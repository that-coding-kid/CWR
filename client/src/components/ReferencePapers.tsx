import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockPapers = [
  { id: '1', title: 'Vaswani et al. 2017.pdf', name: 'Attention Is All You Need' },
  { id: '2', title: 'Dosovitskiy et al. 2020.pdf', name: 'An Image is Worth 16x16 Words' },
  { id: '3', title: 'Brown et al. 2020.pdf', name: 'Language Models are Few-Shot Learners' },
  { id: '4', title: 'Devlin et al. 2018.pdf', name: 'BERT: Pre-training of Deep Bidirectional Transformers' },
];

export default function ReferencePapers() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-sm font-semibold" data-testid="text-references-title">My References</h2>
        <Button 
          size="icon" 
          variant="ghost"
          onClick={() => console.log('Add reference triggered')}
          data-testid="button-add-reference"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {mockPapers.map((paper) => (
            <button
              key={paper.id}
              className="w-full flex items-start gap-3 p-3 rounded-md hover-elevate active-elevate-2 text-left"
              onClick={() => console.log(`Selected paper: ${paper.title}`)}
              data-testid={`button-paper-${paper.id}`}
            >
              <FileText className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" data-testid={`text-paper-title-${paper.id}`}>{paper.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{paper.name}</p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
