import React, { useEffect, useState } from "react";

export default function TicketDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/ticket_store_summary.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-4 text-center text-lg animate-pulse">Loading dashboard...</div>;

  const stores = Object.entries(data)
    .filter(([store]) => store !== "ALL")
    .sort((a, b) => {
      const aNum = parseInt(a[0].replace("store-", "")) || 9999;
      const bNum = parseInt(b[0].replace("store-", "")) || 9999;
      return aNum - bNum;
    });

  const allStats = data.ALL?.open;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-yellow-50 via-white to-yellow-100 text-gray-800 p-8">
      <div className="w-full max-w-6xl text-center">
        <img src="/JL_Multicare_Horz_1C.png" alt="Jiffy Lube Logo" className="mx-auto mb-6 w-48" />
        <h1 className="text-4xl font-extrabold mb-10 tracking-tight" style={{ color: '#BA0C2F' }}>
          🎯 Zendesk Ticket Overview
        </h1>

        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white ring-1 ring-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-yellow-100 text-gray-800 text-xs font-semibold border-b border-gray-300">
              <tr>
                <th className="px-5 py-4">🏪 STORE</th>
                <th className="px-5 py-4">💢 LOW NPS SCORE</th>
                <th className="px-5 py-4">⭐ LOW GOOGLE RATING</th>
                <th className="px-5 py-4">📩 JLI COMPLAINT</th>
                <th className="px-5 py-4">🗂 OTHER</th>
                <th className="px-5 py-4">📦 TOTAL</th>
                <th className="px-5 py-4">⏱ TIME OPEN</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(([store, stats], idx) => {
                const s = stats.open;
                const bg = idx % 2 === 0 ? "bg-white" : "bg-yellow-50";
                return (
                  <tr key={store} className={`${bg} hover:bg-yellow-100 transition-all`}>
                    <td className="px-5 py-3 font-semibold text-yellow-900 whitespace-nowrap">{store}</td>
                    <td className="px-5 py-3 text-red-600 font-medium">{s.low_nps}</td>
                    <td className="px-5 py-3">{s.google_low_rating}</td>
                    <td className="px-5 py-3">{s.jli_complaint}</td>
                    <td className="px-5 py-3">{s.other}</td>
                    <td className="px-5 py-3 font-semibold">{s.total}</td>
                    <td className={`px-5 py-3 ${s.average_age_hours > 48 ? "text-rose-600 font-bold" : "text-gray-700"}`}>
                      {s.average_age_hours.toFixed(1)}h
                    </td>
                  </tr>
                );
              })}

              {allStats && (
                <tr className="bg-yellow-200 text-sm font-extrabold border-t border-gray-400">
                  <td className="px-5 py-4">ALL STORES</td>
                  <td className="px-5 py-4 text-red-700">{allStats.low_nps}</td>
                  <td className="px-5 py-4">{allStats.google_low_rating}</td>
                  <td className="px-5 py-4">{allStats.jli_complaint}</td>
                  <td className="px-5 py-4">{allStats.other}</td>
                  <td className="px-5 py-4">{allStats.total}</td>
                  <td className="px-5 py-4">{allStats.average_age_hours.toFixed(1)}h</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-center text-gray-500 mt-6">
          ⏳ Data from Zendesk API · Updated Daily · Highlighted if Open > 48h
        </p>
      </div>
    </div>
  );
}
