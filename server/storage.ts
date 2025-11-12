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
  getQualityScores(): Promise<QualityScore>;
  
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

  constructor() {
    this.users = new Map();
    this.references = new Map();
    this.chatMessages = new Map();
    this.feedbackItems = new Map();
    this.sectionContents = new Map();
    
    this.qualityScores = {
      clarity: 8.5,
      rigor: 7.8,
      conciseness: 9.2,
      novelty: 8.0,
      structure: 8.7,
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

  async getQualityScores(): Promise<QualityScore> {
    return this.qualityScores;
  }

  async getSectionContent(section: string): Promise<string> {
    return this.sectionContents.get(section) || '';
  }

  async saveSectionContent(data: SectionContent): Promise<void> {
    this.sectionContents.set(data.section, data.content);
  }
}

export const storage = new MemStorage();
