"use client";

import { Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings API call here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
        <button 
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="flex gap-8 items-start">
        <Tabs defaultValue="profile" className="w-full flex gap-8">
          {/* Vertical Tabs List */}
          <TabsList className="flex flex-col h-auto bg-transparent gap-2 w-48 shrink-0 items-stretch">
            <TabsTrigger value="profile" className="justify-start px-4 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
              Business Profile
            </TabsTrigger>
            <TabsTrigger value="availability" className="justify-start px-4 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
              Availability
            </TabsTrigger>
            <TabsTrigger value="payments" className="justify-start px-4 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
              Payments
            </TabsTrigger>
          </TabsList>

          {/* Content Area */}
          <div className="flex-1">
            <TabsContent value="profile" className="mt-0 outline-none">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Business Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Spring Dental Clinic" 
                        className="w-full max-w-md rounded-xl border border-slate-200 bg-white h-10 px-4 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact Email</label>
                      <input 
                        type="email" 
                        placeholder="hello@clinic.com" 
                        className="w-full max-w-md rounded-xl border border-slate-200 bg-white h-10 px-4 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                      <textarea 
                        placeholder="Full street address..." 
                        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 text-sm focus:outline-none focus:border-blue-500 min-h-[100px] resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="availability" className="mt-0 outline-none">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Global Business Hours</h2>
                <div className="space-y-4">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex items-center gap-6 py-2 border-b border-slate-50 last:border-0">
                      <div className="w-32 flex items-center gap-3">
                        <Switch id={`day-${day}`} defaultChecked={day !== "Sunday"} />
                        <label htmlFor={`day-${day}`} className="text-sm font-medium text-slate-700">{day}</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="time" defaultValue="09:00" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm" />
                        <span className="text-slate-400">to</span>
                        <input type="time" defaultValue="17:00" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="mt-0 outline-none">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Payment Methods</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                      <div>
                        <h4 className="font-medium text-slate-800">Stripe Integration</h4>
                        <p className="text-sm text-slate-500">Accept credit and debit cards securely.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                      <div>
                        <h4 className="font-medium text-slate-800">PayPal Integration</h4>
                        <p className="text-sm text-slate-500">Allow customers to pay via their PayPal account.</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Currency</h2>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Default Currency</label>
                    <select className="w-full max-w-xs rounded-xl border border-slate-200 bg-white h-10 px-4 text-sm focus:outline-none focus:border-blue-500">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>INR (₹)</option>
                    </select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
