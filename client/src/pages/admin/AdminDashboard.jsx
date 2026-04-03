import { Users, BedDouble, CreditCard, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { title: "Total Revenue", value: "$12,450", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Occupied Rooms", value: "85 / 120", icon: BedDouble, color: "text-indigo-600", bg: "bg-indigo-100" },
    { title: "Total Guests", value: "240", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Avg. Stay Duration", value: "3.2 Days", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
        <span className="text-sm font-medium bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-slate-500">
          Today: {new Date().toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mt-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Hotel Activity</h2>
        <div className="space-y-4">
          {['GST-049 checked into Room 102', 'Payment of $450 received for BK-9920', 'Room 304 marked as Maintenance by EMP-012'].map((act, i) => (
            <div key={i} className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border-l-4 border-indigo-500">
              <p className="text-sm text-slate-700 font-medium ml-3">{act}</p>
              <span className="ml-auto text-xs text-slate-400">Just now</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}