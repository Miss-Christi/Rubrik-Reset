import { Star, ArrowRight, Calendar } from 'lucide-react';

// 1. Standard Product Card (Colorful & Rounded)
export const ProductCard = ({ item, showPrice = true }) => {
  return (
    <div className="flex flex-col gap-3 group cursor-pointer h-full">
      {/* Image Container */}
      <div className="bg-gray-100 aspect-[4/5] rounded-2xl flex items-center justify-center relative overflow-hidden shadow-sm group-hover:shadow-xl group-hover:shadow-rubrik-navy/10 transition-all duration-500">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out" 
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-rubrik-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Floating Action Button */}
        <div className="absolute bottom-4 right-4 bg-white text-rubrik-navy p-3 rounded-full shadow-lg translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-rubrik-red uppercase tracking-wider mb-1">{item.category}</p>
            <h3 className="font-bold text-rubrik-navy text-lg leading-tight group-hover:text-rubrik-red transition-colors duration-300">
              {item.title}
            </h3>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
           <div className="flex gap-0.5 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < item.rating ? "fill-current" : "text-gray-300"}`} />
              ))}
           </div>
           
           {showPrice ? (
              <p className="text-sm text-gray-600 font-bold">Rs. {item.price}</p>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-rubrik-navy font-bold bg-gray-100 px-2 py-1 rounded-md">
                <Calendar className="w-3 h-3" />
                <span>{item.duration || "Self-Paced"}</span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

// 2. Blog Card (Colorful & Rounded)
export const BlogCard = ({ post }) => (
  <div className="flex flex-col h-full group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-rubrik-navy/10 transition-all duration-500 border border-gray-100">
    <div className="h-48 overflow-hidden relative">
      <img 
        src={post.image} 
        alt={post.title}
        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
      />
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-rubrik-navy uppercase tracking-wider shadow-sm">
        {post.category}
      </div>
    </div>
    
    <div className="p-6 flex flex-col flex-grow">
      <p className="text-xs font-medium text-gray-400 mb-2">{post.date}</p>
      <h3 className="font-bold text-rubrik-navy text-xl leading-tight mb-3 group-hover:text-rubrik-red transition-colors">
        {post.title}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4">
        {post.excerpt}
      </p>
      <div className="mt-auto flex items-center gap-2 text-xs font-bold text-rubrik-navy uppercase tracking-wide group-hover:gap-3 transition-all">
        Read More <ArrowRight className="w-3 h-3" />
      </div>
    </div>
  </div>
);

// 3. Section Header (Standard Modern)
export const SectionHeader = ({ title, link = "#", lightMode = false }) => (
  <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
    <div className="relative">
       <h2 className={`text-3xl md:text-4xl font-bold ${lightMode ? 'text-white' : 'text-rubrik-navy'} tracking-tight`}>
        {title}
      </h2>
      <div className={`h-1 w-20 mt-3 ${lightMode ? 'bg-white/30' : 'bg-rubrik-red'} rounded-full`}></div>
    </div>
    
    <a href={link} className={`group flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${lightMode ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-rubrik-red'} transition-colors`}>
      View All 
      <span className="bg-gray-100 p-1 rounded-full group-hover:bg-rubrik-red group-hover:text-white transition-all">
        <ArrowRight className="w-4 h-4" />
      </span>
    </a>
  </div>
);