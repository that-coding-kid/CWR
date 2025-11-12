import BrainstormingTips from "./BrainstormingTips";
import FeedbackPanel from "./FeedbackPanel";

interface RightSidebarProps {
  currentMode: 'brainstorming' | 'feedback';
}

export default function RightSidebar({ currentMode }: RightSidebarProps) {
  return (
    <div className="h-full bg-sidebar border-l">
      {currentMode === 'brainstorming' ? <BrainstormingTips /> : <FeedbackPanel />}
    </div>
  );
}
