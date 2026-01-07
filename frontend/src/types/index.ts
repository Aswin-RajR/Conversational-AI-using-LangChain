export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
}

export interface SidebarProps {
  onNewChat: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}
