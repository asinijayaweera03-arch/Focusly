import { useRef } from 'react';

export function useNotifications() {
  const permissionRef = useRef(Notification.permission);

  const requestPermission = async () => {
    if (permissionRef.current !== 'granted') {
      const result = await Notification.requestPermission();
      permissionRef.current = result;
    }
  };

  const playBell = () => {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type      = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  };

  const notify = (taskTitle) => {
    playBell();
    if (permissionRef.current === 'granted') {
      new Notification('Focusly — session complete! 🎉', {
        body: `Great work on "${taskTitle}". Time to take a break.`,
        icon: '/favicon.ico',
      });
    }
  };

  return { requestPermission, notify };
}