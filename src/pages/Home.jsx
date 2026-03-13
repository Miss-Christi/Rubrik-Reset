import { useState } from "react";
import { useCart } from "../CartContext";
import Checkout from "../Checkout";
import Navbar from "../components/Navbar";
import CartSidebar from "../components/CartSidebar";
import { ProductCard, BlogCard, SectionHeader } from "../Components";
import { NEW_ARRIVALS, BLOG_POSTS, FORMATION_CHALLENGES } from "../data";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext, useEffect } from "react";
import { getChallenges, getWishlist, toggleProductWishlist, toggleChallengeWishlist } from "../services/api";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X, ShoppingBag } from "lucide-react";

const Home = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [view, setView] = useState("home");
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [formData, setFormData] = useState({ name: "", email: "", message: "", newsletter: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { user } = useContext(AuthContext);
    const [challenges, setChallenges] = useState([]);
    const [wishlistProducts, setWishlistProducts] = useState(new Set());
    const [wishlistChallenges, setWishlistChallenges] = useState(new Set());

    useEffect(() => {
        getChallenges()
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setChallenges(res.data);
                } else {
                    setChallenges(FORMATION_CHALLENGES);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch challenges from API, falling back to static data:", err);
                setChallenges(FORMATION_CHALLENGES);
            });
        if (user) {
            getWishlist().then(res => {
                setWishlistProducts(new Set(res.data.products.map(p => p._id || p)));
                setWishlistChallenges(new Set(res.data.challenges.map(c => c._id || c)));
            }).catch(console.error);
        }
    }, [user]);

    const handleWishlistProduct = async (id) => {
        if (!user) { toast.error("Please login to wishlist items"); return; }
        try {
            const res = await toggleProductWishlist(id);
            setWishlistProducts(new Set(res.data));
            toast.success("Wishlist updated!");
        } catch (e) { toast.error("Failed to update wishlist"); }
    };

    const handleWishlistChallenge = async (id) => {
        if (!user) { toast.error("Please login to wishlist items"); return; }
        try {
            const res = await toggleChallengeWishlist(id);
            setWishlistChallenges(new Set(res.data));
            toast.success("Wishlist updated!");
        } catch (e) { toast.error("Failed to update wishlist"); }
    };

    const handleAddToCart = (item) => {
        addToCart(item);
        setIsCartOpen(true);
        setSelectedProduct(null); // Close the modal if it's open
    };

    if (view === "checkout") {
        return (
            <Checkout
                onBack={() => setView("home")}
                onOrderSuccess={() => setView("home")}
            />
        );
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all required fields!");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await axios.post('http://localhost:5000/api/messages', formData);
            if (response.status === 201) {
                toast.success("Message sent successfully!");
                setFormData({ name: "", email: "", message: "", newsletter: false });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="font-sans min-h-screen flex flex-col bg-stone-50 text-rubrik-navy selection:bg-rubrik-red selection:text-white">
            <ToastContainer position="bottom-right" />
            <Navbar
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                onOpenCart={() => setIsCartOpen(true)}
            />
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={() => setView("checkout")}
            />

            <main className="flex-grow">
                {/* HERO SECTION */}
                <header className="relative h-[600px] flex items-center justify-center text-center px-4 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2000&auto=format&fit=crop"
                            alt="Community Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-rubrik-navy/80 via-rubrik-navy/70 to-rubrik-navy/90 mix-blend-multiply"></div>
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                        <span className="inline-block px-4 py-1.5 rounded-full border border-white/30 bg-white/10 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-6">
                            Revisiting the Basics
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                            Growth that begins <br className="hidden md:block" /> at the core.
                        </h1>
                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                onClick={() =>
                                    document
                                        .getElementById("challenges")
                                        .scrollIntoView({ behavior: "smooth" })
                                }
                                className="bg-rubrik-red text-white px-8 py-3.5 rounded-full font-bold shadow-xl shadow-rubrik-red/20 hover:bg-red-700 hover:scale-105 transition-all duration-300"
                            >
                                Start a Challenge
                            </button>
                            <button
                                onClick={() =>
                                    document
                                        .getElementById("about")
                                        .scrollIntoView({ behavior: "smooth" })
                                }
                                className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 rounded-full font-bold hover:bg-white hover:text-rubrik-navy transition-all duration-300"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </header>

                {/* E-STORE */}
                <section className="py-24 container mx-auto px-6" id="explore">
                    <SectionHeader title="Store Highlights" link="/store" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-8">
                        {NEW_ARRIVALS.map((item) => (
                            <div key={item.id} onClick={() => setSelectedProduct(item)} className="cursor-pointer">
                                <ProductCard 
                                    item={item} 
                                    isWishlisted={wishlistProducts.has(item.id)}
                                    onWishlistClick={handleWishlistProduct}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* ABOUT US */}
                <section
                    className="py-28 bg-rubrik-navy text-white relative overflow-hidden"
                    id="about"
                >
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                            backgroundSize: "40px 40px",
                        }}
                    ></div>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex flex-col md:flex-row gap-16 items-center">
                            <div className="md:w-1/2 order-2 md:order-1">
                                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                                    Stripping away the <span className="text-rubrik-red">excess.</span>
                                </h2>
                                <div className="space-y-6 text-lg text-white/80 font-light leading-relaxed">
                                    <p>
                                        Rubrik Reset is a non-profit organisation focused on empowering
                                        youth by revisiting the basics.
                                    </p>
                                    <p>
                                        In a world of constant noise, we provide the tools to focus on
                                        what truly matters:{" "}
                                        <strong>Community, Faith, and Stewardship.</strong>
                                    </p>
                                </div>
                                <div className="mt-10 pt-10 border-t border-white/10 flex gap-8">
                                    <div>
                                        <span className="block text-3xl font-bold text-white">
                                            500+
                                        </span>
                                        <span className="text-xs uppercase tracking-wider text-white/60">
                                            Members
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-3xl font-bold text-white">
                                            12
                                        </span>
                                        <span className="text-xs uppercase tracking-wider text-white/60">
                                            Workshops
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2 relative order-1 md:order-2">
                                <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500">
                                    <img
                                        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200"
                                        alt="Community"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-rubrik-navy/20"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FORMATION CHALLENGES */}
                <section className="py-24 container mx-auto px-6" id="challenges">
                    <SectionHeader title="Formation Challenges" link="/challenges" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {challenges.map((item) => {
                            const itemId = item._id || item.id;
                            return (
                                <div key={itemId} onClick={() => navigate(`/challenges/${itemId}`)} className="cursor-pointer">
                                    <ProductCard 
                                        item={item} 
                                        showPrice={false}
                                        isWishlisted={wishlistChallenges.has(itemId)}
                                        onWishlistClick={handleWishlistChallenge}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* BLOG */}
                <section className="py-24 bg-white border-t border-stone-200" id="blog">
                    <div className="container mx-auto px-6">
                        <SectionHeader title="Reflections" link="/blog" />
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                            {BLOG_POSTS.map((post) => (
                                <div key={post.id} onClick={() => navigate(`/blog/${post.id}`)} className="h-full">
                                    <BlogCard post={post} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SMALL BUSINESSES */}
                <section className="py-24 bg-stone-50 border-t border-stone-200" id="small-businesses">
                    <div className="container mx-auto px-6">
                        <SectionHeader title="Small Businesses We Support" link="#" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <a href="https://docs.google.com/forms/d/1g19_WPoTHaMRBhOaKnBbB-oiARysVvqnf4HpM9IQFaA/edit?chromeless=1" target="_blank" rel="noreferrer" className="block bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-stone-100 text-center hover:-translate-y-1">
                                <h3 className="text-xl font-bold text-rubrik-navy mb-2">Heirloom Rosary</h3>
                                <p className="text-sm text-stone-500">Handcrafted, beautiful rosaries made with care and devotion.</p>
                            </a>
                            <a href="https://agape-creations-store.vercel.app/" target="_blank" rel="noreferrer" className="block bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-stone-100 text-center hover:-translate-y-1">
                                <h3 className="text-xl font-bold text-rubrik-navy mb-2">Agape Creations</h3>
                                <p className="text-sm text-stone-500">Faith-inspired goods and accessories to share His love.</p>
                            </a>
                            <div className="block bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-stone-100 text-center hover:-translate-y-1">
                                <h3 className="text-xl font-bold text-rubrik-navy mb-2">Painting by Martha</h3>
                                <p className="text-sm text-stone-500">Beautiful, hand-painted artwork to inspire and uplift the soul.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CONTACT */}
                <section className="py-24 flex justify-center px-4" id="contact">
                    <div className="w-full max-w-4xl bg-rubrik-red rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-rubrik-red/30 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-rubrik-navy rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative z-10 max-w-xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                                Start the conversation.
                            </h2>
                            <p className="text-white/80 mb-10 text-lg">
                                Have a question about our programs or want to get involved?
                            </p>
                            <form
                                className="flex flex-col gap-4 text-left"
                                onSubmit={handleFormSubmit}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-white focus:text-rubrik-red outline-none transition-all"
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={isSubmitting}
                                    />
                                    <input
                                        type="email"
                                        className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-white focus:text-rubrik-red outline-none transition-all"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <textarea
                                    rows="4"
                                    className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-white focus:text-rubrik-red outline-none transition-all"
                                    placeholder="How can we help?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    disabled={isSubmitting}
                                />
                                <div className="flex items-center gap-3 my-2">
                                    <input
                                        type="checkbox"
                                        id="newsletter"
                                        className="w-5 h-5 accent-white cursor-pointer"
                                        checked={formData.newsletter}
                                        onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                                        disabled={isSubmitting}
                                    />
                                    <label
                                        htmlFor="newsletter"
                                        className="text-sm font-medium text-white cursor-pointer"
                                    >
                                        Join the newsletter for weekly reflections.
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-white text-rubrik-red font-bold py-4 px-8 rounded-xl mt-4 w-full hover:bg-rubrik-navy hover:text-white transition-all shadow-lg text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-rubrik-red text-white py-16 px-6 border-t border-white/10">
                    <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                                    <img
                                        src="/Rubrik_Logo.png"
                                        alt="RR"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="font-bold text-xl">Rubrik Reset</span>
                            </div>
                            <p className="text-sm text-white/70 leading-relaxed">
                                Revisiting the basics of life skills, community building, and
                                stewardship for a better future.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-[0.2em] opacity-80">
                                Explore
                            </h4>
                            <ul className="space-y-4 text-sm text-white/90 font-medium">
                                <li>
                                    <a
                                        href="#about"
                                        className="hover:translate-x-1 inline-block transition-transform"
                                    >
                                        Our Mission
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#explore"
                                        className="hover:translate-x-1 inline-block transition-transform"
                                    >
                                        Shop Resources
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#challenges"
                                        className="hover:translate-x-1 inline-block transition-transform"
                                    >
                                        Formation
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-[0.2em] opacity-80">
                                Connect
                            </h4>
                            <ul className="space-y-4 text-sm text-white/90 font-medium">
                                <li>
                                    <a
                                        href="#blog"
                                        className="hover:translate-x-1 inline-block transition-transform"
                                    >
                                        Reflections Blog
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#contact"
                                        className="hover:translate-x-1 inline-block transition-transform"
                                    >
                                        Contact Us
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-[0.2em] opacity-80">
                                Legal
                            </h4>
                            <ul className="space-y-4 text-sm text-white/90 font-medium">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:translate-x-1 inline-block transition-transform"
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:translate-x-1 inline-block transition-transform"
                                    >
                                        Terms of Service
                                    </a>
                                </li>
                            </ul>
                            <p className="mt-10 text-xs text-white/50">
                                © 2026 Rubrik Reset. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </main>

            {/* PRODUCT POPUP MODAL */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rubrik-navy/50 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setSelectedProduct(null)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row transform transition-all duration-300 animate-in fade-in zoom-in-95"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="md:w-1/2 relative h-64 md:h-auto">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.title}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-4 left-4 bg-white/80 p-2 rounded-full md:hidden text-rubrik-navy hover:bg-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="md:w-1/2 p-8 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-rubrik-red">
                                    {selectedProduct.category}
                                </span>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="text-rubrik-navy/50 hover:text-rubrik-navy hidden md:block transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <h3 className="text-2xl font-bold text-rubrik-navy mb-2 leading-tight">
                                {selectedProduct.title}
                            </h3>

                            {selectedProduct.price && (
                                <p className="text-xl font-bold text-rubrik-navy mb-4">
                                    ₹{selectedProduct.price}
                                </p>
                            )}

                            {selectedProduct.duration && (
                                <p className="inline-block px-3 py-1 bg-stone-100 text-sm font-medium rounded-full text-rubrik-navy/80 mb-4 w-fit">
                                    {selectedProduct.duration}
                                </p>
                            )}

                            <p className="text-rubrik-navy/70 mb-8 flex-grow leading-relaxed">
                                {selectedProduct.description || "A wonderful addition to your faith journey."}
                            </p>

                            {selectedProduct.isBooking && (
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-rubrik-navy mb-2">Select a Date & Time:</label>
                                    <input 
                                        type="datetime-local" 
                                        className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-rubrik-navy outline-none focus:border-rubrik-red transition-all"
                                        onChange={(e) => setSelectedProduct({...selectedProduct, selectedDate: e.target.value})}
                                    />
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    if (selectedProduct.isBooking && !selectedProduct.selectedDate) {
                                        toast.error("Please select a date for the session.");
                                        return;
                                    }
                                    handleAddToCart(selectedProduct);
                                }}
                                className="w-full bg-rubrik-red text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <ShoppingBag size={20} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
