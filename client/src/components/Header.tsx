import { Sparkles, CheckSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  currentMode: 'brainstorming' | 'feedback';
  onModeChange: (mode: 'brainstorming' | 'feedback') => void;
}

export default function Header({ currentMode, onModeChange }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-background" data-testid="header">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <h1 className="text-lg font-semibold" data-testid="text-app-title">Creative Research Writer</h1>
      </div>

      <div className="flex items-center gap-2 p-1 bg-muted rounded-lg" data-testid="toggle-mode">
        <Button
          variant={currentMode === 'brainstorming' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onModeChange('brainstorming')}
          className="gap-2"
          data-testid="button-brainstorming-mode"
        >
          <Sparkles className="w-4 h-4" />
          Brainstorming
        </Button>
        <Button
          variant={currentMode === 'feedback' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onModeChange('feedback')}
          className="gap-2"
          data-testid="button-feedback-mode"
        >
          <CheckSquare className="w-4 h-4" />
          Feedback
        </Button>
      </div>

      <Avatar data-testid="avatar-user">
        <AvatarImage src="" alt="User" />
        <AvatarFallback>RW</AvatarFallback>
      </Avatar>
    </header>
  );
}
