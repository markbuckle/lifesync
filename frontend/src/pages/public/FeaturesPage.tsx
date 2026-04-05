import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  FolderKanban,
  Sparkles,
  Mail,
  MessageSquare,
  BookOpen,
  Github,
  Video,
  Cloud,
  CheckCircle,
  Users,
} from 'lucide-react';

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

const revealClass = (visible: boolean) =>
  `transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

// ─── Tab content definitions ────────────────────────────────────────────────

const DashboardPreview = () => (
  <div className="space-y-4">
    <div className="flex gap-4">
      {[
        { label: "Today's Tasks", value: '8' },
        { label: 'This Week', value: '23' },
        { label: 'Projects', value: '4' },
      ].map(({ label, value }) => (
        <div key={label} className="flex-1 bg-background rounded-xl p-4">
          <p className="text-2xl font-bold text-primary">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{label}</p>
        </div>
      ))}
    </div>
    <div className="bg-primary/10 rounded-xl p-4 flex items-center gap-3">
      <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
      <p className="text-sm text-gray-700">
        AI insight: You have 3 high-priority tasks due today. Consider blocking 2 hours this afternoon.
      </p>
    </div>
    <div className="bg-background rounded-xl p-4 space-y-2">
      {['Review design mockups', 'Send weekly update', 'Schedule team sync'].map((task) => (
        <div key={task} className="flex items-center gap-3">
          <div className="w-4 h-4 rounded border-2 border-gray-300 flex-shrink-0" />
          <span className="text-sm text-gray-700">{task}</span>
        </div>
      ))}
    </div>
  </div>
);

const TasksPreview = () => {
  const tasks = [
    { title: 'Finalize Q2 report', badge: 'High', badgeClass: 'bg-red-100 text-red-600' },
    { title: 'Review design mockups', badge: 'Medium', badgeClass: 'bg-yellow-100 text-yellow-600' },
    { title: 'Send client proposal', badge: 'High', badgeClass: 'bg-red-100 text-red-600' },
    { title: 'Update team documentation', badge: 'Low', badgeClass: 'bg-green-100 text-green-600' },
  ];
  return (
    <div className="space-y-3">
      {tasks.map(({ title, badge, badgeClass }) => (
        <div key={title} className="flex items-center gap-3 bg-background rounded-xl px-4 py-3">
          <div className="w-4 h-4 rounded border-2 border-gray-300 flex-shrink-0" />
          <span className="flex-1 text-sm text-gray-700">{title}</span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeClass}`}>{badge}</span>
        </div>
      ))}
    </div>
  );
};

const CalendarPreview = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const rows = [
    [null, 1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12, 13],
    [14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27],
    [28, 29, 30, null, null, null, null],
  ];
  const highlighted = new Set([10, 17, 24]);
  const dotted = new Set([8, 14, 22, 26]);

  return (
    <div className="bg-background rounded-xl p-4">
      <div className="grid grid-cols-7 mb-2">
        {days.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7">
          {row.map((day, ci) => (
            <div key={ci} className="flex flex-col items-center py-1">
              {day !== null ? (
                <>
                  <span
                    className={`w-7 h-7 flex items-center justify-center text-sm rounded-full ${
                      highlighted.has(day)
                        ? 'bg-primary text-white font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    {day}
                  </span>
                  {dotted.has(day) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-0.5" />
                  )}
                </>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const ProjectsPreview = () => {
  const projects = [
    { name: 'Website Redesign', progress: 65, tasks: '13/20 tasks', status: 'On Track', statusClass: 'bg-green-100 text-green-700' },
    { name: 'Mobile App MVP', progress: 40, tasks: '8/20 tasks', status: 'In Progress', statusClass: 'bg-blue-100 text-blue-700' },
    { name: 'Q2 Marketing Push', progress: 85, tasks: '17/20 tasks', status: 'Nearly Done', statusClass: 'bg-yellow-100 text-yellow-700' },
  ];
  return (
    <div className="space-y-5">
      {projects.map(({ name, progress, tasks, status, statusClass }) => (
        <div key={name} className="bg-background rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-gray-900 text-sm">{name}</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusClass}`}>{status}</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2 mb-2">
            <div className="bg-primary rounded-full h-2" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{tasks}</span>
            <span>{progress}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const AIPreview = () => (
  <div className="flex flex-col space-y-3 max-w-sm mx-auto">
    <div className="bg-primary text-white rounded-2xl rounded-br-sm px-4 py-2 ml-auto max-w-xs text-sm">
      What&apos;s on my plate today?
    </div>
    <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs text-sm">
      You have 8 tasks today: 3 high-priority, 2 meetings, and a project deadline at 5 PM.
    </div>
    <div className="bg-primary text-white rounded-2xl rounded-br-sm px-4 py-2 ml-auto max-w-xs text-sm">
      Block time for deep work this afternoon
    </div>
    <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs text-sm">
      Done! I&apos;ve blocked 2–4 PM as focus time and moved your optional meeting to tomorrow.
    </div>
  </div>
);

const tabs = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: "Get a bird's-eye view of your day. See upcoming appointments, urgent tasks, and project health all in one glance.",
    preview: <DashboardPreview />,
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: CheckSquare,
    description: 'Create, prioritize, and track tasks with due dates, categories, and AI-assisted scheduling.',
    preview: <TasksPreview />,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: CalendarDays,
    description: 'View all your events in a clean calendar that syncs with your tasks and project deadlines automatically.',
    preview: <CalendarPreview />,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderKanban,
    description: 'Track projects with milestones, progress bars, and at-a-glance status so nothing slips.',
    preview: <ProjectsPreview />,
  },
  {
    id: 'ai',
    label: 'AI Assistant',
    icon: Sparkles,
    description: 'Ask questions in plain English. Your AI assistant can create tasks, summarize your week, and surface what needs attention.',
    preview: <AIPreview />,
  },
];

// ─── Integrations ────────────────────────────────────────────────────────────

const integrations = [
  { icon: CalendarDays, color: '#4285F4', label: 'Google Calendar' },
  { icon: Mail, color: '#EA4335', label: 'Gmail' },
  { icon: MessageSquare, color: '#4A154B', label: 'Slack' },
  { icon: BookOpen, color: '#000000', label: 'Notion' },
  { icon: Github, color: '#24292e', label: 'GitHub' },
  // center logo tile placeholder handled inline
  { icon: Video, color: '#2D8CFF', label: 'Zoom' },
  { icon: Cloud, color: '#0061FF', label: 'Dropbox' },
  { icon: CheckCircle, color: '#F06A6A', label: 'Asana' },
  { icon: Users, color: '#6264A7', label: 'Teams' },
];

// ─── Component ───────────────────────────────────────────────────────────────

const FeaturesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [marqueeHovered, setMarqueeHovered] = useState(false);

  const tabsSection = useScrollReveal();
  const integrationsSection = useScrollReveal();
  const ctaSection = useScrollReveal();

  const activeTabData = tabs.find((t) => t.id === activeTab)!;
  const ActiveIcon = activeTabData.icon;

  // Build the integration tile list (with LifeSync logo in center of first copy)
  const buildTiles = (withLogo: boolean) => {
    const before = integrations.slice(0, 5);
    const after = integrations.slice(5);
    return (
      <>
        {before.map(({ icon: Icon, color, label }) => (
          <div
            key={label}
            className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0"
            title={label}
          >
            <Icon style={{ color }} className="w-6 h-6" strokeWidth={1.75} />
          </div>
        ))}
        {withLogo ? (
          <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center flex-shrink-0">
            <img src="/logo.svg" className="h-10 w-auto" alt="LifeSync" />
          </div>
        ) : (
          <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center flex-shrink-0 opacity-0 pointer-events-none">
            {/* spacer to keep layout consistent in second copy */}
          </div>
        )}
        {after.map(({ icon: Icon, color, label }) => (
          <div
            key={label}
            className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0"
            title={label}
          >
            <Icon style={{ color }} className="w-6 h-6" strokeWidth={1.75} />
          </div>
        ))}
      </>
    );
  };

  return (
    <div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── Section 1: Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-[#8B4328] text-white overflow-hidden py-28 md:py-40 text-center px-4">
        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10">
          <p className="text-primary-light font-semibold text-sm uppercase tracking-widest mb-5">
            LifeSync Features
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Your life,<br />
            <span className="text-primary-light">one platform</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mt-6 leading-relaxed">
            LifeSync brings your tasks, calendar, projects and AI assistant into one beautifully unified experience.
          </p>
          {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              to="/signup"
              className="bg-primary hover:bg-primary-dark text-white rounded-full px-8 py-3.5 font-semibold transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5"
            >
              Get started free →
            </Link>
            <Link
              to="/pricing"
              className="border border-white/30 hover:border-white/60 text-white rounded-full px-8 py-3.5 font-semibold transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
            >
              See pricing
            </Link>
          </div> */}
          {/* <div className="flex items-center justify-center gap-2 mt-8">
            <span className="text-yellow-400 text-lg">★★★★☆</span>
            <span className="text-white/60 text-sm">4.9 · Loved by thousands of users</span>
          </div> */}
        </div>
      </section>

      {/* ── Section 2: Tabbed Feature Showcase ──────────────────────────── */}
      <section className="bg-gray-50 py-24 px-4">
        <div
          ref={tabsSection.ref}
          className={`max-w-5xl mx-auto ${revealClass(tabsSection.visible)}`}
        >
          {/* Tab bar */}
          <div className="flex justify-center gap-2 flex-wrap">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={
                  activeTab === id
                    ? 'bg-primary text-white rounded-full px-5 py-2 font-medium text-sm transition-colors duration-200'
                    : 'bg-white text-gray-600 border border-gray-200 rounded-full px-5 py-2 text-sm hover:border-primary hover:text-primary transition-colors duration-200'
                }
              >
                {label}
              </button>
            ))}
          </div>

          {/* Feature panel */}
          <div className="bg-white rounded-3xl shadow-lg p-10 mt-8 min-h-[420px] transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ActiveIcon className="w-5 h-5 text-primary" strokeWidth={1.75} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{activeTabData.label}</h2>
            </div>
            <p className="text-gray-500 text-base mb-8 max-w-lg">{activeTabData.description}</p>
            {activeTabData.preview}
          </div>
        </div>
      </section>

      {/* ── Section 3: Integrations ──────────────────────────────────────── */}
      <section className="bg-background py-24 px-4">
        <div
          ref={integrationsSection.ref}
          className={`max-w-5xl mx-auto ${revealClass(integrationsSection.visible)}`}
        >
          <div className="text-center mb-12">
            <p className="text-primary uppercase tracking-widest text-sm font-semibold">Integrations</p>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Connect the tools you already use</h2>
          </div>

          {/* Marquee */}
          <div
            className="overflow-hidden w-full"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
            onMouseEnter={() => setMarqueeHovered(true)}
            onMouseLeave={() => setMarqueeHovered(false)}
          >
            <div
              className="flex gap-12 items-center"
              style={{
                animation: 'marquee 30s linear infinite',
                animationPlayState: marqueeHovered ? 'paused' : 'running',
                width: 'max-content',
              }}
            >
              {/* First copy — includes LifeSync logo */}
              {buildTiles(true)}
              {/* Second copy — for seamless loop */}
              {buildTiles(false)}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: CTA Banner ────────────────────────────────────────── */}
      <section className="bg-primary py-20 px-4 text-white text-center">
        <div
          ref={ctaSection.ref}
          className={`max-w-3xl mx-auto ${revealClass(ctaSection.visible)}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="text-white/75 text-lg mt-4 mb-8 leading-relaxed">
            Start for free and experience the clarity of having your entire life in one place.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-primary font-semibold rounded-full px-8 py-3.5 hover:bg-secondary transition-colors duration-200"
          >
            Get started free →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
