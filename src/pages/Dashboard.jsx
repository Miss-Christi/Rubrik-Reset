import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useCart } from "../CartContext";
import { getUserProfile, updateUserProfile, API_BASE_URL } from '../services/api';
import API from "../api/axios.js";
import { Loader2, CheckCircle2 } from "lucide-react";
import { ProductCard, SectionHeader } from "../Components";

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const CITIES_BY_STATE = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Navi Mumbai", "Kolhapur"],
    "Karnataka": ["Bengaluru", "Hubballi-Dharwad", "Mysuru", "Kalaburagi", "Mangaluru", "Belagavi", "Davanagere", "Ballari", "Vijayapura", "Shivamogga"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Nagercoil"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Nadiad", "Morbi"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Prayagraj", "Bareilly", "Aligarh", "Moradabad"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Maheshtala", "Rajpur Sonarpur", "Gopalpur", "Bhatpara", "Panihati"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar"],
};

const Dashboard = () => {
    const { user, logout, setUser, updateUser } = useContext(AuthContext);
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
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [userState, setUserState] = useState("");
    const [city, setCity] = useState("");
    const [landmark, setLandmark] = useState("");
    const [pincode, setPincode] = useState("");

    // Flow states
    const [loading, setLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);

    // 1. INITIAL SESSION & PROFILE FETCH
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await getUserProfile();
                setName(data.name || "");
                setPhone(data.phone || "");
                setUserState(data.state || "");
                setCity(data.city || "");
                setLandmark(data.landmark || "");
                setPincode(data.pincode || "");
                
                // Also sync with AuthContext for display name
                updateUser(data);
            } catch (err) {
                console.error("Failed to load profile", err);
                if (!user) navigate("/login");
            } finally {
                setIsVerifying(false);
            }
        };
        fetchProfile();
    }, [navigate, user]);

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
            const { data } = await updateUserProfile({
                name,
                phone,
                state: userState,
                city,
                landmark,
                pincode
            });
            updateUser(data);
            alert("✓ Profile updated successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update profile");
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
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-12 w-12 bg-[#ef3e36]/10 rounded-2xl flex items-center justify-center">
                                        <CheckCircle2 className="text-[#ef3e36] w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-black ${textPrimary} uppercase tracking-tighter`}>Account Identity</h3>
                                        <p className={`text-xs ${textSecondary} font-bold uppercase tracking-widest`}>Manage your personal ecosystem data</p>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Display Name</label>
                                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${borderSecondary} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} />
                                        </div>
                                        <div>
                                            <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Phone Number</label>
                                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 00000 00000" className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${borderSecondary} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Indian State</label>
                                            <select 
                                                value={userState} 
                                                onChange={(e) => { setUserState(e.target.value); setCity(""); }} 
                                                className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${borderSecondary} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm appearance-none cursor-pointer`}
                                            >
                                                <option value="">Select State</option>
                                                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>City / District</label>
                                            {CITIES_BY_STATE[userState] ? (
                                                <select 
                                                    value={city} 
                                                    onChange={(e) => setCity(e.target.value)} 
                                                    className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${borderSecondary} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm appearance-none cursor-pointer`}
                                                >
                                                    <option value="">Select City</option>
                                                    {CITIES_BY_STATE[userState].map(c => <option key={c} value={c}>{c}</option>)}
                                                    <option value="Other">Other (Manual Input)</option>
                                                </select>
                                            ) : (
                                                <input 
                                                    type="text" 
                                                    value={city} 
                                                    onChange={(e) => setCity(e.target.value)} 
                                                    placeholder="Enter City Name"
                                                    className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${borderSecondary} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {city === "Other" && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                            <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Manual City Entry</label>
                                            <input type="text" placeholder="Specify your city" onChange={(e) => setCity(e.target.value)} className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${borderSecondary} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Landmark / Street</label>
                                            <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="e.g. Near Main Square" className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${borderSecondary} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} />
                                        </div>
                                        <div>
                                            <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Pincode</label>
                                            <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="6-digit code" className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${borderSecondary} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button 
                                            type="submit" 
                                            disabled={loading} 
                                            className="w-full md:w-auto bg-[#ef3e36] text-white px-12 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {loading ? "Synchronizing..." : "Save Profile Changes"}
                                        </button>
                                    </div>
                                </form>
                            </section>

                            <div className={`p-8 rounded-[2rem] border ${borderSecondary} ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} flex items-start gap-4`}>
                                <div className="p-3 bg-blue-500/10 rounded-xl">
                                    <span className="text-xl">🛡️</span>
                                </div>
                                <div>
                                    <p className={`text-xs font-bold ${textPrimary} uppercase tracking-wider mb-1`}>Secure Cloud Sync</p>
                                    <p className={`text-[10px] ${textSecondary} font-medium leading-relaxed`}>Your profile data is encrypted and synchronized across all Rubrik Reset ecosystem terminials. Changes reflect instantly upon saving.</p>
                                </div>
                            </div>
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
                        <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className={`text-lg font-black ${textPrimary} uppercase tracking-tighter`}>Saved for Later</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {wishlist.length > 0 ? wishlist.map((item) => (
                                    <ProductCard
                                        key={item._id}
                                        item={item}
                                        isWishlisted={true} // Since it's in the wishlist
                                        onWishlistClick={() => handleRemoveWishlist(item._id)}
                                    />
                                )) : (
                                    <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                                            <span className="text-2xl">💝</span>
                                        </div>
                                        <p className={`${textSecondary} font-black text-xs uppercase tracking-[0.2em]`}>Your wishlist is empty</p>
                                        <button onClick={() => navigate("/store")} className="mt-6 text-[#ef3e36] text-[10px] font-black uppercase tracking-widest hover:underline">Explore the Store</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;