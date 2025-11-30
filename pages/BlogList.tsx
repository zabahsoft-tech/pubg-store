import React from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

export const BlogList: React.FC = () => {
    const { blogPosts } = useStore();
    return (
        <div className="space-y-8 animate-in fade-in">
             <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white">Latest News</h1>
                <p className="text-gray-400">Updates from the Rahat Pay team</p>
             </div>
             
             {blogPosts.length === 0 ? (
                 <div className="text-center py-20 text-gray-500">Loading articles...</div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map(post => (
                        <Link key={post.id} to={`/blog/${post.id}`} className="group bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-brand-500/50 transition-all hover:shadow-xl hover:shadow-brand-900/10">
                            <div className="aspect-video overflow-hidden">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center text-xs text-gray-500">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {post.date}
                                </div>
                                <h2 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-2">{post.title}</h2>
                                <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
                                <div className="flex items-center text-brand-400 text-sm font-bold pt-2">
                                    Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
             )}
        </div>
    )
}