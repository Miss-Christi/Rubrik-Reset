import { Heart, ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "../CartContext";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navbar = ({ isMenuOpen, setIsMenuOpen, onOpenCart }) => {
    const { totalItems } = useCart();
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-rubrik-red text-white px-6 py-3 shadow-lg sticky top-0 z-50 transition-all duration-300">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                        <img
                            src="/Rubrik_Logo.png"
                            alt="RR"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden md:block text-white">
                        Rubrik Reset
                    </span>
                </Link>

                <div className="hidden md:flex gap-8 font-medium text-sm tracking-wide">
                    {["About", "Store", "Formation", "Reflections"].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase() === "store"
                                ? "explore"
                                : item.toLowerCase() === "reflections"
                                    ? "blog"
                                    : item.toLowerCase() === "formation"
                                        ? "challenges"
                                        : "about"
                                }`}
                            className="hover:text-white/80 transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-5">
                    {user ? (
                        <Link
                            to={user.role === "admin" ? "/admin" : "/dashboard"}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-rubrik-red font-bold text-sm shadow-sm hover:scale-110 transition-transform uppercase"
                            title="Go to Dashboard"
                        >
                            {user.name ? user.name.charAt(0) : <User className="w-5 h-5" />}
                        </Link>
                    ) : (
                        <Link to="/login" className="flex items-center gap-1 text-white">
                            <User className="w-5 h-5" /> Login
                        </Link>
                    )}

                    <Link to="/wishlist" className="relative cursor-pointer text-white/80 hover:text-white transition-all">
                        <Heart className="w-6 h-6" />
                    </Link>
                    <div
                        className="relative cursor-pointer text-white/80 hover:text-white transition-all"
                        onClick={onOpenCart}
                    >
                        <ShoppingBag className="w-6 h-6" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-white text-rubrik-red text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md animate-bounce">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="w-7 h-7" />
                        ) : (
                            <Menu className="w-7 h-7" />
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
