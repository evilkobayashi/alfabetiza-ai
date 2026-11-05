'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, MailX } from 'lucide-react';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const clean = email.trim().toLowerCase();
    localStorage.setItem('ai_tec_unsubscribed_email', clean);
    try {
      await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean }),
      }).catch(() => {});
    } catch {}
    setSubmitted(true);
  };

  return (
    <main id="main-content" className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10">
        <div className="mb-6">
          <Link href="/" className="text-sm font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded">
            &larr; Voltar para a Página Inicial (Alfabetiza AÍ)
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
            <MailX className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Cancelar Recebimento de E-mails (Unsubscribe)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Descadastramento imediato em 1 clique — Alfabetiza AÍ (Aí Tecnologia)
            </p>
          </div>
        </div>

        {submitted ? (
          <div role="status" className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 my-6">
            <div className="flex items-center gap-2 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
              E-mail descadastrado com sucesso!
            </div>
            <p className="text-sm text-emerald-900">
              O endereço <strong>{email}</strong> foi removido de todas as listas de comunicados, novidades pedagógicas e ofertas da Aí Tecnologia. Você receberá apenas e-mails estritamente transacionais caso solicite redefinição de senha.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 my-6">
            <p className="text-sm text-slate-700 leading-relaxed">
              Respeitamos sua caixa de entrada e sua liberdade de escolha (Zero Spam / Zero Dark Patterns). Informe seu e-mail abaixo para cancelar imediatamente o recebimento de comunicações de marketing ou avisos não essenciais:
            </p>
            <div>
              <label htmlFor="unsubscribe-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Seu Endereço de E-mail
              </label>
              <input
                id="unsubscribe-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com.br"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Confirmar Descadastramento Imediato (Unsubscribe)
            </button>
          </form>
        )}

        <div className="pt-6 border-t border-slate-200 text-xs text-slate-600 space-y-2">
          <p>
            Deseja excluir permanentemente sua conta e todos os seus dados pessoais (Direito ao Esquecimento — Art. 18, VI da LGPD)? Acesse a opção <strong>&ldquo;Excluir Conta / Apagar Meus Dados&rdquo;</strong> dentro do seu perfil na plataforma ou consulte nossa <Link href="/privacidade" className="text-blue-700 underline font-semibold">Política de Privacidade</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
