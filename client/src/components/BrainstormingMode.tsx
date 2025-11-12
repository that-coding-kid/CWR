import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";

export default function BrainstormingMode() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/messages'],
    refetchInterval: 2000,
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => 
      apiRequest('/api/chat/messages', 'POST', { type: 'user', content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
      setInput('');
    },
  });

  const handleSend = () => {
    if (!input.trim() || sendMutation.isPending) return;
    sendMutation.mutate(input);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          disabled={sendMutation.isPending}
        />
        <div className="flex justify-end mt-2">
          <Button 
            onClick={handleSend}
            size="sm"
            className="gap-2"
            data-testid="button-send-idea"
            disabled={!input.trim() || sendMutation.isPending}
          >
            <Send className="w-4 h-4" />
            {sendMutation.isPending ? 'Sending...' : 'Send'}
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
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
