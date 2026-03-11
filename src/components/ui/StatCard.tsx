interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, change, positive, icon }: StatCardProps) {
  return (
    <div className="surface-panel rounded-2xl p-4 md:p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500">{label}</span>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <div className="text-xl font-bold text-slate-900 md:text-2xl">{value}</div>
      {change && (
        <span
          className={`text-sm font-medium ${
            positive ? "text-green-600" : "text-red-600"
          }`}
        >
          {positive ? "+" : ""}{change}
        </span>
      )}
    </div>
  );
}
