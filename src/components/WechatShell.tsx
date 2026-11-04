import React, { useState } from 'react';
import { Smartphone, Monitor, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { zenAudio } from '../utils/audioZen';

interface WechatShellProps {
  children: React.ReactNode;
  activeTab: string;
}

export const WechatShell: React.FC<WechatShellProps> = ({ children }) => {
  const [isMiniProgramFrame, setIsMiniProgramFrame] = useState(true);
  const [isSimmering, setIsSimmering] = useState(false);

  const toggleSound = () => {
    const newState = zenAudio.toggleSimmer();
    setIsSimmering(newState);
    if (newState) {
      zenAudio.playZenChime();
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDE6] text-[#1E2320] flex flex-col items-center justify-start p-0 md:p-6 transition-colors duration-300">
      {/* Top Floating Control Bar (Desktop Utility) */}
      <aside aria-label="视图控制" className="w-full max-w-5xl flex items-center justify-between py-2 px-4 mb-2 text-xs text-[#6F6B62]">
        <div className="flex items-center gap-3">
          <span className="font-oriental-serif tracking-widest text-[#242A27] font-semibold text-sm">
            春城嘉叶 · 东方茶事
          </span>
          <span className="hidden sm:inline text-[#A09A8F]">|</span>
          <span className="hidden sm:inline font-mono tracking-wider text-[11px] uppercase">
            CHUN CHENG JIA YE · WECHAT MINI-PROGRAM
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zen Ambience Sound Switch */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 text-xs ${
              isSimmering
                ? 'bg-[#2E3B33] text-[#E8DFD0] shadow-sm'
                : 'bg-white/80 text-[#545048] hover:bg-white border border-[#E3DEC9]'
            }`}
            title="开启/关闭 禅意炭火茶泉水鸣"
          >
            {isSimmering ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="tracking-tight">{isSimmering ? '水沸声起' : '茶室水沸'}</span>
          </button>

          {/* Switcher: WeChat Frame vs Full Canvas */}
          <div className="flex items-center bg-white/80 p-0.5 rounded-full border border-[#E3DEC9]">
            <button
              onClick={() => setIsMiniProgramFrame(true)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all text-xs ${
                isMiniProgramFrame
                  ? 'bg-[#242A27] text-white shadow-xs'
                  : 'text-[#6F6B62] hover:text-[#242A27]'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>真机小程序</span>
            </button>
            <button
              onClick={() => setIsMiniProgramFrame(false)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all text-xs ${
                !isMiniProgramFrame
                  ? 'bg-[#242A27] text-white shadow-xs'
                  : 'text-[#6F6B62] hover:text-[#242A27]'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>宽屏沉浸</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ease-out flex flex-col ${
          isMiniProgramFrame
            ? 'max-w-[420px] h-[780px] max-h-[calc(100vh-70px)] bg-[#FAF8F5] rounded-[44px] shadow-[0_20px_60px_-15px_rgba(25,28,26,0.22)] border-[9px] border-[#202522] relative overflow-hidden'
            : 'max-w-4xl h-[92vh] bg-[#FAF8F5] rounded-3xl shadow-xl border border-[#E8E4DA] relative overflow-hidden'
        }`}
      >
        {/* WeChat Mini Program Top Status Bar & Capsule (When in Frame Mode) */}
        {isMiniProgramFrame && (
          <header className="shrink-0 bg-[#FAF8F5]/90 backdrop-blur-md pt-3.5 pb-2.5 px-6 flex items-center justify-between select-none border-b border-[#EBE7DC] z-30">
            {/* Left Status Bar Time */}
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-tight text-[#1E2320]">
              <span>09:41</span>
              <Sparkles className="w-2.5 h-2.5 text-[#BFA15F]" />
            </div>

            {/* WeChat Standard Capsule Buttons (··· | ⨀) */}
            <div className="flex items-center bg-black/5 backdrop-blur-md px-3 py-1 rounded-full border border-black/10 text-xs gap-3">
              <button aria-label="小程序更多选项" className="hover:opacity-70 text-[#242A27] tracking-tighter font-mono font-bold">
                ···
              </button>
              <span className="w-[1px] h-3 bg-black/15"></span>
              <button aria-label="关闭小程序" className="w-3 h-3 rounded-full border border-[#242A27] flex items-center justify-center hover:opacity-70">
                <span className="w-1 h-1 rounded-full bg-[#242A27]"></span>
              </button>
            </div>
          </header>
        )}

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {children}
        </div>

        {/* WeChat Home Bar (Bottom Indicator on Frame) */}
        {isMiniProgramFrame && (
          <div className="h-4 bg-[#FAF8F5] flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-[#1E2320]/25 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
