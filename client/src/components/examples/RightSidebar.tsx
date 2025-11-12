import { useState } from "react";
import RightSidebar from "../RightSidebar";
import { Button } from "@/components/ui/button";

export default function RightSidebarExample() {
  const [mode, setMode] = useState<'brainstorming' | 'feedback'>('feedback');
  
  return (
    <div className="h-[600px] w-[320px] flex flex-col gap-2">
      <div className="flex gap-2">
        <Button onClick={() => setMode('brainstorming')} size="sm">
          Brainstorming
        </Button>
        <Button onClick={() => setMode('feedback')} size="sm">
          Feedback
        </Button>
      </div>
      <div className="flex-1">
        <RightSidebar currentMode={mode} />
      </div>
    </div>
  );
}
