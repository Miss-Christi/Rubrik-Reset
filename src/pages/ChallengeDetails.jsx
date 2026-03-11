import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FORMATION_CHALLENGES } from "../data";
import { ArrowLeft, BookOpen, CheckCircle, Lock } from "lucide-react";

const ChallengeDetails = () => {
    const { id } = useParams();
    const challenge = FORMATION_CHALLENGES.find((c) => c.id === parseInt(id));

    if (!challenge) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 text-rubrik-navy">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Challenge Not Found</h2>
                    <Link to="/" className="text-rubrik-red hover:underline">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="font-sans min-h-screen flex flex-col bg-stone-50 text-rubrik-navy selection:bg-rubrik-red selection:text-white">
            <Navbar isMenuOpen={false} setIsMenuOpen={() => { }} onOpenCart={() => { }} />

            <main className="flex-grow pb-24">
                {/* HERO SECTION */}
                <header className="bg-rubrik-navy text-white pt-32 pb-16 px-6">
                    <div className="container mx-auto max-w-5xl">
                        <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>

                        <div className="flex flex-col md:flex-row gap-10 items-start">
                            <div className="md:w-2/3">
                                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                                    {challenge.category}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                                    {challenge.title}
                                </h1>
                                <p className="text-lg text-white/80 leading-relaxed mb-6">
                                    {challenge.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    <span className="flex items-center gap-1.5 bg-rubrik-red/20 text-rubrik-red px-3 py-1.5 rounded-lg border border-rubrik-red/30">
                                        <BookOpen size={16} /> {challenge.duration}
                                    </span>
                                </div>
                            </div>
                            <div className="md:w-1/3 w-full">
                                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                                    <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* MODULES / NAS.IO STYLE COURSE CURRICULUM */}
                <section className="container mx-auto max-w-4xl px-6 -mt-8 relative z-10">
                    <div className="bg-white rounded-3xl shadow-xl shadow-rubrik-navy/5 p-8 border border-stone-100">
                        <h2 className="text-2xl font-bold mb-8">Course Curriculum</h2>

                        <div className="space-y-4">
                            {challenge.modules?.map((module, idx) => (
                                <div
                                    key={idx}
                                    className={`border rounded-2xl p-5 flex items-center justify-between transition-all ${module.locked
                                            ? "bg-gray-50 border-gray-100 opacity-70"
                                            : "bg-white border-stone-200 hover:border-rubrik-navy shadow-sm cursor-pointer hover:shadow-md"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${module.locked ? "bg-gray-200 text-gray-400" : "bg-rubrik-navy text-white"
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-lg ${module.locked ? "text-gray-500" : "text-rubrik-navy"}`}>
                                                {module.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{module.description}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {module.locked ? (
                                            <Lock className="text-gray-300" size={24} />
                                        ) : (
                                            <CheckCircle className="text-green-500" size={24} />
                                        )}
                                    </div>
                                </div>
                            ))}

                            {(!challenge.modules || challenge.modules.length === 0) && (
                                <div className="text-center py-10 text-gray-400">
                                    <p>Curriculum modules will strictly appear here soon.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ChallengeDetails;
