import { Plus, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ReferencePaper } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ReferencePapers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const { toast } = useToast();

  const { data: papers = [], isLoading } = useQuery<ReferencePaper[]>({
    queryKey: ['/api/references'],
  });

  const addMutation = useMutation({
    mutationFn: (data: { title: string; name: string }) => 
      apiRequest('/api/references', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/references'] });
      setIsDialogOpen(false);
      setTitle('');
      setName('');
      toast({
        title: "Reference added",
        description: "The paper has been added to your references.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest(`/api/references/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/references'] });
      toast({
        title: "Reference removed",
        description: "The paper has been removed from your references.",
      });
    },
  });

  const handleAdd = () => {
    if (!title.trim() || !name.trim()) return;
    addMutation.mutate({ title, name });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-sm font-semibold" data-testid="text-references-title">My References</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost"
              data-testid="button-add-reference"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-add-reference">
            <DialogHeader>
              <DialogTitle>Add Reference</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="paper-title">File Name</Label>
                <Input
                  id="paper-title"
                  placeholder="e.g., Smith et al. 2024.pdf"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-testid="input-paper-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paper-name">Paper Title</Label>
                <Input
                  id="paper-name"
                  placeholder="e.g., A Novel Approach to..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="input-paper-name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAdd}
                disabled={!title.trim() || !name.trim() || addMutation.isPending}
                data-testid="button-confirm-add"
              >
                {addMutation.isPending ? 'Adding...' : 'Add Reference'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading references...
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {papers.map((paper) => (
              <div
                key={paper.id}
                className="w-full flex items-start gap-3 p-3 rounded-md hover-elevate group"
                data-testid={`card-paper-${paper.id}`}
              >
                <FileText className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" data-testid={`text-paper-title-${paper.id}`}>{paper.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{paper.name}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={() => deleteMutation.mutate(paper.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${paper.id}`}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
