import { Globe, MapPin, Star } from "lucide-react";

export default function DoctorDetail() {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
            <img src="https://i.pravatar.cc/150?u=amanda" alt="Amanda Clara" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-1">Amanda Clara</h2>
            <p className="text-sm text-slate-500 mb-2">Psychologist · 12 years experience</p>
            <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium rounded-full px-2 py-0.5 uppercase tracking-wider">
              Psychology
            </span>
          </div>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors">
          Book an appointment
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h4 className="text-sm text-slate-400 mb-1">Education</h4>
          <p className="text-sm font-medium text-slate-700">PhD in Clinical Psychology, UCLA</p>
        </div>
        <div>
          <h4 className="text-sm text-slate-400 mb-1">Certificate</h4>
          <p className="text-sm font-medium text-slate-700">Certified CBT Therapist, APA</p>
        </div>
      </div>

      {/* Availability */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-slate-800 mb-3">Available Today</h4>
        <div className="flex gap-3">
          <div className="border border-slate-200 rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5 text-slate-600">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            Online Consultation
          </div>
          <div className="border border-slate-200 rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Offline at Doctors Hospitals, California
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-slate-800 mb-2">Monday - Saturday</h4>
        <div className="space-y-1">
          <p className="text-sm text-slate-500">10:00 - 12:00</p>
          <p className="text-sm text-slate-500">14:00 - 20:00</p>
        </div>
      </div>

      {/* Symptoms */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-slate-800 mb-2">Symptoms</h4>
        <p className="text-sm text-slate-500 leading-relaxed">
          Anxiety & Panic Attacks, Stress, Depression, Sleep Disorders
        </p>
      </div>

      {/* Specialty Procedures */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-slate-800 mb-3">Specialty Procedures</h4>
        <div className="flex flex-wrap gap-2">
          {["Cognitive Behavioral Therapy (CBT)", "Family & Couples Therapy", "Supportive Psychotherapy", "Mindfulness-Based Stress Reduction (MBSR)"].map(proc => (
            <span key={proc} className="bg-blue-50 text-blue-600 text-xs rounded-full px-3 py-1.5">
              {proc}
            </span>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-semibold text-slate-800">Reviews</h4>
          <a href="#" className="text-sm text-blue-500 hover:underline">View All</a>
        </div>
        
        <div className="space-y-4">
          {/* Review 1 */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 shrink-0">
              <img src="https://i.pravatar.cc/150?u=courtney" alt="Courtney Henry" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-slate-800">Courtney Henry</span>
                <div className="flex text-amber-400 text-[10px]">
                  <Star fill="currentColor" className="w-3 h-3" />
                  <Star fill="currentColor" className="w-3 h-3" />
                  <Star fill="currentColor" className="w-3 h-3" />
                  <Star fill="currentColor" className="w-3 h-3" />
                  <Star fill="currentColor" className="w-3 h-3" />
                </div>
                <span className="text-xs text-slate-400 ml-2">2 mins ago</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                "Consequat welt qui adipiscing sunt do cillum exercitation est amet commodo elit."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
