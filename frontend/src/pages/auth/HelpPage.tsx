import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  CheckSquare,
  Calendar,
  Sparkles,
  CreditCard,
  Shield,
  ChevronDown,
} from 'lucide-react';

const topics = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    description: 'Set up your account and learn the basics of LifeSync.',
  },
  {
    icon: CheckSquare,
    title: 'Managing Tasks',
    description: 'Create, organise, and track your tasks and to-dos.',
  },
  {
    icon: Calendar,
    title: 'Calendar & Appointments',
    description: 'Sync your schedule and manage appointments with ease.',
  },
  {
    icon: Sparkles,
    title: 'AI Assistant',
    description: 'Get the most out of your intelligent productivity assistant.',
  },
  {
    icon: CreditCard,
    title: 'Account & Billing',
    description: 'Manage your subscription, billing, and payment details.',
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Keep your data safe and control your privacy settings.',
  },
];

const faqs = [
  {
    question: 'How do I invite someone to a shared project?',
    answer:
      'Open the project, click the "Members" button in the top-right corner, then enter the email address of the person you want to invite. They will receive an email with a link to join.',
  },
  {
    question: 'Can I use LifeSync on mobile?',
    answer:
      'Yes — LifeSync is fully responsive and works great in any mobile browser. Native iOS and Android apps are coming soon.',
  },
  {
    question: 'How does the AI Assistant work?',
    answer:
      'The AI Assistant reads your tasks, calendar, and project context to give you relevant suggestions, summaries, and automations. Your data is never used to train external models.',
  },
  {
    question: 'How do I export my data?',
    answer:
      'Go to Settings → Account, then click "Export Data". You will receive a download link by email within a few minutes.',
  },
  {
    question: 'What happens when I cancel my plan?',
    answer:
      'Your account reverts to the Free tier at the end of the billing period. All your data is preserved — you just lose access to Pro features.',
  },
];

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-medium text-gray-800">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <p className="pb-4 text-sm text-gray-500 leading-relaxed">{answer}</p>
      )}
    </div>
  );
};

const HelpPage: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-12">
      {/* Page header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Help & Support</h1>
        <p className="text-sm text-gray-500 mt-1">Browse topics or search for answers.</p>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-primary flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What can we help you with?"
          className="flex-1 bg-transparent text-base text-gray-700 placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Topic cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">
          Browse Topics
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {topics.map(({ icon: Icon, title, description }) => (
            <button
              key={title}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 text-left"
            >
              <div className="bg-secondary rounded-xl p-3 w-fit mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ accordion */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">
          Frequently Asked Questions
        </h2>
        <div className="bg-white rounded-2xl shadow-sm px-6">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>

      {/* Still need help banner */}
      <div className="bg-primary rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Still need help?</h2>
          <p className="text-sm text-white/70 mt-1">
            Our support team is here for you — usually replies within a few hours.
          </p>
        </div>
        <button className="flex-shrink-0 text-sm font-medium text-white border border-white/50 rounded-lg px-5 py-2.5 hover:bg-white/10 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default HelpPage;
