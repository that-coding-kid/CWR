import { useState } from "react";
import Header from "../Header";

export default function HeaderExample() {
  const [mode, setMode] = useState<'brainstorming' | 'feedback'>('brainstorming');
  
  return <Header currentMode={mode} onModeChange={setMode} />;
}
