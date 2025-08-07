import React, { useEffect, useState } from "react";

export default function TicketDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/ticket_store_summary.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-4 text-center text-lg">Loading dashboard...</div>;

  const stores = Object.entries(data)
    .filter(([store]) => store !== "ALL")
    .sort((a, b) => {
      const aNum = parseInt(a[0].replace("store-", "")) || 9999;
      const bNum = parseInt(b[0].replace("store-", "")) || 9999;
      return aNum - bNum;
    });

  const allStats = data.ALL?.open;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-gray-800 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">📊 Zendesk Ticket Dashboard</h1>

        <div className="overflow-x-auto rounded-xl shadow-md bg-white">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-slate-100 text-gray-700 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">🏪 Store</th>
                <th className="px-4 py-3">💢 Low NPS Score</th>
                <th className="px-4 py-3">⭐ Low Google Rating</th>
                <th className="px-4 py-3">📩 JLI Complaint</th>
                <th className="px-4 py-3">🗂 Other</th>
                <th className="px-4 py-3">📦 Total</th>
                <th className="px-4 py-3">⏱ Time Open</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(([store, stats], idx) => {
                const s = stats.open;
                const bg = idx % 2 === 0 ? "bg-white" : "bg-slate-50";
                return (
                  <tr key={store} className={`${bg} hover:bg-yellow-50 transition`}>
                    <td className="px-4 py-2 font-medium whitespace-nowrap">{store}</td>
                    <td className="px-4 py-2 text-red-600">{s.low_nps}</td>
                    <td className="px-4 py-2">{s.google_low_rating}</td>
                    <td className="px-4 py-2">{s.jli_complaint}</td>
                    <td className="px-4 py-2">{s.other}</td>
                    <td className="px-4 py-2 font-semibold">{s.total}</td>
                    <td className={`px-4 py-2 ${s.average_age_hours > 48 ? "text-rose-600 font-bold" : "text-gray-700"}`}>
                      {s.average_age_hours}
                    </td>
                  </tr>
                );
              })}

              {/* Summary row */}
              {allStats && (
                <tr className="bg-slate-200 text-sm font-bold border-t border-gray-300">
                  <td className="px-4 py-3">ALL STORES</td>
                  <td className="px-4 py-3 text-red-700">{allStats.low_nps}</td>
                  <td className="px-4 py-3">{allStats.google_low_rating}</td>
                  <td className="px-4 py-3">{allStats.jli_complaint}</td>
                  <td className="px-4 py-3">{allStats.other}</td>
                  <td className="px-4 py-3">{allStats.total}</td>
                  <td className="px-4 py-3">{allStats.average_age_hours}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Updated from Zendesk API • Time Open in hours • Red = over 48h
        </p>
      </div>
    </div>
  );
}
