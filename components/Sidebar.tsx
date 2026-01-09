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
    AppWindow,
    Link as LinkIcon,
    Globe,
    Database,
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
    PlaneLanding
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
            
            {/* Collapse toggle button when collapsed (centered) */}
            {isCollapsed && (
                <div className="hidden lg:flex justify-center py-2 border-b border-white/5">
                    <button 
                        onClick={() => setIsCollapsed(false)}
                        className="text-gray-400 hover:text-white transition-colors p-2"
                        title="Expandir menu"
                    >
                        <PanelLeftOpen className="w-5 h-5" />
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto py-5 custom-scrollbar h-[calc(100vh-81px)]">
                
                {/* GS PF008 - MOVED TO TOP */}
                <MenuSection 
                    title="GS PF008" 
                    icon={<FolderOpen className="w-4 h-4 text-yellow-500" />} 
                    defaultOpen={true}
                    isCollapsed={isCollapsed}
                    onExpand={handleExpand}
                    titleClassName="text-white font-bold"
                >
                     <MenuItem 
                        icon={<Files />} 
                        label="Modelos e Formulários" 
                        active={currentView === 'templates'}
                        onClick={() => onChangeView('templates')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<BookOpen />} 
                        label="Leg PF008" 
                        active={currentView === 'legislation'}
                        onClick={() => onChangeView('legislation')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<FileText />} 
                        label="Procedimentos" 
                        active={currentView === 'procedures'}
                        onClick={() => onChangeView('procedures')}
                        isCollapsed={isCollapsed}
                    />

                    {/* Relatórios Section (Moved Inside GS PF008) */}
                    {!isCollapsed && (
                        <div className="px-4 pt-3 pb-1">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider block border-b border-gray-600/50 pb-1 mb-1">
                                Relatórios
                            </span>
                        </div>
                    )}
                    <MenuItem 
                        icon={<FileText />} 
                        label="Relatório Turno" 
                        active={currentView === 'statistics'} 
                        onClick={() => onChangeView('statistics')} 
                        isCollapsed={isCollapsed} 
                    />
                    <MenuItem 
                        icon={<LineChart />} 
                        label="Relatório Semanal" 
                        active={currentView === 'statistics'} 
                        onClick={() => onChangeView('statistics')} 
                        isCollapsed={isCollapsed} 
                    />
                    <MenuItem 
                        icon={<BarChart />} 
                        label="Relatório Mensal" 
                        active={currentView === 'statistics'} 
                        onClick={() => onChangeView('statistics')} 
                        isCollapsed={isCollapsed} 
                    />

                    {/* Aplicações PF008 */}
                    {!isCollapsed && (
                        <div className="px-4 pt-3 pb-1">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider block border-b border-gray-600/50 pb-1 mb-1">
                                Aplicações
                            </span>
                        </div>
                    )}
                    <MenuItem 
                        icon={<Scan />} 
                        label="PASSE+" 
                        onClick={() => openExternalLink('https://passe.ssi.local/app/select-app')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<Globe />} 
                        label="PORTAL FRONTEIRAS" 
                        onClick={() => openExternalLink('https://iam.ssi.local/realms/realm-pfront/protocol/openid-connect/auth?client_id=client-pfront-frontend&redirect_uri=https%3A%2F%2Fportalfronteiras.ssi.local%2Faplicacoes%2Faplicacoes-fronteira&state=9ce1a4e2-a37a-4782-8532-6f5c9fa7ff48&response_mode=fragment&response_type=code&scope=openid&nonce=5855955a-db20-41f7-bb2c-7203c0a0e64c&code_challenge=UH8xRJYorwCqxL9PSna5Iy8cqxayotY6XZ1QpWfhKpw&code_challenge_method=S256')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<Database />} 
                        label="PRISMA" 
                        onClick={() => openExternalLink('https://prisma.ssi.local/PRISMA/')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<Siren />} 
                        label="SISII" 
                        onClick={() => alert('Link SISII indisponível (Rede Interna)')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<ArrowLeftRight />} 
                        label="EES" 
                        onClick={() => alert('Link EES indisponível (Rede Interna)')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<Stamp />} 
                        label="VIS" 
                        onClick={() => alert('Link VIS indisponível (Rede Interna)')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<CreditCard />} 
                        label="FTA (ANA)" 
                        onClick={() => openExternalLink('https://apps.ana.pt/BILL_Theme/LoginPage.aspx')}
                        isCollapsed={isCollapsed}
                    />

                    {/* Links PF008 */}
                    {!isCollapsed && (
                        <div className="px-4 pt-3 pb-1">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider block border-b border-gray-600/50 pb-1 mb-1">
                                Links Úteis
                            </span>
                        </div>
                    )}
                    <MenuItem 
                        icon={<LinkIcon />} 
                        label="Link Externo 1" 
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<LinkIcon />} 
                        label="Link Externo 2" 
                        isCollapsed={isCollapsed}
                    />
                </MenuSection>

                <MenuSection 
                    title="Registo de Voos" 
                    icon={<Briefcase className="w-4 h-4 text-red-500" />} 
                    defaultOpen={false}
                    isCollapsed={isCollapsed}
                    onExpand={handleExpand}
                    titleClassName="text-white font-bold"
                >
                    <MenuItem 
                        icon={<Radar />} 
                        label="Radar de Voos" 
                        active={currentView === 'flight-tracker'}
                        onClick={() => onChangeView('flight-tracker')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<PlusCircle />} 
                        label="Novo Voo" 
                        active={currentView === 'flight-form'}
                        onClick={() => onChangeView('flight-form')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<List />} 
                        label="Listar Aplicações" 
                        active={currentView === 'flight-list'}
                        onClick={() => onChangeView('flight-list')}
                        isCollapsed={isCollapsed}
                    />
                </MenuSection>

                <MenuSection 
                    title="Meteorologia" 
                    icon={<CloudSun className="w-4 h-4 text-blue-300" />} 
                    defaultOpen={false}
                    isCollapsed={isCollapsed}
                    onExpand={handleExpand}
                    titleClassName="text-white font-bold"
                >
                    <MenuItem 
                        icon={<CloudSun />} 
                        label="Resumo" 
                        active={currentView === 'weather'}
                        onClick={() => onChangeView('weather')}
                        isCollapsed={isCollapsed}
                    />
                     <MenuItem 
                        icon={<PlaneTakeoff />} 
                        label="PXO (Porto Santo)" 
                        active={currentView === 'weather-pxo'}
                        onClick={() => onChangeView('weather-pxo')}
                        isCollapsed={isCollapsed}
                    />
                     <MenuItem 
                        icon={<PlaneLanding />} 
                        label="FNC (Madeira)" 
                        active={currentView === 'weather-fnc'}
                        onClick={() => onChangeView('weather-fnc')}
                        isCollapsed={isCollapsed}
                    />
                </MenuSection>

                <MenuSection 
                    title="Estatísticas" 
                    icon={<BarChart className="w-4 h-4 text-purple-400" />} 
                    defaultOpen={false}
                    isCollapsed={isCollapsed}
                    onExpand={handleExpand}
                    titleClassName="text-white font-bold"
                >
                    <MenuItem 
                        icon={<PieChart />} 
                        label="Painel Geral" 
                        active={currentView === 'statistics'} 
                        onClick={() => onChangeView('statistics')} 
                        isCollapsed={isCollapsed} 
                    />
                </MenuSection>

                {/* PF008 Ask! Section */}
                <MenuSection 
                    title="PF008 Ask!" 
                    icon={<Cpu className="w-4 h-4" />} 
                    defaultOpen={false}
                    isCollapsed={isCollapsed}
                    onExpand={handleExpand}
                    titleClassName="text-white font-bold"
                >
                    <MenuItem 
                        icon={<Bot />} 
                        label="Chat" 
                        active={currentView === 'ai-assistant'} 
                        onClick={() => onChangeView('ai-assistant')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<Camera />} 
                        label="Captura / Upload Imagem" 
                        active={currentView === 'ai-image-editor'}
                        onClick={() => onChangeView('ai-image-editor')}
                        isCollapsed={isCollapsed}
                    />
                </MenuSection>

                <MenuSection 
                    title="Calendário" 
                    icon={<Calendar className="w-4 h-4" />} 
                    defaultOpen={false}
                    isCollapsed={isCollapsed}
                    onExpand={handleExpand}
                    titleClassName="text-white font-bold"
                >
                    <MenuItem 
                        icon={<CalendarDays />} 
                        label="Vista Mensal" 
                        active={currentView === 'calendar-monthly'}
                        onClick={() => onChangeView('calendar-monthly')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<CalendarRange />} 
                        label="Vista Anual" 
                        active={currentView === 'calendar-annual'}
                        onClick={() => onChangeView('calendar-annual')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<BellRing />} 
                        label="Lembretes" 
                        active={currentView === 'reminders'}
                        onClick={() => onChangeView('reminders')}
                        isCollapsed={isCollapsed}
                    />
                </MenuSection>

                <MenuSection 
                    title="Contactos PFO08" 
                    icon={<Users className="w-4 h-4" />} 
                    defaultOpen={false}
                    isCollapsed={isCollapsed}
                    onExpand={handleExpand}
                    titleClassName="text-white font-bold"
                >
                    <MenuItem icon={<Phone />} label="Lista Telefónica" isCollapsed={isCollapsed} />
                    <MenuItem icon={<Bell />} label="Piquetes / Urgências" isCollapsed={isCollapsed} />
                </MenuSection>

                <MenuSection 
                    title="Formação PF008" 
                    icon={<GraduationCap className="w-4 h-4" />} 
                    defaultOpen={false}
                    isCollapsed={isCollapsed}
                    onExpand={handleExpand}
                    titleClassName="text-white font-bold"
                >
                    {!isCollapsed && (
                        <div className="px-4 pt-3 pb-1">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider block border-b border-gray-600/50 pb-1 mb-1">
                                Plataformas de Formação e Ambiente de Testes
                            </span>
                        </div>
                    )}
                    <MenuItem 
                        icon={<MonitorPlay />} 
                        label="Plataforma E-Learning" 
                        onClick={() => openExternalLink('https://elearning.ssi.local')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<FlaskConical />} 
                        label="Ambiente Teste PASSE" 
                        onClick={() => alert('Ambiente Sandbox PASSE')}
                        isCollapsed={isCollapsed}
                    />
                    <MenuItem 
                        icon={<FlaskConical />} 
                        label="Ambiente Teste Portal" 
                        onClick={() => alert('Ambiente Sandbox Portal')}
                        isCollapsed={isCollapsed}
                    />
                </MenuSection>

                <div className="border-t border-white/10 mt-auto">
                   <div className="p-4">
                        <MenuItem 
                            icon={<LogOut />} 
                            label="Sair" 
                            className="text-red-300 hover:bg-red-900/20 hover:text-red-200"
                            onClick={onLogout}
                            isCollapsed={isCollapsed}
                        />
                   </div>
                </div>
            </div>
        </div>
    );
};

interface MenuSectionProps { 
    title: string; 
    icon?: React.ReactNode; 
    children: React.ReactNode; 
    defaultOpen?: boolean;
    isCollapsed?: boolean;
    onExpand?: () => void;
    titleClassName?: string;
}

const MenuSection: React.FC<MenuSectionProps> = ({ title, icon, children, defaultOpen = true, isCollapsed, onExpand, titleClassName }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const handleHeaderClick = () => {
        if (isCollapsed && onExpand) {
            onExpand();
            setIsOpen(true);
        } else {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="mb-2">
            <button 
                onClick={handleHeaderClick}
                className={`w-full flex items-center px-4 py-3 text-white font-bold hover:text-gray-200 hover:bg-white/10 transition-colors group select-none ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                title={isCollapsed ? title : ''}
            >
                <div className="flex items-center gap-3">
                    <span className={`transition-colors ${isOpen && !isCollapsed ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`}>
                        {icon}
                    </span>
                    {!isCollapsed && (
                        <span className={`text-xs uppercase font-bold tracking-wider ${titleClassName || (isOpen ? 'text-white' : '')}`}>
                            {title}
                        </span>
                    )}
                </div>
                {!isCollapsed && (
                    isOpen ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-white" />
                )}
            </button>
            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen && !isCollapsed ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="pb-2">
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
}> = ({ icon, label, active, className = '', onClick, isCollapsed }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center px-4 py-3 cursor-pointer transition-colors text-sm font-bold text-white
        ${active ? 'bg-secondary dark:bg-blue-900 border-l-4 border-blue-400' : 'hover:bg-white/10 border-l-4 border-transparent hover:opacity-100'} 
        ${className}
        ${isCollapsed ? 'justify-center border-l-0 px-2' : ''}
        `}
        title={isCollapsed ? label : ''}
    >
        <span className={`w-6 h-6 flex items-center justify-center ${!isCollapsed ? 'mr-3' : ''}`}>{icon}</span>
        {!isCollapsed && <span>{label}</span>}
    </button>
);

export default Sidebar;