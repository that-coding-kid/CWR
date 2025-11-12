import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const tips = [
  "Don't self-censor",
  "Focus on quantity over quality",
  "Build on your references",
  "Ask 'what if' questions",
];

export default function BrainstormingTips() {
  return (
    <div className="p-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            Brainstorming Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-xs font-semibold text-muted-foreground mt-0.5">{index + 1}.</span>
              <p className="text-sm text-foreground">{tip}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
