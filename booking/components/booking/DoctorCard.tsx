import Image from "next/image";

interface DoctorCardProps {
  name: string;
  specialty: string;
  experience: string;
  imageUrl: string;
  specialtyChip: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function DoctorCard({
  name,
  specialty,
  experience,
  imageUrl,
  specialtyChip,
  isActive,
  onClick
}: DoctorCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 cursor-pointer border-b border-slate-100 last:border-0 transition-all duration-200 ${
        isActive 
          ? "border-l-4 border-l-blue-500 bg-blue-50/40" 
          : "border-l-4 border-l-transparent hover:bg-slate-50"
      }`}
    >
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-800 truncate">{name}</h4>
          <p className="text-xs text-slate-500 truncate mb-2">{specialty} · {experience}</p>
          <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-medium rounded-full px-2 py-0.5 uppercase tracking-wider">
            {specialtyChip}
          </span>
        </div>
      </div>
      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-xl py-2 mt-3 transition-colors">
        Book an appointment
      </button>
    </div>
  );
}
