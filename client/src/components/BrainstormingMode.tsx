import { useState } from "react";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockMessages = [
  {
    id: '1',
    type: 'system',
    content: 'Hello! Add your references and describe your idea. I\'ll ask questions to help you brainstorm.',
  },
  {
    id: '2',
    type: 'llm',
    content: 'That\'s a fascinating start. Have you considered how you will measure the impact of attention mechanisms on model interpretability and its implications for downstream task performance?',
  },
];

export default function BrainstormingMode() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const handleSend = () => {
    if (!input.trim()) return;
    
    console.log('Sending message:', input);
    setMessages([...messages, { 
      id: Date.now().toString(), 
      type: 'user', 
      content: input 
    }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Textarea
          placeholder="Tell me about your core idea, hypothesis, or research question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="min-h-[100px] resize-none"
          data-testid="input-idea"
        />
        <div className="flex justify-end mt-2">
          <Button 
            onClick={handleSend}
            size="sm"
            className="gap-2"
            data-testid="button-send-idea"
          >
            <Send className="w-4 h-4" />
            Send
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              data-testid={`message-${message.id}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.type === 'system'
                    ? 'bg-muted text-muted-foreground'
                    : message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
