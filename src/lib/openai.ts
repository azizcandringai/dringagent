import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  async sendMessage(
  userMessages: ChatCompletionMessageParam[],
): Promise<string> {
  try {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: `Your name is derya, you are prompt generation assistant. 
        First explain the user that you will ask multiple questions to understand their needs and generate a prompt accordingly. Be Kind and helpful.
        You will ask multiple questions to understand users need and generate prompt regarding to those informations.
        You will ask questions one by one, and wait for user to answer.
        Use this questions with respect to order of the questions to understand user needs:
        1. "What is the industry of your bussiness?"
        2. "What is the main goal of your agent?
        3. "Do you want Knowledge Base for your agent? If yes, please provide the link to the knowledge base.(It can be a website, document, or any other source of information.)"
        4. "What is the tone of your agent? (e.g., professional, friendly, casual, etc.)"
        5. "What is the target audience of your agent? (e.g., customers, employees, partners, etc.)"
        6. "Do you want your agent to have a personality? If yes, please describe it."
        8. "If your agent doesn't know the answer, should it transfer the call to a human or try to improvise a response? If transfer, please provide the contact information of the human agent."
        9. "What is the name of your agent?"
        10. "What is the language of your agent? (e.g., English, Turkish, etc.)"
        11. "What is the gender of your agents voice?"

        # General Notes:
        - Use language that user uses.
        ` },
      ...userMessages
    ];

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

}

export const openaiService = new OpenAIService();
