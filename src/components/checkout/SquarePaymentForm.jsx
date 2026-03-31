import React from 'react';
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';

const SquarePaymentForm = ({ totalAmount = 2999 }) => {
  // Replace with actual Square IDs
  const APPLICATION_ID = "sandbox-sq0idb-your-app-id";
  const LOCATION_ID = "sandbox-your-location-id";

  const handlePayment = async (token) => {
    console.log("Token generated:", token.token);
    alert(`Sandbox Token generated: ${token.token}\n\nIn production, this would securely send to your Node/Express backend to create the payment.`);
  };

  return (
    <div className="bg-white border border-brand-blue/20 p-8 rounded-beat shadow-glow-blue max-w-md mx-auto">
      <h2 className="text-brand-dark text-2xl font-bold mb-6 text-center">Secure Checkout</h2>
      
      <div className="mb-6 flex justify-between items-center text-gray-600">
        <span>Total Amount:</span>
        <span className="text-xl font-bold text-brand-green">${(totalAmount / 100).toFixed(2)}</span>
      </div>

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
      <p className="text-gray-500 text-xs mt-6 text-center leading-relaxed">
        Secured by Square. Your files will be delivered instantly after payment.
      </p>
    </div>
  );
};

export default SquarePaymentForm;
