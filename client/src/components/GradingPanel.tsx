import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { QualityScore } from "@shared/schema";

export default function GradingPanel() {
  const { data: scores } = useQuery<QualityScore>({
    queryKey: ['/api/quality-scores'],
  });

  const metrics = scores ? [
    { metric: 'Clarity', score: scores.clarity },
    { metric: 'Rigor', score: scores.rigor },
    { metric: 'Conciseness', score: scores.conciseness },
    { metric: 'Novelty', score: scores.novelty },
    { metric: 'Structure', score: scores.structure },
  ] : [];

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold mb-3" data-testid="text-quality-score-title">Quality Score</h3>
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
    </div>
  );
}
