import React from 'react';
import { Calendar, ListTodo, FolderKanban, Lightbulb } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const suggestedPrompts = [
  {
    id: 1,
    icon: Calendar,
    text: 'What appointments do I have this week?',
  },
  {
    id: 2,
    icon: ListTodo,
    text: 'Create a task to review the Q4 report',
  },
  {
    id: 3,
    icon: FolderKanban,
    text: 'Show me my projects that need attention',
  },
  {
    id: 4,
    icon: Lightbulb,
    text: 'Give me productivity tips for tomorrow',
  },
];

const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelectPrompt }) => {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-600">Suggested prompts:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {suggestedPrompts.map((prompt) => {
          const Icon = prompt.icon;
          return (
            <button
              key={prompt.id}
              onClick={() => onSelectPrompt(prompt.text)}
              className="flex items-start gap-2.5 p-3 rounded-lg bg-primary text-white transition-all hover:shadow-md hover:scale-[1.02] text-left"
            >
              <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-medium leading-tight">{prompt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedPrompts;