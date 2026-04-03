import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Everything you need to get started.',
    cta: 'Get started free',
    ctaTo: '/signup',
    highlight: false,
    features: [
      'Up to 5 active projects',
      'Basic task management',
      'Calendar view',
      '1 GB storage',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    description: 'For individuals who want to do more.',
    cta: 'Start free trial',
    ctaTo: '/signup',
    highlight: true,
    features: [
      'Unlimited projects',
      'AI Assistant',
      'Advanced calendar & scheduling',
      'Priority email support',
      '20 GB storage',
      'Custom integrations',
    ],
  },
  {
    name: 'Business',
    price: '$19',
    period: 'per month',
    description: 'For teams and growing organisations.',
    cta: 'Start free trial',
    ctaTo: '/signup',
    highlight: false,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Admin controls & permissions',
      'Usage analytics',
      'Unlimited storage',
      'Dedicated support',
    ],
  },
];

const PricingPage: React.FC = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-[#8B4328] text-white overflow-hidden py-28">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <p className="text-primary-light font-semibold text-sm uppercase tracking-widest mb-4">
            Simple pricing
          </p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-5">
            Plans for every stage
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Start for free and upgrade when you're ready. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.highlight
                    ? 'bg-primary text-white shadow-xl shadow-primary/30'
                    : 'bg-white border border-primary/15 hover:shadow-md transition-shadow'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-primary text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
                    Most popular
                  </div>
                )}

                <div className="mb-6">
                  <h2 className={`text-lg font-semibold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h2>
                  <p className={`text-sm mb-4 ${plan.highlight ? 'text-white/70' : 'text-gray-500'}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm mb-1.5 ${plan.highlight ? 'text-white/60' : 'text-gray-400'}`}>
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-white/80' : 'text-primary'}`}
                        strokeWidth={2.5}
                      />
                      <span className={plan.highlight ? 'text-white/85' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.ctaTo}
                  className={`text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? 'bg-white text-primary hover:bg-secondary'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-secondary/40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Common questions</h2>
          <div className="space-y-8">
            {[
              {
                q: 'Can I switch plans later?',
                a: 'Yes — you can upgrade or downgrade at any time. Changes take effect immediately and are prorated.',
              },
              {
                q: 'What happens when my trial ends?',
                a: "You'll be moved to the Free plan automatically. You won't be charged unless you choose to upgrade.",
              },
              {
                q: 'Is there a discount for annual billing?',
                a: 'Annual billing is coming soon and will offer up to 20% off. Join the waitlist to be notified first.',
              },
              {
                q: 'Do you offer refunds?',
                a: "If you're not satisfied within the first 30 days, contact us and we'll make it right.",
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5">{q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get in sync?</h2>
          <p className="text-gray-500 mb-8">Join thousands of people already using LifeSync to stay on top of everything.</p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-colors shadow-lg shadow-primary/25"
          >
            Get started free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
