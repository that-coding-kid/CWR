# Design Guidelines: Creative Research Writer

## Design Philosophy

**Aesthetic Direction**: Modern, minimalist, AI-native interface inspired by tools like Anara
- **Theme**: Dark mode first - clean, spacious, text-focused
- **Typography**: Inter (clean sans-serif)
- **Icons**: Lucide React icon library
- **Visual Language**: Component-driven, spacious layouts with clear hierarchy

## Layout Architecture

### 3-Column Responsive Structure
- **Left Sidebar** (Resizable): Reference management + Auto-summary panel
- **Main Content Area** (Fluid): Primary workspace switching between modes
- **Right Sidebar** (Resizable): Context-aware feedback and grading

## Core Components

### Header (Fixed Top)
- **Left**: Application logo/title "Creative Research Writer"
- **Center**: Segmented control mode toggle (pill-shaped):
  - "Brainstorming" with sparkles icon
  - "Feedback" with check-square icon
- **Right**: User profile/avatar

### Left Sidebar

**Section 1: Reference Papers**
- Heading: "My References"
- "Add Reference" button with + or upload icon
- Scrollable list of paper entries (e.g., "Vaswani et al. 2017.pdf")

**Section 2: Auto-Summary Panel**
- Heading: "Auto-Summary"
- Animated "tuning..." indicator (subtle pulsing dot)
- Scrollable summary text area

### Main Content Area (Mode-Dependent)

**Brainstorming Mode**:
- Chat-style interface
- Top: Clean textarea with placeholder "Tell me about your core idea, hypothesis, or research question..."
- Below: Scrollable chat window with:
  - System messages
  - LLM question prompts

**Feedback Mode**:
- Section selector dropdown at top:
  - Label: "Current Section:"
  - Options: Abstract, Introduction, Methodology, Results, Discussion, Conclusion, Other
- Large text editor/textarea filling the space
- Placeholder: "Paste your written content here..."

### Right Sidebar (Mode-Dependent)

**Brainstorming Mode**:
- Minimal "Tips" card with brainstorming guidance

**Feedback Mode**:

*Grading Panel*:
- Heading: "Quality Score"
- Grid of 5 metric cards displaying:
  - Clarity: 8.5/10
  - Rigor: 8.5/10
  - Conciseness: 8.5/10
  - Novelty: 8.5/10
  - Structure: 8.5/10
- Style as modern stat cards

*Feedback List*:
- Heading: "Actionable Feedback"
- Scrollable feedback cards containing:
  - Title/Type (e.g., "Suggestion: Improve Flow")
  - Feedback text
  - Location indicator (e.g., "Section: Methodology")

## Spacing & Layout
- Generous whitespace for readability
- Clean component separation
- Resizable panels with clear affordances
- Scrollable sections where content may overflow

## Interactive Elements
- Functional mode toggle affecting entire layout
- Hover states on all interactive elements
- Clean, modern button styling
- Smooth transitions between modes

## Visual Hierarchy
- Clear headings for each panel/section
- Distinct visual treatment for system vs. user content in chat
- Card-based design for metrics and feedback items
- Strong contrast for critical information in dark mode

## Images
No hero images or decorative imagery required. This is a utility-focused, text-heavy application where function drives the interface.