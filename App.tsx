import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender } from './types';
import { sendMessageToN8n } from './services/n8nService';
import ChatBubble from './components/ChatBubble';
import MessageInput from './components/MessageInput';
import TypingIndicator from './components/TypingIndicator';
import SettingsModal from './components/SettingsModal';
import { BOT_GREETING, DEFAULT_N8N_WEBHOOK_URL, LOCAL_STORAGE_KEY } from './constants';

const GearIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
    </svg>
);


const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY) || DEFAULT_N8N_WEBHOOK_URL;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isUrlConfigured = n8nWebhookUrl && !n8nWebhookUrl.includes('YOUR_N8N_INSTANCE');


  useEffect(() => {
    // Initial greeting from the bot
    setMessages([
      {
        id: 'initial-greeting',
        text: BOT_GREETING,
        sender: Sender.Bot,
      },
    ]);
  }, []);

  useEffect(() => {
    // Scroll to the bottom every time messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!isUrlConfigured) {
        setIsSettingsOpen(true);
        return;
    }
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: Sender.User,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    const botReplyText = await sendMessageToN8n(text, n8nWebhookUrl);

    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      text: botReplyText,
      sender: Sender.Bot,
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setIsLoading(false);
  };
  
  const handleSaveSettings = (newUrl: string) => {
    const trimmedUrl = newUrl.trim();
    setN8nWebhookUrl(trimmedUrl);
    localStorage.setItem(LOCAL_STORAGE_KEY, trimmedUrl);
    setIsSettingsOpen(false);
     // Clear old messages and show a fresh greeting
    setMessages([
      {
        id: 'config-saved',
        text: "Settings saved! " + BOT_GREETING,
        sender: Sender.Bot,
      },
    ]);
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
          <div className="w-full max-w-4xl mx-auto flex flex-col h-full my-4">
              <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-100">n8n Webhook Chatbot</h1>
                  <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    aria-label="Open settings"
                  >
                    <GearIcon className="w-6 h-6" />
                  </button>
              </header>

              {!isUrlConfigured && (
                  <div className="m-4 text-sm bg-yellow-900 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-md flex items-center justify-between">
                      <p>
                          <strong>Configuration Needed:</strong> Please click the gear icon to set your n8n webhook URL.
                      </p>
                      <button 
                        onClick={() => setIsSettingsOpen(true)}
                        className="ml-4 px-3 py-1 rounded-md bg-yellow-700 hover:bg-yellow-600 text-white font-semibold transition-colors"
                      >
                        Settings
                      </button>
                  </div>
              )}

              <main className="flex-1 overflow-y-auto p-4 bg-gray-800/50">
                  <div className="flex flex-col space-y-2">
                      {messages.map((msg) => (
                          <ChatBubble key={msg.id} message={msg} />
                      ))}
                      {isLoading && <TypingIndicator />}
                      <div ref={messagesEndRef} />
                  </div>
              </main>
              <footer className="bg-gray-800">
                  <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
              </footer>
          </div>
      </div>
      <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
          currentUrl={n8nWebhookUrl}
      />
    </>
  );
};

export default App;