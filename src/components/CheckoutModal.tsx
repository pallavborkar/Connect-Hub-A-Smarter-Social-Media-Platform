import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Check, 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle, 
  Building2, 
  CheckCircle2, 
  Zap, 
  Calendar,
  Share2,
  Users,
  QrCode,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';
import { SubscriptionPlanId, BillingCycle, PaymentMethodType } from '../types';

export const CheckoutModal: React.FC = () => {
  const { 
    checkoutModalState, 
    closeCheckoutModal, 
    processSubscriptionPayment,
    user,
    workspace,
    showToast,
    triggerConfetti
  } = useApp();

  if (!checkoutModalState.isOpen) return null;

  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>(
    checkoutModalState.selectedPlan || 'team'
  );
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(
    checkoutModalState.billingCycle || 'monthly'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');

  // Billing Contact Form
  const [fullName, setFullName] = useState(user.name || 'Pallav Borkar');
  const [email, setEmail] = useState(user.email || 'pallavborkar73@gmail.com');
  const [companyName, setCompanyName] = useState(workspace.name || 'JSPM Social Media Team');
  const [gstNumber, setGstNumber] = useState('27AAACJ1234F1Z5');
  const [address, setAddress] = useState('JSPM Campus, Hadapsar');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('411028');

  // Payment details form
  const [upiId, setUpiId] = useState('pallav@okaxis');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('982');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Checkout states
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentErrorMessage, setPaymentErrorMessage] = useState('');
  const [processingStep, setProcessingStep] = useState('');

  const plan = SUBSCRIPTION_PLANS[selectedPlanId];
  const basePrice = selectedCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalAmount = basePrice + gstAmount;

  const handlePayNow = async (forceFail = false) => {
    setPaymentState('processing');
    setProcessingStep('Connecting to Razorpay / Stripe Gateway...');

    await new Promise((r) => setTimeout(r, 600));
    setProcessingStep('Verifying 256-bit TLS secure payment token...');

    await new Promise((r) => setTimeout(r, 700));
    setProcessingStep(
      paymentMethod === 'upi'
        ? `Requesting UPI auto-mandate authorization for ${upiId}...`
        : `Authorizing card ${cardNumber.slice(0, 4)} via 3D Secure OTP...`
    );

    await new Promise((r) => setTimeout(r, 800));

    if (forceFail) {
      setPaymentState('failed');
      setPaymentErrorMessage('Transaction declined by issuing bank: Insufficient funds or daily UPI limit reached. Please try an alternate payment method.');
      return;
    }

    setPaymentState('success');
    setProcessingStep('Payment verified! Provisioning subscription and updating workspace limits...');

    await new Promise((r) => setTimeout(r, 600));

    processSubscriptionPayment({
      planId: selectedPlanId,
      billingCycle: selectedCycle,
      amount: totalAmount,
      paymentMethod: paymentMethod === 'upi' ? `UPI (${upiId})` : `Visa (•••• 4242)`,
      billingContact: {
        fullName,
        email,
        companyOrCollegeName: companyName,
        gstNumber,
        addressLine1: address,
        city,
        state,
        pincode,
        country: 'India',
      },
    });

    triggerConfetti();
    showToast('Payment Successful! 🎉', `Welcome to Socially ${plan.name}! Your workspace is now upgraded.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (paymentState !== 'processing') closeCheckoutModal();
        }}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-8"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
              S
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                Socially Secure Checkout
              </h2>
              <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>256-Bit SSL Encrypted • Powered by Razorpay / Stripe</span>
              </p>
            </div>
          </div>

          <button
            onClick={closeCheckoutModal}
            disabled={paymentState === 'processing'}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentState === 'success' ? (
          /* Payment Success View */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Payment Successful!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Your workspace has been upgraded to the <strong>{plan.name}</strong> plan. All new limits and AI capabilities are unlocked immediately.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto text-xs space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Plan:</span>
                <strong className="text-slate-900 dark:text-white">{plan.name} ({selectedCycle})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Charged:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">₹{totalAmount.toLocaleString('en-IN')} (incl. 18% GST)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Method:</span>
                <span className="text-slate-800 dark:text-slate-200">{paymentMethod === 'upi' ? `UPI (${upiId})` : 'Credit Card'}</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={closeCheckoutModal}
                className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all shadow-xl shadow-indigo-600/30 cursor-pointer"
              >
                Go to Workspace Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Main 2-Column Checkout Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 dark:divide-slate-800">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-7 p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Step 1: Plan & Billing Cycle */}
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  1. Select Plan & Billing Interval
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {(['creator', 'team', 'pro'] as SubscriptionPlanId[]).map((pId) => {
                    const p = SUBSCRIPTION_PLANS[pId];
                    const isSel = selectedPlanId === pId;
                    return (
                      <button
                        key={pId}
                        type="button"
                        onClick={() => setSelectedPlanId(pId)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSel
                            ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 ring-2 ring-purple-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 dark:text-white">{p.name}</span>
                          {p.isPopular && (
                            <span className="text-[9px] font-bold bg-purple-600 text-white px-1.5 py-0.2 rounded-full">
                              HOT
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                          ₹{selectedCycle === 'yearly' ? p.yearlyPrice : p.monthlyPrice}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Interval Toggle */}
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCycle('monthly')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCycle === 'monthly'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCycle('yearly')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      selectedCycle === 'yearly'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500 text-white font-black">
                      SAVE 17%
                    </span>
                  </button>
                </div>
              </div>

              {/* Step 2: Billing & GST Information */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  2. Organization & Billing Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Billing Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Billing Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      College / Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      GSTIN (Optional for 18% Input Credit)
                    </label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="e.g. 27AAACJ1234F1Z5"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  3. Select Payment Method
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs">UPI (Instant)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs">Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs">NetBanking</span>
                  </button>
                </div>

                {/* Subform for selected method */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Enter UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@oksbi"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-slate-400">
                      Supports Google Pay, PhonePe, Paytm, BHIM, CRED, and all UPI apps with recurring auto-mandates.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Select Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Bank of Baroda</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Error Message if Failed */}
              {paymentState === 'failed' && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start space-x-3 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Payment Attempt Failed</strong>
                    <p className="mt-0.5 leading-relaxed">{paymentErrorMessage}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary & Pay Action */}
            <div className="lg:col-span-5 p-6 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Order Summary
                </span>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>{plan.name} Plan</span>
                        {plan.isPopular && (
                          <span className="text-[9px] font-black bg-gradient-to-r from-purple-600 to-pink-600 text-white px-1.5 py-0.2 rounded-full">
                            POPULAR
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-slate-400 capitalize">
                        {selectedCycle} billing
                      </span>
                    </div>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      ₹{basePrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>{plan.limits.aiGenerations.toLocaleString()} AI generations / mo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{plan.limits.socialAccounts} connected social channels</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 text-purple-500" />
                      <span>{plan.limits.teamMembers} workspace team member seats</span>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Base Subscription Subtotal:</span>
                    <span>₹{basePrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>GST (18% for Indian Entities):</span>
                    <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline font-black text-slate-900 dark:text-white">
                    <span className="text-sm">Total Due Today:</span>
                    <span className="text-2xl text-indigo-600 dark:text-indigo-400">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pay Now Button & Process Handlers */}
              <div className="space-y-3">
                {paymentState === 'processing' ? (
                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-center space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
                    <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      {processingStep}
                    </p>
                    <p className="text-[10px] text-slate-400">Do not refresh or close this window.</p>
                  </div>
                ) : (
                  <>
                    <button
                      id="checkout-pay-now-btn"
                      onClick={() => handlePayNow(false)}
                      className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-black text-sm transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{totalAmount.toLocaleString('en-IN')} & Activate</span>
                    </button>

                    {/* Developer Sandbox Fail Test Button */}
                    <button
                      onClick={() => handlePayNow(true)}
                      className="w-full py-1.5 text-[11px] text-slate-400 hover:text-rose-500 text-center cursor-pointer"
                    >
                      (Test Bank Decline Simulation)
                    </button>
                  </>
                )}

                <p className="text-[10px] text-center text-slate-400 leading-relaxed">
                  By clicking Pay, you authorize Socially to activate your plan. Recurring auto-charges can be cancelled anytime with 1-click in Settings.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
