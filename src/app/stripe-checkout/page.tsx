
'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CheckoutPage from '@/components/payment/stripe';
import convertToSubcurrency from '@/utils/convertToSubcurrency';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined');
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function StripeCheckoutContent() {
  const searchParams = useSearchParams();
  const amount = parseFloat(searchParams.get('amount') || '0');
  const id = parseInt(searchParams.get('id') || '0', 10);

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Louise Guay</h1>
        <h2 className="text-2xl">
          has requested
          <span className="font-bold"> ${amount} CAD</span>
        </h2>
      </div>
      <Elements
        stripe={stripePromise}
        options={{
          mode: 'payment',
          amount: convertToSubcurrency(amount),
          currency: 'cad',
        }}
      >
        <CheckoutPage amount={amount} id={id} />
      </Elements>
    </main>
  );
}

function StripeCheckoutFallback() {
  return <div>Loading...</div>;
}

export default function StripeCheckout() {
  return (
    <Suspense fallback={<StripeCheckoutFallback />}>
      <StripeCheckoutContent />
    </Suspense>
  );
}
