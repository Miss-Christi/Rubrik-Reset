import { X, ShoppingBag, Minus, Plus } from "lucide-react";
import { useCart } from "../CartContext";

const CartSidebar = ({ isOpen, onClose, onCheckout }) => {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-rubrik-navy text-white">
                    <h2 className="text-xl font-bold">Your Bag ({cart.length})</h2>
                    <button onClick={onClose}>
                        <X className="w-6 h-6 hover:rotate-90 transition-transform" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 mt-20">
                            <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-4 items-start">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-20 h-20 rounded-lg object-cover border border-gray-100"
                                />
                                <div className="flex-grow">
                                    <h3 className="font-bold text-rubrik-navy text-sm leading-tight mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-3">{item.category}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-xs font-bold w-4 text-center">
                                                {item.quantity}
                                            </span>
                                            <button onClick={() => updateQuantity(item.id, 1)}>
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-rubrik-red text-sm">
                                                ₹{item.price * item.quantity}
                                            </p>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-[10px] text-gray-400 underline hover:text-red-500 mt-1"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500 font-medium">Subtotal</span>
                            <span className="text-2xl font-bold text-rubrik-navy">
                                ₹{totalPrice}
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                onClose();
                                onCheckout();
                            }}
                            className="w-full bg-rubrik-red text-white py-4 rounded-xl font-bold shadow-lg hover:bg-rubrik-navy transition-colors"
                        >
                            Checkout Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSidebar;
