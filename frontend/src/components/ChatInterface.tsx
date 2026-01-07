import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message, ChatState } from '../types';

const ChatInterface: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isTyping: false,
  });

  const [apiKey, setApiKey] = useState('');

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          api_key: apiKey
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error calling backend API:', error);
      throw new Error('Failed to get AI response. Please check if the backend server is running.');
    }
  };

  const handleSendMessage = useCallback(async (content: string) => {
    if (!apiKey) {
      const errorMessage: Message = {
        id: generateId(),
        content: "Please enter your Google API Key in the sidebar to start chatting.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          id: generateId(),
          content,
          role: 'user',
          timestamp: new Date(),
        }, errorMessage],
        isLoading: false,
        isTyping: false,
      }));
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      isTyping: true,
    }));

    try {
      const aiResponse = await getAIResponse(content);

      const assistantMessage: Message = {
        id: generateId(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        isTyping: false,
      }));
    } catch (error) {
      console.error('Error getting AI response:', error);
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        isTyping: false,
      }));
    }
  }, [apiKey]);

  const handleNewChat = useCallback(() => {
    setChatState({
      messages: [],
      isLoading: false,
      isTyping: false,
    });
  }, []);

  return (
    <div className="chat-container">
      <Sidebar
        onNewChat={handleNewChat}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
      />
      <div className="chat-main">
        <MessageList
          messages={chatState.messages}
          isTyping={chatState.isTyping}
        />
        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={chatState.isLoading}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
