
import React, { useState, useEffect } from 'react';
import { Mail, Copy, CheckCircle, Send, Share2, X } from 'lucide-react';

interface EmailReportViewProps {
    type: 'pulsar' | 'ramfa' | 'turno';
}

const EmailReportView: React.FC<EmailReportViewProps> = ({ type }) => {
    const [copied, setCopied] = useState(false);
    const [to, setTo] = useState('');
    const [cc, setCc] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const getDefaults = () => {
        switch (type) {
            case 'turno':
                return {
                    to: 'aeroporto.madeira@psp.pt',
                    cc: 'jmscalcada@psp.pt; nmsaraiva@psp.pt; fronteira.portosanto.pf008@psp.pt; supervisoroperacional.pf008@psp.pt; equipadeapoio.pf008@psp.pt',
                    subject: 'Relatório turno 01MAI2025 - turno 15H30/00H00 - PF008',
                    body: `Bom Dia!

Incumbiu-me o Senhor Comandante em acumulação da Esquadra de Segurança Aeroportuária e Controlo de Fronteira do Porto Santo, Chefe Coordenador Sandra Feitas, de enviar os relatórios em epigrafe para os fins tido por convenientes.

"Uma Polícia das pessoas e para as pessoas: segurança, igualdade, respeito e confiança." - Estratégia PSP 24/26.

Sem outro assunto de momento.
Sandra Freitas
Chefe Coordenador`
                };
            case 'pulsar':
                return {
                    to: 'dtf.dgif@psp.pt',
                    cc: 'jmscalcada@psp.pt; jmcatanho@psp.pt; aeroporto.madeira@psp.pt; nopera.madeira@psp.pt; lmberenguer@psp.pt; nmsaraiva@psp.pt',
                    subject: 'ESACF P. Santo - Relatórios PULSAR-EUROSUR - W06',
                    body: `Bom Dia!

Incumbiu-me o Senhor Comandante da Esquadra de Segurança Aeroportuária e Controlo de Fronteira do Porto Santo, Chefe Coordenador Sandra Feitas, de enviar os relatórios em epigrafe para os fins tido por convenientes.

"Uma Polícia das pessoas e para as pessoas: segurança, igualdade, respeito e confiança." - Estratégia PSP 24/26.

Sem outro assunto de momento.
Sandra Freitas
Chefe Coordenador`
                };
            case 'ramfa':
                return {
                    to: 'dtf.dgif@psp.pt',
                    cc: 'jmscalcada@psp.pt; jmcatanho@psp.pt; aeroporto.madeira@psp.pt; nopera.madeira@psp.pt; lmberenguer@psp.pt; smnunes@psp.pt; nmsaraiva@psp.pt',
                    subject: 'Envio dos relatórios RAMFA; FRAUDE DOCUMENTAL; LISTA DE VOOS E LISTAGEM DE VOOS',
                    body: `Bom Dia!

Incumbiu-me o Senhor Comandante da Esquadra de Segurança Aeroportuária e Controlo de Fronteira do Porto Santo, Chefe Coordenador Sandra Feitas, de enviar os relatórios em epigrafe para os fins tido por convenientes.

"Uma Polícia das pessoas e para as pessoas: segurança, igualdade, respeito e confiança." - Estratégia PSP 24/26.

Sem outro assunto de momento.
Sandra Freitas
Chefe Coordenador`
                };
            default:
                return { to: '', cc: '', subject: '', body: '' };
        }
    };

    // Reset form when type changes
    useEffect(() => {
        const defaults = getDefaults();
        setTo(defaults.to);
        setCc(defaults.cc);
        setSubject(defaults.subject);
        setBody(defaults.body);
    }, [type]);

    const handleCopy = () => {
        const textToCopy = `Para: ${to}\nCc: ${cc}\nAssunto: ${subject}\n\n${body}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Envio de Email</h1>
                    <p className="text-blue-400 font-bold text-sm tracking-wide uppercase">
                        {/* Fix: Handled exhaustive ternary to avoid TypeScript error on 'never' type by removing unreachable toUpperCase() call */}
                        {type === 'turno' ? 'Relatório de Turno' : type === 'pulsar' ? 'Relatório PULSAR-EUROSUR' : type === 'ramfa' ? 'Relatórios RAMFA / FRAUDE' : ''}
                    </p>
                </div>
                <div className="bg-blue-600/10 p-3 rounded-2xl border border-blue-500/20">
                    <Mail className="w-8 h-8 text-blue-500" />
                </div>
            </div>

            <div className="bg-[#131b2e] rounded-[32px] border border-white/5 shadow-2xl overflow-hidden flex flex-col flex-1">
                {/* Email Header Simulation - Editable Fields */}
                <div className="p-6 bg-white/5 border-b border-white/5 space-y-4">
                    <div className="flex items-start gap-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest w-12 pt-2.5">Para:</span>
                        <input 
                            type="text"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="flex-1 bg-black/20 px-3 py-2 rounded-lg text-sm text-blue-300 font-mono border border-transparent focus:border-blue-500/30 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest w-12 pt-2.5">Cc:</span>
                        <input 
                            type="text"
                            value={cc}
                            onChange={(e) => setCc(e.target.value)}
                            className="flex-1 bg-black/20 px-3 py-2 rounded-lg text-xs text-gray-400 font-mono border border-transparent focus:border-blue-500/30 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest w-12 pt-2.5">Ass:</span>
                        <input 
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="flex-1 bg-black/20 px-3 py-2 rounded-lg text-sm text-white font-bold border border-transparent focus:border-blue-500/30 outline-none transition-all"
                            placeholder="Assunto do e-mail..."
                        />
                    </div>
                </div>

                {/* Body Area - Editable Textarea */}
                <div className="p-8 flex-1 bg-black/10 relative flex flex-col">
                    <div className="absolute top-4 right-4 z-10">
                        <button 
                            onClick={handleCopy}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
                        >
                            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'COPIADO!' : 'COPIAR TUDO'}
                        </button>
                    </div>
                    
                    <textarea 
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-gray-300 font-sans leading-relaxed whitespace-pre-wrap outline-none border-none resize-none custom-scrollbar"
                        placeholder="Escreva a redação do e-mail aqui..."
                    />
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        <Share2 className="w-3 h-3" /> Modelo Oficial DSAM-PF008
                    </div>
                    <div className="flex gap-3">
                         <a 
                            href={`mailto:${to}?cc=${cc}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-900/20 active:scale-95"
                        >
                            <Send className="w-4 h-4" />
                            ABRIR NO OUTLOOK
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="h-10"></div>
        </div>
    );
};

export default EmailReportView;
