import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, Sender } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const N8nLogo: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 flex-shrink-0 self-start mt-1">
        <path d="M11.9992 0L0 6.929V20.783L11.9992 13.854V0Z" fill="#7B61FF"/>
        <path d="M11.9992 13.854L0 20.783L12 27.712L24 20.783L11.9992 13.854Z" fill="#1A0D46"/>
        <path d="M24 6.929L12 0V13.854L24 20.783V6.929Z" fill="#472EC9"/>
    </svg>
);


const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 flex-shrink-0 self-start mt-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white self-end'
    : 'bg-gray-700 text-gray-200 self-start';
  
  const containerClasses = isUser
    ? 'flex justify-end'
    : 'flex justify-start';

  return (
    <div className={`w-full flex ${containerClasses} my-2`}>
      <div className={`flex items-start max-w-lg md:max-w-2xl`}>
        {!isUser && <N8nLogo />}
        <div className={`px-4 py-2 rounded-2xl shadow-md ${bubbleClasses}`}>
          {isUser ? (
            <p className="text-base whitespace-pre-wrap">{message.text}</p>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none 
              prose-p:my-2 first:prose-p:mt-0 last:prose-p:mb-0
              prose-headings:my-2 first:prose-headings:mt-0 last:prose-headings:mb-0
              prose-blockquote:my-2
              prose-ul:my-2 first:prose-ul:mt-0 last:prose-ul:mb-0
              prose-ol:my-2 first:prose-ol:mt-0 last:prose-ol:mb-0
              prose-a:text-blue-400 hover:prose-a:underline
              prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono prose-code:text-xs
              prose-pre:bg-gray-900/50 prose-pre:p-3 prose-pre:rounded-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {isUser && <UserIcon />}
      </div>
    </div>
  );
};

export default ChatBubble;