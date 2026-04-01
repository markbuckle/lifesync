import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  CheckSquare,
  FolderKanban,
  Sparkles,
  CalendarDays,
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

const HomePage: React.FC = () => {
  const features = useScrollReveal();
  const howItWorks = useScrollReveal();
  const cta = useScrollReveal();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-[#8B4328] text-white overflow-hidden min-h-screen flex items-center">
        {/* Video Background */}
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
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">

          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-sm font-medium text-white/90">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI-Powered Productivity
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Your life,{' '}
            <span className="text-primary-light">in sync.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            LifeSync uses AI to unify your tasks, calendar, and projects - so you spend less time organizing and more time doing what matters.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 text-base"
            >
              Get started free
            </Link>
            <Link
              to="/features"
              className="px-8 py-3.5 border border-white/30 hover:border-white/60 text-white font-semibold rounded-full transition-all duration-300 backdrop-blur-sm hover:bg-white/10 text-base"
            >
              See how it works
            </Link>
          </div>

          {/* Social proof stats */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-white/60 text-sm">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-2xl font-bold text-white">10k+</span>
              <span>users synced</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20"></div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-2xl font-bold text-white">98%</span>
              <span>satisfaction rate</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20"></div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-2xl font-bold text-white">4.9★</span>
              <span>average rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div ref={features.ref} className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${revealClass(features.visible)}`}>
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Built for how you actually work</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: LayoutDashboard,
                title: 'Smart Dashboard',
                description: 'Get a unified view of your day - upcoming events, pending tasks, and project status at a glance.',
              },
              {
                icon: CalendarCheck,
                title: 'Appointment Booking',
                description: 'Let others book time with you through shareable scheduling links that respect your availability.',
              },
              {
                icon: CheckSquare,
                title: 'Task Management',
                description: 'Create, prioritize, and track tasks with due dates and statuses so nothing slips through the cracks.',
              },
              {
                icon: FolderKanban,
                title: 'Project Tracker',
                description: 'Organize work into projects with milestones and task breakdowns to keep larger goals on track.',
              },
              {
                icon: Sparkles,
                title: 'AI Assistant',
                description: 'Ask questions, get summaries, or let the AI suggest how to structure your day based on your workload.',
              },
              {
                icon: CalendarDays,
                title: 'Calendar Integration',
                description: 'See all your events in one calendar that syncs with your tasks and project deadlines automatically.',
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 border border-primary/20 hover:shadow-md transition-shadow duration-300 flex gap-5 items-start"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-gray-600 text-base leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div ref={howItWorks.ref} className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${revealClass(howItWorks.visible)}`}>
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Simple by design</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">How it works</h2>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-12 md:gap-6">
            {[
              {
                step: 1,
                title: 'Connect your calendar',
                description: 'Link your existing calendar in seconds. LifeSync imports your events and learns your schedule.',
              },
              {
                step: 2,
                title: 'Add your tasks & projects',
                description: 'Create tasks, set deadlines, and group them into projects. Everything lives in one place.',
              },
              {
                step: 3,
                title: 'Let the AI handle the rest',
                description: 'Our AI surfaces what needs attention, suggests priorities, and keeps your day running smoothly.',
              },
            ].map(({ step, title, description }, index, arr) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-5 flex-shrink-0">
                    <span className="text-2xl font-bold text-white">{step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600 text-base leading-relaxed max-w-xs">{description}</p>
                </div>
                {index < arr.length - 1 && (
                  <>
                    {/* Horizontal connector (desktop) */}
                    <div className="hidden md:flex items-center self-start mt-8 flex-shrink-0">
                      <div className="w-8 h-px bg-primary/30"></div>
                      <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                    </div>
                    {/* Vertical connector (mobile) */}
                    <div className="flex md:hidden flex-col items-center self-center -my-4">
                      <div className="w-px h-8 bg-primary/30"></div>
                    </div>
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="py-16 md:py-24 bg-gray-900">
        <div ref={cta.ref} className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${revealClass(cta.visible)}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Ready to take back your time?
          </h2>
          <p className="text-white/75 text-lg mb-10 leading-relaxed">
            Join thousands of people who use LifeSync to stay organized, focused, and in control - without the chaos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 text-base"
            >
              Get started free
            </Link>
            <Link
              to="/features"
              className="px-8 py-3.5 border-2 border-white/50 hover:border-white text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/10 text-base"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
