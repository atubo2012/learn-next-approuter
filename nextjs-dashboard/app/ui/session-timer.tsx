'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SessionTimerProps {
  expires: string;
}

export default function SessionTimer({ expires }: SessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!expires) return;

    const interval = setInterval(() => {
      const expiresTime = new Date(expires).getTime();
      const now = Date.now();
      const diff = expiresTime - now;

      if (diff <= 0) {
        setTimeLeft('已过期');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expires]);

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <p className="text-sm font-semibold text-gray-700">实时倒计时:</p>
      <p className="text-lg text-blue-600">{timeLeft || '计算中...'}</p>
      <Link href="/dashboard" className="text-sm text-blue-600">返回</Link>
    </div>
  );
}