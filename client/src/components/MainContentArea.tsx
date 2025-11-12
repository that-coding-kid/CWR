import BrainstormingMode from "./BrainstormingMode";
import FeedbackMode from "./FeedbackMode";

interface MainContentAreaProps {
  currentMode: 'brainstorming' | 'feedback';
}

export default function MainContentArea({ currentMode }: MainContentAreaProps) {
  return (
    <div className="h-full bg-background">
      {currentMode === 'brainstorming' ? <BrainstormingMode /> : <FeedbackMode />}
    </div>
  );
}
