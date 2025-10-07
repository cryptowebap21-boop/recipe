import { randomUUID } from "crypto";

// Simple session storage for results (optional)
export interface SessionResult {
  id: string;
  type: 'detector' | 'humanizer';
  input: string;
  output: any;
  timestamp: Date;
}

export interface IStorage {
  // Session results (for temporary storage)
  saveResult(result: Omit<SessionResult, 'id' | 'timestamp'>): Promise<SessionResult>;
  getResult(id: string): Promise<SessionResult | undefined>;
  getRecentResults(limit?: number): Promise<SessionResult[]>;
}

export class MemStorage implements IStorage {
  private results: Map<string, SessionResult>;

  constructor() {
    this.results = new Map();
  }

  async saveResult(result: Omit<SessionResult, 'id' | 'timestamp'>): Promise<SessionResult> {
    const id = randomUUID();
    const sessionResult: SessionResult = {
      ...result,
      id,
      timestamp: new Date(),
    };
    
    this.results.set(id, sessionResult);
    
    // Keep only last 100 results to prevent memory overflow
    if (this.results.size > 100) {
      const oldest = Array.from(this.results.entries())
        .sort(([, a], [, b]) => a.timestamp.getTime() - b.timestamp.getTime())[0];
      this.results.delete(oldest[0]);
    }
    
    return sessionResult;
  }

  async getResult(id: string): Promise<SessionResult | undefined> {
    return this.results.get(id);
  }

  async getRecentResults(limit: number = 10): Promise<SessionResult[]> {
    return Array.from(this.results.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
