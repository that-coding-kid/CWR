import { useState } from "react";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import MainContentArea from "@/components/MainContentArea";
import RightSidebar from "@/components/RightSidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  const [currentMode, setCurrentMode] = useState<'brainstorming' | 'feedback'>('brainstorming');

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Header currentMode={currentMode} onModeChange={setCurrentMode} />
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <LeftSidebar />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={55} minSize={30}>
          <MainContentArea currentMode={currentMode} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <RightSidebar currentMode={currentMode} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
