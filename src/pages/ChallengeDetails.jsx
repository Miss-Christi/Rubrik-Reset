import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowLeft, BookOpen, CheckCircle, Lock, Trophy } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { getChallengeById, getChallengeProgress, joinChallenge } from "../services/api";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import { FORMATION_CHALLENGES } from "../data";

const ChallengeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [challenge, setChallenge] = useState(null);
    const [days, setDays] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        const fetchChallengeData = async () => {
            try {
                const res = await getChallengeById(id);
                setChallenge(res.data.challenge);
                setDays(res.data.days);

                if (user) {
                    const progRes = await getChallengeProgress(id);
                    setProgress(progRes.data);
                }
            } catch (error) {
                console.error("Failed to load challenge from API. Falling back to static data.");
                const staticChallenge = FORMATION_CHALLENGES.find(c => c.id.toString() === id || c._id === id);
                if (staticChallenge) {
                    setChallenge(staticChallenge);
                    // Mock days from modules if available
                    if (staticChallenge.modules) {
                        const mockDays = staticChallenge.modules.map((mod, index) => ({
                            _id: `mock-${index}`,
                            dayNumber: index + 1,
                            content: { theme: mod.title, reading: mod.description }
                        }));
                        setDays(mockDays);
                    }
                } else {
                    toast.error("Failed to load challenge");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchChallengeData();
    }, [id, user]);

    const handleJoin = async () => {
        if (!user) {
            toast.error("Please login to join the challenge");
            navigate("/login");
            return;
        }
        setJoining(true);
        try {
            await joinChallenge(id);
            toast.success("Successfully joined!");
            const progRes = await getChallengeProgress(id);
            setProgress(progRes.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to join");
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rubrik-navy"></div></div>;
    }

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
                            <div className="md:w-1/3 w-full flex flex-col items-center">
                                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 mb-6">
                                    <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover" />
                                </div>

                                {progress?.joined ? (
                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 w-full text-center border border-white/20">
                                        <p className="text-sm text-white/70 mb-1">Your Progress</p>
                                        <div className="flex items-end justify-center gap-2 mb-2">
                                            <span className="text-3xl font-bold">{progress.userChallenge.totalPoints}</span>
                                            <span className="text-sm mb-1 opacity-70">pts</span>
                                        </div>
                                        <p className="text-sm font-bold text-rubrik-red bg-white/90 rounded-full py-1">Joined & Active</p>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={handleJoin}
                                        disabled={joining}
                                        className="w-full py-4 bg-rubrik-red text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-all text-lg"
                                    >
                                        {joining ? "Joining..." : "Join Challenge"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* DAY BY DAY MODULES */}
                <section className="container mx-auto max-w-4xl px-6 -mt-8 relative z-10 flex flex-col md:flex-row gap-8">
                    {/* Main Content: Days */}
                    <div className="md:w-2/3 bg-white rounded-3xl shadow-xl shadow-rubrik-navy/5 p-8 border border-stone-100">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">Daily Checkpoints</h2>
                            <p className="text-sm font-bold text-gray-500">{days.length} Days</p>
                        </div>

                        <div className="space-y-4 relative">
                            {/* Vertical Line for connection */}
                            <div className="absolute left-[2.25rem] top-8 bottom-8 w-0.5 bg-gray-100 z-0"></div>

                            {days.map((day, idx) => {
                                const isCompleted = progress?.completedDayIds?.includes(day._id);
                                // A day is locked if they haven't joined, or if previous day isn't completed 
                                // (For Nas.io style, usually unlocked day by day or if joined. Let's unlock if joined for simplicity, or day by day).
                                // Let's make it simple: locked if not joined.
                                const isLocked = !progress?.joined;

                                return (
                                    <div
                                        key={day._id}
                                        onClick={() => !isLocked && navigate(`/challenges/${challenge._id}/days/${day._id}`)}
                                        className={`relative z-10 border rounded-2xl p-5 flex items-center justify-between transition-all ${isLocked
                                                ? "bg-gray-50 border-gray-100 opacity-70"
                                                : "bg-white border-stone-200 hover:border-rubrik-navy shadow-sm cursor-pointer hover:shadow-md"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-bold text-lg border-4 ${
                                                isCompleted 
                                                    ? "bg-green-50 border-green-200 text-green-600" 
                                                    : isLocked ? "bg-stone-50 border-stone-100 text-stone-400" : "bg-rubrik-navy/5 border-white text-rubrik-navy"
                                                }`}>
                                                {isCompleted ? <CheckCircle size={20} /> : day.dayNumber}
                                            </div>
                                            <div>
                                                <h3 className={`font-bold text-lg ${isLocked ? "text-gray-500" : "text-rubrik-navy"}`}>
                                                    Day {day.dayNumber}: {day.content?.theme || "Challenge"}
                                                </h3>
                                                <p className="text-sm text-gray-400 mt-1 line-clamp-1">{day.content?.reading}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {isLocked ? (
                                                <Lock className="text-gray-300" size={20} />
                                            ) : isCompleted ? (
                                                <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">Done</span>
                                            ) : (
                                                <button className="text-sm font-bold bg-gray-100 hover:bg-rubrik-navy hover:text-white px-4 py-1.5 rounded-full transition-colors">View</button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {days.length === 0 && (
                                <div className="text-center py-10 text-gray-400">
                                    <p>Daily checkpoints will appear here soon.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Leaderboard Snapshot */}
                    <div className="md:w-1/3">
                        <div className="bg-white rounded-3xl shadow-xl shadow-rubrik-navy/5 p-6 border border-stone-100 sticky top-24">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Trophy className="text-yellow-500" /> Leaderboard
                            </h3>
                            <button 
                                onClick={() => navigate(`/challenges/${challenge._id}/leaderboard`)}
                                className="w-full py-3 bg-stone-50 border border-stone-200 text-rubrik-navy font-bold rounded-xl hover:bg-stone-100 transition-colors"
                            >
                                View Full Leaderboard
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ChallengeDetails;
