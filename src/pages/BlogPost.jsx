import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BLOG_POSTS } from "../data";
import { ArrowLeft, Calendar, Share2, Twitter, Facebook, Linkedin } from "lucide-react";

const BlogPost = () => {
    const { id } = useParams();
    const post = BLOG_POSTS.find((p) => p.id === parseInt(id));

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 text-rubrik-navy">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
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

            <main className="flex-grow pt-24 pb-24">
                <article className="container mx-auto max-w-3xl px-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-rubrik-navy/50 hover:text-rubrik-red mb-10 transition-colors font-medium text-sm">
                        <ArrowLeft size={16} /> Back to Library
                    </Link>

                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-rubrik-red/10 text-rubrik-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                                <Calendar size={14} /> {post.date}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-rubrik-navy mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed font-light">
                            {post.excerpt}
                        </p>
                    </header>

                    <figure className="mb-12 rounded-3xl overflow-hidden shadow-xl shadow-rubrik-navy/5 aspect-[21/9]">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </figure>

                    <div className="prose prose-lg prose-stone max-w-none text-gray-700">
                        {post.content ? (
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        ) : (
                            // Fallback dummy content if none exists
                            <>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <h2>Rebuilding the Foundations</h2>
                                <p>
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                                <blockquote>
                                    "The future belongs to those who return to the essentials."
                                </blockquote>
                                <p>
                                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
                                </p>
                            </>
                        )}
                    </div>

                    {/* SHARE ACTIONS */}
                    <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-gray-500 font-medium">
                            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                <img src="/Rubrik_Logo.png" alt="Author" className="w-full h-full object-cover opacity-80" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-rubrik-navy m-0 leading-tight">Written by</p>
                                <p className="text-sm m-0">Rubrik Reset Team</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-400 mr-2 uppercase tracking-wider flex items-center gap-2">
                                <Share2 size={16} /> Share
                            </span>
                            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-500 hover:text-white transition-colors">
                                <Twitter size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-colors">
                                <Facebook size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-700 hover:text-white transition-colors">
                                <Linkedin size={18} />
                            </button>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
};

export default BlogPost;
