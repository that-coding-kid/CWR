import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ReferencePaper } from "@shared/schema";
import { useEffect, useState } from "react";

export default function AutoSummaryPanel() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: papers = [] } = useQuery<ReferencePaper[]>({
    queryKey: ['/api/references'],
  });

  const { data: summaryData } = useQuery<{ summary: string }>({
    queryKey: ['/api/auto-summary'],
  });

  const generateSummaryMutation = useMutation({
    mutationFn: () => apiRequest('/api/generate-auto-summary', 'POST'),
    onMutate: () => {
      setIsGenerating(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auto-summary'] });
      setIsGenerating(false);
    },
    onError: () => {
      setIsGenerating(false);
    },
  });

  useEffect(() => {
    if (papers.length > 0) {
      generateSummaryMutation.mutate();
    }
  }, [papers.length]);

  const displaySummary = summaryData?.summary || 'No references added yet. Upload research papers to generate an auto-summary of key concepts and methodologies.';

  return (
    <div className="flex flex-col h-full border-t">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-sm font-semibold" data-testid="text-summary-title">Auto-Summary</h2>
        <div className="flex items-center gap-2">
          {isGenerating && (
            <>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" data-testid="indicator-tuning" />
              <span className="text-xs text-muted-foreground">generating...</span>
            </>
          )}
          {!isGenerating && papers.length > 0 && (
            <span className="text-xs text-muted-foreground">AI-generated</span>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-line" data-testid="text-summary-content">
            {displaySummary}
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}
