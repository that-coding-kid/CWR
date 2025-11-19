import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReferencePaperSchema, insertChatMessageSchema, sectionContentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/references', async (req, res) => {
    const references = await storage.getReferences();
    res.json(references);
  });

  app.post('/api/references', async (req, res) => {
    try {
      const data = insertReferencePaperSchema.parse(req.body);
      const paper = await storage.addReference(data);
      res.json(paper);
    } catch (error) {
      res.status(400).json({ error: 'Invalid reference data' });
    }
  });

  app.delete('/api/references/:id', async (req, res) => {
    const { id } = req.params;
    const deleted = await storage.deleteReference(id);
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Reference not found' });
    }
  });

  app.get('/api/chat/messages', async (req, res) => {
    const messages = await storage.getChatMessages();
    res.json(messages);
  });

  app.post('/api/chat/messages', async (req, res) => {
    try {
      const data = insertChatMessageSchema.parse(req.body);
      const message = await storage.addChatMessage(data);
      
      if (data.type === 'user') {
        setTimeout(async () => {
          const aiResponses = [
            'That\'s an interesting perspective. Could you elaborate on how this relates to your hypothesis?',
            'Have you considered the potential limitations of this approach?',
            'What empirical evidence supports this claim?',
            'How does this connect to the references you\'ve provided?',
            'Can you clarify the methodology you\'re proposing?',
          ];
          
          const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
          
          await storage.addChatMessage({
            type: 'llm',
            content: randomResponse,
          });
        }, 1000);
      }
      
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: 'Invalid message data' });
    }
  });

  app.get('/api/feedback', async (req, res) => {
    const feedback = await storage.getFeedback();
    res.json(feedback);
  });

  app.get('/api/quality-scores', async (req, res) => {
    const scores = await storage.getQualityScores();
    res.json(scores);
  });

  app.post('/api/generate-scores', async (req, res) => {
    const abstractContent = await storage.getSectionContent('Abstract');
    await storage.generateScores(abstractContent);
    const scores = await storage.getQualityScores();
    res.json(scores);
  });

  app.post('/api/generate-feedback', async (req, res) => {
    const abstractContent = await storage.getSectionContent('Abstract');
    await storage.generateFeedback(abstractContent);
    const feedback = await storage.getFeedback();
    res.json(feedback);
  });

  app.get('/api/section/:section', async (req, res) => {
    const { section } = req.params;
    const content = await storage.getSectionContent(section);
    res.json({ content });
  });

  app.post('/api/section', async (req, res) => {
    try {
      const data = sectionContentSchema.parse(req.body);
      await storage.saveSectionContent(data);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Invalid section data' });
    }
  });

  app.get('/api/auto-summary', async (req, res) => {
    const summary = await storage.getAutoSummary();
    res.json({ summary });
  });

  app.post('/api/generate-auto-summary', async (req, res) => {
    try {
      const references = await storage.getReferences();
      
      if (references.length === 0) {
        await storage.setAutoSummary('No references added yet. Upload research papers to generate an auto-summary of key concepts and methodologies.');
        return res.json({ summary: await storage.getAutoSummary() });
      }

      const referenceText = references.map(r => `${r.name}: ${r.title}`).join('. ');
      const prompt = `Summarize the key concepts and research themes from these academic papers: ${referenceText}. Focus on identifying core methodologies, innovations, and connections between the works.`;

      const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 300,
            min_length: 100,
            do_sample: false,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const result = await response.json();
      const summary = Array.isArray(result) ? result[0].summary_text : result.summary_text || 'Summary generation in progress...';
      
      await storage.setAutoSummary(summary);
      res.json({ summary });
    } catch (error) {
      console.error('Auto-summary generation error:', error);
      const fallbackSummary = `Based on ${(await storage.getReferences()).length} references: Your research collection provides comprehensive coverage of key concepts in the field. The references collectively explore foundational theories, methodologies, and recent advances.`;
      await storage.setAutoSummary(fallbackSummary);
      res.json({ summary: fallbackSummary });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
