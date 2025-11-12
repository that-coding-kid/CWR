import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockScores = [
  { metric: 'Clarity', score: 8.5 },
  { metric: 'Rigor', score: 7.8 },
  { metric: 'Conciseness', score: 9.2 },
  { metric: 'Novelty', score: 8.0 },
  { metric: 'Structure', score: 8.7 },
];

export default function GradingPanel() {
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold mb-3" data-testid="text-quality-score-title">Quality Score</h3>
      <div className="space-y-2">
        {mockScores.map((item) => (
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
