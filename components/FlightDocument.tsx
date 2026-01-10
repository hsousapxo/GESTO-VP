
import React from 'react';
import { Shield, Check } from 'lucide-react';
import { FlightFormData } from '../types';

const CHECKLIST_ITEMS = [
    "DGVP - GEN DEC",
    "Consulta SIS II",
    "Enviar Email (SOA/OPA/Groundforce)",
    "Controlo Documental Obrigatório",
    "Dispensa de Controlo Documental",
    "Registar Voo na Capa de Registos",
    "Registar: Lista de Voos / Lista Paxs",
    "Elaborar Relatório de Turno",
    "Enviar Relatório por Email",
    "Imprimir Relatório de Tráfego Aéreo"
];

interface FlightDocumentProps {
    flight: FlightFormData;
}

const FlightDocument: React.FC<FlightDocumentProps> = ({ flight }) => {
    return (
        <div className="bg-white text-black font-sans official-document w-[210mm] min-h-[297mm] p-12 mx-auto print:w-full print:p-12 print:m-0">
            {/* FRONT PAGE */}
            <div className="min-h-[26cm] flex flex-col">
                <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-black text-white p-2 rounded">
                            <Shield className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tight">Polícia de Segurança Pública</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Comando Regional da Madeira</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Divisão de Segurança Aeroportuária</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Posto de Fronteira do Porto Santo - PF008</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="bg-gray-100 p-4 rounded border border-gray-300">
                            <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Auto de Controlo n.º / Voo</p>
                            <p className="text-lg font-black">{flight.gesdocNumber || 'PENDENTE'} / {flight.flightNumber || '---'}</p>
                        </div>
                        <p className="text-[10px] mt-2 font-bold text-gray-500 uppercase">Emissão: {new Date().toLocaleDateString('pt-PT')}</p>
                    </div>
                </div>

                <div className="mb-12 text-center">
                    <h2 className="text-2xl font-black uppercase tracking-tighter border-b-2 border-gray-200 pb-2 inline-block px-12 italic">Auto de Controlo de Fronteira</h2>
                </div>

                <div className="mb-10">
                    <h3 className="text-xs font-black uppercase tracking-widest border-b border-black mb-4 pb-1">Informações Gerais</h3>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
                        <div className="flex justify-between border-b border-gray-100 py-1"><b>N.º Voo:</b> <span>{flight.flightNumber}</span></div>
                        <div className="flex justify-between border-b border-gray-100 py-1"><b>Natureza:</b> <span className="font-bold">{flight.flightNature}</span></div>
                        <div className="flex justify-between border-b border-gray-100 py-1"><b>Operador:</b> <span>{flight.operator}</span></div>
                        <div className="flex justify-between border-b border-gray-100 py-1"><b>Estado Global:</b> <span className="uppercase font-bold">{flight.status}</span></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="border-2 border-black p-5 rounded-xl">
                        <h4 className="text-center font-black uppercase text-xs mb-4 bg-gray-100 py-1">Movimento de Chegada ({flight.arrivalRouteType || '---'})</h4>
                        <div className="space-y-2 text-[11px]">
                            <p className="flex justify-between"><b>Origem:</b> <span>{flight.origin}</span></p>
                            <p className="flex justify-between"><b>Registo Voo:</b> <span>{flight.regVPArrival}</span></p>
                            <p className="flex justify-between"><b>Estado:</b> <span className="font-bold uppercase">{flight.arrivalStatus}</span></p>
                            <p className="flex justify-between"><b>Data/Hora:</b> <span>{flight.dateArrival} {flight.scheduleTimeArrival}</span></p>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-center font-bold text-[9px] mb-2 uppercase">Passageiros (POB)</p>
                                <div className="grid grid-cols-3 text-center border border-gray-300">
                                    <div className="border-r border-gray-300 p-1"><b>UE</b><br/>{flight.arrivalUeCount}</div>
                                    <div className="border-r border-gray-300 p-1"><b>NON-UE</b><br/>{flight.arrivalNonSchengenCount}</div>
                                    <div className="p-1"><b>TRIP.</b><br/>{flight.arrivalCrewCount}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-2 border-black p-5 rounded-xl">
                        <h4 className="text-center font-black uppercase text-xs mb-4 bg-gray-100 py-1">Movimento de Partida ({flight.departureRouteType || '---'})</h4>
                        <div className="space-y-2 text-[11px]">
                            <p className="flex justify-between"><b>Destino:</b> <span>{flight.destination}</span></p>
                            <p className="flex justify-between"><b>Registo Voo:</b> <span>{flight.regVPDeparture}</span></p>
                            <p className="flex justify-between"><b>Estado:</b> <span className="font-bold uppercase">{flight.departureStatus}</span></p>
                            <p className="flex justify-between"><b>Data/Hora:</b> <span>{flight.dateDeparture} {flight.scheduleTimeDeparture}</span></p>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-center font-bold text-[9px] mb-2 uppercase">Passageiros (POB)</p>
                                <div className="grid grid-cols-3 text-center border border-gray-300">
                                    <div className="border-r border-gray-300 p-1"><b>UE</b><br/>{flight.departureUeCount}</div>
                                    <div className="border-r border-gray-300 p-1"><b>NON-UE</b><br/>{flight.departureNonSchengenCount}</div>
                                    <div className="p-1"><b>TRIP.</b><br/>{flight.departureCrewCount}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-widest border-b border-black mb-2 pb-1">Observações Operacionais</h3>
                    <div className="border border-gray-300 rounded-lg p-4 min-h-[120px] text-xs italic">
                        {flight.observations || 'Sem observações adicionais.'}
                    </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-20 pb-10">
                    <div className="text-center">
                        <div className="border-b border-black h-12 mb-2"></div>
                        <p className="text-[9px] font-black uppercase text-gray-500">Agente Responsável</p>
                        <p className="text-xs font-bold">{flight.createdBy}</p>
                        <p className="text-[9px] text-gray-400">{flight.createdAt ? new Date(flight.createdAt).toLocaleString() : new Date().toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                        <div className="border-b border-black h-12 mb-2"></div>
                        <p className="text-[9px] font-black uppercase text-gray-500">Visto / Comando</p>
                    </div>
                </div>
            </div>

            {/* VERSO - PAGE 2 */}
            <div style={{ pageBreakBefore: 'always' }} className="flex flex-col min-h-screen pt-12">
                <div className="text-center mb-10">
                    <h2 className="text-xl font-black uppercase tracking-widest border-b-2 border-black pb-2 inline-block px-8 italic">Verso - Protocolo de Checklist Operacional</h2>
                </div>
                <div className="grid grid-cols-2 gap-10">
                    {/* Protocolo Chegada */}
                    <div>
                        <h4 className="font-black uppercase text-[10px] mb-4 bg-gray-100 py-1.5 text-center border border-black">Protocolo Chegada</h4>
                        <table className="w-full text-[9px] border-collapse">
                            <thead>
                                <tr className="border-b border-black bg-gray-50">
                                    <th className="text-left py-2 px-2 uppercase tracking-tighter">Item de Controlo</th>
                                    <th className="text-center py-2 w-16 uppercase tracking-tighter">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CHECKLIST_ITEMS.map((item, i) => (
                                    <tr key={i} className="border-b border-gray-200">
                                        <td className="py-2.5 px-2 font-bold text-gray-700">{item}</td>
                                        <td className="text-center py-2.5">
                                            <div className={`mx-auto w-4 h-4 border border-black flex items-center justify-center ${flight.arrivalChecklist?.[item] ? 'bg-black shadow-inner' : ''}`}>
                                                {flight.arrivalChecklist?.[item] && <Check className="text-white w-3 h-3 stroke-[4]" />}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Protocolo Partida */}
                    <div>
                            <h4 className="font-black uppercase text-[10px] mb-4 bg-gray-100 py-1.5 text-center border border-black">Protocolo Partida</h4>
                            <table className="w-full text-[9px] border-collapse">
                            <thead>
                                <tr className="border-b border-black bg-gray-50">
                                    <th className="text-left py-2 px-2 uppercase tracking-tighter">Item de Controlo</th>
                                    <th className="text-center py-2 w-16 uppercase tracking-tighter">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CHECKLIST_ITEMS.map((item, i) => (
                                    <tr key={i} className="border-b border-gray-200">
                                        <td className="py-2.5 px-2 font-bold text-gray-700">{item}</td>
                                        <td className="text-center py-2.5">
                                            <div className={`mx-auto w-4 h-4 border border-black flex items-center justify-center ${flight.departureChecklist?.[item] ? 'bg-black shadow-inner' : ''}`}>
                                                {flight.departureChecklist?.[item] && <Check className="text-white w-3 h-3 stroke-[4]" />}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-auto pt-10 text-center text-[8px] text-gray-400 uppercase tracking-widest">
                    PF008 - Documento Processado Electronicamente
                </div>
            </div>
        </div>
    );
};

export default FlightDocument;
