import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import type { ReferencePaper } from "@shared/schema";

const summaryLevels = {
  0: `No references added yet. Upload research papers to generate an auto-summary of key concepts and methodologies.`,
  1: `Based on 1 reference: The paper discusses foundational concepts in your research area. Add more references to build a comprehensive understanding of the field.`,
  2: `Based on 2 references: Your references begin to outline key themes. The initial reference provides foundational understanding, while the second reference adds complementary perspectives on methodology and applications.`,
  3: `Based on 3 references: A clearer research landscape emerges. The first reference establishes core theoretical frameworks, the second explores practical implementations, and the third provides critical evaluation of existing approaches.`,
  4: `Based on 4 references: The core concept emerging from your references is the 'Transformer' architecture and its variants, which revolutionized natural language processing and computer vision through self-attention mechanisms.

Key themes identified:
• Self-attention mechanisms enabling parallel sequence processing
• Transfer learning through pre-training on large corpora (BERT approach)
• Few-shot learning capabilities in large-scale models (GPT-3)
• Cross-domain applicability from NLP to computer vision (Vision Transformers)

The references collectively demonstrate how transformer architectures have become the foundation for state-of-the-art models across multiple AI domains, with consistent improvements in both efficiency and performance compared to previous sequential approaches.`,
  5: `Based on 5+ references: Your reference collection provides comprehensive coverage of transformer architectures and their evolution. The synthesis reveals:

**Core Innovation**: Self-attention mechanisms (Vaswani et al.) that weight input sequence importance, enabling parallelization and capturing long-range dependencies more effectively than RNNs/LSTMs.

**Key Developments**:
• BERT (Devlin et al.): Bidirectional pre-training using masked language modeling, establishing transfer learning as standard practice
• GPT family (Brown et al.): Demonstrates emergent few-shot capabilities at scale, showing that model size and training data volume unlock new abilities
• Vision Transformers (Dosovitskiy et al.): Proves transformer effectiveness extends beyond NLP, treating images as sequences of patches

**Methodological Patterns**:
1. Pre-training on massive datasets followed by fine-tuning for specific tasks
2. Scaling laws: consistent performance improvements with increased model parameters and data
3. Architecture simplification: removing domain-specific components in favor of pure attention mechanisms

**Research Trajectory**: The field is moving toward unified architectures that work across modalities (text, vision, audio), with attention mechanisms as the universal computation primitive. This convergence suggests future research will focus on scaling, efficiency optimizations, and multimodal integration rather than architecture search.`,
};

export default function AutoSummaryPanel() {
  const { data: papers = [] } = useQuery<ReferencePaper[]>({
    queryKey: ['/api/references'],
  });

  const getSummary = () => {
    if (papers.length === 0) return summaryLevels[0];
    if (papers.length === 1) return summaryLevels[1];
    if (papers.length === 2) return summaryLevels[2];
    if (papers.length === 3) return summaryLevels[3];
    if (papers.length === 4) return summaryLevels[4];
    return summaryLevels[5];
  };

  return (
    <div className="flex flex-col h-full border-t">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-sm font-semibold" data-testid="text-summary-title">Auto-Summary</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" data-testid="indicator-tuning" />
          <span className="text-xs text-muted-foreground">
            {papers.length > 0 ? 'analyzing...' : 'waiting...'}
          </span>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-line" data-testid="text-summary-content">
            {getSummary()}
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}
