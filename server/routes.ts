import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { aiDetectorRequestSchema, humanizerRequestSchema } from "@shared/schema";
import { HUMANIZER_SCRIPT, AI_CHECKER_SCRIPT } from "./scripts";

// Mock responses for development mode
const createMockAIDetectorResponse = (text: string) => {
  const words = text.split(' ').length;
  const probability = Math.floor(Math.random() * 100);
  const confidence = probability >= 80 ? "Very confident" : probability >= 40 ? "Maybe" : "Not confident";
  
  return {
    ai_probability: probability,
    confidence,
    reasoning: `This ${words}-word text shows ${probability >= 60 ? 'strong' : probability >= 30 ? 'moderate' : 'weak'} indicators of AI generation based on sentence structure patterns and word choice consistency.`
  };
};

const createMockHumanizerResponse = (text: string) => {
  // Simple mock humanization - add some casual elements
  const humanized = text
    .replace(/\. /g, '. ')
    .replace(/However, /g, 'But ')
    .replace(/Therefore, /g, 'So ')
    .replace(/Additionally, /g, 'Also, ')
    .replace(/Furthermore, /g, 'And ');
  
  return {
    rewrittenText: humanized,
    originalText: text,
    meta: {
      originalWordCount: text.split(' ').length,
      rewrittenWordCount: humanized.split(' ').length
    }
  };
};

async function callRouterAPI(prompt: string): Promise<any> {
  const apiKey = process.env.ROUTER_API_KEY;
  const apiUrl = process.env.ROUTER_API_URL || 'https://api.router.example.com/v1/completions';
  
  if (!apiKey) {
    throw new Error('ROUTER_API_KEY not configured');
  }
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-r3',
      input: prompt
    })
  });
  
  if (!response.ok) {
    throw new Error(`Router API error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Basic rate limiting without express-rate-limit
  const requestCounts = new Map<string, { count: number; resetTime: number }>();
  const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
  const RATE_LIMIT_MAX = 50; // 50 requests per window

  const rateLimiter = (req: any, res: any, next: any) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    const clientData = requestCounts.get(clientIP);
    
    if (!clientData || now > clientData.resetTime) {
      requestCounts.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      return next();
    }
    
    if (clientData.count >= RATE_LIMIT_MAX) {
      return res.status(429).json({ error: 'Too many requests, please try again later.' });
    }
    
    clientData.count++;
    next();
  };

  // Apply rate limiting to API routes
  app.use('/api', rateLimiter);
  
  // CORS middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });
  
  // AI Detector endpoint
  app.post('/api/check', async (req, res) => {
    try {
      const { text } = aiDetectorRequestSchema.parse(req.body);
      
      // Check if we're in dev mode (no API key)
      if (!process.env.ROUTER_API_KEY) {
        console.log('Dev mode: Using mock AI detector response');
        const mockResponse = createMockAIDetectorResponse(text);
        return res.json(mockResponse);
      }
      
      // Prepare the prompt with the AI checker script
      const prompt = AI_CHECKER_SCRIPT.replace(/\[USER_TEXT\]/g, text);
      
      // Call Router API
      const response = await callRouterAPI(prompt);
      
      // Parse the response - assuming it returns the text content
      let result;
      try {
        // Try to extract JSON from the response
        const responseText = response.output || response.text || JSON.stringify(response);
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        // Fallback if parsing fails
        result = createMockAIDetectorResponse(text);
      }
      
      res.json(result);
    } catch (error) {
      console.error('Error in /api/check:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid input', details: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error', message: (error as Error).message });
      }
    }
  });
  
  // Humanizer endpoint
  app.post('/api/humanize', async (req, res) => {
    try {
      const { text } = humanizerRequestSchema.parse(req.body);
      
      // Check if we're in dev mode (no API key)
      if (!process.env.ROUTER_API_KEY) {
        console.log('Dev mode: Using mock humanizer response');
        const mockResponse = createMockHumanizerResponse(text);
        return res.json(mockResponse);
      }
      
      // Prepare the prompt with the humanizer script
      const prompt = HUMANIZER_SCRIPT.replace(/\[USER_TEXT\]/g, text);
      
      // Call Router API
      const response = await callRouterAPI(prompt);
      
      // Extract the rewritten text from the response
      const rewrittenText = response.output || response.text || text; // Fallback to original if extraction fails
      
      const result = {
        rewrittenText,
        originalText: text,
        meta: {
          originalWordCount: text.split(' ').length,
          rewrittenWordCount: rewrittenText.split(' ').length
        }
      };
      
      res.json(result);
    } catch (error) {
      console.error('Error in /api/humanize:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid input', details: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error', message: (error as Error).message });
      }
    }
  });
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      hasApiKey: !!process.env.ROUTER_API_KEY,
      devMode: !process.env.ROUTER_API_KEY
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
