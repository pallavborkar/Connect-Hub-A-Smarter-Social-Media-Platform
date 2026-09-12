import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle,
  Users,
  Share2,
  Calendar,
  Layers,
  Lock,
  Star,
  CheckCircle2,
  X,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SUBSCRIPTION_PLANS, FEATURE_COMPARISON_CATEGORIES } from '../config/subscriptionPlans';
import { SubscriptionPlanId, BillingCycle } from '../types';

export const PricingView: React.FC = () => {
  const { 
    subscription, 
    billingCycle, 
    setBillingCycle, 
    openCheckoutModal, 
    openEnterpriseModal,
    setActiveView 
  } = useApp();

  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(true);

  const toggleFaq = (idx: number) => {
    setFaqOpen(faqOpen === idx ? null : idx);
  };

  const handleSelectPlan = (planId: SubscriptionPlanId) => {
    if (planId === 'enterprise') {
      openEnterpriseModal();
    } else {
      openCheckoutModal(planId, billingCycle);
    }
  };

  const faqs = [
    {
      q: 'Can I change my plan or cancel at any time?',
      a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time from Settings → Billing & Subscription. If you upgrade, your remaining balance is prorated immediately.',
    },
    {
      q: 'How does the 7-day free trial work for paid plans?',
      a: 'When you start a trial on Creator or Team, you get full unrestricted access for 7 days. You can cancel before the 7 days end without being charged.',
    },
    {
      q: 'Do you offer special discounts for colleges and agencies?',
      a: 'Yes. We offer up to 30% additional discount on annual institutional plans for verified educational institutions and high-volume creative agencies. Contact us via the Enterprise tier.',
    },
    {
      q: 'What payment methods are supported globally?',
      a: 'We support all major payment methods including Cards (Visa, Mastercard, Amex), UPI (Google Pay, PhonePe), and international bank transfers.',
    },
    {
      q: 'What happens if we reach our monthly AI generation limit?',
      a: 'You can either upgrade your plan for higher monthly limits or top up an AI credit pack at any time without changing your base tier.',
    },
  ];

  return (
    <div id="pricing-page" className="p-4 sm:p-6 md:p-10 space-y-12 max-w-7xl mx-auto text-[#F5F5F0]">
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#C8FF00]/10 border border-[#C8FF00]/30 text-[#C8FF00] font-mono-tag text-[10px] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#C8FF00]" />
          <span>PLANS BUILT FOR HIGH-VELOCITY CREATIVE TEAMS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight uppercase">
          Predictable scale. <span className="text-[#C8FF00]">Zero friction.</span>
        </h1>
        
        <p className="text-sm sm:text-base text-[#9A9A9A] font-mono leading-relaxed">
          Select the optimal plan to power your multi-channel command center, AI synthesis, and team publishing workflow.
        </p>

        {/* Monthly / Yearly Billing Toggle */}
        <div className="pt-4 flex items-center justify-center">
          <div className="bg-[#111111] p-1.5 rounded-2xl border border-white/10 flex items-center space-x-2">
            <button
              id="billing-toggle-monthly"
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#080808]'
                  : 'text-[#707070] hover:text-white'
              }`}
            >
              Monthly
            </button>

            <button
              id="billing-toggle-yearly"
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-[#C8FF00] text-[#080808]'
                  : 'text-[#707070] hover:text-white'
              }`}
            >
              <span>Yearly</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-black uppercase ${
                billingCycle === 'yearly' ? 'bg-[#080808] text-[#C8FF00]' : 'bg-[#C8FF00]/20 text-[#C8FF00]'
              }`}>
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {(['free', 'creator', 'team', 'pro'] as SubscriptionPlanId[]).map((planId) => {
          const plan = SUBSCRIPTION_PLANS[planId];
          const isCurrent = subscription.planId === planId;
          const isPopular = plan.isPopular;

          const displayPrice = plan.monthlyPrice === 0 
            ? 'Free' 
            : `₹${billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}`;
          const priceUnit = plan.monthlyPrice === 0 
            ? '' 
            : billingCycle === 'yearly' ? '/year' : '/month';
          const monthlyEquivalent = plan.yearlyPriceMonthlyEquivalent > 0 
            ? `₹${plan.yearlyPriceMonthlyEquivalent}` 
            : null;

          return (
            <motion.div
              key={planId}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`relative rounded-2xl p-6 flex flex-col justify-between border transition-all ${
                isPopular
                  ? 'bg-[#151515] border-[#C8FF00] shadow-2xl shadow-[#C8FF00]/10 ring-1 ring-[#C8FF00]/30'
                  : 'bg-[#111111] border-white/10 shadow-sm'
              }`}
            >
              {/* Most Popular Ribbon */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-[#C8FF00] text-[#080808] text-[10px] font-mono font-black tracking-wider uppercase flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span>MOST POPULAR</span>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrent && (
                <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-[#C8FF00]/10 border border-[#C8FF00]/30 text-[#C8FF00] text-[10px] font-mono font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>CURRENT PLAN</span>
                </div>
              )}

              <div>
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-black text-white">{plan.name}</h3>
                  <p className="text-xs font-mono text-[#9A9A9A] min-h-[32px]">{plan.tagline}</p>
                </div>

                {/* Price Display */}
                <div className="my-6 border-y border-white/10 py-4">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl sm:text-4xl font-display font-black text-white">{displayPrice}</span>
                    {priceUnit && (
                      <span className="text-xs font-mono text-[#707070]">
                        {priceUnit}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && monthlyEquivalent && (
                    <p className="text-[11px] font-mono text-[#C8FF00] mt-1">
                      Equivalent to {monthlyEquivalent}/month
                    </p>
                  )}
                </div>

                {/* Core Features List */}
                <div className="space-y-2.5 mb-6">
                  <p className="text-[10px] font-mono-tag text-[#707070]">INCLUDED CAPABILITIES:</p>
                  {plan.features.slice(0, 5).map((f, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs font-mono text-[#F5F5F0]">
                      <Check className="w-4 h-4 text-[#C8FF00] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  id={`select-plan-${planId}`}
                  onClick={() => handleSelectPlan(planId)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    isCurrent
                      ? 'bg-white/5 text-[#707070] cursor-default'
                      : isPopular
                      ? 'btn-lime shadow-lg shadow-[#C8FF00]/10'
                      : 'btn-secondary-dark'
                  }`}
                >
                  <span>{isCurrent ? 'Current Plan Active' : plan.ctaText}</span>
                  {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enterprise Banner */}
      <div className="p-8 rounded-2xl card-brivon border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0E0E0E]">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#C8FF00]" />
            <span className="font-mono-tag text-[10px] text-[#C8FF00]">CUSTOM ENTERPRISE</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-white">
            Need a dedicated single-tenant cluster or custom SLA?
          </h3>
          <p className="text-xs font-mono text-[#9A9A9A] leading-relaxed">
            Get unlimited seats, custom generative AI fine-tuning, dedicated IP routing, enterprise SSO, and 24/7 priority engineering support.
          </p>
        </div>

        <button
          onClick={openEnterpriseModal}
          className="btn-secondary-dark px-6 py-3 text-xs font-mono font-bold shrink-0 cursor-pointer"
        >
          Talk to Enterprise Sales →
        </button>
      </div>

      {/* Feature Comparison Table */}
      <div className="card-brivon rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="font-mono-tag text-[10px] text-[#C8FF00]">DEEP SPECIFICATION</span>
            <h3 className="text-xl font-display font-bold text-white mt-0.5">Feature Matrix Comparison</h3>
          </div>
          <button
            onClick={() => setShowComparison(prev => !prev)}
            className="text-xs font-mono text-[#9A9A9A] hover:text-white flex items-center space-x-1 cursor-pointer"
          >
            <span>{showComparison ? 'Collapse' : 'Expand'}</span>
            {showComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showComparison && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-[#707070]">
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4">Free</th>
                  <th className="py-3 px-4">Creator</th>
                  <th className="py-3 px-4 text-[#C8FF00]">Team</th>
                  <th className="py-3 px-4">Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {FEATURE_COMPARISON_CATEGORIES.flatMap(cat => cat.features).map((feat, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{feat.name}</td>
                    <td className="py-3 px-4 text-[#9A9A9A]">{typeof feat.free === 'boolean' ? (feat.free ? '✓' : '—') : feat.free}</td>
                    <td className="py-3 px-4 text-[#9A9A9A]">{typeof feat.creator === 'boolean' ? (feat.creator ? '✓' : '—') : feat.creator}</td>
                    <td className="py-3 px-4 text-[#C8FF00] font-bold">{typeof feat.team === 'boolean' ? (feat.team ? '✓' : '—') : feat.team}</td>
                    <td className="py-3 px-4 text-white">{typeof feat.pro === 'boolean' ? (feat.pro ? '✓' : '—') : feat.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <div className="card-brivon rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-white/10 pb-4">
          <span className="font-mono-tag text-[10px] text-[#C8FF00]">FREQUENTLY ASKED QUESTIONS</span>
          <h3 className="text-xl font-display font-bold text-white mt-0.5">Everything you need to know</h3>
        </div>

        <div className="space-y-3 divide-y divide-white/5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="pt-3">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between text-left py-2 text-sm font-display font-bold text-white hover:text-[#C8FF00] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {faqOpen === idx ? <ChevronUp className="w-4 h-4 text-[#C8FF00]" /> : <ChevronDown className="w-4 h-4 text-[#707070]" />}
              </button>
              {faqOpen === idx && (
                <p className="text-xs font-mono text-[#9A9A9A] leading-relaxed pb-3 pt-1">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
