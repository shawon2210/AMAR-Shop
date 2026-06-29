'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-container-margin animate-fade-in-up">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant p-md flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-3xl">install_mobile</span>
        <div className="flex-1 min-w-0">
          <p className="font-title-sm text-title-sm">Install AmarShop</p>
          <p className="text-body-sm text-secondary">Get the best shopping experience</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-sm font-label-bold text-secondary hover:bg-surface-container rounded-lg transition-colors"
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="px-4 py-1.5 text-sm font-label-bold bg-primary text-on-primary rounded-lg hover:brightness-110 transition-all"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
