
import React, { useState } from 'react';
import { 
    Shield, 
    Bot, 
    Camera, 
    PlusCircle, 
    List, 
    ClipboardList, 
    LineChart, 
    BarChart, 
    Phone, 
    Bell, 
    Calendar, 
    LogOut, 
    FolderOpen, 
    BookOpen, 
    FileText, 
    Files, 
    CalendarDays, 
    CalendarRange, 
    BellRing, 
    ChevronDown, 
    ChevronRight, 
    Cpu, 
    Briefcase, 
    PieChart, 
    Users, 
    Radar,
    Globe,
    Scan,
    Siren,
    ArrowLeftRight,
    Stamp,
    CreditCard,
    GraduationCap,
    FlaskConical,
    MonitorPlay,
    PanelLeftClose,
    PanelLeftOpen,
    CloudSun,
    PlaneTakeoff,
    PlaneLanding,
    Archive,
    BarChart3,
    AlertTriangle,
    History,
    Activity,
    FileSpreadsheet,
    Layers,
    Library,
    FileWarning,
    Hand,
    ClipboardCheck,
    Mail,
    Baby,
    ShieldAlert,
    UserX,
    ClipboardEdit,
    Hash,
    Smartphone,
    ExternalLink,
    Lock,
    ShieldCheck,
    Plane
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
    isOpen: boolean;
    currentView: ViewState;
    onChangeView: (view: ViewState) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentView, onChangeView, onLogout }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    const openExternalLink = (url: string) => {
        window.open(url, '_blank');
    };

    const handleExpand = () => {
        if (isCollapsed) setIsCollapsed(false);
    };

    return (
        <div 
            className={`fixed inset-y-0 left-0 bg-primary dark:bg-[#112240] text-white transform transition-all duration-300 z-50 shadow-xl lg:translate-x-0 lg:static 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            ${isCollapsed ? 'lg:w-20' : 'lg:w-[260px]'} w-[260px]`}
        >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between h-[81px]">
                <div 
                    className={`flex items-center gap-2 cursor-pointer transition-all ${isCollapsed ? 'justify-center w-full' : ''}`}
                    onClick={() => onChangeView('dashboard')}
                    title="Ir para Dashboard"
                >
                    <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    {!isCollapsed && (
                        <div className="overflow-hidden whitespace-nowrap">
                            <h2 className="text-lg font-bold leading-none tracking-tight">GESTO VP</h2>
                            <p className="text-[10px] text-blue-300 font-bold tracking-wider">ESACFPS / DSAM - PF008</p>
                        </div>
                    )}
                </div>
                
                {!isCollapsed && (
                    <button 
                        onClick={() => setIsCollapsed(true)}
                        className="hidden lg:block text-gray-400 hover:text-white transition-colors"
                        title="Recolher menu"
                    >
                        <PanelLeftClose className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto py-5 custom-scrollbar h-[calc(100vh-81px)]">
                
                {/* GS PF008 Section */}
                <MenuSection title="GS PF008" icon={<FolderOpen className="w-4 h-4 text-yellow-500" />} defaultOpen={true} isCollapsed={isCollapsed} onExpand={handleExpand}>
                    
                    {/* Folder: APP PF008 */}
                    <SubMenu label="APP PF008" icon={<Smartphone className="w-4 h-4 text-blue-400" />} isCollapsed={isCollapsed}>
                        {/* New Nested Folder: APP PF */}
                        <SubMenu label="APP PF" icon={<Layers className="w-3.5 h-3.5 text-blue-300" />} isCollapsed={isCollapsed}>
                            <MenuItem 
                                icon={<Lock className="w-3 h-3" />} 
                                label="SISII" 
                                onClick={() => openExternalLink('https://sis2.rnsi.local/SchengenII/faces/pages/index.jspx')}
                                isCollapsed={isCollapsed}
                                isSmall
                                className="!border-l-0 text-orange-300"
                            />
                            <MenuItem 
                                icon={<Globe className="w-3 h-3" />} 
                                label="Portal Fronteiras" 
                                onClick={() => openExternalLink('https://portalfronteiras.ssi.local/')}
                                isCollapsed={isCollapsed}
                                isSmall
                                className="!border-l-0 text-blue-300"
                            />
                            <MenuItem 
                                icon={<Plane className="w-3 h-3" />} 
                                label="Portal Voos Privados" 
                                onClick={() => openExternalLink('https://portalfronteiras.ssi.local/aplicacoes/voos-privados')}
                                isCollapsed={isCollapsed}
                                isSmall
                                className="!border-l-0 text-sky-300"
                            />
                            <MenuItem 
                                icon={<ShieldCheck className="w-3 h-3" />} 
                                label="PASSE+" 
                                onClick={() => openExternalLink('https://iam.ssi.local/realms/realm-scf/protocol/openid-connect/auth?client_id=client-scf-frontend&redirect_uri=https%3A%2F%2Fpasse.ssi.local%2Fapp&state=af052487-53a8-4e75-a0c5-304edca79254&response_mode=fragment&response_type=code&scope=openid&nonce=bf881dee-1ef6-41d9-ad18-081a2897639f')}
                                isCollapsed={isCollapsed}
                                isSmall
                                className="!border-l-0 text-green-300"
                            />
                            <MenuItem 
                                icon={<Cpu className="w-3 h-3" />} 
                                label="PRISMA" 
                                onClick={() => openExternalLink('https://iam.ssi.local/realms/realm-prisma/protocol/saml/clients/client-prisma-app?SAMLRequest=fJJfT4MwFMW%2FCul7geLGXDNIcIuRZFMy0AdfTAfFNSkt9hb%2FfHsrbMl80KcmN%2Bfc87snXQHrZE%2BzwR7Vnr8NHKyXbxL0EkfLebRsQkxIuMCz%2BXKGD019wPO4XSwIiVtSx8h74gaEVgmK%2FBB5OcDAcwWWKetGYRTjkOBwWZFrehXSkDwjrzDa6lrLG6EaoV4TNBhFNQMBVLGOA7U1LbPdlrqN9DCJgN5VVYGLh7JCXgbAjXWha61g6LgpuXkXNX%2FcbxN0tLYHGgS9EdAxH0D4UtdMBsU%2BL3dZULprg5MReZ%2BdVEDHBv7n6E%2FQKF39qOl4qLnw%2F29nZ2SUngEF6y7oDGeyg%2BnBE%2FsquEiaYnt671bnm0JLUX95t9p0zPX8VzLxyTgRDW5HKR0U9LwWreCN61FK%2FbF2kZYnyJrB9RGkU%2Brv%2F5B%2BAwAA%2F%2F8DAA%3D%3D')}
                                isCollapsed={isCollapsed}
                                isSmall
                                className="!border-l-0 text-purple-300"
                            />
                        </SubMenu>

                        <MenuItem 
                            icon={<Bot className="w-3.5 h-3.5" />} 
                            label="IA Assistant" 
                            active={currentView === 'ai-assistant'} 
                            onClick={() => onChangeView('ai-assistant')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<Camera className="w-3.5 h-3.5" />} 
                            label="Editor de Imagem IA" 
                            active={currentView === 'ai-image-editor'} 
                            onClick={() => onChangeView('ai-image-editor')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<Radar className="w-3.5 h-3.5" />} 
                            label="Radar de Voos" 
                            active={currentView === 'flight-tracker'} 
                            onClick={() => onChangeView('flight-tracker')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                    </SubMenu>

                    {/* Folder: Modelos e Formulários */}
                    <SubMenu label="Modelos e Formulários" icon={<Files className="w-4 h-4 text-blue-400" />} isCollapsed={isCollapsed}>
                        <MenuItem 
                            icon={<FileText className="w-3.5 h-3.5" />} 
                            label="Modelos Infocest" 
                            active={currentView === 'template-infocest'} 
                            onClick={() => onChangeView('template-infocest')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<Stamp className="w-3.5 h-3.5" />} 
                            label="Modelo Carimbos" 
                            active={currentView === 'template-carimbos'} 
                            onClick={() => onChangeView('template-carimbos')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<ClipboardCheck className="w-3.5 h-3.5" />} 
                            label="Modelo Declaração de Entrada" 
                            active={currentView === 'template-decl-entrada'} 
                            onClick={() => onChangeView('template-decl-entrada')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<Hand className="w-3.5 h-3.5" />} 
                            label="Modelo Interceções" 
                            active={currentView === 'template-intercecoes'} 
                            onClick={() => onChangeView('template-intercecoes')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<FileWarning className="w-3.5 h-3.5" />} 
                            label="Modelo Abandono Voluntário" 
                            active={currentView === 'template-notif-abandono'} 
                            onClick={() => onChangeView('template-notif-abandono')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<Layers className="w-3.5 h-3.5 opacity-50" />} 
                            label="Ver Todos" 
                            active={currentView === 'templates'} 
                            onClick={() => onChangeView('templates')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                    </SubMenu>
                    
                    {/* Folder: Leg PF008 */}
                    <SubMenu label="Leg PF008" icon={<BookOpen className="w-4 h-4 text-blue-400" />} isCollapsed={isCollapsed}>
                        <MenuItem 
                            icon={<Library className="w-3.5 h-3.5" />} 
                            label="Livraria Jurídica" 
                            active={currentView === 'legal-library'} 
                            onClick={() => onChangeView('legal-library')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<FileText className="w-3.5 h-3.5" />} 
                            label="Diplomas Legais" 
                            active={currentView === 'legislation'} 
                            onClick={() => onChangeView('legislation')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                    </SubMenu>

                    {/* Folder: Procedimentos */}
                    <SubMenu label="Procedimentos" icon={<ClipboardList className="w-4 h-4 text-blue-400" />} isCollapsed={isCollapsed}>
                        <MenuItem 
                            icon={<Baby className="w-3.5 h-3.5" />} 
                            label="Menores" 
                            active={currentView === 'proc-menores'} 
                            onClick={() => onChangeView('proc-menores')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<Mail className="w-3.5 h-3.5" />} 
                            label="Envio de Emails" 
                            active={currentView === 'proc-emails'} 
                            onClick={() => onChangeView('proc-emails')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<ShieldAlert className="w-3.5 h-3.5" />} 
                            label="Interceções" 
                            active={currentView === 'proc-intercecoes'} 
                            onClick={() => onChangeView('proc-intercecoes')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        
                        {/* Nested SubMenu: Códigos de Interceção */}
                        <SubMenu label="Códigos de Interceção" icon={<Hash className="w-3.5 h-3.5 text-orange-400" />} isCollapsed={isCollapsed}>
                             <div className="grid grid-cols-3 gap-1 pr-2">
                                {[...Array(23)].map((_, i) => (
                                    <MenuItem 
                                        key={i}
                                        icon={<span className="text-[10px] font-bold">{i + 1}</span>} 
                                        label={`${i + 1}`} 
                                        active={currentView === 'proc-cod-intercecao'} 
                                        onClick={() => onChangeView('proc-cod-intercecao')} 
                                        isCollapsed={isCollapsed}
                                        isSmall
                                        className="!border-l-0 bg-white/5 hover:bg-white/10 rounded justify-center"
                                    />
                                ))}
                             </div>
                        </SubMenu>

                        <MenuItem 
                            icon={<FileWarning className="w-3.5 h-3.5" />} 
                            label="Extravio Passaporte" 
                            active={currentView === 'proc-extravio'} 
                            onClick={() => onChangeView('proc-extravio')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<UserX className="w-3.5 h-3.5" />} 
                            label="Recusa de Entrada" 
                            active={currentView === 'proc-recusa'} 
                            onClick={() => onChangeView('proc-recusa')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<ClipboardEdit className="w-3.5 h-3.5" />} 
                            label="Declaração Entrada" 
                            active={currentView === 'proc-decl-entrada'} 
                            onClick={() => onChangeView('proc-decl-entrada')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<ClipboardList className="w-3.5 h-3.5 opacity-50" />} 
                            label="Todos os SOPs" 
                            active={currentView === 'procedures'} 
                            onClick={() => onChangeView('procedures')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                    </SubMenu>
                </MenuSection>

                {/* Registo de Voos */}
                <MenuSection title="Registo de Voos" icon={<Briefcase className="w-4 h-4 text-red-500" />} isCollapsed={isCollapsed} onExpand={handleExpand}>
                    <MenuItem icon={<Radar />} label="Radar de Voos" active={currentView === 'flight-tracker'} onClick={() => onChangeView('flight-tracker')} isCollapsed={isCollapsed} />
                    <MenuItem icon={<PlusCircle />} label="Novo Voo" active={currentView === 'flight-form'} onClick={() => onChangeView('flight-form')} isCollapsed={isCollapsed} />
                    <MenuItem icon={<List />} label="Voos Agendados" active={currentView === 'flight-list'} onClick={() => onChangeView('flight-list')} isCollapsed={isCollapsed} />
                    <MenuItem icon={<Archive />} label="Arquivo Voos" active={currentView === 'flight-archive'} onClick={() => onChangeView('flight-archive')} isCollapsed={isCollapsed} />
                </MenuSection>

                {/* Estatísticas Section */}
                <MenuSection title="Estatísticas" icon={<BarChart3 className="w-4 h-4 text-blue-500" />} defaultOpen={true} isCollapsed={isCollapsed} onExpand={handleExpand}>
                    
                    {/* Folder: Estatística Semanal */}
                    <SubMenu label="Estatística Semanal" icon={<LineChart className="w-4 h-4 text-blue-400" />} isCollapsed={isCollapsed}>
                        <MenuItem 
                            icon={<Activity className="w-3.5 h-3.5" />} 
                            label="Análise Fluxo Semanal" 
                            active={currentView === 'statistics-weekly'} 
                            onClick={() => onChangeView('statistics-weekly')} 
                            isCollapsed={isCollapsed} 
                            isSmall
                        />
                    </SubMenu>

                    {/* Folder: Estatística Mensal */}
                    <SubMenu label="Estatística Mensal" icon={<PieChart className="w-4 h-4 text-blue-400" />} isCollapsed={isCollapsed}>
                        <MenuItem 
                            icon={<BarChart className="w-3.5 h-3.5" />} 
                            label="Consolidado Mensal" 
                            active={currentView === 'statistics-monthly'} 
                            onClick={() => onChangeView('statistics-monthly')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<CalendarRange className="w-3.5 h-3.5 opacity-50" />} 
                            label="Comparativo Anual" 
                            active={currentView === 'statistics-annual'} 
                            onClick={() => onChangeView('statistics-annual')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                    </SubMenu>

                    <MenuItem 
                        icon={<History className="w-4 h-4" />} 
                        label="Geral / Turno" 
                        active={currentView === 'statistics'} 
                        onClick={() => onChangeView('statistics')} 
                        isCollapsed={isCollapsed} 
                    />
                </MenuSection>

                {/* Relatórios Section */}
                <MenuSection title="Relatórios PF" icon={<FileText className="w-4 h-4 text-white" />} isCollapsed={isCollapsed} onExpand={handleExpand}>
                    <SubMenu label="Relatórios Oficiais" icon={<FileSpreadsheet className="w-4 h-4 text-blue-400" />} isCollapsed={isCollapsed}>
                        <MenuItem 
                            icon={<Activity className="w-3.5 h-3.5" />} 
                            label="Pulsar" 
                            active={currentView === 'report-pulsar'} 
                            onClick={() => onChangeView('report-pulsar')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<Globe className="w-3.5 h-3.5" />} 
                            label="Eurosur" 
                            active={currentView === 'report-eurosur'} 
                            onClick={() => onChangeView('report-eurosur')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                        <MenuItem 
                            icon={<FileSpreadsheet className="w-3.5 h-3.5" />} 
                            label="RAMFA" 
                            active={currentView === 'report-ramfa'} 
                            onClick={() => onChangeView('report-ramfa')} 
                            isCollapsed={isCollapsed}
                            isSmall
                        />
                    </SubMenu>
                </MenuSection>

                {/* Meteorologia */}
                <MenuSection title="Meteorologia" icon={<CloudSun className="w-4 h-4 text-blue-300" />} isCollapsed={isCollapsed} onExpand={handleExpand}>
                    <MenuItem icon={<CloudSun />} label="Resumo" active={currentView === 'weather'} onClick={() => onChangeView('weather')} isCollapsed={isCollapsed} />
                    <MenuItem icon={<AlertTriangle />} label="Alerta Tempo" active={currentView === 'weather-alerts'} onClick={() => onChangeView('weather-alerts')} isCollapsed={isCollapsed} />
                </MenuSection>

                {/* Calendário */}
                <MenuSection title="Calendário" icon={<Calendar className="w-4 h-4" />} isCollapsed={isCollapsed} onExpand={handleExpand}>
                    <MenuItem icon={<CalendarDays />} label="Vista Mensal" active={currentView === 'calendar-monthly'} onClick={() => onChangeView('calendar-monthly')} isCollapsed={isCollapsed} />
                    <MenuItem icon={<CalendarRange />} label="Vista Anual" active={currentView === 'calendar-annual'} onClick={() => onChangeView('calendar-annual')} isCollapsed={isCollapsed} />
                    <MenuItem icon={<BellRing />} label="Lembretes" active={currentView === 'reminders'} onClick={() => onChangeView('reminders')} isCollapsed={isCollapsed} />
                </MenuSection>

                <div className="border-t border-white/10 mt-auto p-4">
                    <MenuItem icon={<LogOut />} label="Sair" className="text-red-300 hover:bg-red-900/20" onClick={onLogout} isCollapsed={isCollapsed} />
                </div>
            </div>
        </div>
    );
};

// --- Helper Components ---

interface MenuSectionProps { 
    title: string; 
    icon?: React.ReactNode; 
    children: React.ReactNode; 
    defaultOpen?: boolean;
    isCollapsed?: boolean;
    onExpand?: () => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ title, icon, children, defaultOpen = false, isCollapsed, onExpand }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const handleHeaderClick = () => { if (isCollapsed && onExpand) { onExpand(); setIsOpen(true); } else { setIsOpen(!isOpen); } };

    return (
        <div className="mb-1">
            <button onClick={handleHeaderClick} className={`w-full flex items-center px-4 py-2.5 text-white hover:bg-white/5 transition-colors select-none ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className="flex items-center gap-3">
                    <span className="text-gray-400">{icon}</span>
                    {!isCollapsed && <span className="text-[11px] uppercase font-black tracking-widest">{title}</span>}
                </div>
                {!isCollapsed && (isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen && !isCollapsed ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pb-1">{children}</div>
            </div>
        </div>
    );
};

interface SubMenuProps {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    isCollapsed?: boolean;
}

const SubMenu: React.FC<SubMenuProps> = ({ label, icon, children, isCollapsed }) => {
    const [isOpen, setIsOpen] = useState(false);
    if (isCollapsed) return null;

    return (
        <div className="pl-4">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-gray-100 hover:text-white transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <span className="text-blue-400 group-hover:scale-110 transition-transform">{icon}</span>
                    <span className="truncate">{label}</span>
                </div>
                {isOpen ? <ChevronDown className="w-3.5 h-3.5 opacity-50" /> : <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-6 border-l border-white/5 ml-6 py-1 flex flex-col gap-0.5">
                    {children}
                </div>
            </div>
        </div>
    );
};

const MenuItem: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    active?: boolean; 
    className?: string;
    onClick?: () => void;
    isCollapsed?: boolean;
    isSmall?: boolean;
}> = ({ icon, label, active, className = '', onClick, isCollapsed, isSmall }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center cursor-pointer transition-all border-l-4
        ${active ? 'bg-secondary/40 text-blue-400 border-blue-400' : 'text-gray-400 hover:text-white border-transparent hover:bg-white/5'} 
        ${isCollapsed ? 'justify-center border-l-0 py-3' : isSmall ? 'py-1.5 px-3 text-xs font-medium' : 'py-2.5 px-4 text-sm font-bold'}
        ${className}`}
        title={isCollapsed ? label : ''}
    >
        <span className={`${isCollapsed ? '' : isSmall ? 'mr-2' : 'mr-3'} opacity-70`}>{icon}</span>
        {!isCollapsed && <span className="truncate">{label}</span>}
    </button>
);

export default Sidebar;
