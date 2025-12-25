import React from 'react';

const MuseumIntro: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-white pb-20">
      <div className="p-6">
        <div className="border-l-4 border-uibe-red pl-4 mb-6">
            <h1 className="text-3xl font-bold text-ink-black font-serif">对外经贸博物馆</h1>
            <p className="text-stone-500 mt-1">University of International Business and Economics Museum</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8 aspect-video">
             <img src="https://picsum.photos/800/450?grayscale" alt="UIBE Museum Hall" className="w-full h-full object-cover" />
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                 <h3 className="font-bold text-lg">见证中国开放历程</h3>
             </div>
        </div>

        <div className="prose prose-stone max-w-none">
            <p className="leading-relaxed text-stone-700">
                本博物馆主要展示中国对外贸易发展的历史轨迹，特别是改革开放以来的巨大成就。
                通过珍贵的历史档案、商品实物以及多媒体互动，我们向世界讲述中国经贸故事。
            </p>
            
            <div className="my-6 grid grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-uibe-gold mb-1">1951</div>
                    <div className="text-xs text-stone-500 uppercase">建校年份</div>
                </div>
                <div className="bg-stone-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-uibe-gold mb-1">2000+</div>
                    <div className="text-xs text-stone-500 uppercase">馆藏文物</div>
                </div>
            </div>

            <h3 className="text-xl font-bold text-ink-black mt-8 mb-4">展览特色</h3>
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <span className="text-uibe-red mt-1">▪</span>
                    <span><strong>校史与经贸史结合：</strong> 独具特色的对外经贸大学发展史。</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-uibe-red mt-1">▪</span>
                    <span><strong>广交会记忆：</strong> 历届广交会珍贵实物与照片。</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-uibe-red mt-1">▪</span>
                    <span><strong>中外礼品：</strong> 国际交往中互赠的珍贵礼品展示。</span>
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default MuseumIntro;