// The default URL to use if nothing is set in localStorage.
// This is a placeholder and should be replaced by the user in the settings.
export const DEFAULT_N8N_WEBHOOK_URL = 'https://YOUR_N8N_INSTANCE.com/webhook/YOUR_PATH';

// The key used to store the webhook URL in the browser's localStorage.
export const LOCAL_STORAGE_KEY = 'n8nWebhookUrl';

export const BOT_GREETING = "Hello! I'm a chatbot connected to an n8n workflow. How can I help you today?";
export const BOT_ERROR_MESSAGE = "Sorry, I'm having trouble connecting right now. Please check your webhook URL in settings or try again in a moment.";