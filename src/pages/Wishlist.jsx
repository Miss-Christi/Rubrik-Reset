import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Heart, ArrowLeft, ShoppingBag } from "lucide-react";
import { getWishlist, toggleProductWishlist, toggleChallengeWishlist } from "../services/api";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import { ProductCard } from "../Components";
import { useCart } from "../CartContext";
import CartSidebar from "../components/CartSidebar";
import Checkout from "../Checkout";

const Wishlist = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [products, setProducts] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // For cart flow if user clicks on a product from wishlist
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [view, setView] = useState("wishlist");

    const fetchWishlist = async () => {
        try {
            const res = await getWishlist();
            setProducts(res.data.products);
            setChallenges(res.data.challenges);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            toast.error("Please login to see wishlist");
            navigate("/login");
            return;
        }
        fetchWishlist();
    }, [user, navigate]);

    const handleRemoveProduct = async (id) => {
        try {
            await toggleProductWishlist(id);
            setProducts(products.filter(p => p._id !== id));
            toast.success("Removed from wishlist");
        } catch(e) {}
    }

    const handleRemoveChallenge = async (id) => {
        try {
            await toggleChallengeWishlist(id);
            setChallenges(challenges.filter(c => c._id !== id));
            toast.success("Removed from wishlist");
        } catch(e) {}
    }

    if (view === "checkout") {
        return (
            <Checkout
                onBack={() => setView("wishlist")}
                onOrderSuccess={() => setView("wishlist")}
            />
        );
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rubrik-navy"></div></div>;
    }

    return (
        <div className="font-sans min-h-screen flex flex-col bg-stone-50 text-rubrik-navy">
            <Navbar isMenuOpen={false} setIsMenuOpen={() => {}} onOpenCart={() => setIsCartOpen(true)} />
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => setView("checkout")} />

            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-6xl">
                    <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold flex items-center gap-4">
                                <Heart className="text-rubrik-red fill-current w-12 h-12" /> My Wishlist
                            </h1>
                            <p className="text-gray-500 mt-2 text-lg">Your saved resources and challenges.</p>
                        </div>
                        <Link to="/" className="text-sm font-bold bg-white border border-gray-200 px-6 py-3 rounded-full hover:border-rubrik-navy transition-colors flex items-center gap-2">
                            <ArrowLeft size={16}/> Continue Browsing
                        </Link>
                    </header>

                    {products.length === 0 && challenges.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <Heart className="mx-auto text-gray-200 w-24 h-24 mb-6" />
                            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Explore our store and challenges, and click the heart icon to save items for later.</p>
                            <Link to="/" className="bg-rubrik-red text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-red-700 transition">Explore</Link>
                        </div>
                    )}

                    {products.length > 0 && (
                        <div className="mb-16">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">Saved Products</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {products.map(p => (
                                    <div key={p._id} className="relative group p-1 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        <div onClick={() => { /* Mocking add to cart or view */ addToCart(p); setIsCartOpen(true); }} className="cursor-pointer">
                                            <ProductCard item={p} showPrice={true} isWishlisted={true} onWishlistClick={handleRemoveProduct} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {challenges.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">Saved Challenges</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {challenges.map(c => (
                                    <div key={c._id} className="relative group" onClick={() => navigate(`/challenges/${c._id}`)}>
                                        <ProductCard item={c} showPrice={false} isWishlisted={true} onWishlistClick={handleRemoveChallenge} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Wishlist;
