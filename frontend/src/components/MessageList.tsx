import React from 'react';
import { MessageListProps } from '../types';

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="message-container">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="mb-8 p-4 bg-muted/30 rounded-full">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 tracking-tight">
            Welcome to NeuralChat
          </h2>
          <p className="text-muted-foreground max-w-md text-base leading-relaxed mb-10">
            Your advanced AI companion. Ask me anything and I'll provide intelligent, contextual responses.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
            {[
              { icon: '🧠', title: 'Deep Learning', desc: 'Advanced neural networks' },
              { icon: '⚡', title: 'Real-time', desc: 'Instant responses' },
              { icon: '🔒', title: 'Secure', desc: 'Private & encrypted' },
              { icon: '🌐', title: 'Connected', desc: 'Knowledge base access' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-card hover:bg-muted/50 border border-border rounded-xl transition-all duration-200 cursor-pointer group text-left">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                  <div>
                    <h3 className="font-medium text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`message ${message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                  }`}
              >
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>

                <div className={`text-[10px] mt-2 opacity-70 flex items-center ${message.role === 'user' ? 'justify-end text-primary-foreground/80' : 'justify-start text-muted-foreground'
                  }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message justify-start">
              <div className="bg-muted px-5 py-4 rounded-2xl rounded-bl-sm flex items-center space-x-2">
                <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageList;
