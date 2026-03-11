import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowLeft, Trophy, Medal, Star } from "lucide-react";
import { getLeaderboard, getChallengeById } from "../services/api";
import { toast } from "react-toastify";

const ChallengeLeaderboard = () => {
    const { id } = useParams();
    const [leaderboard, setLeaderboard] = useState([]);
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLB = async () => {
            try {
                const chalRes = await getChallengeById(id);
                setChallenge(chalRes.data.challenge);
                
                const lbRes = await getLeaderboard(id);
                setLeaderboard(lbRes.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load leaderboard");
            } finally {
                setLoading(false);
            }
        };
        fetchLB();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rubrik-navy"></div></div>;
    }

    return (
        <div className="font-sans min-h-screen flex flex-col bg-stone-50 text-rubrik-navy">
            <Navbar isMenuOpen={false} setIsMenuOpen={() => {}} onOpenCart={() => {}} />
            
            <main className="flex-grow pt-24 pb-20">
                <div className="container mx-auto max-w-3xl px-6">
                    <Link to={`/challenges/${id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-rubrik-navy mb-8 transition-colors">
                        <ArrowLeft size={16} /> Back to Challenge
                    </Link>

                    <div className="text-center mb-12">
                        <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-inner border border-yellow-200">
                            <Trophy size={40} className="text-yellow-500" />
                        </div>
                        <h1 className="text-4xl font-extrabold mb-2 text-rubrik-navy">Leaderboard</h1>
                        <p className="text-gray-500">{challenge?.title}</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
                        {leaderboard.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                <Star className="mx-auto mb-4 opacity-50" size={48} />
                                <p>No one has scored points yet. Be the first!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {leaderboard.map((entry, idx) => (
                                    <div key={entry._id} className={`flex items-center p-6 transition-colors hover:bg-gray-50 ${idx < 3 ? 'bg-orange-50/30' : ''}`}>
                                        <div className="w-12 h-12 shrink-0 flex items-center justify-center mr-4">
                                            {idx === 0 ? <Medal size={40} className="text-yellow-400 fill-current" /> :
                                             idx === 1 ? <Medal size={36} className="text-gray-400 fill-current" /> :
                                             idx === 2 ? <Medal size={36} className="text-amber-600 fill-current" /> :
                                             <span className="text-xl font-bold text-gray-400">#{idx + 1}</span>}
                                        </div>
                                        
                                        <div className="flex-grow flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg text-rubrik-navy">{entry.user?.name || "Anonymous"}</h3>
                                                <p className="text-xs text-gray-400 font-medium tracking-wide">{entry.completedDays} days completed</p>
                                            </div>
                                            <div className="flex items-end gap-1.5 bg-gray-100 px-4 py-2 rounded-xl">
                                                <span className="text-2xl font-black text-rubrik-red">{entry.totalPoints}</span>
                                                <span className="text-xs font-bold text-gray-400 mb-1">pts</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChallengeLeaderboard;
