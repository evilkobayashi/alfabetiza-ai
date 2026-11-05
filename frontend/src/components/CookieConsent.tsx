'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ai_tec_cookie_consent_v2');
    if (!consent) {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleChoice('essential');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show]);

  const handleChoice = (choice: 'essential' | 'all') => {
    localStorage.setItem('ai_tec_cookie_consent_v2', choice);
    localStorage.setItem('ai_tec_cookie_consent_date', new Date().toISOString());
    if (choice === 'essential' && typeof window !== 'undefined') {
      (window as any)['ga-disable-GA_MEASUREMENT_ID'] = true;
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Banner de Consentimento de Cookies e Privacidade LGPD"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 shadow-2xl"
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="text-slate-100 text-xs sm:text-sm leading-relaxed max-w-3xl">
          <p className="font-bold text-white flex items-center gap-2 mb-1">
            <Cookie className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            Controle de Cookies, Privacidade (LGPD) e Transparência
          </p>
          <p className="text-slate-200">
            Utilizamos cookies estritamente essenciais para autenticação segura e funcionamento da sessão. Cookies analíticos são <strong>desativados por padrão</strong> e só são ativados mediante seu consentimento expresso (Opt-In). Não exibimos anúncios e não comercializamos dados. Consulte nossa{' '}
            <Link href="/privacidade" className="text-emerald-400 underline hover:text-emerald-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded">
              Política de Privacidade
            </Link>,{' '}
            <Link href="/cookies" className="text-emerald-400 underline hover:text-emerald-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded">
              Política de Cookies e SDKs
            </Link>,{' '}
            <Link href="/reembolso" className="text-emerald-400 underline hover:text-emerald-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded">
              Política de Reembolso
            </Link>{' '}e{' '}
            <Link href="/termos" className="text-emerald-400 underline hover:text-emerald-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded">
              Termos de Serviço
            </Link>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto justify-end">
          <button
            type="button"
            onClick={() => handleChoice('essential')}
            className="flex-1 lg:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Apenas Essenciais (Rejeitar Opcionais)
          </button>
          <button
            type="button"
            onClick={() => handleChoice('all')}
            className="flex-1 lg:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 border border-emerald-400 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            Aceitar Todos os Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
