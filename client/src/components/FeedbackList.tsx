import { AlertCircle, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockFeedback = [
  {
    id: '1',
    type: 'Critical',
    title: 'Cite Evidence',
    content: 'The claim in paragraph 3 requires empirical support. Consider adding citations to recent studies that demonstrate this relationship.',
    section: 'Methodology',
  },
  {
    id: '2',
    type: 'Suggestion',
    title: 'Improve Flow',
    content: 'The transition between paragraph 2 and 3 is abrupt. Consider adding a sentence to link the ideas more smoothly.',
    section: 'Introduction',
  },
  {
    id: '3',
    type: 'Suggestion',
    title: 'Clarify Terminology',
    content: 'The term "attention mechanism" is used inconsistently. Ensure uniform terminology throughout the document.',
    section: 'Results',
  },
];

export default function FeedbackList() {
  return (
    <div className="flex flex-col h-full border-t">
      <div className="px-4 py-3 border-b">
        <h3 className="text-sm font-semibold" data-testid="text-feedback-title">Actionable Feedback</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {mockFeedback.map((item) => (
            <Card key={item.id} className="hover-elevate" data-testid={`card-feedback-${item.id}`}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.type === 'Critical' ? (
                      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                    ) : (
                      <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                    <span className="text-sm font-semibold" data-testid={`text-feedback-title-${item.id}`}>
                      {item.type}: {item.title}
                    </span>
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0 text-xs">
                    {item.section}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-feedback-content-${item.id}`}>
                  {item.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
