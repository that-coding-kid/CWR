import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const sections = [
  'Abstract',
  'Introduction',
  'Methodology',
  'Results',
  'Discussion',
  'Conclusion',
  'Other',
];

export default function FeedbackMode() {
  const [section, setSection] = useState('Introduction');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: (data: { section: string; content: string }) => 
      apiRequest('/api/section', 'POST', data),
    onSuccess: () => {
      toast({
        title: "Saved",
        description: "Your content has been saved.",
      });
    },
  });

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/section/${section}`);
        const data = await response.json();
        setContent(data.content || '');
      } catch (error) {
        console.error('Failed to load section content:', error);
        setContent('');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [section]);

  useEffect(() => {
    if (isLoading) return;
    
    const timer = setTimeout(() => {
      saveMutation.mutate({ section, content });
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, section, isLoading]);

  const handleSectionChange = (newSection: string) => {
    saveMutation.mutate({ section, content });
    setSection(newSection);
  };

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <div className="flex items-center gap-3">
        <Label htmlFor="section-select" className="text-sm font-medium whitespace-nowrap">
          Current Section:
        </Label>
        <Select value={section} onValueChange={handleSectionChange}>
          <SelectTrigger id="section-select" className="w-[200px]" data-testid="select-section">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sections.map((s) => (
              <SelectItem key={s} value={s} data-testid={`option-section-${s.toLowerCase()}`}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {saveMutation.isPending && (
          <span className="text-xs text-muted-foreground">Saving...</span>
        )}
      </div>

      <Textarea
        value={isLoading ? 'Loading...' : content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste your written content here..."
        className="flex-1 resize-none font-serif text-base leading-relaxed"
        data-testid="textarea-content"
        disabled={isLoading}
      />
    </div>
  );
}
