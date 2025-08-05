import PayPalCheckout from '../../components/PayPalCheckout';

export default function PaymentPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Pay for Your Gig</h1>
      <PayPalCheckout />
    </div>
  );
}