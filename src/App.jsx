import React, { useState } from 'react';
import { ShoppingBag, Heart, Menu, X, ArrowRight, User, Trash2, Plus, Minus } from 'lucide-react';
import { ProductCard, BlogCard, SectionHeader } from './Components';
import { NEW_ARRIVALS, FORMATION_CHALLENGES, BLOG_POSTS } from './data';
import { CartProvider, useCart } from './CartContext';
import Checkout from './Checkout';

// --- CART SIDEBAR COMPONENT ---
const CartSidebar = ({ isOpen, onClose, onCheckout }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (!isOpen) return null;
  

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-rubrik-navy text-white">
          <h2 className="text-xl font-bold">Your Bag ({cart.length})</h2>
          <button onClick={onClose}><X className="w-6 h-6 hover:rotate-90 transition-transform" /></button>
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
                <img src={item.image} alt={item.title} className="w-20 h-20 rounded-lg object-cover border border-gray-100" />
                <div className="flex-grow">
                  <h3 className="font-bold text-rubrik-navy text-sm leading-tight mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{item.category}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                      <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}><Minus className="w-3 h-3" /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}><Plus className="w-3 h-3" /></button>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-rubrik-red text-sm">₹{item.price * item.quantity}</p>
                       <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-gray-400 underline hover:text-red-500 mt-1">Remove</button>
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
              <span className="text-2xl font-bold text-rubrik-navy">₹{totalPrice}</span>
            </div>
            <button 
              onClick={() => { onClose(); onCheckout(); }}
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

// --- NAVBAR COMPONENT ---
const Navbar = ({ isMenuOpen, setIsMenuOpen, onOpenCart }) => {
  const { totalItems } = useCart();
  
  return (
    <nav className="bg-rubrik-red text-white px-6 py-3 shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-md group-hover:scale-105 transition-transform">
            <img src="/Rubrik_Logo.png" alt="RR" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden md:block text-white">Rubrik Reset</span>
        </div>

        <div className="hidden md:flex gap-8 font-medium text-sm tracking-wide">
          {['About', 'Store', 'Formation', 'Reflections'].map((item) => (
             <a key={item} href={`#${item.toLowerCase() === 'store' ? 'explore' : item.toLowerCase() === 'reflections' ? 'blog' : item.toLowerCase() === 'formation' ? 'challenges' : 'about'}`} className="hover:text-white/80 transition-colors">{item}</a>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <Heart className="w-6 h-6 cursor-pointer text-white/80 hover:text-white transition-all" />
          <div className="relative cursor-pointer text-white/80 hover:text-white transition-all" onClick={onOpenCart}>
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-rubrik-red text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md animate-bounce">{totalItems}</span>
            )}
          </div>
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- MAIN APP ---
const RubrikApp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState('home'); 
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart(item);
    setIsCartOpen(true); 
  };

  if (view === 'checkout') {
    return <Checkout onBack={() => setView('home')} onOrderSuccess={() => setView('home')} />;
  }

  return (
    <div className="font-sans min-h-screen flex flex-col bg-stone-50 text-rubrik-navy selection:bg-rubrik-red selection:text-white">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} onOpenCart={() => setIsCartOpen(true)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => setView('checkout')} />

      <main className="flex-grow">
        
        {/* HERO SECTION (Specific Request: No Shadow, Text on Image) */}
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
              Growth that begins <br className="hidden md:block"/> at the core.
            </h1>
            <div className="flex flex-col md:flex-row gap-4">
              <button onClick={() => document.getElementById('challenges').scrollIntoView({behavior: 'smooth'})} className="bg-rubrik-red text-white px-8 py-3.5 rounded-full font-bold shadow-xl shadow-rubrik-red/20 hover:bg-red-700 hover:scale-105 transition-all duration-300">
                Start a Challenge
              </button>
              <button onClick={() => document.getElementById('about').scrollIntoView({behavior: 'smooth'})} className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 rounded-full font-bold hover:bg-white hover:text-rubrik-navy transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </header>

        {/* E-STORE */}
        <section className="py-24 container mx-auto px-6" id="explore">
          <SectionHeader title="Store Highlights" link="/store" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-8">
            {NEW_ARRIVALS.map(item => (
              <div key={item.id} onClick={() => handleAddToCart(item)}>
                <ProductCard item={item} />
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT US */}
        <section className="py-28 bg-rubrik-navy text-white relative overflow-hidden" id="about">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="md:w-1/2 order-2 md:order-1">
                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Stripping away the <span className="text-rubrik-red">excess.</span></h2>
                <div className="space-y-6 text-lg text-white/80 font-light leading-relaxed">
                  <p>Rubrik Reset is a non-profit organisation focused on empowering youth by revisiting the basics.</p>
                  <p>In a world of constant noise, we provide the tools to focus on what truly matters: <strong>Community, Faith, and Stewardship.</strong></p>
                </div>
                <div className="mt-10 pt-10 border-t border-white/10 flex gap-8">
                  <div><span className="block text-3xl font-bold text-white">500+</span><span className="text-xs uppercase tracking-wider text-white/60">Members</span></div>
                  <div><span className="block text-3xl font-bold text-white">12</span><span className="text-xs uppercase tracking-wider text-white/60">Workshops</span></div>
                </div>
              </div>
              <div className="md:w-1/2 relative order-1 md:order-2">
                <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500">
                   <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200" alt="Community" className="w-full h-full object-cover" />
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
            {FORMATION_CHALLENGES.map(item => (
               <div key={item.id} onClick={() => handleAddToCart(item)}>
                 <ProductCard item={item} showPrice={false} />
               </div>
            ))}
          </div>
        </section>

        {/* BLOG */}
        <section className="py-24 bg-white border-t border-stone-200" id="blog">
          <div className="container mx-auto px-6">
            <SectionHeader title="Reflections" link="/blog" />
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              {BLOG_POSTS.map(post => <BlogCard key={post.id} post={post} />)}
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
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Start the conversation.</h2>
              <p className="text-white/80 mb-10 text-lg">Have a question about our programs or want to get involved?</p>
              <form className="flex flex-col gap-4 text-left" onSubmit={(e) => { e.preventDefault(); alert("Message Sent!"); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-white focus:text-rubrik-red outline-none transition-all" placeholder="Name" />
                  <input type="email" className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-white focus:text-rubrik-red outline-none transition-all" placeholder="Email" />
                </div>
                <textarea rows="4" className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-white focus:text-rubrik-red outline-none transition-all" placeholder="How can we help?" />
                <div className="flex items-center gap-3 my-2">
                  <input type="checkbox" id="newsletter" className="w-5 h-5 accent-white cursor-pointer" />
                  <label htmlFor="newsletter" className="text-sm font-medium text-white cursor-pointer">Join the newsletter for weekly reflections.</label>
                </div>
                <button className="bg-white text-rubrik-red font-bold py-4 px-8 rounded-xl mt-4 w-full hover:bg-rubrik-navy hover:text-white transition-all shadow-lg text-lg">Send Message</button>
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
                  <img src="/Rubrik_Logo.png" alt="RR" className="w-full h-full object-cover" />
                 </div>
                 <span className="font-bold text-xl">Rubrik Reset</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">Revisiting the basics of life skills, community building, and stewardship for a better future.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-[0.2em] opacity-80">Explore</h4>
              <ul className="space-y-4 text-sm text-white/90 font-medium">
                <li><a href="#about" className="hover:translate-x-1 inline-block transition-transform">Our Mission</a></li>
                <li><a href="#explore" className="hover:translate-x-1 inline-block transition-transform">Shop Resources</a></li>
                <li><a href="#challenges" className="hover:translate-x-1 inline-block transition-transform">Formation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-[0.2em] opacity-80">Connect</h4>
              <ul className="space-y-4 text-sm text-white/90 font-medium">
                <li><a href="#blog" className="hover:translate-x-1 inline-block transition-transform">Reflections Blog</a></li>
                <li><a href="#contact" className="hover:translate-x-1 inline-block transition-transform">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-[0.2em] opacity-80">Legal</h4>
              <ul className="space-y-4 text-sm text-white/90 font-medium">
                <li><a href="#" className="hover:translate-x-1 inline-block transition-transform">Privacy Policy</a></li>
                <li><a href="#" className="hover:translate-x-1 inline-block transition-transform">Terms of Service</a></li>
              </ul>
              <p className="mt-10 text-xs text-white/50">© 2026 Rubrik Reset. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <RubrikApp />
    </CartProvider>
  );
}