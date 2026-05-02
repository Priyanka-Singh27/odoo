import { useState } from "react";
import { CreditCard } from "lucide-react";

interface PaymentFormProps {
  onNext: () => void;
  price: number;
}

export default function PaymentForm({ onNext, price }: PaymentFormProps) {
  const [method, setMethod] = useState("card");

  return (
    <div className="flex gap-8 max-w-4xl w-full">
      {/* Left: Payment Method */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Choose a payment method</h2>
        
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setMethod("card")}
            className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${method === "card" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <CreditCard className="w-4 h-4" /> Credit Card
          </button>
          <button 
            onClick={() => setMethod("upi")}
            className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${method === "upi" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            UPI Pay
          </button>
          <button 
            onClick={() => setMethod("paypal")}
            className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${method === "paypal" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            Paypal
          </button>
        </div>

        {method === "card" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 uppercase font-medium tracking-wide">Cardholder Name</label>
              <input type="text" className="w-full rounded-xl border border-slate-200 bg-white h-10 px-4 text-sm focus:outline-none focus:border-blue-500" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 uppercase font-medium tracking-wide">Card Number</label>
              <input type="text" className="w-full rounded-xl border border-slate-200 bg-white h-10 px-4 text-sm focus:outline-none focus:border-blue-500" placeholder="0000 0000 0000 0000" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1.5 uppercase font-medium tracking-wide">Expiry Date</label>
                <input type="text" className="w-full rounded-xl border border-slate-200 bg-white h-10 px-4 text-sm focus:outline-none focus:border-blue-500" placeholder="MM/YY" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1.5 uppercase font-medium tracking-wide">CVV</label>
                <input type="text" className="w-full rounded-xl border border-slate-200 bg-white h-10 px-4 text-sm focus:outline-none focus:border-blue-500" placeholder="123" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Order Summary */}
      <div className="w-[340px] shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h3 className="text-base font-semibold text-slate-800 mb-6">Order Summary</h3>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500">Service</span>
            <span className="text-sm font-medium text-slate-800">${(price * 0.9).toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500">Taxes</span>
            <span className="text-sm font-medium text-slate-800">${(price * 0.1).toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-base font-semibold text-slate-800">Total</span>
            <span className="text-base font-bold text-blue-600">${price.toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={onNext}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-colors mt-6"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
