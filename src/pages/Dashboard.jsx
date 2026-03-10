import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import API from "../api/axios";

const Dashboard = () => {
    const { user, logout, setUser } = useContext(AuthContext);
    const [downloads, setDownloads] = useState([]);
    const [challenges, setChallenges] = useState([]);

    // --- NAVIGATION & UI STATE ---
    const [activeTab, setActiveTab] = useState("downloads");
    const [name, setName] = useState(user?.name || "");
    const [passwords, setPasswords] = useState({ current: "", next: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [dRes, cRes] = await Promise.all([
                    API.get("/user/downloads"),
                    API.get("/user/active-challenges")
                ]);
                setDownloads(dRes.data);
                setChallenges(cRes.data);
            } catch (err) {
                console.error("Error loading dashboard data", err);
            }
        };
        fetchUserData();
    }, []);

    const handleDownload = async (purchaseId) => {
        try {
            await API.get(`/downloads/check/${purchaseId}`);
            window.open(`http://localhost:5000/api/downloads/secure-download/${purchaseId}`, "_blank");
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
            const { data } = await API.put("/profile/update", { name });
            setUser({ ...user, name: data.name });
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

    // Sidebar Navigation Helper
    const NavItem = ({ id, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full text-left p-4 rounded-xl transition-all text-sm font-bold uppercase tracking-tight ${activeTab === id
                    ? "bg-[#ef3e36] text-white shadow-lg shadow-red-900/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-[#72c9e0]"
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar Navigation */}
            <aside className="w-72 bg-slate-900 text-white hidden md:flex flex-col shrink-0 shadow-2xl">
                <div className="p-8 border-b border-slate-800 flex flex-col items-center">
                    <div className="bg-white p-3 rounded-xl mb-6 shadow-inner">
                        <img src="/Rubrik_Logo.png" alt="Logo" className="h-12 w-auto object-contain" />
                    </div>
                    <div className="text-center">
                        <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black mb-1">Welcome,</p>
                        <p className="text-xl font-black text-[#72c9e0] uppercase leading-tight">{user?.name || "Member"}</p>
                    </div>
                </div>

                <nav className="p-6 space-y-4 flex-1">
                    <NavItem id="downloads" label="My Downloads" />
                    <NavItem id="challenges" label="Religious Challenges" />
                    <NavItem id="settings" label="Profile Settings" />
                    <NavItem id="orders" label="Order History" />
                    <NavItem id="wishlist" label="My Wishlist" />
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <button onClick={logout} className="w-full py-4 bg-slate-800 hover:bg-[#ef3e36] transition-colors rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-sm">
                        Logout System
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white h-24 shadow-sm flex items-center justify-between px-12 sticky top-0 z-10">
                    <div>
                        <h2 className="font-black text-slate-900 uppercase tracking-tighter text-3xl">
                            {activeTab.replace("-", " ")}
                        </h2>
                        <p className="text-[10px] text-[#ef3e36] font-black uppercase tracking-[0.3em] mt-1">Rubrik Reset Personal Terminal</p>
                    </div>
                </header>

                <main className="p-12 space-y-12 overflow-y-auto">

                    {/* VIEW: MY DOWNLOADS */}
                    {activeTab === "downloads" && (
                        <section className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg">Acquired Digital Assets</h3>
                                <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-4 py-2 rounded-full border border-amber-100 uppercase tracking-widest">Links expire based on purchase date</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {downloads.length > 0 ? downloads.map((item) => (
                                    <div key={item._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-black text-slate-800 text-lg mb-2">{item.productId?.title || "Digital Product"}</h3>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Attempts: {item.downloadCount} / {item.maxDownloadLimit}</p>
                                        </div>
                                        <button
                                            disabled={item.downloadCount >= item.maxDownloadLimit}
                                            onClick={() => handleDownload(item._id)}
                                            className="w-full py-4 bg-[#72c9e0] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-100 transition hover:scale-[1.02] disabled:bg-slate-200"
                                        >
                                            {item.downloadCount >= item.maxDownloadLimit ? "Limit Reached" : "Download PDF"}
                                        </button>
                                        <p className="mt-4 text-[9px] text-[#ef3e36] font-black text-center uppercase tracking-widest">
                                            Expires: {new Date(item.expiryDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-4 border-dashed border-slate-100">
                                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em]">No purchases found. Explore our shop!</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* VIEW: CHALLENGES */}
                    {activeTab === "challenges" && (
                        <section className="animate-in fade-in slide-in-from-right-8 duration-500 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden p-8">
                            <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg mb-8">Current Religious Challenges</h3>
                            <div className="space-y-4">
                                {challenges.length > 0 ? challenges.map(challenge => (
                                    <div key={challenge.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                            <p className="font-black text-slate-800 uppercase tracking-tight">{challenge.title}</p>
                                            <p className="text-[10px] text-[#72c9e0] font-black uppercase tracking-widest mt-1">Day {challenge.currentDay} of {challenge.totalDays}</p>
                                        </div>
                                        <button className="px-6 py-3 bg-white text-[#72c9e0] border-2 border-[#72c9e0] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#72c9e0] hover:text-white transition">
                                            View Today's Prompt
                                        </button>
                                    </div>
                                )) : <p className="text-slate-400 font-bold uppercase tracking-widest text-center py-10">No active challenges found.</p>}
                            </div>
                        </section>
                    )}

                    {/* VIEW: SETTINGS */}
                    {activeTab === "settings" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in zoom-in-95 duration-300">
                            {/* Profile */}
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-8">Profile Management</h3>
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Display Name</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#72c9e0]/20 focus:border-[#72c9e0] outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Email Address (Secure)</label>
                                        <input type="email" defaultValue={user?.email} disabled className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-400 cursor-not-allowed" />
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full py-4 bg-[#72c9e0] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 transition hover:scale-[1.02] disabled:bg-slate-300">
                                        {loading ? "Processing..." : "Update Credentials"}
                                    </button>
                                </form>
                            </div>

                            {/* Security */}
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-8">Security Protocol</h3>
                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Current System Password</label>
                                        <input type="password" placeholder="••••••••" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">New Access Password</label>
                                        <input type="password" placeholder="••••••••" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#ef3e36]/20 focus:border-[#ef3e36] outline-none" />
                                    </div>
                                    <button type="submit" className="w-full py-4 border-2 border-[#ef3e36] text-[#ef3e36] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ef3e36] hover:text-white transition">
                                        Authorize Password Change
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* PLACEHOLDER VIEWS FOR ORDERS AND WISHLIST */}
                    {activeTab === "orders" && (
                        <div className="py-20 text-center bg-white rounded-[2.5rem] shadow-xl border border-slate-100">
                            <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg mb-4 text-white">Order History Terminal</h3>
                            <p className="text-slate-400 font-bold uppercase tracking-widest">No previous transaction records found.</p>
                        </div>
                    )}

                    {activeTab === "wishlist" && (
                        <div className="py-20 text-center bg-white rounded-[2.5rem] shadow-xl border border-slate-100">
                            <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg mb-4 text-white">Saved Wishlist</h3>
                            <p className="text-slate-400 font-bold uppercase tracking-widest">Your wishlist is currently empty.</p>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default Dashboard;