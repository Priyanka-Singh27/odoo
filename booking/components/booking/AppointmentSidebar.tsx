import React from 'react';
import { X, Users, MapPin, Clock } from 'lucide-react';
import { AppointmentType } from './AppointmentCard';

interface AppointmentSidebarProps {
  appointment: AppointmentType | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: () => void;
}

export default function AppointmentSidebar({ appointment, isOpen, onClose, onBook }: AppointmentSidebarProps) {
  if (!isOpen || !appointment) return null;

  const imageUrl = appointment.image_url || `https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=500&q=80`;
  const location = appointment.location || "Main Clinic";
  const providers = appointment.provider_data ? JSON.parse(appointment.provider_data).map((p: any) => p.name) : [];

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div 
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out z-50 translate-x-0"
        style={{ animation: 'slideIn 300ms ease-out' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/50 backdrop-blur-md hover:bg-white text-slate-800 rounded-full shadow-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="h-64 shrink-0">
          <img src={imageUrl} alt={appointment.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{appointment.name}</h2>
          
          <div className="flex flex-col gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center text-sm text-slate-700">
              <Clock className="w-4 h-4 mr-3 text-slate-400" />
              <span className="font-medium">{appointment.duration} minutes</span>
            </div>
            <div className="flex items-center text-sm text-slate-700">
              <MapPin className="w-4 h-4 mr-3 text-slate-400" />
              <span>{location}</span>
            </div>
            <div className="flex items-start text-sm text-slate-700">
              <Users className="w-4 h-4 mr-3 text-slate-400 mt-0.5 shrink-0" />
              <span>
                {providers.length > 0 ? (
                  <span className="flex flex-col gap-1">
                    {providers.map((p: string) => (
                      <span key={p}>• {p}</span>
                    ))}
                  </span>
                ) : 'Any available provider'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">About this appointment</h3>
            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
              {appointment.description || "No detailed description provided for this appointment type."}
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white shrink-0">
          <button
            onClick={onBook}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            Book Appointment
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </div>
  );
}
