import { BOT_ERROR_MESSAGE } from '../constants';

/**
 * Sends a message to the n8n webhook and returns the bot's reply.
 * @param userMessage The message from the user.
 * @param webhookUrl The n8n webhook URL to send the request to.
 * @returns A promise that resolves to the bot's reply string.
 */
export const sendMessageToN8n = async (userMessage: string, webhookUrl: string): Promise<string> => {
  try {
    if (!webhookUrl || webhookUrl.includes('YOUR_N8N_INSTANCE')) {
        console.warn('n8n Webhook URL is not configured. Please update it in the settings.');
        return "This is a simulated response. Please configure your n8n webhook URL in the settings to get a real reply.";
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      console.error('Webhook response was not ok.', { status: response.status });
      return BOT_ERROR_MESSAGE;
    }

    const data = await response.json();

    // The n8n workflow might return data in different formats.
    // Let's try to handle the most common ones gracefully.

    // Case 1: An array with a single object, e.g., `[{"output": "bot's reply"}]`
    if (Array.isArray(data) && data.length > 0 && data[0] && typeof data[0].output === 'string') {
      return data[0].output;
    }

    // Case 2: A single object, e.g., `{"output": "bot's reply"}`
    if (data && typeof data.output === 'string') {
      return data.output;
    }

    // If neither format matches, log an error.
    console.error('Invalid response format from webhook. Expected `[{"output": "..."}]` or `{"output": "..."}`.', data);
    return "I received a response, but the format was unexpected.";

  } catch (error) {
    console.error('Failed to send message to n8n webhook:', error);
    return BOT_ERROR_MESSAGE;
  }
};
