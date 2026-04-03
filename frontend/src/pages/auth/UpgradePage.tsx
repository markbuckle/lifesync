import React from 'react';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    description: 'For individuals who want to do more.',
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

const UpgradePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Upgrade your plan</h1>
      <p className="text-sm text-gray-500 mb-6">You are currently on the <span className="font-medium text-gray-700">Free</span> plan.</p>

      {/* Current plan banner */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Free plan</p>
            <p className="text-xs text-gray-400 mt-0.5">5 projects · Basic features · Community support</p>
          </div>
        </div>
        <span className="text-xs font-semibold bg-secondary text-primary-dark px-3 py-1 rounded-full">
          Current
        </span>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-2 gap-5 mb-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-xl shadow-sm p-6 flex flex-col ${
              plan.highlight ? 'ring-2 ring-primary' : ''
            }`}
          >
            {plan.highlight && (
              <span className="self-start text-xs font-bold uppercase tracking-widest text-primary bg-secondary px-2.5 py-0.5 rounded-full mb-4">
                Most popular
              </span>
            )}

            <h2 className="text-base font-semibold text-gray-900">{plan.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5 mb-4">{plan.description}</p>

            <div className="flex items-end gap-1 mb-5">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-xs text-gray-400 mb-1.5">/{plan.period}</span>
            </div>

            <ul className="space-y-2.5 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" strokeWidth={2.5} />
                  <span className="text-gray-600">{f}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
                plan.highlight
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'border border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
              }`}
            >
              Upgrade to {plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-400 text-center">
        All plans include a 14-day free trial. No credit card required.{' '}
        <a href="/pricing" className="text-primary hover:underline">See full comparison</a>
      </p>
    </div>
  );
};

export default UpgradePage;
