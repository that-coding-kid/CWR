import { 
  type User, 
  type InsertUser,
  type ReferencePaper,
  type InsertReferencePaper,
  type ChatMessage,
  type InsertChatMessage,
  type FeedbackItem,
  type InsertFeedbackItem,
  type QualityScore,
  type SectionContent,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getReferences(): Promise<ReferencePaper[]>;
  addReference(paper: InsertReferencePaper): Promise<ReferencePaper>;
  deleteReference(id: string): Promise<boolean>;
  
  getChatMessages(): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  getFeedback(): Promise<FeedbackItem[]>;
  generateFeedback(content: string): Promise<void>;
  getQualityScores(): Promise<QualityScore>;
  generateScores(content: string): Promise<void>;
  
  getSectionContent(section: string): Promise<string>;
  saveSectionContent(data: SectionContent): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private references: Map<string, ReferencePaper>;
  private chatMessages: Map<string, ChatMessage>;
  private feedbackItems: Map<string, FeedbackItem>;
  private qualityScores: QualityScore;
  private sectionContents: Map<string, string>;
  private scoreVersion: number;

  constructor() {
    this.users = new Map();
    this.references = new Map();
    this.chatMessages = new Map();
    this.feedbackItems = new Map();
    this.sectionContents = new Map();
    this.scoreVersion = 0;
    
    this.qualityScores = {
      helpfulness: 3,
      correctness: 4,
      coherence: 3,
      complexity: 2.5,
      verbosity: 6,
    };
    
    this.seedData();
  }

  private seedData() {
    const mockPapers: ReferencePaper[] = [
      { id: '1', title: 'Vaswani et al. 2017.pdf', name: 'Attention Is All You Need' },
      { id: '2', title: 'Dosovitskiy et al. 2020.pdf', name: 'An Image is Worth 16x16 Words' },
      { id: '3', title: 'Brown et al. 2020.pdf', name: 'Language Models are Few-Shot Learners' },
      { id: '4', title: 'Devlin et al. 2018.pdf', name: 'BERT: Pre-training of Deep Bidirectional Transformers' },
    ];
    
    mockPapers.forEach(paper => this.references.set(paper.id, paper));
    
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        type: 'system',
        content: 'Hello! Add your references and describe your idea. I\'ll ask questions to help you brainstorm.',
      },
      {
        id: '2',
        type: 'llm',
        content: 'That\'s a fascinating start. Have you considered how you will measure the impact of attention mechanisms on model interpretability and its implications for downstream task performance?',
      },
    ];
    
    mockMessages.forEach(msg => this.chatMessages.set(msg.id, msg));
    
    const mockFeedback: FeedbackItem[] = [
      {
        id: '1',
        type: 'Critical',
        title: 'Cite Evidence',
        content: 'The claim in paragraph 3 requires empirical support. Consider adding citations to recent studies that demonstrate this relationship.',
        section: 'Methodology',
      },
      {
        id: '2',
        type: 'Suggestion',
        title: 'Improve Flow',
        content: 'The transition between paragraph 2 and 3 is abrupt. Consider adding a sentence to link the ideas more smoothly.',
        section: 'Introduction',
      },
      {
        id: '3',
        type: 'Suggestion',
        title: 'Clarify Terminology',
        content: 'The term "attention mechanism" is used inconsistently. Ensure uniform terminology throughout the document.',
        section: 'Results',
      },
    ];
    
    mockFeedback.forEach(item => this.feedbackItems.set(item.id, item));
    
    const mockContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;
    
    this.sectionContents.set('Introduction', mockContent);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getReferences(): Promise<ReferencePaper[]> {
    return Array.from(this.references.values());
  }

  async addReference(paper: InsertReferencePaper): Promise<ReferencePaper> {
    const id = randomUUID();
    const newPaper: ReferencePaper = { ...paper, id };
    this.references.set(id, newPaper);
    return newPaper;
  }

  async deleteReference(id: string): Promise<boolean> {
    return this.references.delete(id);
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values());
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const newMessage: ChatMessage = { ...message, id };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }

  async getFeedback(): Promise<FeedbackItem[]> {
    return Array.from(this.feedbackItems.values());
  }

  async generateFeedback(content: string): Promise<void> {
    this.feedbackItems.clear();
    
    const isImproved = content.length > 200;
    
    const feedbackData: FeedbackItem[] = [
      {
        id: '1',
        type: 'Critical',
        title: 'Lacks Specificity',
        content: 'WHERE: In the opening statement "This paper introduces a new model for sentiment analysis." WHY: The statement is too vague and doesn\'t convey the unique contribution of your work. HOW: Specify what makes your model novel - is it the architecture, the training approach, or the application domain? For example: "This paper introduces a transformer-based sentiment analysis model that incorporates contextual embeddings to improve accuracy on code-mixed social media text."',
        section: 'Abstract',
      },
      {
        id: '2',
        type: 'Critical',
        title: 'Missing Quantitative Results',
        content: 'WHERE: "The results show our model is better than SOTA." WHY: Academic writing requires precise, quantifiable claims to support your conclusions. Vague comparisons undermine credibility. HOW: Include specific metrics with percentage improvements. For example: "Our model achieves 94.2% accuracy on the XYZ benchmark, outperforming the current SOTA by 3.7 percentage points."',
        section: 'Abstract',
      },
      {
        id: '3',
        type: 'Suggestion',
        title: 'Unclear Architecture Description',
        content: 'WHERE: "We used a novel deep learning architecture based on transformers." WHY: Readers need to understand what modifications or innovations you made to the standard transformer architecture. HOW: Briefly describe your architectural contribution: "We propose a multi-headed attention mechanism with sentiment-specific positional encodings that captures both syntactic and emotional context."',
        section: 'Abstract',
      },
      {
        id: '4',
        type: 'Suggestion',
        title: 'Improve Verbosity',
        content: 'WHERE: "It is also very fast." WHY: This informal phrasing detracts from the academic tone and lacks precision. HOW: Provide concrete performance metrics: "The model achieves inference speeds of 250 sentences per second on standard GPU hardware, making it suitable for real-time applications."',
        section: 'Abstract',
      },
      {
        id: '5',
        type: 'Suggestion',
        title: 'Strengthen Applications Section',
        content: 'WHERE: "We believe this work has many applications in natural language processing." WHY: The concluding statement is too general and weakens the impact of your contribution. HOW: Specify 2-3 concrete applications with brief justification: "This work has immediate applications in social media monitoring, customer feedback analysis, and multilingual sentiment detection, particularly for low-resource languages where training data is scarce."',
        section: 'Abstract',
      },
    ];
    
    if (isImproved) {
      const improvedFeedback: FeedbackItem[] = [
        {
          id: '6',
          type: 'Suggestion',
          title: 'Consider Dataset Details',
          content: 'WHERE: Throughout the abstract. WHY: Including information about your training and evaluation datasets strengthens reproducibility. HOW: Add a brief mention: "trained on 500K annotated reviews from the SentiBank corpus and evaluated on three benchmark datasets."',
          section: 'Abstract',
        },
        {
          id: '7',
          type: 'Suggestion',
          title: 'Highlight Broader Impact',
          content: 'WHERE: Conclusion of the abstract. WHY: Mentioning broader implications can increase the paper\'s appeal and citation potential. HOW: Add: "This advancement opens new possibilities for real-time emotion tracking in crisis communication and public health monitoring."',
          section: 'Abstract',
        },
      ];
      feedbackData.push(...improvedFeedback);
    }
    
    feedbackData.forEach(item => this.feedbackItems.set(item.id, item));
  }

  async getQualityScores(): Promise<QualityScore> {
    return this.qualityScores;
  }

  async generateScores(content: string): Promise<void> {
    this.scoreVersion++;
    
    const baseAbstract = "This paper introduces a new model for sentiment analysis.  We used a novel deep learning architecture based on transformers. The results show our model is better than SOTA. It is also very fast. We believe this work has many applications in natural language processing.";
    
    if (content.toLowerCase().includes(baseAbstract.toLowerCase().substring(0, 50))) {
      if (this.scoreVersion === 1) {
        this.qualityScores = {
          helpfulness: 3,
          correctness: 4,
          coherence: 3,
          complexity: 2.5,
          verbosity: 6,
        };
      } else {
        this.qualityScores = {
          helpfulness: 6.5,
          correctness: 7.8,
          coherence: 7.2,
          complexity: 6.8,
          verbosity: 8.5,
        };
      }
    } else {
      this.qualityScores = {
        helpfulness: 5 + Math.random() * 3,
        correctness: 5 + Math.random() * 3,
        coherence: 5 + Math.random() * 3,
        complexity: 4 + Math.random() * 4,
        verbosity: 5 + Math.random() * 3,
      };
    }
  }

  async getSectionContent(section: string): Promise<string> {
    return this.sectionContents.get(section) || '';
  }

  async saveSectionContent(data: SectionContent): Promise<void> {
    this.sectionContents.set(data.section, data.content);
  }
}

export const storage = new MemStorage();
