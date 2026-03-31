import React, { useState } from 'react';
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';
import { useCartStore } from '../store/useCartStore';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { total, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // Mock IDs for demo
  const APPLICATION_ID = import.meta.env.VITE_SQUARE_APPLICATION_ID || "sandbox-sq0idb-demo";
  const LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID || "L-DEMO";

  const handlePayment = async (token) => {
    setIsProcessing(true);
    try {
      // Simulate backend delay for demo
      await new Promise(r => setTimeout(r, 1500));
      
      // We spoof the response for demo since /api/pay backend doesn't exist yet
      const mockSuccess = true;
      if (mockSuccess) {
        setIsSuccess(true);
        clearCart();
        setTimeout(() => navigate('/'), 5000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto text-brand-green shadow-glow-green">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-brand-dark">PAYMENT SUCCESSFUL!</h1>
          <p className="text-gray-600 text-lg">Your instrumentals are being prepared for download.</p>
          <p className="text-brand-blue text-sm">Check your email for the download links and receipt.</p>
        </div>
        <p className="text-gray-400 text-xs pt-8">Redirecting you to home in a few seconds...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-brand-dark">CHECKOUT</h1>
            <p className="text-gray-500">Complete your purchase securely.</p>
          </div>

          <div className="p-8 bg-gray-50 border border-gray-100 rounded-beat space-y-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Total</span>
              <span className="text-2xl font-black text-brand-blue">${total().toFixed(2)}</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-brand-green/10 rounded-lg flex items-center justify-center text-brand-green">
                  <ShieldCheck size={18} />
                </div>
                Secure SSL Encryption
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center text-brand-blue">
                  <Lock size={18} />
                </div>
                PCI Compliant Payments
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-beat shadow-glow-blue border border-brand-blue/10">
          <h2 className="text-brand-dark text-xl font-black mb-8 flex items-center gap-2">
            CARD DETAILS
          </h2>
          
          {isProcessing ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-brand-dark font-bold">Processing Payment...</p>
            </div>
          ) : (
            <PaymentForm
              applicationId={APPLICATION_ID}
              locationId={LOCATION_ID}
              cardTokenizeResponseReceived={handlePayment}
            >
              <CreditCard 
                buttonProps={{
                  css: {
                      backgroundColor: "#3B82F6", // Your Brand Blue
                      color: "#fff",
                      borderRadius: "50px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      padding: "16px",
                      transition: "all 0.3s",
                      '&:hover': { backgroundColor: "#60A5FA" }
                  }
                }}
              />
            </PaymentForm>
          )}

          <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4 opacity-30 grayscale" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 opacity-30 grayscale" alt="Mastercard" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" className="h-4 opacity-30 grayscale" alt="Paypal" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
