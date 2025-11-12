import { useState } from "react";
import MainContentArea from "../MainContentArea";
import { Button } from "@/components/ui/button";

export default function MainContentAreaExample() {
  const [mode, setMode] = useState<'brainstorming' | 'feedback'>('brainstorming');
  
  return (
    <div className="h-[600px] flex flex-col gap-2">
      <div className="flex gap-2">
        <Button onClick={() => setMode('brainstorming')} size="sm">
          Brainstorming
        </Button>
        <Button onClick={() => setMode('feedback')} size="sm">
          Feedback
        </Button>
      </div>
      <div className="flex-1">
        <MainContentArea currentMode={mode} />
      </div>
    </div>
  );
}
