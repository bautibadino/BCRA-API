interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, change, positive, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{label}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
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
