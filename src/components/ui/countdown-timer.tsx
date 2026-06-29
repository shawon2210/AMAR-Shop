'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  variant?: 'default' | 'flash-sale';
  onEnd?: () => void;
}

export function CountdownTimer({ targetDate, variant = 'default', onEnd }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    function calculate() {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setExpired(true);
        onEnd?.();
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onEnd]);

  if (expired) {
    return <span className="text-error font-bold">Sale Ended</span>;
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (variant === 'flash-sale') {
    return (
      <div className="flex gap-sm">
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-sm min-w-[60px] text-center">
          <span className="block font-display-lg-mobile">{pad(timeLeft.hours)}</span>
          <span className="text-[10px] font-label-bold uppercase">Hours</span>
        </div>
        <span className="font-display-lg-mobile self-center">:</span>
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-sm min-w-[60px] text-center">
          <span className="block font-display-lg-mobile">{pad(timeLeft.minutes)}</span>
          <span className="text-[10px] font-label-bold uppercase">Mins</span>
        </div>
        <span className="font-display-lg-mobile self-center">:</span>
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-sm min-w-[60px] text-center">
          <span className="block font-display-lg-mobile">{pad(timeLeft.seconds)}</span>
          <span className="text-[10px] font-label-bold uppercase">Secs</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-xs text-white">
      <span className="bg-inverse-surface rounded px-xs py-[2px] font-bold">{pad(timeLeft.hours)}</span>
      <span className="text-inverse-surface font-bold">:</span>
      <span className="bg-inverse-surface rounded px-xs py-[2px] font-bold">{pad(timeLeft.minutes)}</span>
      <span className="text-inverse-surface font-bold">:</span>
      <span className="bg-inverse-surface rounded px-xs py-[2px] font-bold">{pad(timeLeft.seconds)}</span>
    </div>
  );
}
