'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check,
  ChevronRight,
  CircleAlert,
  CreditCard,
  Gift,
  Loader2,
  LockKeyhole,
  MapPin,
  PackageCheck,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Tag,
  Truck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';

type User = { id: string; name: string; email: string };
type Address = {
  fullName?: string;
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  label?: string;
  isDefault?: boolean;
};
type Payment = {
  brand?: string;
  cardNumberLast4?: string;
  expiry?: string;
  label?: string;
  isDefault?: boolean;
};
type Coupon = {
  code: string;
  description?: string;
  discount?: number;
  type?: string;
};
type StepId = 'delivery' | 'payment' | 'extras' | 'review';

const STEPS: { id: StepId; label: string; helper: string }[] = [
  { id: 'delivery', label: 'Delivery', helper: 'Where should we send it?' },
  { id: 'payment', label: 'Payment', helper: 'How would you like to pay?' },
  { id: 'extras', label: 'Extras', helper: 'Savings and gifts' },
  { id: 'review', label: 'Review', helper: 'Confirm everything' },
];

const EMPTY_ADDRESS: Address = {
  country: 'United States',
};

function displayDate(offset: number) {
  return new Date(Date.now() + offset * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function CheckoutExperience({
  user,
  savedAddresses,
  savedPayments,
}: {
  user: User;
  savedAddresses: Address[];
  savedPayments: Payment[];
}) {
  const router = useRouter();
  const { items, subtotal, refresh } = useCart();
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<StepId>('delivery');
  const [addressMode, setAddressMode] = useState<'saved' | 'new'>(
    savedAddresses.length ? 'saved' : 'new'
  );
  const defaultAddress = savedAddresses.find((address) => address.isDefault) || savedAddresses[0];
  const [address, setAddress] = useState<Address>({
    ...EMPTY_ADDRESS,
    fullName: user.name,
    ...defaultAddress,
  });
  const defaultPayment = savedPayments.find((payment) => payment.isDefault) || savedPayments[0];
  const [paymentMode, setPaymentMode] = useState<'saved' | 'new'>(
    savedPayments.length ? 'saved' : 'new'
  );
  const [selectedPayment, setSelectedPayment] = useState(defaultPayment ? savedPayments.indexOf(defaultPayment) : 0);
  const [cardNumber, setCardNumber] = useState(
    defaultPayment?.cardNumberLast4 ? `**** **** **** ${defaultPayment.cardNumberLast4}` : ''
  );
  const [expiry, setExpiry] = useState(defaultPayment?.expiry || '');
  const [brand, setBrand] = useState(defaultPayment?.brand || 'Visa');
  const [cardholder, setCardholder] = useState(defaultPayment?.label || user.name);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    refresh().finally(() => {
      if (active) setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, [refresh]);

  const couponDiscount = Math.min(Number(appliedCoupon?.discount || 0), subtotal);
  const shipping = subtotal >= 35 || appliedCoupon?.type === 'freeship' ? 0 : 5.99;
  const giftWrapFee = giftWrap ? 3.99 : 0;
  const tax = +((subtotal - couponDiscount) * 0.08).toFixed(2);
  const total = +(subtotal - couponDiscount + shipping + giftWrapFee + tax).toFixed(2);
  const stepIndex = STEPS.findIndex((item) => item.id === step);

  function updateAddress(field: keyof Address, value: string) {
    setAddress((current) => ({ ...current, [field]: value }));
    setError('');
  }

  function chooseSavedAddress(index: number) {
    setAddressMode('saved');
    setAddress({ ...EMPTY_ADDRESS, ...savedAddresses[index] });
    setError('');
  }

  function chooseSavedPayment(index: number) {
    const payment = savedPayments[index];
    setPaymentMode('saved');
    setSelectedPayment(index);
    setCardNumber(payment.cardNumberLast4 ? `**** **** **** ${payment.cardNumberLast4}` : '');
    setExpiry(payment.expiry || '');
    setBrand(payment.brand || 'Visa');
    setCardholder(payment.label || user.name);
    setError('');
  }

  function validateAddress() {
    const missing = ['fullName', 'street', 'city', 'state', 'zip'].filter(
      (field) => !String(address[field as keyof Address] || '').trim()
    );
    if (missing.length) {
      setError('Add the missing delivery details before continuing.');
      return false;
    }
    return true;
  }

  function validatePayment() {
    const digits = cardNumber.replace(/\D/g, '');
    if (!cardholder.trim() || !expiry.trim() || (paymentMode === 'new' && (digits.length < 12 || digits.length > 19))) {
      setError('Check the cardholder name, card number, and expiration date.');
      return false;
    }
    return true;
  }

  function continueTo(next: StepId) {
    setError('');
    if (step === 'delivery' && !validateAddress()) return;
    if (step === 'payment' && !validatePayment()) return;
    setStep(next);
  }

  async function applyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError('Enter a coupon code first.');
      return;
    }
    setCouponLoading(true);
    setCouponError('');
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.valid) throw new Error(data.error || 'That coupon is not available.');
      setAppliedCoupon(data);
      setCouponCode(data.code || code);
      toast.success(`Coupon applied — you saved ${formatPrice(data.discount || 0)}`);
    } catch (couponFailure: any) {
      setAppliedCoupon(null);
      setCouponError(couponFailure.message || 'We could not validate that coupon.');
    } finally {
      setCouponLoading(false);
    }
  }

  async function placeOrder() {
    setError('');
    if (!validateAddress()) {
      setStep('delivery');
      return;
    }
    if (!validatePayment()) {
      setStep('payment');
      return;
    }
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        addresses: [address],
        paymentMethod: brand,
        cardNumber,
        giftWrap,
        giftMessage,
      };
      if (appliedCoupon?.code) payload.couponCode = appliedCoupon.code;
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'We could not place your order.');
      setPlaced(data.order);
      window.dispatchEvent(new Event('cart:update'));
    } catch (orderFailure: any) {
      setError(orderFailure.message || 'We could not place your order. Your cart is still safe.');
      toast.error(orderFailure.message || 'Checkout needs your attention.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <main className="confidence-shell py-8">
        <div className="skeleton h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-4">
            <div className="skeleton h-20" />
            <div className="skeleton h-96" />
          </div>
          <div className="skeleton h-80" />
        </div>
      </main>
    );
  }

  if (placed) {
    return (
      <main className="confidence-shell py-10">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="panel p-7 sm:p-10 text-center animate-fadeIn">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amazon-green/15 text-amazon-greenDark">
              <Check className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="section-kicker text-amazon-greenDark">Order confirmed</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold">You’re all set, {user.name.split(' ')[0]}.</h1>
            <p className="mt-3 text-amazon-textMuted">
              We sent a receipt to <b className="text-amazon-text">{user.email}</b>. Nothing else is needed from you.
            </p>
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="rounded-xl bg-amazon-bg p-4">
                <p className="section-kicker">Order number</p>
                <p className="mt-1 font-bold">{placed.orderNumber}</p>
              </div>
              <div className="rounded-xl bg-amazon-bg p-4">
                <p className="section-kicker">Total</p>
                <p className="mt-1 font-bold">{formatPrice(placed.total)}</p>
              </div>
              <div className="rounded-xl bg-amazon-bg p-4">
                <p className="section-kicker">Delivery promise</p>
                <p className="mt-1 font-bold">
                  {placed.deliveryEta ? new Date(placed.deliveryEta).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : displayDate(4)}
                </p>
              </div>
            </div>
            <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
              <Link href={`/account/orders/${placed._id}`} className="amazon-btn-primary inline-flex justify-center items-center gap-2">
                <PackageCheck className="h-4 w-4" /> Track your order
              </Link>
              <Link href="/" className="amazon-btn-yellow inline-flex justify-center">Continue shopping</Link>
            </div>
          </div>
          <div className="panel p-5 flex gap-3 items-start">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amazon-greenDark" />
            <div>
              <p className="font-semibold">Your order is protected</p>
              <p className="mt-1 text-sm text-amazon-textMuted">
                Need help? Visit your order page for delivery updates, returns, and support options.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="confidence-shell py-12">
        <div className="panel mx-auto max-w-xl p-10 text-center">
          <PackageCheck className="mx-auto h-10 w-10 text-amazon-greenDark" />
          <h1 className="mt-4 text-2xl font-bold">Your checkout is waiting</h1>
          <p className="mt-2 text-amazon-textMuted">Your cart is empty. Add something you love and we’ll keep the checkout simple.</p>
          <Link href="/" className="amazon-btn-primary mt-6 inline-flex">Explore products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="confidence-shell py-5 sm:py-8">
      <div className="mb-7 flex items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-amazon-navy">
          halo<span className="text-amazon-orange">zon</span>
        </Link>
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-amazon-greenDark shadow-card">
          <LockKeyhole className="h-4 w-4" aria-hidden="true" /> Secure checkout
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-amazon-green/25 bg-amazon-green/10 px-4 py-3 text-sm text-amazon-greenDark">
        <div className="flex items-start gap-3">
          <Truck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <b>Delivery promise: {displayDate(2)}–{displayDate(5)}</b>
            <p className="mt-0.5 text-amazon-textMuted">We’ll show tracking here as soon as your order ships.</p>
          </div>
        </div>
      </div>

      <nav aria-label="Checkout progress" className="mb-6 overflow-x-auto">
        <ol className="grid min-w-[620px] grid-cols-4 gap-2">
          {STEPS.map((item, index) => {
            const complete = index < stepIndex;
            const active = item.id === step;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={index > stepIndex}
                  onClick={() => (index <= stepIndex ? setStep(item.id) : undefined)}
                  aria-current={active ? 'step' : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                    active ? 'border-amazon-orange bg-white shadow-card' : 'border-transparent bg-white/50'
                  } disabled:cursor-default disabled:opacity-60`}
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    complete ? 'bg-amazon-greenDark text-white' : active ? 'bg-amazon-orange text-amazon-navy' : 'bg-amazon-bg text-amazon-textMuted'
                  }`}>
                    {complete ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{item.label}</span>
                    <span className="hidden text-xs text-amazon-textMuted sm:block">{item.helper}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {error && (
        <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-amazon-deal/30 bg-amazon-deal/10 p-4 text-sm">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amazon-deal" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
            <p className="mt-1 text-amazon-textMuted">Your cart is unchanged. Fix the highlighted details or retry when you’re ready.</p>
          </div>
          <button type="button" onClick={() => setError('')} className="text-amazon-link" aria-label="Dismiss checkout error">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {step === 'delivery' && (
            <section className="panel p-5 sm:p-7 animate-fadeIn" aria-labelledby="delivery-heading">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-kicker">Step 1 of 4</p>
                  <h1 id="delivery-heading" className="mt-1 text-2xl font-bold">Choose your delivery address</h1>
                  <p className="mt-1 text-sm text-amazon-textMuted">We’ll use this address for every item in your cart.</p>
                </div>
                <MapPin className="h-6 w-6 text-amazon-orange" aria-hidden="true" />
              </div>

              {savedAddresses.length > 0 && (
                <fieldset className="mt-6">
                  <legend className="mb-3 text-sm font-bold">Saved addresses</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {savedAddresses.map((saved, index) => (
                      <label key={`${saved.street}-${index}`} className={`cursor-pointer rounded-xl border p-4 transition ${
                        addressMode === 'saved' && address.street === saved.street ? 'border-amazon-orange bg-amazon-orange/10' : 'border-amazon-border hover:border-amazon-orange'
                      }`}>
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="saved-address"
                            checked={addressMode === 'saved' && address.street === saved.street}
                            onChange={() => chooseSavedAddress(index)}
                            className="mt-1 accent-amazon-orange"
                          />
                          <span className="text-sm">
                            <span className="block font-bold">{saved.label || (saved.isDefault ? 'Default address' : 'Saved address')}</span>
                            <span className="mt-1 block">{saved.fullName || user.name}</span>
                            <span className="block text-amazon-textMuted">{saved.street}{saved.apt ? `, ${saved.apt}` : ''}</span>
                            <span className="block text-amazon-textMuted">{saved.city}, {saved.state} {saved.zip}</span>
                          </span>
                        </div>
                      </label>
                    ))}
                    <label className={`cursor-pointer rounded-xl border p-4 transition ${
                      addressMode === 'new' ? 'border-amazon-orange bg-amazon-orange/10' : 'border-amazon-border hover:border-amazon-orange'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="saved-address" checked={addressMode === 'new'} onChange={() => { setAddressMode('new'); setAddress((current) => ({ ...current, street: '', apt: '', city: '', state: '', zip: '' })); }} className="accent-amazon-orange" />
                        <span className="text-sm font-bold">Add a new address</span>
                      </div>
                    </label>
                  </div>
                </fieldset>
              )}

              {(!savedAddresses.length || addressMode === 'new') && (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field id="fullName" label="Full name" value={address.fullName} onChange={(value) => updateAddress('fullName', value)} required />
                  <Field id="phone" label="Phone number" value={address.phone} onChange={(value) => updateAddress('phone', value)} />
                  <Field id="street" label="Street address" value={address.street} onChange={(value) => updateAddress('street', value)} required />
                  <Field id="apt" label="Apt, suite, or unit" value={address.apt} onChange={(value) => updateAddress('apt', value)} />
                  <Field id="city" label="City" value={address.city} onChange={(value) => updateAddress('city', value)} required />
                  <Field id="state" label="State" value={address.state} onChange={(value) => updateAddress('state', value)} required />
                  <Field id="zip" label="ZIP code" value={address.zip} onChange={(value) => updateAddress('zip', value)} required />
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold">Country</span>
                    <select id="country" value={address.country || 'United States'} onChange={(event) => updateAddress('country', event.target.value)} className="amazon-input">
                      {['United States', 'Canada', 'United Kingdom', 'India', 'Japan', 'Germany'].map((country) => <option key={country}>{country}</option>)}
                    </select>
                  </label>
                </div>
              )}

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-amazon-bg p-4 text-sm">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amazon-greenDark" />
                <span><b>Protected delivery.</b> We’ll keep your order details private and show the same promise on your confirmation.</span>
              </div>
              <div className="mt-6 flex justify-end">
                <button type="button" onClick={() => continueTo('payment')} className="amazon-btn-primary inline-flex items-center gap-2">Continue to payment <ChevronRight className="h-4 w-4" /></button>
              </div>
            </section>
          )}

          {step === 'payment' && (
            <section className="panel p-5 sm:p-7 animate-fadeIn" aria-labelledby="payment-heading">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-kicker">Step 2 of 4</p>
                  <h1 id="payment-heading" className="mt-1 text-2xl font-bold">Choose a payment method</h1>
                  <p className="mt-1 text-sm text-amazon-textMuted">Your card is only charged when the order is placed.</p>
                </div>
                <CreditCard className="h-6 w-6 text-amazon-orange" aria-hidden="true" />
              </div>

              {savedPayments.length > 0 && (
                <fieldset className="mt-6 space-y-3">
                  <legend className="mb-3 text-sm font-bold">Saved payment methods</legend>
                  {savedPayments.map((payment, index) => (
                    <label key={`${payment.cardNumberLast4}-${index}`} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      paymentMode === 'saved' && selectedPayment === index ? 'border-amazon-orange bg-amazon-orange/10' : 'border-amazon-border hover:border-amazon-orange'
                    }`}>
                      <input type="radio" name="saved-payment" checked={paymentMode === 'saved' && selectedPayment === index} onChange={() => chooseSavedPayment(index)} className="accent-amazon-orange" />
                      <CreditCard className="h-5 w-5 text-amazon-textMuted" />
                      <span className="flex-1 text-sm">
                        <span className="block font-bold">{payment.label || payment.brand || 'Saved card'}</span>
                        <span className="text-amazon-textMuted">{payment.brand || 'Card'} ending in {payment.cardNumberLast4} · exp {payment.expiry}</span>
                      </span>
                    </label>
                  ))}
                  <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    paymentMode === 'new' ? 'border-amazon-orange bg-amazon-orange/10' : 'border-amazon-border hover:border-amazon-orange'
                  }`}>
                    <input type="radio" name="saved-payment" checked={paymentMode === 'new'} onChange={() => { setPaymentMode('new'); setCardNumber(''); }} className="accent-amazon-orange" />
                    <CreditCard className="h-5 w-5 text-amazon-textMuted" />
                    <span className="text-sm font-bold">Use a new card</span>
                  </label>
                </fieldset>
              )}

              {(!savedPayments.length || paymentMode === 'new') && (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field id="cardholder" label="Name on card" value={cardholder} onChange={setCardholder} required />
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold">Card type</span>
                    <select value={brand} onChange={(event) => setBrand(event.target.value)} className="amazon-input">
                      {['Visa', 'Mastercard', 'American Express', 'Discover'].map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <Field id="cardNumber" label="Card number" value={cardNumber} onChange={(value) => { setPaymentMode('new'); setCardNumber(value.replace(/\D/g, '').slice(0, 19)); }} placeholder="1234 5678 9012 3456" required />
                  <Field id="expiry" label="Expiration (MM/YY)" value={expiry} onChange={setExpiry} placeholder="12/29" required />
                </div>
              )}

              <div className="mt-6 flex items-center gap-3 rounded-xl bg-amazon-bg p-4 text-sm">
                <LockKeyhole className="h-5 w-5 shrink-0 text-amazon-greenDark" />
                <span><b>Secure payment.</b> Your card details are encrypted and never shared with sellers.</span>
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <button type="button" onClick={() => setStep('delivery')} className="amazon-btn-dark bg-transparent !text-amazon-link hover:!bg-amazon-bg">Back</button>
                <button type="button" onClick={() => continueTo('extras')} className="amazon-btn-primary inline-flex items-center gap-2">Continue to extras <ChevronRight className="h-4 w-4" /></button>
              </div>
            </section>
          )}

          {step === 'extras' && (
            <section className="panel p-5 sm:p-7 animate-fadeIn" aria-labelledby="extras-heading">
              <p className="section-kicker">Step 3 of 4</p>
              <h1 id="extras-heading" className="mt-1 text-2xl font-bold">Make it yours</h1>
              <p className="mt-1 text-sm text-amazon-textMuted">Add savings or a thoughtful gift message before you review.</p>

              <div className="mt-6 rounded-xl border border-amazon-border p-4">
                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-amazon-orange" />
                  <div>
                    <h2 className="font-bold">Coupon code</h2>
                    <p className="text-xs text-amazon-textMuted">Savings are applied before tax.</p>
                  </div>
                </div>
                {appliedCoupon ? (
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-amazon-green/10 p-3 text-sm">
                    <span><b className="text-amazon-greenDark">{appliedCoupon.code}</b> saves {formatPrice(appliedCoupon.discount || 0)}</span>
                    <button type="button" onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="amazon-link text-xs">Remove</button>
                  </div>
                ) : (
                  <div className="mt-4 flex gap-2">
                    <input aria-label="Coupon code" value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} className="amazon-input" placeholder="Try WELCOME10" />
                    <button type="button" onClick={applyCoupon} disabled={couponLoading} className="amazon-btn-dark shrink-0 inline-flex items-center gap-2">
                      {couponLoading && <Loader2 className="h-4 w-4 animate-spin" />} Apply
                    </button>
                  </div>
                )}
                {couponError && <p role="alert" className="mt-2 text-xs text-amazon-deal">{couponError}</p>}
                <p className="mt-2 text-xs text-amazon-textMuted">Popular codes: WELCOME10, SAVE20, FREESHIP</p>
              </div>

              <div className="mt-4 rounded-xl border border-amazon-border p-4">
                <div className="flex items-start gap-3">
                  <input id="giftWrap" type="checkbox" checked={giftWrap} onChange={(event) => setGiftWrap(event.target.checked)} className="mt-1 h-4 w-4 accent-amazon-orange" />
                  <div>
                    <label htmlFor="giftWrap" className="font-bold">Add gift wrap · {formatPrice(3.99)}</label>
                    <p className="text-xs text-amazon-textMuted">A small detail that makes opening it feel special.</p>
                  </div>
                  <Gift className="ml-auto h-5 w-5 text-amazon-orange" />
                </div>
                {giftWrap && (
                  <textarea aria-label="Gift message" maxLength={200} value={giftMessage} onChange={(event) => setGiftMessage(event.target.value)} className="amazon-input mt-4 min-h-24" placeholder="Add a gift message (optional)" />
                )}
              </div>

              <div className="mt-6 flex justify-between gap-3">
                <button type="button" onClick={() => setStep('payment')} className="amazon-btn-dark bg-transparent !text-amazon-link hover:!bg-amazon-bg">Back</button>
                <button type="button" onClick={() => setStep('review')} className="amazon-btn-primary inline-flex items-center gap-2">Review order <ChevronRight className="h-4 w-4" /></button>
              </div>
            </section>
          )}

          {step === 'review' && (
            <section className="panel p-5 sm:p-7 animate-fadeIn" aria-labelledby="review-heading">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-kicker">Step 4 of 4</p>
                  <h1 id="review-heading" className="mt-1 text-2xl font-bold">Review your order</h1>
                  <p className="mt-1 text-sm text-amazon-textMuted">Everything looks good? Place your order when you’re ready.</p>
                </div>
                <PackageCheck className="h-6 w-6 text-amazon-greenDark" />
              </div>

              <ReviewRow title="Delivering to" onEdit={() => setStep('delivery')}>
                <b>{address.fullName || user.name}</b>
                <span>{address.street}{address.apt ? `, ${address.apt}` : ''}</span>
                <span>{address.city}, {address.state} {address.zip}</span>
              </ReviewRow>
              <ReviewRow title="Payment" onEdit={() => setStep('payment')}>
                <span>{brand} ending in {cardNumber.slice(-4)}</span>
                <span className="text-amazon-textMuted">Cardholder: {cardholder}</span>
              </ReviewRow>
              <ReviewRow title="Order items">
                <div className="divide-y divide-amazon-border">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="h-12 w-12 shrink-0 rounded-lg bg-amazon-bg p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt="" className="h-full w-full object-contain" />
                      </div>
                      <span className="flex-1 text-sm line-clamp-2">{item.title} <span className="text-amazon-textMuted">×{item.qty}</span></span>
                      <b className="text-sm">{formatPrice(item.price * item.qty)}</b>
                    </div>
                  ))}
                </div>
              </ReviewRow>
              {(appliedCoupon || giftWrap) && (
                <ReviewRow title="Added extras" onEdit={() => setStep('extras')}>
                  {appliedCoupon && <span className="text-amazon-greenDark">Coupon {appliedCoupon.code} · saved {formatPrice(couponDiscount)}</span>}
                  {giftWrap && <span>Gift wrap{giftMessage ? ` · “${giftMessage}”` : ''}</span>}
                </ReviewRow>
              )}
              <div className="mt-6 flex justify-between gap-3">
                <button type="button" onClick={() => setStep('extras')} className="amazon-btn-dark bg-transparent !text-amazon-link hover:!bg-amazon-bg">Back</button>
                <button type="button" onClick={placeOrder} disabled={submitting} className="amazon-btn-orange inline-flex items-center gap-2">
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Placing order…</> : <>Place order · {formatPrice(total)}</>}
                </button>
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Order summary</h2>
              <span className="text-xs text-amazon-textMuted">{items.length} item{items.length === 1 ? '' : 's'}</span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <SummaryLine label="Items" value={formatPrice(subtotal)} />
              {couponDiscount > 0 && <SummaryLine label={`Coupon (${appliedCoupon?.code})`} value={`−${formatPrice(couponDiscount)}`} positive />}
              <SummaryLine label="Shipping" value={shipping === 0 ? 'FREE' : formatPrice(shipping)} />
              {giftWrap && <SummaryLine label="Gift wrap" value={formatPrice(giftWrapFee)} />}
              <SummaryLine label="Estimated tax" value={formatPrice(tax)} />
              <div className="my-3 border-t border-amazon-border" />
              <div className="flex items-baseline justify-between text-lg font-bold">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
            <p className="mt-4 rounded-lg bg-amazon-green/10 p-3 text-xs text-amazon-greenDark">
              <b>No surprises.</b> You’ll pay exactly this total at checkout.
            </p>
          </div>
          <div className="panel p-5">
            <p className="section-kicker">Your confidence checklist</p>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-amazon-greenDark" /> Delivery promise shown upfront</li>
              <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-amazon-greenDark" /> Secure payment and privacy</li>
              <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-amazon-greenDark" /> Easy order tracking and returns</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  id: string;
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-sm font-semibold">{label}{required && <span aria-hidden="true"> *</span>}</span>
      <input id={id} required={required} value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="amazon-input" />
    </label>
  );
}

function ReviewRow({ title, children, onEdit }: { title: string; children: React.ReactNode; onEdit?: () => void }) {
  return (
    <div className="mt-5 border-t border-amazon-border pt-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold">{title}</h2>
        {onEdit && <button type="button" onClick={onEdit} className="amazon-link inline-flex items-center gap-1 text-xs"><Pencil className="h-3 w-3" /> Edit</button>}
      </div>
      <div className="flex flex-col gap-1 text-sm">{children}</div>
    </div>
  );
}

function SummaryLine({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 ${positive ? 'text-amazon-greenDark' : ''}`}>
      <span>{label}</span><span className="text-right">{value}</span>
    </div>
  );
}
