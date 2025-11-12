import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const sections = [
  'Abstract',
  'Introduction',
  'Methodology',
  'Results',
  'Discussion',
  'Conclusion',
  'Other',
];

const mockContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;

export default function FeedbackMode() {
  const [section, setSection] = useState('Introduction');
  const [content, setContent] = useState(mockContent);

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <div className="flex items-center gap-3">
        <Label htmlFor="section-select" className="text-sm font-medium whitespace-nowrap">
          Current Section:
        </Label>
        <Select value={section} onValueChange={setSection}>
          <SelectTrigger id="section-select" className="w-[200px]" data-testid="select-section">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sections.map((s) => (
              <SelectItem key={s} value={s} data-testid={`option-section-${s.toLowerCase()}`}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste your written content here..."
        className="flex-1 resize-none font-serif text-base leading-relaxed"
        data-testid="textarea-content"
      />
    </div>
  );
}
