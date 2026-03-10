import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import API from "../api/axios";

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ totalSales: 0, totalUsers: 0, totalOrders: 0 });
    const [users, setUsers] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [activeTab, setActiveTab] = useState("inventory");

    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ title: "", category: "Poster", price: "", fileUrl: "" });

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [pRes, sRes, uRes, cRes] = await Promise.all([
                    API.get("/admin/products"),
                    API.get("/admin/stats"),
                    API.get("/admin/users"),
                    API.get("/admin/challenges")
                ]);
                setProducts(pRes.data);
                setStats(sRes.data);
                setUsers(uRes.data);
                setChallenges(cRes.data);
            } catch (error) {
                console.error("Admin Fetch Failed", error);
            }
        };
        fetchAdminData();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post("/admin/products", newProduct);
            setProducts([...products, data]);
            setShowModal(false);
            setNewProduct({ title: "", category: "Poster", price: "", fileUrl: "" });
            alert("Product added successfully!");
        } catch (err) {
            alert("Failed to add product");
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await API.delete(`/admin/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

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
                    {/* LOGO IMAGE - Path updated to public folder filename */}
                    <div className="bg-white p-3 rounded-xl mb-6 shadow-inner">
                        <img
                            src="/Rubrik_Logo.png"
                            alt="Rubrik Reset Logo"
                            className="h-12 w-auto object-contain"
                        />
                    </div>

                    <div className="text-center">
                        <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black mb-1">Welcome,</p>
                        <p className="text-xl font-black text-[#72c9e0] uppercase leading-tight">
                            {user?.name || "Admin User"}
                        </p>
                    </div>
                </div>

                <nav className="p-6 space-y-4 flex-1">
                    <NavItem id="inventory" label="Inventory Control" />
                    <NavItem id="sales" label="Sales Statistics" />
                    <NavItem id="challenges" label="Challenge History" />
                    <NavItem id="users" label="User Support" />
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <button onClick={logout} className="w-full py-4 bg-slate-800 hover:bg-[#ef3e36] transition-colors rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-sm">
                        Logout System
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="bg-white h-24 shadow-sm flex items-center justify-between px-12 sticky top-0 z-10">
                    <div>
                        <h2 className="font-black text-slate-900 uppercase tracking-tighter text-3xl">
                            {activeTab}
                        </h2>
                        <p className="text-[10px] text-[#ef3e36] font-black uppercase tracking-[0.3em] mt-1">Rubrik Reset Administrative Terminal</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Active</span>
                    </div>
                </header>

                <main className="p-12 space-y-12">

                    {activeTab === "inventory" && (
                        <section className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                    <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg">Active Digital Assets</h3>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="bg-[#ef3e36] text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition shadow-lg shadow-red-100"
                                    >
                                        + Create New Product
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50/50 text-[10px] text-slate-400 uppercase font-black tracking-widest">
                                                <th className="p-6">Asset Title</th>
                                                <th className="p-6">Category</th>
                                                <th className="p-6">Price Point</th>
                                                <th className="p-6">Identifier</th>
                                                <th className="p-6 text-center">Management</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {products.map(product => (
                                                <tr key={product._id} className="text-sm hover:bg-slate-50/50 transition">
                                                    <td className="p-6 font-bold text-slate-800">{product.title}</td>
                                                    <td className="p-6">
                                                        <span className="bg-[#72c9e0]/10 text-[#72c9e0] px-4 py-1.5 rounded-full text-[10px] font-black uppercase">{product.category}</span>
                                                    </td>
                                                    <td className="p-6 font-mono font-black text-[#ef3e36]">₹{product.price}</td>
                                                    <td className="p-6 text-xs text-slate-400 font-medium italic">{product.fileName}</td>
                                                    <td className="p-6 text-center space-x-6">
                                                        <button className="text-[#72c9e0] font-black text-[11px] uppercase tracking-wider hover:text-slate-900 transition">Edit</button>
                                                        <button onClick={() => handleDeleteProduct(product._id)} className="text-[#ef3e36] font-black text-[11px] uppercase tracking-wider hover:underline transition">Remove</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === "sales" && (
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in zoom-in-95 duration-300">
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border-b-8 border-[#72c9e0]">
                                <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.3em] mb-4">Total Gross Revenue</p>
                                <p className="text-5xl font-black text-slate-900">₹{stats.totalSales || stats.sales || 0}</p>
                            </div>
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border-b-8 border-[#ef3e36]">
                                <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.3em] mb-4">Authenticated Users</p>
                                <p className="text-5xl font-black text-slate-900">{stats.totalUsers || stats.users || 0}</p>
                            </div>
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border-b-8 border-slate-900">
                                <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.3em] mb-4">Processed Orders</p>
                                <p className="text-5xl font-black text-slate-900">{stats.totalOrders || stats.orders || 0}</p>
                            </div>
                        </section>
                    )}

                    {activeTab === "challenges" && (
                        <section className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                                <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                                    <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg">User Activity Feed</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50/50 text-[10px] text-slate-400 uppercase font-black tracking-widest">
                                                <th className="p-6">User</th>
                                                <th className="p-6">Challenge</th>
                                                <th className="p-6">Date Registered</th>
                                                <th className="p-6 text-right pr-12">Current Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {challenges.map((c, index) => (
                                                <tr key={index} className="text-sm hover:bg-slate-50/50 transition">
                                                    <td className="p-6 font-black text-slate-800">{c.userName || "Guest"}</td>
                                                    <td className="p-6 text-slate-600 font-bold">{c.challengeTitle}</td>
                                                    <td className="p-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-6 text-right pr-12">
                                                        <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${c.status === "completed" ? "bg-green-100 text-green-600" : "bg-[#ef3e36]/10 text-[#ef3e36]"
                                                            }`}>
                                                            {c.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === "users" && (
                        <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                            <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                                <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg">Platform Directory</h3>
                            </div>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                        <th className="p-6">User Profile</th>
                                        <th className="p-6">Secure Contact</th>
                                        <th className="p-6 text-right pr-12">Administrative Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {users.map(u => (
                                        <tr key={u._id} className="hover:bg-slate-50/50 transition">
                                            <td className="p-6 text-sm font-black text-slate-800 uppercase">{u.name}</td>
                                            <td className="p-6 text-sm text-[#72c9e0] font-bold underline">{u.email}</td>
                                            <td className="p-6 text-right pr-12">
                                                <button className="text-[10px] font-black text-[#ef3e36] border-2 border-[#ef3e36] px-6 py-2 rounded-xl hover:bg-[#ef3e36] hover:text-white transition-all uppercase tracking-widest shadow-sm">
                                                    RESET ACCESS
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}
                </main>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
                        <div className="p-10 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">New Digital Asset</h3>
                        </div>
                        <form onSubmit={handleAddProduct} className="p-10 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Product Title</label>
                                <input type="text" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#72c9e0]/20 focus:border-[#72c9e0] outline-none transition-all" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Price (₹)</label>
                                    <input type="number" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#72c9e0]/20 focus:border-[#72c9e0] outline-none transition-all" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Category</label>
                                    <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#72c9e0]/20 focus:border-[#72c9e0] outline-none transition-all text-slate-900" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} >
                                        <option value="Poster">Poster</option>
                                        <option value="Course">Course</option>
                                        <option value="Template">Template</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Secure Asset Source (URL)</label>
                                <input type="text" required placeholder="https://cloud.storage/asset..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#72c9e0]/20 focus:border-[#72c9e0] outline-none transition-all" value={newProduct.fileUrl} onChange={(e) => setNewProduct({ ...newProduct, fileUrl: e.target.value })} />
                            </div>
                            <div className="flex space-x-6 pt-8">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition">Discard</button>
                                <button type="submit" className="flex-1 px-4 py-4 bg-[#ef3e36] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-200 hover:scale-[1.02] transition-transform">Deploy Asset</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;