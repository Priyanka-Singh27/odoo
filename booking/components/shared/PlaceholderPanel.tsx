type PlaceholderPanelProps = {
  title: string;
  description: string;
};

export default function PlaceholderPanel({ title, description }: PlaceholderPanelProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="text-slate-500 mt-2">{description}</p>
    </div>
  );
}
