import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, CheckCircle, Sparkles, Droplet } from 'lucide-react';
import { zenAudio } from '../utils/audioZen';

interface DailyTeaRitualProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckInSuccess: (earnedPoints: number, earnedTokens: number) => void;
  hasCheckedInToday: boolean;
}

export const DailyTeaRitual: React.FC<DailyTeaRitualProps> = ({
  isOpen,
  onClose,
  onCheckInSuccess,
  hasCheckedInToday,
}) => {
  const [timerSeconds, setTimerSeconds] = useState(8);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTeaType, setSelectedTeaType] = useState<'rock' | 'puer' | 'green' | 'white'>('rock');
  const [checkedIn, setCheckedIn] = useState(hasCheckedInToday);

  // Suggested times per tea
  const teaConfigs = {
    rock: { name: '岩茶老枞水仙', temp: '100°C 鼎沸悬壶', time: 8, quotes: '骨鲠岩香，涤荡尘襟。' },
    puer: { name: '易武古树生普', temp: '98°C 柔水定点', time: 7, quotes: '静默如山，岁月生津。' },
    green: { name: '狮峰明前龙井', temp: '85°C 凉泉中投', time: 25, quotes: '嫩芽初展，天地清明。' },
    white: { name: '荒野白毫银针', temp: '90°C 顺壁轻注', time: 15, quotes: '空谷幽兰，一念清凉。' },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isRunning) {
      setIsRunning(false);
      zenAudio.playZenChime();
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const selectTea = (type: 'rock' | 'puer' | 'green' | 'white') => {
    setSelectedTeaType(type);
    setIsRunning(false);
    setTimerSeconds(teaConfigs[type].time);
  };

  const handleStartTimer = () => {
    zenAudio.playZenChime();
    setIsRunning(true);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimerSeconds(teaConfigs[selectedTeaType].time);
  };

  const handleCheckIn = () => {
    if (checkedIn) return;
    zenAudio.playZenChime();
    setCheckedIn(true);
    onCheckInSuccess(50, 2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-md rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl border border-[#E4DEC9] flex flex-col relative p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#29322D] flex items-center justify-center transition-colors"
          aria-label="关闭点茶仪式"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center space-y-1 mb-5">
          <span className="text-[10px] tracking-widest text-[#847E72] font-mono uppercase">
            MINDFUL TEA RITUAL
          </span>
          <h3 className="font-oriental-serif text-xl font-bold text-[#1F2522] tracking-widest">
            朝夕点茶 · 凝神静虑
          </h3>
          <p className="text-xs text-[#7B7569] font-light italic">
            「{teaConfigs[selectedTeaType].quotes}」
          </p>
        </div>

        {/* Tea Types Selection */}
        <div className="grid grid-cols-4 gap-1.5 mb-5">
          {(['rock', 'puer', 'green', 'white'] as const).map((type) => (
            <button
              key={type}
              onClick={() => selectTea(type)}
              className={`py-2 px-1 rounded-xl text-center text-xs font-oriental-serif border transition-all ${
                selectedTeaType === type
                  ? 'bg-[#232B26] text-white border-[#232B26] shadow-xs'
                  : 'bg-white text-[#635D50] border-[#DED7C8] hover:border-[#232B26]'
              }`}
            >
              {type === 'rock' ? '岩茶' : type === 'puer' ? '普洱' : type === 'green' ? '绿茶' : '白茶'}
            </button>
          ))}
        </div>

        {/* Circular Brewing Timer */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center mb-5">
          {/* Subtle Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#DDD5C2] animate-spin-slow duration-[30000ms]" />
          <div className="w-36 h-36 rounded-full bg-[#F3EFE7] border border-[#DDD5C2] flex flex-col items-center justify-center shadow-inner text-center p-3">
            <span className="text-[10px] text-[#868074] font-oriental-serif block">
              {teaConfigs[selectedTeaType].temp}
            </span>
            <span className="font-mono text-4xl font-light text-[#1F2522] tracking-tighter my-0.5">
              {timerSeconds}s
            </span>
            <span className="text-[10px] text-[#8F733E] font-medium flex items-center gap-1 justify-center">
              <Droplet className="w-3 h-3 text-[#376B8E]" />
              <span>{timerSeconds === 0 ? '即刻分汤' : isRunning ? '茶香渐融' : '静候注水'}</span>
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={isRunning ? () => setIsRunning(false) : handleStartTimer}
            className="px-6 h-10 rounded-full bg-[#232B26] hover:bg-[#181E1A] text-white font-oriental-serif text-xs font-medium tracking-widest flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isRunning ? '暂停浸泡' : timerSeconds === 0 ? '重新注汤' : '注水开泡'}</span>
          </button>
          <button
            onClick={handleResetTimer}
            className="p-2.5 rounded-full border border-[#DCD5C4] hover:bg-white text-[#645E52] transition-colors"
            title="复位计时"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Daily Check-in Action */}
        <div className="pt-4 border-t border-[#ECE7DD] text-center space-y-2">
          <button
            onClick={handleCheckIn}
            disabled={checkedIn}
            className={`w-full h-11 rounded-xl font-oriental-serif text-xs font-semibold tracking-widest flex items-center justify-center gap-2 transition-all ${
              checkedIn
                ? 'bg-[#EBF3ED] text-[#2F6740] cursor-default'
                : 'bg-[#8F733E] hover:bg-[#7D6434] text-white shadow-xs active:scale-[0.98]'
            }`}
          >
            {checkedIn ? (
              <>
                <CheckCircle className="w-4 h-4 text-[#2F6740]" />
                <span>今日点茶已圆满 · 获叶值 +50 嘉叶币 +2</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>点茶圆满 · 签到领50叶值与2嘉叶币</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-[#8C867B] font-light">
            每日修持朝夕点茶，累积叶值提升会员等阶，享私享茶室与寄售折扣。
          </p>
        </div>
      </div>
    </div>
  );
};
