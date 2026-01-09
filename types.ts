
export enum FlightType {
    ARRIVAL = 'chegada',
    DEPARTURE = 'partida',
    TURNAROUND = 'escala'
}

export type FlightStatus = 'Agendado' | 'Confirmado' | 'Realizado' | 'Cancelado' | 'Arquivado';

export type FlightNature = 
    | 'Voo Privado' 
    | 'Voo Militar' 
    | 'Voo Divergido' 
    | 'Voo de Carga' 
    | 'Voo Diplomático' 
    | 'Voo de Instrução';

export interface FlightFormData {
    id?: string;
    createdAt?: Date;
    createdBy?: string; // Agent Name
    createdByCategory?: string; // Agent Category
    flightNumber: string;
    flightType: FlightType | ''; // Now includes TURNAROUND
    flightNature: FlightNature | '';
    status: FlightStatus;
    aircraftType: string;
    
    // Gesdoc
    gesdocNumber?: string;
    gesdocYear?: number;
    
    // Arrival Data
    regVPArrival?: string;
    origin: string;
    scheduleTimeArrival: string;
    dateArrival: string; // Changed from actualTime (Date string YYYY-MM-DD)
    
    // Arrival POB
    arrivalUeCount: number;
    arrivalNonSchengenCount: number;
    arrivalCrewCount: number;

    // Departure Data
    regVPDeparture?: string;
    destination: string;
    scheduleTimeDeparture: string;
    dateDeparture: string; // Changed from actualTime (Date string YYYY-MM-DD)

    // Departure POB
    departureUeCount: number;
    departureNonSchengenCount: number;
    departureCrewCount: number;
    
    operator: string;
    
    // Additional Info
    observations?: string;
    attachmentName?: string;
    
    // Checklist state (key: boolean)
    checklist?: Record<string, boolean>;
}

export interface WeatherData {
    temp: number;
    condition: string;
    feelsLike: number;
    max: number;
    min: number;
    pressure: number;
    sunrise: string;
    sunset: string;
    dayDuration: number;
}

export type ViewState = 
    | 'dashboard' 
    | 'ai-assistant' 
    | 'ai-image-editor' 
    | 'flight-form' 
    | 'flight-list'
    | 'flight-archive'
    | 'flight-tracker' 
    | 'statistics'
    | 'statistics-weekly'
    | 'statistics-monthly'
    | 'weather'
    | 'weather-pxo'
    | 'weather-fnc'
    | 'templates' 
    | 'legislation' 
    | 'procedures'
    | 'calendar-monthly'
    | 'calendar-annual'
    | 'reminders'
    | 'contacts';

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
    groundingMetadata?: any;
    image?: string;
}

export interface GroundingChunk {
    web?: {
        uri: string;
        title: string;
    };
    maps?: {
        uri: string;
        title: string;
        placeAnswerSources?: { reviewSnippets: { url: string }[] }[];
    };
}

export type ReminderType = 'Alerta' | 'Voo Privado' | 'Reunião';
export type RecurrenceType = 'Não repetir' | 'Diariamente' | 'Semanalmente' | 'Mensalmente' | 'Anualmente';

export interface Reminder {
    id: string;
    subject: string;
    date: Date;
    type: ReminderType;
    recurrence: RecurrenceType;
    alarm: boolean;
    completed: boolean;
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    category: string;
}