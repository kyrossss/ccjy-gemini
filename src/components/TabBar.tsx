import React from 'react';
import { Home, Compass, RefreshCw, Calendar, UserCheck } from 'lucide-react';

export type TabKey = 'home' | 'shop' | 'consign' | 'room' | 'member';

interface TabBarProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { key: TabKey; label: string; en: string; icon: React.ReactNode }[] = [
    {
      key: 'home',
      label: '茶邸',
      en: 'HOME',
      icon: <Home className="w-4 h-4" />,
    },
    {
      key: 'shop',
      label: '品物',
      en: 'SHOP',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      key: 'consign',
      label: '流转',
      en: 'MARKET',
      icon: <RefreshCw className="w-4 h-4" />,
    },
    {
      key: 'room',
      label: '茶室',
      en: 'SALON',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      key: 'member',
      label: '茶人',
      en: 'MY',
      icon: <UserCheck className="w-4 h-4" />,
    },
  ];

  return (
    <nav
      aria-label="底部导航"
      className="sticky bottom-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#ECE7DD] py-1.5 px-3 w-full shadow-[0_-4px_16px_rgba(0,0,0,0.03)] shrink-0"
    >
      <div className="grid grid-cols-5 items-center">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`flex flex-col items-center justify-center py-1 transition-all group ${
                isActive ? 'text-[#232B26]' : 'text-[#8E887E] hover:text-[#4A453D]'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-[#232B26] text-[#FAF8F5] scale-105 shadow-xs' : 'group-hover:bg-black/5'
                }`}
              >
                {tab.icon}
              </div>
              <span
                className={`text-[11px] font-oriental-serif mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-[#1E2320]' : 'font-normal'
                }`}
              >
                {tab.label}
              </span>
              <span className="text-[8px] tracking-widest font-mono text-[#A8A296] uppercase scale-90">
                {tab.en}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
