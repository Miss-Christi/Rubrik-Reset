import React, { useState } from 'react';
import { useCart } from './CartContext';
import { ArrowLeft, CheckCircle, QrCode } from 'lucide-react';

export default function Checkout({ onBack, onOrderSuccess }) {
  const { cart, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [paymentFile, setPaymentFile] = useState(null);

  // UPI Configuration (Replace with real ID)
  const upiID = "rubrikreset@upi"; 
  const upiLink = `upi://pay?pa=${upiID}&pn=RubrikReset&am=${totalPrice}&cu=INR`;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    setPaymentFile(e.target.files[0]);
  };

  const handleSubmitDetails = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = () => {
    console.log("Order Placed:", { ...formData, cart, total: totalPrice, proof: paymentFile });
    clearCart();
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- SUCCESS SCREEN ---
  if (step === 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4 text-center animate-fade-in-up">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-rubrik-navy mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you, {formData.name}. We have received your order and payment proof. You will receive a confirmation email shortly.
          </p>
          <button 
            onClick={onOrderSuccess}
            className="bg-rubrik-red text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-rubrik-navy transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-rubrik-navy mb-8 font-bold transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Store
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT COLUMN: ORDER SUMMARY */}
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl font-serif font-bold text-rubrik-navy mb-6">Order Summary</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-rubrik-navy text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-rubrik-navy">₹{item.price * item.quantity}</p>
                </div>
              ))}
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-500">Total</span>
                <span className="text-3xl font-serif font-bold text-rubrik-red">₹{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FORMS */}
          <div className="order-1 lg:order-2">
            
            {/* STEP 1: DETAILS FORM */}
            {step === 1 && (
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-fade-in-up">
                <h2 className="text-2xl font-serif font-bold text-rubrik-navy mb-6">Shipping Details</h2>
                <form onSubmit={handleSubmitDetails} className="flex flex-col gap-4">
                  <input required name="name" onChange={handleInputChange} placeholder="Full Name" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-rubrik-navy focus:bg-white transition-all" />
                  <input required name="email" type="email" onChange={handleInputChange} placeholder="Email Address" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-rubrik-navy focus:bg-white transition-all" />
                  <input required name="phone" type="tel" onChange={handleInputChange} placeholder="Phone Number" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-rubrik-navy focus:bg-white transition-all" />
                  <textarea required name="address" rows="3" onChange={handleInputChange} placeholder="Shipping Address" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-rubrik-navy focus:bg-white transition-all" />
                  <button type="submit" className="mt-4 bg-rubrik-navy text-white py-4 rounded-xl font-bold hover:bg-rubrik-red transition-colors shadow-lg">
                    Proceed to Payment
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {step === 2 && (
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center animate-fade-in-up">
                <h2 className="text-2xl font-serif font-bold text-rubrik-navy mb-2">Scan to Pay</h2>
                <p className="text-gray-500 mb-8 text-sm">Scan the QR code below using any UPI App</p>

                {/* QR Code Container */}
                <div className="bg-white p-6 rounded-xl border-2 border-dashed border-rubrik-red inline-block mb-8 relative">
                    <div className="w-48 h-48 bg-gray-50 flex flex-col items-center justify-center rounded-lg">
                        <QrCode className="w-16 h-16 text-rubrik-navy mb-3"/>
                        <span className="text-xs font-bold text-gray-400">RUBRIKRESET@UPI</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                  <a href={upiLink} className="bg-rubrik-navy/5 text-rubrik-navy font-bold py-3 rounded-xl border border-rubrik-navy/20 hover:bg-rubrik-navy hover:text-white transition-all">
                    Pay via UPI App
                  </a>

                  <div className="text-left bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Upload Payment Screenshot</label>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-rubrik-red file:text-white hover:file:bg-rubrik-navy cursor-pointer"/>
                  </div>

                  <button 
                    onClick={handleFinalSubmit} 
                    disabled={!paymentFile}
                    className="mt-2 bg-rubrik-red text-white py-4 rounded-xl font-bold hover:bg-black transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}