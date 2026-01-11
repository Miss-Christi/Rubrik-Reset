import React, { useState } from 'react';
import { ShoppingBag, Heart, Menu, X, ArrowRight, User } from 'lucide-react';
import { ProductCard, BlogCard, SectionHeader } from './components';
// IMPORT THE DATA HERE
import { NEW_ARRIVALS, FORMATION_CHALLENGES, BLOG_POSTS } from './data';

// --- NAVBAR COMPONENT ---

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => (
  // Red Background, White Text
  <nav className="bg-rubrik-red text-white px-6 py-3 shadow-lg sticky top-0 z-50 transition-all duration-300">
    <div className="container mx-auto flex items-center justify-between">
      
      {/* Logo */}
      <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-md group-hover:scale-105 transition-transform">
          <img src="/Rubrik_Logo.png" alt="RR" className="w-full h-full object-cover" />
        </div>
        <span className="font-bold text-xl tracking-tight hidden md:block text-white font-serif">Rubrik Reset</span>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-8 font-medium text-sm tracking-wide">
        {['About', 'Store', 'Formation', 'Reflections'].map((item) => (
           <a 
             key={item} 
             href={`#${item.toLowerCase() === 'store' ? 'explore' : item.toLowerCase() === 'reflections' ? 'blog' : item.toLowerCase() === 'formation' ? 'challenges' : 'about'}`} 
             className="relative px-2 py-1 hover:text-white/80 transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform hover:after:scale-x-100 hover:after:origin-bottom-left"
           >
             {item}
           </a>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-5">
        <div className="h-6 w-px bg-white/20 hidden md:block"></div>
        <Heart className="w-6 h-6 cursor-pointer text-white/80 hover:text-white hover:scale-110 transition-all" />
        <div className="relative cursor-pointer text-white/80 hover:text-white hover:scale-110 transition-all">
          <ShoppingBag className="w-6 h-6" />
        </div>
        
        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>
    </div>

    {/* Mobile Menu */}
    {isMenuOpen && (
      <div className="md:hidden absolute top-full left-0 w-full bg-rubrik-red border-t border-white/10 shadow-xl py-6 flex flex-col items-center gap-6 animate-fade-in-down z-40">
        <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-xl font-serif font-bold text-white hover:opacity-70">About</a>
        <a href="#explore" onClick={() => setIsMenuOpen(false)} className="text-xl font-serif font-bold text-white hover:opacity-70">Store</a>
        <a href="#challenges" onClick={() => setIsMenuOpen(false)} className="text-xl font-serif font-bold text-white hover:opacity-70">Formation</a>
        <a href="#blog" onClick={() => setIsMenuOpen(false)} className="text-xl font-serif font-bold text-white hover:opacity-70">Reflections</a>
        <button className="flex items-center gap-2 bg-white text-rubrik-red px-6 py-2 rounded-full font-bold text-sm">
          <User className="w-4 h-4" /> Sign In
        </button>
      </div>
    )}
  </nav>
);

// --- MAIN APP ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="font-sans min-h-screen flex flex-col bg-stone-50 text-rubrik-navy selection:bg-rubrik-red selection:text-white">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <header className="relative h-[650px] flex items-center justify-center text-center px-4 overflow-hidden group">
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2000&auto=format&fit=crop" 
               alt="Community Background" 
               className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[20s]"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-rubrik-navy/80 via-rubrik-navy/60 to-stone-50"></div>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
            <span className="inline-block px-5 py-2 rounded-full border border-white/20 bg-white/5 text-white text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md mb-8">
            Revisiting the Basics • Youth Formation
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.1] drop-shadow-lg">
              Growth that begins <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-stone-200 to-gray-400">at the core.</span>
            </h1>
            <p className="text-stone-200 text-lg md:text-xl max-w-2xl mb-12t">
              Revisiting the basics of life skills, community stewardship, and values-driven growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button onClick={() => document.getElementById('challenges').scrollIntoView({behavior: 'smooth'})} className="bg-rubrik-red text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-white hover:text-rubrik-red hover:-translate-y-1 transition-all duration-300">
                Start a Challenge
              </button>
              <button onClick={() => document.getElementById('about').scrollIntoView({behavior: 'smooth'})} className="border border-white/30 text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-rubrik-navy hover:-translate-y-1 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </header>

        {/* E-STORE HIGHLIGHTS */}
        <section className="py-24 container mx-auto px-6" id="explore">
          <SectionHeader title="Store Highlights" link="/store" />
          {/* Grid: 2(Mobile) - 3(Tablet/Half) - 6(Full) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-8">
            {NEW_ARRIVALS.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        </section>

        {/* ABOUT US */}
        <section className="py-28 bg-rubrik-navy text-white relative overflow-hidden" id="about">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="md:w-1/2 order-2 md:order-1">
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                  Stripping away the <span className="text-rubrik-red">excess.</span>
                </h2>
                <div className="space-y-6 text-lg text-white/80 font-light leading-relaxed">
                  <p>
                    Rubrik Reset is a non-profit organisation focused on empowering youth by revisiting the basics. 
                  </p>
                  <p>
                    In a world of constant noise, we provide the tools to focus on what truly matters: <strong>Community, Faith, and Stewardship.</strong>
                  </p>
                </div>
                <div className="mt-10 pt-10 border-t border-white/10 flex gap-8">
                  <div>
                    <span className="block text-3xl font-bold text-white">500+</span>
                    <span className="text-xs uppercase tracking-wider text-white/60">Members</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-bold text-white">12</span>
                    <span className="text-xs uppercase tracking-wider text-white/60">Workshops</span>
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
            {FORMATION_CHALLENGES.map(item => <ProductCard key={item.id} item={item} showPrice={false} />)}
          </div>
        </section>

        {/* LATEST REFLECTIONS (BLOG) */}
        <section className="py-24 bg-white border-t border-stone-200" id="blog">
          <div className="container mx-auto px-6">
            <SectionHeader title="Reflections" link="/blog" />
            {/* Grid: 2(Mobile/Tablet) - 5(Full) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              {BLOG_POSTS.map(post => <BlogCard key={post.id} post={post} />)}
            </div>
          </div>
        </section>

        {/* CONTACT - RED CARD */}
        <section className="py-24 flex justify-center px-4" id="contact">
          <div className="w-full max-w-4xl bg-rubrik-red rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-rubrik-red/30 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
               <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl"></div>
               <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-rubrik-navy rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white">Start the conversation.</h2>
              <p className="text-white/80 mb-10 text-lg">Have a question about our programs or want to get involved?</p>
              
              <form className="flex flex-col gap-4 text-left" onSubmit={(e) => { e.preventDefault(); alert("Message Sent!"); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-white focus:text-rubrik-red outline-none transition-all" placeholder="Name" />
                  <input type="email" className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-white focus:text-rubrik-red outline-none transition-all" placeholder="Email" />
                </div>
                <textarea rows="4" className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-white focus:text-rubrik-red outline-none transition-all" placeholder="How can we help?" />
                
                <div className="flex items-center gap-3 my-2">
                  <input type="checkbox" id="newsletter" className="w-5 h-5 accent-white cursor-pointer" />
                  <label htmlFor="newsletter" className="text-sm font-medium text-white cursor-pointer">
                    Join the newsletter for weekly reflections.
                  </label>
                </div>

                <button className="bg-white text-rubrik-red font-bold py-4 px-8 rounded-xl mt-4 w-full hover:bg-rubrik-navy hover:text-white transition-all shadow-lg text-lg">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-rubrik-red text-white py-16 px-6 border-t border-white/10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                <img src="/Rubrik_Logo.png" alt="RR" className="w-full h-full object-cover" />
               </div>
               <span className="font-serif font-bold text-xl">Rubrik Reset</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Revisiting the basics of life skills, community building, and stewardship for a better future.
            </p>
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
    </div>
  );
}