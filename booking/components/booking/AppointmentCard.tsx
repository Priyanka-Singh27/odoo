import React from 'react';
import { Users, MapPin } from 'lucide-react';

export interface AppointmentType {
  id: string;
  name: string;
  description: string;
  duration: number;
  provider_count: number;
  manage_capacity: number;
  advance_payment: number;
  manual_confirmation: number;
  provider_data?: string;
  image_url?: string;
  location?: string;
}

export default function AppointmentCard({ appointment, onClick }: { appointment: AppointmentType, onClick: () => void }) {
  const imageUrl = appointment.image_url || `https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=500&q=80`;
  const location = appointment.location || "Main Clinic";
  const providers = appointment.provider_data ? JSON.parse(appointment.provider_data).map((p: any) => p.name) : [];

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col"
    >
      <div className="h-40 overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={appointment.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-slate-700 shadow-sm">
          {appointment.duration} min
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1">{appointment.name}</h3>
        
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-start text-sm text-slate-600">
            <Users className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
            <span className="line-clamp-1">
              {providers.length > 0 ? providers.join(', ') : 'Any available provider'}
            </span>
          </div>
          <div className="flex items-start text-sm text-slate-600">
            <MapPin className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
        
        <p className="text-sm text-slate-500 line-clamp-2 mt-auto border-t border-slate-100 pt-3">
          {appointment.description || "No description available."}
        </p>
      </div>
    </div>
  );
}
