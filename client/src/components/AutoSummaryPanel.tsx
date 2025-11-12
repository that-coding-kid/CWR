import { ScrollArea } from "@/components/ui/scroll-area";

const mockSummary = `The core concept from the references is the 'Transformer' architecture, which revolutionized natural language processing by introducing self-attention mechanisms that allow models to weigh the importance of different parts of the input sequence.

This architecture forms the foundation of modern large language models, including BERT and GPT variants. The key innovation is the ability to process sequences in parallel rather than sequentially, leading to significant improvements in both training efficiency and model performance.

The Vision Transformer (ViT) extends these concepts to computer vision, demonstrating that the transformer architecture's effectiveness is not limited to text processing but can be applied across multiple domains with remarkable success.`;

export default function AutoSummaryPanel() {
  return (
    <div className="flex flex-col h-full border-t">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-sm font-semibold" data-testid="text-summary-title">Auto-Summary</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" data-testid="indicator-tuning" />
          <span className="text-xs text-muted-foreground">tuning...</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-line" data-testid="text-summary-content">
            {mockSummary}
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}
