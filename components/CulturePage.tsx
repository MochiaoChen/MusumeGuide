import React from 'react';
import { Artifact } from '../types';

const artifacts: Artifact[] = [
  {
    id: '1',
    title: '青花瓷',
    category: '陶瓷',
    description: '青花瓷（Blue and white pottery），又称白地青花瓷，常简称青花，中华陶瓷烧制工艺的珍品。是中国瓷器的主流品种之一，属釉下彩瓷。',
    imageUrl: 'https://picsum.photos/400/300?grayscale', // Placeholder
  },
  {
    id: '2',
    title: '丝绸之路',
    category: '历史',
    description: '丝绸之路是古代中国与西方所有政治经济文化往来通道的统称。它不仅是商业贸易路线，更是东西方文化交流的桥梁。',
    imageUrl: 'https://picsum.photos/400/301?blur=2', // Placeholder
  },
  {
    id: '3',
    title: '中国茶道',
    category: '生活',
    description: '中国茶道，是沏茶、赏茶、闻茶、饮茶的美学之道。对外贸易中，茶叶曾是极其重要的出口商品。',
    imageUrl: 'https://picsum.photos/400/302', // Placeholder
  },
  {
    id: '4',
    title: '苏绣',
    category: '工艺',
    description: '苏绣是苏州地区刺绣产品的总称，其发源地在苏州吴县一带，现已遍衍无锡、常州等地。',
    imageUrl: 'https://picsum.photos/400/303', // Placeholder
  }
];

const CulturePage: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-stone-100 pb-20">
      {/* Hero Header */}
      <div className="relative h-64 bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
            src="https://picsum.photos/800/400?grayscale" 
            alt="Chinese Pattern" 
            className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl font-serif font-bold tracking-widest mb-2">中华瑰宝</h2>
            <div className="w-16 h-1 bg-uibe-red mb-4"></div>
            <p className="text-stone-200 text-sm tracking-wider">传承 · 匠心 · 交流</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
            <h3 className="text-2xl font-serif text-ink-black mb-3">文化传承与贸易</h3>
            <p className="text-stone-600 leading-relaxed max-w-2xl mx-auto">
                对外经贸博物馆不仅记录了贸易的数字，更记录了文化的流动。
                每一件商品背后，都承载着中华民族五千年的智慧与审美。
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artifacts.map((item) => (
                <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-uibe-gold group">
                    <div className="h-48 overflow-hidden">
                        <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xl font-bold text-ink-black font-serif">{item.title}</h4>
                            <span className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded">{item.category}</span>
                        </div>
                        <p className="text-stone-600 text-sm leading-relaxed mb-4">
                            {item.description}
                        </p>
                        <button className="text-uibe-red text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                            了解更多 <span>→</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Decorative Quote */}
        <div className="mt-12 p-8 bg-culture-paper rounded-xl border border-stone-200 relative">
             <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-uibe-red text-white px-4 py-1 text-xs tracking-widest rounded-full shadow">
                经贸史话
             </div>
             <p className="text-center font-serif text-lg text-stone-700 italic">
                “丝绸之路不仅是商贸之路，更是东西方文明的对话之路。”
             </p>
        </div>
      </div>
    </div>
  );
};

export default CulturePage;