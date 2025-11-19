import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { QualityScore } from "@shared/schema";
import { useState } from "react";

export default function GradingPanel() {
  const [showScores, setShowScores] = useState(false);
  
  const { data: scores } = useQuery<QualityScore>({
    queryKey: ['/api/quality-scores'],
    enabled: showScores,
  });

  const generateScoreMutation = useMutation({
    mutationFn: () => apiRequest('/api/generate-scores', 'POST'),
    onSuccess: () => {
      setShowScores(true);
      queryClient.invalidateQueries({ queryKey: ['/api/quality-scores'] });
    },
  });

  const metrics = scores ? [
    { metric: 'Helpfulness', score: scores.helpfulness },
    { metric: 'Correctness', score: scores.correctness },
    { metric: 'Coherence', score: scores.coherence },
    { metric: 'Complexity', score: scores.complexity },
    { metric: 'Verbosity', score: scores.verbosity },
  ] : [];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" data-testid="text-quality-score-title">Quality Score</h3>
        <Button 
          size="sm" 
          onClick={() => generateScoreMutation.mutate()}
          disabled={generateScoreMutation.isPending}
          data-testid="button-generate-score"
        >
          {generateScoreMutation.isPending ? 'Generating...' : 'Generate Score'}
        </Button>
      </div>
      
      {showScores && (
        <div className="space-y-2">
          {metrics.map((item) => (
            <Card key={item.metric} className="hover-elevate" data-testid={`card-score-${item.metric.toLowerCase()}`}>
              <CardContent className="p-3 flex items-center justify-between">
                <span className="text-sm font-medium">{item.metric}</span>
                <span className="text-sm font-semibold text-primary" data-testid={`text-score-${item.metric.toLowerCase()}`}>
                  {item.score}/10
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!showScores && (
        <p className="text-xs text-muted-foreground text-center py-4">
          Click "Generate Score" to analyze your content
        </p>
      )}
    </div>
  );
}
