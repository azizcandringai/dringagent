import OpenAI from 'openai';

// Dummy OpenAI key for development
const DUMMY_API_KEY = 'sk-dummy-1234567890abcdef1234567890abcdef1234567890abcdef';

class OpenAIService {
  private client: OpenAI | null = null;
  private apiKey: string;

  constructor() {
    // Try to get API key from localStorage, fallback to dummy
    this.apiKey = this.getStoredApiKey() || DUMMY_API_KEY;
    this.initializeClient();
  }

  private getStoredApiKey(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openai-api-key');
    }
    return null;
  }

  private initializeClient() {
    this.client = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    if (typeof window !== 'undefined') {
      localStorage.setItem('openai-api-key', apiKey);
    }
    this.initializeClient();
  }

  getApiKey(): string {
    return this.apiKey;
  }

  isDummyKey(): boolean {
    return this.apiKey === DUMMY_API_KEY;
  }

  async sendMessage(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized');
    }

    // If using dummy key, return a mock response
    if (this.isDummyKey()) {
      return this.getDummyResponse(messages[messages.length - 1]?.content || '');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      if (error instanceof Error) {
        throw new Error(`OpenAI API Error: ${error.message}`);
      }
      throw new Error('Failed to get response from OpenAI');
    }
  }

  private getDummyResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    const responses = [
      "I'm using a dummy OpenAI key. Please configure your real API key in settings to get actual AI responses!",
      "This is a demo response. Set up your OpenAI API key to chat with the real GPT-4o-mini model.",
      "Hello! I'm currently in demo mode. Add your OpenAI API key to enable real AI conversations.",
      "I'd love to help, but I need a real OpenAI API key to provide intelligent responses.",
      "Demo mode active! Configure your API key to unlock the full chatbot experience."
    ];

    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! I'm currently running in demo mode with a dummy API key. Please configure your OpenAI API key to start real conversations!";
    }

    if (message.includes('help') || message.includes('api') || message.includes('key')) {
      return "To get started, click the settings button and enter your OpenAI API key. You can get one from https://platform.openai.com/api-keys";
    }

    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const openaiService = new OpenAIService();