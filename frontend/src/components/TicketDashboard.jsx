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
    <div className="min-h-screen bg-gradient-to-tr from-yellow-50 via-white to-yellow-100 text-gray-800 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl text-center mx-auto">
        <img src="/JL_Multicare_Horz_1C.png" alt="Jiffy Lube Logo" className="mx-auto mb-8 w-48 max-w-full" />
        <h1 className="text-5xl font-extrabold mb-10 tracking-tight" style={{ color: '#BA0C2F' }}>
          🎯 Zendesk Ticket Overview
        </h1>

        <div className="overflow-x-auto rounded-xl shadow-xl bg-white ring-2 ring-gray-300">
          <table className="min-w-full text-md text-center">
            <thead className="bg-yellow-200 text-gray-800 text-sm font-bold uppercase">
              <tr>
                <th className="px-6 py-4">🏪 STORE</th>
                <th className="px-6 py-4">💢 LOW NPS SCORE</th>
                <th className="px-6 py-4">⭐ LOW GOOGLE RATING</th>
                <th className="px-6 py-4">📩 JLI COMPLAINT</th>
                <th className="px-6 py-4">🗂 OTHER</th>
                <th className="px-6 py-4">📦 TOTAL</th>
                <th className="px-6 py-4">⏱ TIME OPEN</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(([store, stats], idx) => {
                const s = stats.open;
                const rowColor = idx % 2 === 0 ? "bg-white" : "bg-yellow-50";
                return (
                  <tr key={store} className={`${rowColor} hover:bg-yellow-100 transition-all text-center`}>
                    <td className="px-6 py-4 font-semibold text-yellow-900 whitespace-nowrap">{store}</td>
                    <td className="px-6 py-4 text-red-600 font-semibold">{s.low_nps}</td>
                    <td className="px-6 py-4 text-yellow-800">{s.google_low_rating}</td>
                    <td className="px-6 py-4 text-pink-700">{s.jli_complaint}</td>
                    <td className="px-6 py-4 text-gray-700">{s.other}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{s.total}</td>
                    <td className={`px-6 py-4 font-medium ${s.average_age_hours > 48 ? "text-red-700" : "text-green-700"}`}>{s.average_age_hours.toFixed(1)}h</td>
                  </tr>
                );
              })}

              {allStats && (
                <tr className="bg-yellow-300 text-md font-extrabold border-t border-gray-400 text-center">
                  <td className="px-6 py-5">ALL STORES</td>
                  <td className="px-6 py-5 text-red-800">{allStats.low_nps}</td>
                  <td className="px-6 py-5 text-yellow-900">{allStats.google_low_rating}</td>
                  <td className="px-6 py-5 text-pink-800">{allStats.jli_complaint}</td>
                  <td className="px-6 py-5">{allStats.other}</td>
                  <td className="px-6 py-5">{allStats.total}</td>
                  <td className="px-6 py-5">{allStats.average_age_hours.toFixed(1)}h</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-center text-gray-600 mt-6">
          ⏳ Data from Zendesk API · Updated Daily · <span className="text-red-700 font-semibold">Red</span> = Over 48h
        </p>
      </div>
    </div>
  );
}
