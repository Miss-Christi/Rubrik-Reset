import { useState, useEffect } from "react";
import { getSiteContent } from "../services/api";
import Navbar from "../components/Navbar";

const Legal = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("privacy");

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const { data } = await getSiteContent();
                setContent(data);
            } catch (error) {
                console.error("Failed to fetch legal content");
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rubrik-red"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 text-rubrik-navy font-sans flex flex-col">
            <Navbar isMenuOpen={false} setIsMenuOpen={() => {}} onOpenCart={() => {}} />

            <div className="flex-grow container mx-auto px-6 py-24 mb-10 max-w-4xl">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full border border-rubrik-red/20 bg-rubrik-red/5 text-rubrik-red text-xs font-bold uppercase tracking-widest mb-6">
                        Legal Information
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-rubrik-navy mb-4 tracking-tight">
                        Privacy & Terms
                    </h1>
                    <p className="text-stone-500 font-medium max-w-2xl mx-auto">
                        We are committed to transparency and clarity regarding your data and usage terms.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-12">
                    <button
                        onClick={() => setActiveTab("privacy")}
                        className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                            activeTab === "privacy"
                                ? "bg-rubrik-navy text-white shadow-lg"
                                : "bg-white text-stone-500 hover:bg-stone-100 hover:text-rubrik-navy border border-stone-200"
                        }`}
                    >
                        Privacy Policy
                    </button>
                    <button
                        onClick={() => setActiveTab("terms")}
                        className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                            activeTab === "terms"
                                ? "bg-rubrik-navy text-white shadow-lg"
                                : "bg-white text-stone-500 hover:bg-stone-100 hover:text-rubrik-navy border border-stone-200"
                        }`}
                    >
                        Terms of Service
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white p-10 md:p-16 rounded-[2rem] shadow-sm border border-stone-100 min-h-[500px]">
                    {activeTab === "privacy" && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-black mb-8 text-rubrik-navy border-b border-stone-100 pb-4">
                                Privacy Policy
                            </h2>
                            <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed font-medium whitespace-pre-wrap">
                                {content?.privacyPolicy || "We value your privacy. Content is currently being updated."}
                            </div>
                        </div>
                    )}

                    {activeTab === "terms" && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-black mb-8 text-rubrik-navy border-b border-stone-100 pb-4">
                                Terms of Service
                            </h2>
                            <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed font-medium whitespace-pre-wrap">
                                {content?.termsOfService || "By using our platform, you agree to our terms. Content is currently being updated."}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-stone-200 py-10 mt-auto text-center">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    &copy; 2026 Rubrik Reset &bull; Digital Ecosystem
                </p>
            </footer>
        </div>
    );
};

export default Legal;
