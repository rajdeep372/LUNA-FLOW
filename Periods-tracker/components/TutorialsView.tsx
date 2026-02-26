import React, { useState } from 'react';
import { PlayCircle, HeartPulse, Apple, Sparkles, BookOpen } from 'lucide-react';

// Categories for our filtering tabs
type Category = 'All' | 'Pain Relief' | 'Diet & Nutrition' | 'Hygiene';

// Curated list of educational videos
const TUTORIAL_VIDEOS = [
  {
    id: '1',
    title: '5 Yoga Poses for Severe Menstrual Cramps',
    category: 'Pain Relief',
    embedId: 'v7AYKMP6rOE', // You can replace these with your preferred YouTube video IDs
    duration: '23mins 45sec',
    description: 'Gentle stretches to relieve lower back pain and pelvic cramps.',
  },
  {
    id: '2',
    title: 'Foods to Eat & Avoid During Your Period',
    category: 'Diet & Nutrition',
    embedId: 'E-8gvJlkY8c',
    duration: '2mins 32sec',
    description: 'Learn which nutrients help reduce bloating and mood swings.',
  },
  {
    id: '3',
    title: 'Complete Guide to Menstrual Hygiene',
    category: 'YIoA6n0ULIU',
    embedId: 'j8eB-tI_D9c',
    duration: '15 mins',
    description: 'Best practices for using pads, tampons, and menstrual cups safely.',
  },
  {
    id: '4',
    title: 'Home Remedies for Period Pain',
    category: 'Pain Relief',
    embedId: 'LIsYbDCMfDc',
    duration: '2mins 32sec',
    description: 'Natural ways to soothe cramps using heat pads and herbal teas.',
  }
];

const TutorialsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category>('All');

  // Filter videos based on the selected tab
  const filteredVideos = TUTORIAL_VIDEOS.filter(video => 
    activeTab === 'All' ? true : video.category === activeTab
  );

  const tabs: { name: Category; icon: React.ReactNode }[] = [
    { name: 'All', icon: <BookOpen size={16} /> },
    { name: 'Pain Relief', icon: <HeartPulse size={16} /> },
    { name: 'Diet & Nutrition', icon: <Apple size={16} /> },
    { name: 'Hygiene', icon: <Sparkles size={16} /> },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[75vh] flex flex-col animate-in fade-in zoom-in duration-300">
      
      {/* Header Section */}
      <div className="p-8 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-white">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-2">
          <PlayCircle className="text-indigo-500" size={28} />
          Wellness Hub
        </h2>
        <p className="text-slate-500">Curated video guides for your menstrual health and daily comfort.</p>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mt-6">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === tab.name 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="p-8 flex-1 bg-slate-50/30 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              
              {/* YouTube iFrame Embed */}
              <div className="aspect-video w-full bg-slate-900 relative">
                <iframe
                  src={`https://www.youtube.com/embed/${video.embedId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full border-0"
                ></iframe>
              </div>

              {/* Video Details */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
                    {video.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                    {video.duration}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <BookOpen size={48} className="mb-4 opacity-50" />
            <p className="font-medium">No tutorials found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialsView;