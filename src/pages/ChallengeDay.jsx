import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowLeft, BookOpen, CheckCircle, Quote, Star, UserCircle2 } from "lucide-react";
import { getChallengeById, submitChallengeDay, getChallengeProgress } from "../services/api";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import { FORMATION_CHALLENGES } from "../data";

const ChallengeDay = () => {
    const { id, dayId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [challenge, setChallenge] = useState(null);
    const [dayData, setDayData] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submissionText, setSubmissionText] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getChallengeById(id);
                setChallenge(res.data.challenge);
                
                const currentDay = res.data.days.find(d => d._id === dayId);
                if (!currentDay) {
                    toast.error("Day not found");
                    navigate(`/challenges/${id}`);
                    return;
                }
                setDayData(currentDay);

                if (user) {
                    const progRes = await getChallengeProgress(id);
                    if (!progRes.data.joined) {
                        toast.error("You must join the challenge first");
                        navigate(`/challenges/${id}`);
                        return;
                    }
                    if (progRes.data.completedDayIds?.includes(dayId)) {
                        setIsCompleted(true);
                    }
                } else {
                    toast.error("Please login to view challenge details");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Failed to load from API, falling back to static data.");
                const staticChallenge = FORMATION_CHALLENGES.find(c => c.id.toString() === id || c._id === id);
                if (staticChallenge) {
                    setChallenge(staticChallenge);
                    
                    if (staticChallenge.modules) {
                        const mockDays = staticChallenge.modules.map((mod, index) => ({
                            _id: `mock-${index}`,
                            dayNumber: index + 1,
                            points: 10,
                            content: { theme: mod.title, reading: mod.description, task: "Reflect on this module." }
                        }));
                        const currentDay = mockDays.find(d => d._id === dayId);
                        if (!currentDay) {
                            toast.error("Day not found");
                            navigate(`/challenges/${id}`);
                            return;
                        }
                        setDayData(currentDay);
                        setIsCompleted(false);
                    }
                } else {
                    toast.error("Failed to load");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, dayId, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (dayId && dayId.startsWith("mock-")) {
                setTimeout(() => {
                    setIsCompleted(true);
                    toast.success(`Day ${dayData.dayNumber} completed! +${dayData.points} points. 🏆`);
                    setSubmitting(false);
                }, 500);
                return;
            }
            await submitChallengeDay(id, dayId, submissionText);
            setIsCompleted(true);
            toast.success(`Day ${dayData.dayNumber} completed! +${dayData.points} points. 🏆`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit");
        } finally {
            if (!dayId || !dayId.startsWith("mock-")) setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rubrik-navy"></div></div>;
    }

    return (
        <div className="font-sans min-h-screen flex flex-col bg-stone-50 text-rubrik-navy">
            <Navbar isMenuOpen={false} setIsMenuOpen={() => {}} onOpenCart={() => {}} />

            <main className="flex-grow pt-24 pb-20">
                <div className="container mx-auto max-w-3xl px-6">
                    <Link to={`/challenges/${id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-rubrik-navy mb-8 transition-colors">
                        <ArrowLeft size={16} /> Back to Checkpoints
                    </Link>

                    <header className="mb-10 text-center">
                        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-rubrik-navy/5 text-rubrik-navy rounded-full font-bold text-sm tracking-widest uppercase mb-4">
                            Day {dayData.dayNumber} 
                            <span className="text-rubrik-red bg-white px-2 py-0.5 rounded shadow-sm flex items-center gap-1"><Star size={12} className="fill-current text-yellow-500"/> {dayData.points} pts</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{dayData.content?.theme || "Daily Journey"}</h1>
                    </header>

                    <div className="space-y-8">
                        {dayData.content?.reading && (
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                                <h3 className="flex items-center gap-2 font-bold text-xl mb-4 text-rubrik-red">
                                    <BookOpen size={20} /> Scripture Reading
                                </h3>
                                <p className="text-lg font-medium bg-rubrik-red/5 p-4 rounded-xl text-rubrik-navy/80">{dayData.content.reading}</p>
                            </section>
                        )}

                        {dayData.content?.youcat && (
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                                <h3 className="flex items-center gap-2 font-bold text-xl mb-4 text-rubrik-navy">
                                    <Quote size={20} className="fill-current text-yellow-400" /> YOUCAT Reference
                                </h3>
                                <p className="text-gray-600 leading-relaxed italic">{dayData.content.youcat}</p>
                            </section>
                        )}

                        {dayData.content?.reflection && (
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 text-lg leading-relaxed text-gray-700">
                                <div dangerouslySetInnerHTML={{ __html: dayData.content.reflection }} />
                            </section>
                        )}

                        {dayData.content?.task && (
                            <section className="bg-rubrik-navy text-white p-8 rounded-2xl shadow-xl shadow-rubrik-navy/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                <h3 className="font-bold text-2xl mb-4 flex items-center gap-2"><CheckCircle className="text-green-400" /> Today's Action</h3>
                                <p className="text-lg text-white/90 mb-6">{dayData.content.task}</p>
                            </section>
                        )}

                        {/* Submission Form */}
                        <section className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 mt-12">
                            {isCompleted ? (
                                <div className="text-center py-8">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-100">
                                        <CheckCircle size={40} className="text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-green-600 mb-2">Day Completed!</h3>
                                    <p className="text-gray-500">You've successfully finished today's checkpoint.</p>
                                    <button onClick={() => navigate(`/challenges/${id}`)} className="mt-8 px-6 py-3 bg-gray-100 text-rubrik-navy font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                        Return to Overview
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <h3 className="text-xl font-bold mb-4">Complete Your Day</h3>
                                    <p className="text-sm text-gray-500 mb-6">Write a short reflection or confirmation on today's action (optional) and claim your points.</p>
                                    
                                    <textarea
                                        rows="4"
                                        placeholder="My thoughts on today's reading / confirming task completion..."
                                        className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-rubrik-navy focus:bg-white focus:border-rubrik-red outline-none transition-all mb-6 resize-none"
                                        value={submissionText}
                                        onChange={(e) => setSubmissionText(e.target.value)}
                                        disabled={submitting}
                                    />
                                    
                                    <button 
                                        type="submit" 
                                        disabled={submitting}
                                        className="w-full py-4 bg-rubrik-red text-white font-bold text-lg rounded-xl shadow-lg shadow-rubrik-red/20 hover:bg-red-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={20} />
                                        {submitting ? "Submitting..." : `Mark Day as Completed (+${dayData.points} pts)`}
                                    </button>
                                </form>
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChallengeDay;
