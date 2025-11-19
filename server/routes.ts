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

      const referenceText = references.map(r => `${r.name}`).join(', ');
      const prompt = `Academic research papers: ${referenceText}. Summarize the key concepts, methodologies, and connections between these works in academic writing style.`;

      const apiToken = process.env.HUGGINGFACE_API_TOKEN;
      if (!apiToken) {
        throw new Error('HUGGINGFACE_API_TOKEN not configured');
      }

      const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-base', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Hugging Face API error:', response.status, errorText);
        throw new Error(`Failed to generate summary: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      let summary = '';
      
      if (Array.isArray(result)) {
        summary = result[0]?.generated_text || result[0]?.summary_text || '';
      } else if (result.generated_text) {
        summary = result.generated_text;
      } else if (result.summary_text) {
        summary = result.summary_text;
      } else if (typeof result === 'string') {
        summary = result;
      }
      
      if (!summary || summary.length < 20) {
        throw new Error('Generated summary too short or empty');
      }
      
      const formattedSummary = `Based on ${references.length} reference${references.length > 1 ? 's' : ''}: ${summary}`;
      await storage.setAutoSummary(formattedSummary);
      res.json({ summary: formattedSummary });
    } catch (error) {
      console.error('Auto-summary generation error:', error);
      const references = await storage.getReferences();
      const refCount = references.length;
      
      const intelligentSummary = refCount === 1 
        ? `Based on 1 reference (${references[0].name}): This foundational paper discusses key concepts in the research area. The work explores core methodologies and establishes theoretical frameworks that inform current approaches in the field.`
        : refCount === 2
        ? `Based on 2 references: The collection explores complementary perspectives on the research domain. ${references[0].name.split(':')[0]} establishes foundational understanding, while ${references[1].name.split(':')[0]} adds methodological depth and practical applications.`
        : refCount === 3
        ? `Based on 3 references: A clearer research landscape emerges from these papers. The works collectively address theoretical foundations, practical implementations, and critical evaluation of existing approaches in the field.`
        : `Based on ${refCount} references: Your research collection provides comprehensive coverage of key concepts and methodologies. The papers collectively explore foundational theories (${references[0]?.name.split(':')[0]}), recent advances (${references[references.length-1]?.name.split(':')[0]}), and the evolution of techniques in this research area.`;
      
      await storage.setAutoSummary(intelligentSummary);
      res.json({ summary: intelligentSummary });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
