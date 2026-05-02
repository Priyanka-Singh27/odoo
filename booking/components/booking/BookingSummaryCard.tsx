interface BookingSummaryCardProps {
  serviceName: string;
  providerName?: string;
  date?: string;
  time?: string;
  capacity?: number;
  price?: number;
}

export default function BookingSummaryCard({
  serviceName,
  providerName,
  date,
  time,
  capacity,
  price
}: BookingSummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 w-[340px] shrink-0">
      <h3 className="text-base font-semibold text-slate-800 mb-6">Booking Summary</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between border-b border-slate-100 pb-4">
          <span className="text-sm text-slate-500">Service</span>
          <span className="text-sm font-medium text-slate-800 text-right">{serviceName}</span>
        </div>
        
        {providerName && (
          <div className="flex justify-between border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500">Provider</span>
            <span className="text-sm font-medium text-slate-800 text-right">{providerName}</span>
          </div>
        )}
        
        {date && (
          <div className="flex justify-between border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500">Date</span>
            <span className="text-sm font-medium text-slate-800 text-right">{date}</span>
          </div>
        )}
        
        {time && (
          <div className="flex justify-between border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500">Time</span>
            <span className="text-sm font-medium text-slate-800 text-right">{time}</span>
          </div>
        )}
        
        {capacity !== undefined && capacity > 0 && (
          <div className="flex justify-between border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500">No. of people</span>
            <span className="text-sm font-medium text-slate-800 text-right">{capacity}</span>
          </div>
        )}
        
        {price !== undefined && (
          <div className="flex justify-between pt-2">
            <span className="text-base font-semibold text-slate-800">Total Price</span>
            <span className="text-base font-bold text-blue-600">${price.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
