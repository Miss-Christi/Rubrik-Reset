import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import API from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import { 
    Users, 
    Package, 
    BarChart3, 
    Settings, 
    LogOut, 
    AlertCircle, 
    CheckCircle2, 
    Trash2, 
    ArrowUpRight,
    Search,
    Filter,
    MoreVertical,
    ChevronRight,
    Shield,
    History,
    FileText,
    HelpCircle,
    UserPlus,
    Calendar,
    Edit3
} from "lucide-react";

const AdminDashboard = () => {
    const { user, logout, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalChallengeOrders: 0 });
    const [users, setUsers] = useState([]);
    const [challenges, setChallenges] = useState([]); // This will be the DEFINITIONS from /admin/challenges/list
    const [challengeHistory, setChallengeHistory] = useState([]); // This will be the PARTICIPATION from /admin/challenges
    const [reflections, setReflections] = useState([]);
    const [activeTab, setActiveTab] = useState("inventory");
    const [theme, setTheme] = useState("Light");

    // Modal states
    const [showProductModal, setShowProductModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ title: "", category: "Poster", price: "", fileUrl: "" });

    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [newChallenge, setNewChallenge] = useState({ title: "", category: "Challenge", price: "", fileUrl: "", days: "" });

    const [showReflectionModal, setShowReflectionModal] = useState(false);
    const [newReflection, setNewReflection] = useState({ title: "", content: "", image: "", category: "Reflection", readTime: "5 min read" });

    const [fullSiteContent, setFullSiteContent] = useState({});
    const [siteContent, setSiteContent] = useState("");
    const [contentKey, setContentKey] = useState("terms"); // Default to terms

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [pRes, sRes, uRes, cListRes, cHistRes, rRes] = await Promise.all([
                    API.get("/admin/products"),
                    API.get("/admin/stats"),
                    API.get("/admin/users"),
                    API.get("/admin/challenges/list").catch(() => ({ data: [] })),
                    API.get("/admin/challenges").catch(() => ({ data: [] })),
                    API.get("/reflections").catch(() => ({ data: [] }))
                ]);
                setProducts(pRes.data);
                setStats(sRes.data);
                setUsers(uRes.data);
                setChallenges(cListRes.data);
                setChallengeHistory(cHistRes.data);
                setReflections(rRes.data);
            } catch (error) {
                console.error("Admin Fetch Failed", error);
            }
        };
        fetchAdminData();
    }, []);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const { data } = await API.get(`/content`);
                setFullSiteContent(data);
            } catch (err) {
                console.error("Failed to fetch site content");
            }
        };
        fetchContent();
    }, []);

    useEffect(() => {
        if (contentKey === "terms") setSiteContent(fullSiteContent.termsOfService || "");
        if (contentKey === "privacy") setSiteContent(fullSiteContent.privacyPolicy || "");
    }, [contentKey, fullSiteContent]);

    const handleSaveContent = async () => {
        try {
            const payload = {};
            if (contentKey === "terms") payload.termsOfService = siteContent;
            if (contentKey === "privacy") payload.privacyPolicy = siteContent;

            const { data } = await API.put(`/content`, payload);
            setFullSiteContent(data);
            alert("✓ Content saved successfully!");
        } catch (err) {
            alert("Failed to save content");
        }
    };

    const handleLogout = () => {
        logout(); // Relying on the updated AuthContext logout flow which clears localStorage and redirects to '/' 
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post("/admin/products", newProduct);
            setProducts([...products, data]);
            setShowProductModal(false);
            setNewProduct({ title: "", category: "Poster", price: "", fileUrl: "" });
            alert("Product added successfully!");
        } catch (err) {
            alert("Failed to add product");
        }
    };

    const handleAddChallenge = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post("/admin/challenges", {
                ...newChallenge,
                days: parseInt(newChallenge.days)
            });
            setChallenges([...challenges, data]);
            setShowChallengeModal(false);
            setNewChallenge({ title: "", category: "Challenge", price: "", fileUrl: "", days: "" });
            alert("Challenge created successfully!");
        } catch (err) {
            alert("Failed to create challenge");
        }
    };

    const handleAddReflection = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post("/reflections", newReflection);
            setReflections([...reflections, data]);
            setShowReflectionModal(false);
            setNewReflection({ title: "", content: "", image: "", category: "Reflection", readTime: "5 min read" });
            alert("Reflection added successfully!");
        } catch (err) {
            alert("Failed to add reflection");
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this asset?")) {
            try {
                await API.delete(`/admin/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const handleDeleteChallenge = async (id) => {
        if (window.confirm("Are you sure you want to delete this challenge?")) {
            try {
                await API.delete(`/admin/challenges/${id}`);
                setChallenges(challenges.filter(c => c._id !== id));
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const handleDeleteReflection = async (id) => {
        if (window.confirm("Are you sure you want to delete this reflection?")) {
            try {
                await API.delete(`/reflections/${id}`);
                setReflections(reflections.filter(r => r._id !== id));
            } catch (err) {
                alert("Delete failed");
            }
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

    const standardProducts = products.filter(p => !['Challenge', 'Reflection'].includes(p.category));
    // Note: Challenges now come from their own collection in the 'challenges' state.
    // Reflections come from the 'reflections' state.

    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUpdateUserRole = async (id, newRole) => {
        try {
            await API.put(`/admin/users/${id}/role`, { role: newRole });
            setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
            alert(`✓ User role updated to ${newRole}`);
            if (id === user._id) {
                // If admin updates their own role, update local context too
                updateUser({ role: newRole });
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update role");
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to PERMANENTLY delete this user? This action cannot be undone.")) {
            try {
                await API.delete(`/admin/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
                setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
                setShowUserModal(false);
                alert("✓ User deleted successfully");
            } catch (err) {
                alert(err.response?.data?.message || "Failed to delete user");
            }
        }
    };

    return (
        <div className={`min-h-screen ${bgMain} flex flex-col md:flex-row p-6 md:p-10 gap-6 font-sans transition-colors duration-300`}>

            {/* LEFT COLUMN */}
            <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
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

                        <div className={`h-16 w-16 ${isDark ? "bg-slate-700" : "bg-[#2A7B8E]/10"} rounded-full flex items-center justify-center ${isDark ? "text-white" : "text-[#2A7B8E]"} text-2xl font-black mb-3 shrink-0`}>
                            {user?.name?.charAt(0) || "A"}
                        </div>
                        <div>
                            <p className={`font-bold ${textPrimary} text-lg leading-tight uppercase tracking-tight`}>{user?.name || "Admin User"}</p>
                            <p className={`text-xs ${textSecondary} mt-1`}>{user?.email || "admin@rubrikreset.com"}</p>
                        </div>
                    </div>

                    <div className="p-2 space-y-1 mt-2">
                        <NavItem id="inventory" label="Inventory Management" />
                        <NavItem id="sales" label="Sales & Stats" />
                        <NavItem id="challenges" label="Challenge History" />
                        <NavItem id="users" label="User Support" />
                        <NavItem id="legal" label="Privacy & Terms" />
                        <button
                            onClick={handleLogout}
                            className={`w-full text-left px-5 py-3.5 mt-2 rounded-xl ${textSecondary} ${isDark ? "hover:bg-red-500/10 hover:text-red-400" : "hover:bg-red-50 hover:text-[#ef3e36]"} transition-colors font-bold flex justify-between items-center`}
                        >
                            <span className="text-sm">Log Out</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className={`flex-1 ${bgCard} rounded-[2rem] shadow-xl flex flex-col overflow-hidden min-h-[600px] transition-colors duration-300`}>

                <div className={`h-24 px-10 border-b ${borderSecondary} flex items-center justify-between shrink-0`}>
                    <div>
                        <h2 className={`text-2xl font-black ${textPrimary} capitalize tracking-tight`}>{activeTab} Workspace</h2>
                        <p className={`text-xs ${textSecondary} font-medium mt-1 uppercase tracking-widest`}>Manage platform data and configuration</p>
                    </div>
                </div>

                <main className="p-10 flex-1 overflow-y-auto">

                    {activeTab === "inventory" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500">

                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className={`text-lg font-black ${textPrimary} uppercase tracking-tighter`}>Active Digital Assets</h3>
                                    <button onClick={() => setShowProductModal(true)} className="bg-[#ef3e36] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition shadow-sm">
                                        + Create New Product
                                    </button>
                                </div>
                                <div className={`border ${borderSecondary} rounded-2xl overflow-hidden shrink-0`}>
                                    <table className="w-full text-left whitespace-nowrap">
                                        <thead>
                                            <tr className={`${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50/80 text-slate-400"} text-xs uppercase font-black tracking-widest`}>
                                                <th className="p-4">Asset Title</th>
                                                <th className="p-4">Category</th>
                                                <th className="p-4">Price</th>
                                                <th className="p-4">Identifier</th>
                                                <th className="p-4 text-center">Manage</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>
                                            {standardProducts.map(product => (
                                                <tr key={product._id} className={`text-sm ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50/50"} transition-colors`}>
                                                    <td className={`p-4 font-bold ${textPrimary}`}>{product.title}</td>
                                                    <td className="p-4">
                                                        <span className={`${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"} px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider`}>{product.category}</span>
                                                    </td>
                                                    <td className="p-4 font-mono font-bold text-[#ef3e36]">₹{product.price}</td>
                                                    <td className={`p-4 text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-400"} truncate max-w-[200px]`}>{product.fileName}</td>
                                                    <td className="p-4 text-center space-x-4">
                                                        <button onClick={() => handleDeleteProduct(product._id)} className="text-[#ef3e36] font-bold text-xs uppercase tracking-wider hover:underline transition">Remove</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {standardProducts.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className={`p-8 text-center ${textSecondary} font-bold text-sm`}>No regular products available.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <div className={`border-t ${borderSecondary} my-8`}></div>

                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className={`text-lg font-black ${textPrimary} uppercase tracking-tighter`}>Active Challenges</h3>
                                    <button onClick={() => setShowChallengeModal(true)} className="bg-[#2A7B8E] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1f5f6e] transition shadow-sm">
                                        + Create New Challenge
                                    </button>
                                </div>
                                <div className={`border ${borderSecondary} rounded-2xl overflow-hidden shrink-0`}>
                                    <table className="w-full text-left whitespace-nowrap">
                                        <thead>
                                            <tr className={`${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50/80 text-slate-400"} text-xs uppercase font-black tracking-widest`}>
                                                <th className="p-4">Challenge Title</th>
                                                <th className="p-4">Duration</th>
                                                <th className="p-4">Price</th>
                                                <th className="p-4 text-center">Manage</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>
                                            {challenges.map(c => (
                                                <tr key={c._id} className={`text-sm ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50/50"} transition-colors`}>
                                                    <td className={`p-4 font-bold ${textPrimary}`}>{c.title}</td>
                                                    <td className={`p-4 text-xs font-bold ${textSecondary}`}>{c.days ? `${c.days} Days` : "-"}</td>
                                                    <td className="p-4 font-mono font-bold text-[#ef3e36]">₹{c.price}</td>
                                                    <td className="p-4 text-center space-x-4">
                                                        <button onClick={() => handleDeleteChallenge(c._id)} className="text-[#ef3e36] font-bold text-xs uppercase tracking-wider hover:underline transition">Remove</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {challenges.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className={`p-8 text-center ${textSecondary} font-bold text-sm`}>No challenges available.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <div className={`border-t ${borderSecondary} my-8`}></div>

                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className={`text-lg font-black ${textPrimary} uppercase tracking-tighter`}>Reflection Challenges (Blog)</h3>
                                    <button onClick={() => setShowReflectionModal(true)} className="bg-rubrik-red text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition shadow-sm">
                                        + Create New Reflection
                                    </button>
                                </div>
                                <div className={`border ${borderSecondary} rounded-2xl overflow-hidden shrink-0`}>
                                    <table className="w-full text-left whitespace-nowrap">
                                        <thead>
                                            <tr className={`${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50/80 text-slate-400"} text-xs uppercase font-black tracking-widest`}>
                                                <th className="p-4">Title</th>
                                                <th className="p-4">Author</th>
                                                <th className="p-4">Read Time</th>
                                                <th className="p-4 text-center">Manage</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>
                                            {reflections.map(r => (
                                                <tr key={r._id} className={`text-sm ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50/50"} transition-colors`}>
                                                    <td className={`p-4 font-bold ${textPrimary}`}>{r.title}</td>
                                                    <td className={`p-4 text-xs font-bold ${textSecondary}`}>{r.author}</td>
                                                    <td className={`p-4 font-mono font-bold text-[#ef3e36]`}>{r.readTime}</td>
                                                    <td className="p-4 text-center space-x-4">
                                                        <button onClick={() => handleDeleteReflection(r._id)} className="text-[#ef3e36] font-bold text-xs uppercase tracking-wider hover:underline transition">Remove</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {reflections.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className={`p-8 text-center ${textSecondary} font-bold text-sm`}>No reflections available.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === "sales" && (
                        <div className="animate-in fade-in duration-500 max-w-4xl space-y-6">
                            <div className={`${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"} p-8 rounded-[2rem] border flex flex-col sm:flex-row gap-8`}>

                                <div className={`flex-1 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"} p-8 rounded-2xl shadow-sm border text-center`}>
                                    <div className="h-16 w-16 bg-[#2A7B8E]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <span className="text-2xl text-[#2A7B8E]">🚀</span>
                                    </div>
                                    <p className={`text-4xl font-black ${textPrimary}`}>{stats.totalChallengeOrders || 0}</p>
                                    <p className={`text-xs font-black ${textSecondary} uppercase tracking-widest mt-2`}>Challenge Orders</p>
                                </div>

                                <div className={`flex-1 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"} p-8 rounded-2xl shadow-sm border text-center`}>
                                    <div className={`h-16 w-16 ${isDark ? "bg-indigo-500/10" : "bg-indigo-50"} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                                        <span className={`text-2xl ${isDark ? "text-indigo-400" : "text-indigo-500"}`}>👥</span>
                                    </div>
                                    <p className={`text-4xl font-black ${textPrimary}`}>{stats.totalUsers || stats.users || 0}</p>
                                    <p className={`text-xs font-black ${textSecondary} uppercase tracking-widest mt-2`}>Authenticated Users</p>
                                </div>

                                <div className={`flex-1 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"} p-8 rounded-2xl shadow-sm border text-center`}>
                                    <div className={`h-16 w-16 ${isDark ? "bg-green-500/10" : "bg-green-50"} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                                        <span className={`text-2xl ${isDark ? "text-green-400" : "text-green-500"}`}>🛒</span>
                                    </div>
                                    <p className={`text-4xl font-black ${textPrimary}`}>{stats.totalOrders || stats.orders || 0}</p>
                                    <p className={`text-xs font-black ${textSecondary} uppercase tracking-widest mt-2`}>Processed Orders</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "challenges" && (
                        <div className="animate-in fade-in duration-500">
                            <div className={`border ${borderSecondary} rounded-2xl overflow-hidden`}>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className={`${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-400"} text-[10px] uppercase font-black tracking-widest`}>
                                            <th className="p-5">User</th>
                                            <th className="p-5">Challenge</th>
                                            <th className="p-5">Date Registered</th>
                                            <th className="p-5 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>
                                        {challengeHistory.map((c, index) => (
                                            <tr key={index} className={`text-sm ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}>
                                                <td className={`p-5 font-bold ${textPrimary}`}>{c.userName || "Guest"}</td>
                                                <td className={`p-5 font-medium ${textSecondary}`}>{c.challengeTitle}</td>
                                                <td className={`p-5 text-xs font-bold uppercase tracking-widest ${textSecondary}`}>{new Date(c.createdAt || Date.now()).toLocaleDateString()}</td>
                                                <td className="p-5 text-right">
                                                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${c.status === "completed" ? (isDark ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-700") : (isDark ? "bg-red-900/50 text-red-400" : "bg-[#ef3e36]/10 text-[#ef3e36]")}`}>
                                                        {c.status || "Active"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {challengeHistory.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className={`p-8 text-center ${textSecondary} font-bold text-sm`}>No challenge history available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div className="animate-in fade-in duration-500">
                            <div className={`border ${borderSecondary} rounded-2xl overflow-hidden`}>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className={`${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-400"} text-[10px] uppercase font-black tracking-widest`}>
                                            <th className="p-5">Platform User Identity</th>
                                            <th className="p-5">Secure Contact</th>
                                            <th className="p-5 text-right">Management</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>
                                        {users.map(u => (
                                            <tr key={u._id} className={`text-sm ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}>
                                                <td className="p-5 flex items-center gap-4">
                                                    <div className={`h-10 w-10 rounded-full ${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-400"} flex items-center justify-center font-bold text-xs`}>
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold ${textPrimary} uppercase tracking-tight`}>{u.name}</p>
                                                    </div>
                                                </td>
                                                <td className={`p-5 font-medium ${textSecondary}`}>{u.email}</td>
                                                <td className="p-5 text-right">
                                                    <button 
                                                        onClick={() => { setSelectedUser(u); setShowUserModal(true); }}
                                                        className="text-xs font-bold text-[#ef3e36] border border-[#ef3e36] hover:bg-[#ef3e36] hover:text-white px-4 py-2 rounded-lg transition uppercase tracking-widest shadow-sm"
                                                    >
                                                        Manage Access
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className={`p-8 text-center ${textSecondary} font-bold text-sm`}>No users found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "challenges" && (
                        <div className="animate-in fade-in duration-500 max-w-4xl space-y-8">
                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className={`text-lg font-black ${textPrimary} uppercase tracking-tighter`}>Active Challenge History</h3>
                                </div>
                                <div className={`border ${borderSecondary} rounded-2xl overflow-hidden shrink-0`}>
                                    <table className="w-full text-left whitespace-nowrap">
                                        <thead>
                                            <tr className={`${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50/80 text-slate-400"} text-xs uppercase font-black tracking-widest`}>
                                                <th className="p-4">Challenge Title</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4 text-center">Active Users Count</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>
                                            {challengeHistory.map((ch, idx) => (
                                                <tr key={ch._id || idx} className={`text-sm ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50/50"} transition-colors`}>
                                                    <td className={`p-4 font-bold ${textPrimary}`}>{ch.challengeTitle}</td>
                                                    <td className="p-4">
                                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                                                            {ch.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 font-mono font-bold text-[#ef3e36] text-center">
                                                        {ch.activeUsersCount} 
                                                        <span className="text-slate-400 text-xs ml-1 font-sans">users</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {challengeHistory.length === 0 && (
                                                <tr>
                                                    <td colSpan="3" className={`p-8 text-center ${textSecondary} font-bold text-sm`}>No active challenges found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === "legal" && (
                        <div className="animate-in fade-in duration-500 max-w-4xl space-y-8">
                            <div className="flex gap-4">
                                {["terms", "privacy"].map(key => (
                                    <button
                                        key={key}
                                        onClick={() => setContentKey(key)}
                                        className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${contentKey === key ? "bg-[#2A7B8E] text-white shadow-md" : `${isDark ? "bg-slate-800 text-slate-400" : "bg-white text-slate-500 border border-slate-100"}`}`}
                                    >
                                        {key}
                                    </button>
                                ))}
                            </div>
                            <div className={`${bgCard} rounded-[2rem] border ${borderSecondary} p-8 shadow-sm flex flex-col gap-6`}>
                                <div className="flex justify-between items-center">
                                    <h3 className={`text-lg font-black ${textPrimary} uppercase tracking-tighter`}>Editing: {contentKey.replace('-', ' ')}</h3>
                                    <button onClick={handleSaveContent} className="bg-green-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition shadow-sm">
                                        Save Changes
                                    </button>
                                </div>
                                <textarea
                                    value={siteContent}
                                    onChange={(e) => setSiteContent(e.target.value)}
                                    className={`w-full h-80 ${isDark ? "bg-slate-800 text-slate-200" : "bg-slate-50 text-slate-700"} border ${borderSecondary} rounded-2xl p-6 font-medium text-sm focus:ring-2 focus:ring-[#2A7B8E]/20 outline-none transition-all`}
                                    placeholder="Write site content here..."
                                />
                                <p className={`text-[10px] ${textSecondary} font-medium uppercase tracking-[0.1em] italic text-center`}>This content is served live to the respective pages on the website.</p>
                            </div>
                        </div>
                    )}

                </main>
            </div>


            {/* MODALS */}
            {
                showProductModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className={`${bgCard} rounded-[3rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-200 border ${borderSecondary}`}>
                            <h2 className={`text-2xl font-black ${textPrimary} uppercase tracking-tighter mb-8 border-b ${borderSecondary} pb-4`}>NEW DIGITAL ASSET</h2>
                            <form onSubmit={handleAddProduct} className="space-y-6">
                                <div>
                                    <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Product Title</label>
                                    <input type="text" required className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${isDark ? "border-slate-700" : "border-slate-200"} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} value={newProduct.title} onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Price (₹)</label>
                                        <input type="number" required className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${isDark ? "border-slate-700" : "border-slate-200"} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Category</label>
                                        <div className="relative">
                                            <select className={`w-full appearance-none ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${isDark ? "border-slate-700" : "border-slate-200"} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                                <option value="Poster">Poster</option>
                                                <option value="Course">Course</option>
                                                <option value="Template">Template</option>
                                            </select>
                                            <span className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-bold text-lg ${textSecondary}`}>⌄</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Secure Asset Source (URL)</label>
                                    <input type="text" required placeholder="https://..." className={`w-full ${isDark ? "bg-slate-800 text-slate-300" : "bg-[#f8fafc] text-[#64748b]"} border ${isDark ? "border-slate-700" : "border-slate-200"} rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} value={newProduct.fileUrl} onChange={e => setNewProduct({ ...newProduct, fileUrl: e.target.value })} />
                                </div>
                                <div className="flex items-center justify-between pt-8 gap-4 px-2">
                                    <button type="button" onClick={() => setShowProductModal(false)} className={`${textSecondary} text-[11px] font-black uppercase tracking-widest hover:${textPrimary} transition-colors p-4`}>Discard</button>
                                    <button type="submit" className="bg-[#ef3e36] text-white px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-transform">Deploy Asset</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {
                showChallengeModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className={`${bgCard} rounded-[3rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-200 border ${borderSecondary}`}>
                            <h2 className={`text-2xl font-black ${textPrimary} uppercase tracking-tighter mb-8 border-b ${borderSecondary} pb-4`}>NEW CHALLENGE</h2>
                            <form onSubmit={handleAddChallenge} className="space-y-6">
                                <div>
                                    <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Challenge Title</label>
                                    <input type="text" required className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${isDark ? "border-slate-700" : "border-slate-200"} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} value={newChallenge.title} onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Price (₹)</label>
                                        <input type="number" required className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${isDark ? "border-slate-700" : "border-slate-200"} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} value={newChallenge.price} onChange={e => setNewChallenge({ ...newChallenge, price: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Duration (Days)</label>
                                        <input type="number" required placeholder="e.g. 7" className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${isDark ? "border-slate-700" : "border-slate-200"} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} value={newChallenge.days} onChange={e => setNewChallenge({ ...newChallenge, days: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Secure Asset Source (URL)</label>
                                    <input type="text" required placeholder="https://..." className={`w-full ${isDark ? "bg-slate-800 text-slate-300" : "bg-[#f8fafc] text-[#64748b]"} border ${isDark ? "border-slate-700" : "border-slate-200"} rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} value={newChallenge.fileUrl} onChange={e => setNewChallenge({ ...newChallenge, fileUrl: e.target.value })} />
                                </div>
                                <div className="flex items-center justify-between pt-8 gap-4 px-2">
                                    <button type="button" onClick={() => setShowChallengeModal(false)} className={`${textSecondary} text-[11px] font-black uppercase tracking-widest hover:${textPrimary} transition-colors p-4`}>Discard</button>
                                    <button type="submit" className="bg-[#ef3e36] text-white px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-transform">Create Challenge</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {
                showReflectionModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className={`${bgCard} rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in-95 duration-200 border ${borderSecondary} max-h-[90vh] overflow-y-auto`}>
                            <h2 className={`text-2xl font-black ${textPrimary} uppercase tracking-tighter mb-8 border-b ${borderSecondary} pb-4`}>NEW REFLECTION POST</h2>
                            <form onSubmit={handleAddReflection} className="space-y-6">
                                <div>
                                    <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Reflection Title</label>
                                    <input type="text" required className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${isDark ? "border-slate-700" : "border-slate-200"} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} value={newReflection.title} onChange={e => setNewReflection({ ...newReflection, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Post Content (Markdown supported)</label>
                                    <textarea rows="6" required className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${isDark ? "border-slate-700" : "border-slate-200"} rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} value={newReflection.content} onChange={e => setNewReflection({ ...newReflection, content: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Banner Image URL</label>
                                        <input type="text" className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${isDark ? "border-slate-700" : "border-slate-200"} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} value={newReflection.image} onChange={e => setNewReflection({ ...newReflection, image: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-2`}>Read Time (e.g. 5 min)</label>
                                        <input type="text" className={`w-full ${isDark ? "bg-slate-800 text-white" : "bg-[#f8fafc] text-[#0f172a]"} border ${isDark ? "border-slate-700" : "border-slate-200"} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none transition-all shadow-sm`} value={newReflection.readTime} onChange={e => setNewReflection({ ...newReflection, readTime: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-8 gap-4 px-2">
                                    <button type="button" onClick={() => setShowReflectionModal(false)} className={`${textSecondary} text-[11px] font-black uppercase tracking-widest hover:${textPrimary} transition-colors p-4`}>Discard</button>
                                    <button type="submit" className="bg-[#ef3e36] text-white px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-transform">Publish Reflection</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* USER MANAGEMENT MODAL */}
            {
                showUserModal && selectedUser && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className={`${bgCard} rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-200 border ${borderSecondary}`}>
                            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                                <div>
                                    <h2 className={`text-xl font-black ${textPrimary} uppercase tracking-tighter`}>MANAGE USER ACCESS</h2>
                                    <p className={`text-xs ${textSecondary} font-bold mt-1`}>{selectedUser.email}</p>
                                </div>
                                <button onClick={() => setShowUserModal(false)} className={`${textSecondary} hover:${textPrimary} font-bold text-xl`}>×</button>
                            </div>

                            <div className="space-y-8">
                                <section>
                                    <label className={`block text-[11px] font-black ${textSecondary} uppercase tracking-[0.2em] mb-4`}>Current Status: <span className="text-[#ef3e36]">{selectedUser.role}</span></label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => handleUpdateUserRole(selectedUser._id, 'user')}
                                            disabled={selectedUser.role === 'user'}
                                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedUser.role === 'user' ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-800'}`}
                                        >
                                            Downgrade to User
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateUserRole(selectedUser._id, 'admin')}
                                            disabled={selectedUser.role === 'admin'}
                                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedUser.role === 'admin' ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-800'}`}
                                        >
                                            Promote to Admin
                                        </button>
                                    </div>
                                </section>

                                <div className={`border-t ${borderSecondary} pt-6`}>
                                    <h4 className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-4">CRITICAL ZONE</h4>
                                    <button 
                                        onClick={() => handleDeleteUser(selectedUser._id)}
                                        className="w-full py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                    >
                                        Delete User Account
                                    </button>
                                    <p className="text-[9px] text-slate-400 mt-3 text-center italic">Deleting a user removes all their challenge history and downloads.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AdminDashboard;