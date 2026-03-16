import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useCart } from "../CartContext";
import { API_BASE_URL } from '../services/api';
import API from "../api/axios";
import { Loader2, Eye, EyeOff } from "lucide-react";

const Dashboard = () => {
    const { user, logout, setUser } = useContext(AuthContext);
    const { addToCart } = useCart(); // Pull cart actions
    const navigate = useNavigate();

    // --- STATE ---
    const [activeTab, setActiveTab] = useState("downloads");
    const [theme, setTheme] = useState("Light");

    // Data States
    const [downloads, setDownloads] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [orders, setOrders] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    // Profile States
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [passwords, setPasswords] = useState({ current: "", next: "" });
    const [showPasswords, setShowPasswords] = useState(false);

    // Flow states
    const [loading, setLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);

    // 1. INITIAL SESSION CHECK
    useEffect(() => {
        const verifySession = async () => {
            try {
                // Strip "/api" to hit the root auth routes
                const baseUrl = API_BASE_URL.replace('/api', '');
                const res = await axios.get(`${baseUrl}/auth/current_user`, { withCredentials: true });
                if (res.data) {
                    setUser(res.data);
                    setName(res.data.name);
                    setPhone(res.data.phone || "");
                }
            } catch (err) {
                console.log("No active session found, checking context user...");
                if (!user) navigate("/login");
            } finally {
                setIsVerifying(false);
            }
        };
        verifySession();
    }, [setUser, navigate, user]);

    // 2. FETCH DASHBOARD DATA
    useEffect(() => {
        if (!isVerifying && user) {
            const fetchUserData = async () => {
                try {
                    const [dRes, cRes, oRes, wRes] = await Promise.all([
                        API.get("/user/downloads"),
                        API.get("/user/challenges"),
                        API.get("/user/orders"),
                        API.get("/user/wishlist")
                    ]);
                    setDownloads(dRes.data);
                    setChallenges(cRes.data);
                    setOrders(oRes.data);
                    setWishlist(wRes.data);
                } catch (err) {
                    console.error("Error loading dashboard data", err);
                }
            };
            fetchUserData();
        }
    }, [isVerifying, user]);

    const handleDownload = async (purchaseId) => {
        try {
            await API.get(`/downloads/check/${purchaseId}`);
            window.open(`${API_BASE_URL}/downloads/secure-download/${purchaseId}`, "_blank");
            setTimeout(() => {
                API.get("/user/downloads").then(res => setDownloads(res.data));
            }, 2000);
        } catch (err) {
            alert(err.response?.data?.message || "Download unavailable.");
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await API.put("/profile/update", { name, phone });
            setUser({ ...user, name: data.name, phone: data.phone });
            alert("✓ Profile updated successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!passwords.current || !passwords.next) return alert("Please fill both fields");
        setLoading(true);
        try {
            await API.put("/profile/password", {
                currentPassword: passwords.current,
                newPassword: passwords.next
            });
            alert("🔒 Password changed successfully!");
            setPasswords({ current: "", next: "" });
        } catch (err) {
            alert(err.response?.data?.message || "Invalid current password");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveWishlist = async (productId) => {
        try {
            const { data } = await API.post(`/user/wishlist/${productId}`);
            setWishlist(data); // update with the new list
        } catch (err) {
            alert("Failed to remove from wishlist");
        }
    };

    // Dark Mode Styling Helpers
    const isDark = theme === "Dark";
    const bgMain = isDark ? "bg-[#0b1120]" : "bg-[#2A7B8E]";
    const bgCard = isDark ? "bg-[#1e293b]" : "bg-white";
    const textPrimary = isDark ? "text-white" : "text-slate-800";
    const textSecondary = isDark ? "text-slate-400" : "text-slate-500";
    const borderSecondary = isDark ? "border-slate-700" : "border-slate-100";
    const bgHover = isDark ? "hover:bg-slate-800" : "hover:bg-slate-50";

    const NavItem = ({ id, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full text-left px-5 py-3.5 rounded-xl transition-all font-bold flex justify-between items-center ${activeTab === id
                ? (isDark ? "bg-[#2A7B8E]/20 text-[#7bbdda]" : "bg-[#2A7B8E]/10 text-[#2A7B8E]") + " shadow-sm"
                : `${textSecondary} ${bgHover}`
                }`}
        >
            <span className="text-sm">{label}</span>
            <span className="text-lg opacity-50">›</span>
        </button>
    );

    if (isVerifying) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <Loader2 className="animate-spin h-10 w-10 text-[#ef3e36] mb-4" />
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${bgMain} flex flex-col md:flex-row p-6 md:p-10 gap-6 font-sans transition-colors duration-300`}>

            {/* LEFT COLUMN - Profile, Logo & Settings */}
            <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">

                {/* Profile Card */}
                <div className={`${bgCard} rounded-[2rem] shadow-xl overflow-hidden p-2 transition-colors duration-300`}>

                    <div className={`p-6 pb-2 flex justify-center border-b ${borderSecondary}`}>
                        <img src="/Rubrik_Logo.png" alt="Rubrik Reset Logo" className={`h-24 w-auto object-contain ${isDark ? "brightness-200 invert" : ""}`} />
                    </div>

                    <div className={`p-6 flex flex-col items-center border-b ${borderSecondary} text-center relative`}>
                        {/* Theme Toggle in top right of Profile section */}
                        <button
                            onClick={() => setTheme(isDark ? "Light" : "Dark")}
                            className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 grayscale opacity-70 hover:opacity-100 ${isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                        >
                            {isDark ? "Dark 🌙" : "Light ☀️"}
                        </button>

                        {user?.image ? (
                            <img src={user.image} alt="User" className="w-16 h-16 rounded-full border-2 border-slate-200 mb-3 shrink-0" />
                        ) : (
                            <div className={`h-16 w-16 ${isDark ? "bg-slate-700" : "bg-slate-100"} rounded-full flex items-center justify-center ${isDark ? "text-white" : "text-slate-500"} text-2xl font-black mb-3 shrink-0`}>
                                {(user?.email?.charAt(0) || user?.name?.charAt(0) || "U").toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className={`font-bold ${textPrimary} text-lg leading-tight uppercase tracking-tight`}>{user?.name || "Member"}</p>
                            <p className={`text-xs ${textSecondary} mt-1`}>{user?.email}</p>
                        </div>
                    </div>

                    <div className="p-2 space-y-1 mt-2">
                        <NavItem id="downloads" label="My Downloads" />
                        <NavItem id="challenges" label="Formation Challenges" />
                        <NavItem id="settings" label="Profile Settings" />
                        <NavItem id="orders" label="Order History" />
                        <NavItem id="wishlist" label="My Wishlist" />
                        <button
                            onClick={() => { logout(); navigate("/"); }}
                            className={`w-full text-left px-5 py-3.5 mt-2 rounded-xl ${textSecondary} ${isDark ? "hover:bg-red-500/10 hover:text-red-400" : "hover:bg-red-50 hover:text-[#ef3e36]"} transition-colors font-bold flex justify-between items-center`}
                        >
                            <span className="text-sm">Log Out</span>
                        </button>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN - Main Workspace */}
            <div className={`flex-1 ${bgCard} rounded-[2rem] shadow-xl flex flex-col overflow-hidden min-h-[600px] transition-colors duration-300`}>

                <div className={`h-24 px-10 border-b ${borderSecondary} flex items-center justify-between shrink-0`}>
                    <div>
                        <h2 className={`text-2xl font-black ${textPrimary} capitalize tracking-tight`}>{activeTab.replace('-', ' ')} Workspace</h2>
                        <p className={`text-xs ${textSecondary} font-medium mt-1 uppercase tracking-widest`}>Rubrik Reset Personal Terminal</p>
                    </div>
                </div>

                <main className="p-10 flex-1 overflow-y-auto">

                    {/* MY DOWNLOADS */}
                    {activeTab === "downloads" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className={`text-lg font-black ${textPrimary} uppercase tracking-tighter`}>Acquired Digital Assets</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {downloads.length > 0 ? downloads.map((item) => (
                                    <div key={item._id} className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-8 rounded-[2rem] shadow-sm border flex flex-col justify-between`}>
                                        <div>
                                            <h3 className={`font-black ${textPrimary} text-lg mb-1 line-clamp-2`}>{item.productId?.title || "Digital Product"}</h3>
                                            <span className={`${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'} px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider`}>Attempts: {item.downloadCount} / {item.maxDownloadLimit}</span>
                                        </div>
                                        <div className="mt-8">
                                            <button
                                                disabled={item.downloadCount >= item.maxDownloadLimit}
                                                onClick={() => handleDownload(item._id)}
                                                className={`w-full py-3 ${item.downloadCount >= item.maxDownloadLimit ? (isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400') : 'bg-[#ef3e36] text-white hover:bg-red-600'} rounded-xl text-xs font-black uppercase tracking-widest transition shadow-sm`}
                                            >
                                                {item.downloadCount >= item.maxDownloadLimit ? "Limit Reached" : "Download Assets"}
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-12 text-center">
                                        <p className={`${textSecondary} font-bold text-sm uppercase tracking-widest`}>No digital assets available.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* FORMATION CHALLENGES */}
                    {activeTab === "challenges" && (
                        <div className="animate-in fade-in duration-500">
                            <div className={`border ${borderSecondary} rounded-2xl overflow-hidden`}>
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead>
                                        <tr className={`${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-400"} text-[10px] uppercase font-black tracking-widest`}>
                                            <th className="p-5">Challenge</th>
                                            <th className="p-5">Progress</th>
                                            <th className="p-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>
                                        {challenges.map((c, index) => (
                                            <tr key={index} className={`text-sm ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}>
                                                <td className={`p-5 font-bold ${textPrimary}`}>{c.title}</td>
                                                <td className={`p-5 font-medium ${textSecondary}`}>Day {c.currentDay} of {c.totalDays}</td>
                                                <td className="p-5 text-right">
                                                    <button onClick={() => navigate(`/challenges/${c.id}`)} className="text-xs font-bold text-[#ef3e36] hover:underline uppercase tracking-widest transition">View Challenge</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {challenges.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className={`p-8 text-center ${textSecondary} font-bold text-sm`}>No active challenges found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* PROFILE SETTINGS */}
                    {activeTab === "settings" && (
                        <div className="animate-in fade-in duration-500 space-y-12 max-w-2xl">

                            <section>
                                <h3 className={`text-lg font-black ${textPrimary} uppercase tracking-tighter mb-6`}>Profile Management</h3>
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div>
                                        <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Display Name</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${borderSecondary} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} />
                                    </div>
                                    <div>
                                        <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Email Address (Static)</label>
                                        <input type="email" defaultValue={user?.email} disabled className={`w-full ${isDark ? "bg-slate-900 text-slate-500 border-slate-800" : "bg-slate-100 text-slate-400 border-slate-200"} border rounded-2xl p-4 text-sm font-bold cursor-not-allowed shadow-sm`} />
                                    </div>
                                    <div>
                                        <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Phone Number (Optional)</label>
                                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(+91) 98765 43210" className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${borderSecondary} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} />
                                    </div>
                                    <button type="submit" disabled={loading} className="bg-[#ef3e36] text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-red-600 transition disabled:opacity-50">
                                        {loading ? "Processing..." : "Update Credentials"}
                                    </button>
                                </form>
                            </section>

                            <div className={`border-t ${borderSecondary}`}></div>

                            <section>
                                <h3 className={`text-lg font-black ${textPrimary} uppercase tracking-tighter mb-6`}>Security Protocol</h3>
                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <div className="relative">
                                        <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Current Password</label>
                                        <input type={showPasswords ? "text" : "password"} placeholder="••••••••" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${borderSecondary} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none shadow-sm pr-12`} />
                                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} className={`absolute right-4 top-10 ${textSecondary} hover:${textPrimary} transition`}>
                                            {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>New Password</label>
                                        <input type={showPasswords ? "text" : "password"} placeholder="••••••••" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${borderSecondary} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none shadow-sm pr-12`} />
                                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} className={`absolute right-4 top-10 ${textSecondary} hover:${textPrimary} transition`}>
                                            {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <button type="submit" disabled={loading} className={`border-2 border-[#ef3e36] text-[#ef3e36] px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#ef3e36] hover:text-white transition shadow-sm disabled:opacity-50`}>
                                        Authorize Change
                                    </button>
                                </form>
                            </section>
                        </div>
                    )}

                    {/* ORDER HISTORY */}
                    {activeTab === "orders" && (
                        <div className="animate-in fade-in duration-500">
                            <div className={`border ${borderSecondary} rounded-2xl overflow-hidden`}>
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead>
                                        <tr className={`${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-400"} text-[10px] uppercase font-black tracking-widest`}>
                                            <th className="p-5">Product Name</th>
                                            <th className="p-5">Price</th>
                                            <th className="p-5">Quantity</th>
                                            <th className="p-5 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>
                                        {orders.map((o) => (
                                            <tr key={o._id} className={`text-sm ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}>
                                                <td className={`p-5 font-bold ${textPrimary}`}>{o.productName}</td>
                                                <td className={`p-5 font-mono font-bold text-[#ef3e36]`}>₹{o.price}</td>
                                                <td className={`p-5 font-medium ${textSecondary}`}>{o.quantity}</td>
                                                <td className={`p-5 text-right font-medium ${textSecondary} text-xs tracking-wider`}>
                                                    {new Date(o.purchaseDate).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className={`p-8 text-center ${textSecondary} font-bold text-sm`}>No previous transaction records found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* MY WISHLIST */}
                    {activeTab === "wishlist" && (
                        <div className="animate-in fade-in duration-500">
                            <div className={`border ${borderSecondary} rounded-2xl overflow-hidden`}>
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead>
                                        <tr className={`${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-400"} text-[10px] uppercase font-black tracking-widest`}>
                                            <th className="p-5">Product Title</th>
                                            <th className="p-5">Price</th>
                                            <th className="p-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>
                                        {wishlist.map((w) => (
                                            <tr key={w._id} className={`text-sm ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}>
                                                <td className={`p-5 font-bold ${textPrimary}`}>{w.title}</td>
                                                <td className={`p-5 font-mono font-bold text-[#ef3e36]`}>₹{w.price}</td>
                                                <td className="p-5 text-right space-x-4">
                                                    <button onClick={() => { addToCart(w); navigate("/cart"); }} className={`bg-[#2A7B8E] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition shadow-sm`}>
                                                        Add to Cart
                                                    </button>
                                                    <button onClick={() => handleRemoveWishlist(w._id)} className={`text-[#ef3e36] px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:underline transition`}>
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {wishlist.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className={`p-8 text-center ${textSecondary} font-bold text-sm`}>Your wishlist is currently empty.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;