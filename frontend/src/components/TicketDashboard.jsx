import React, { useEffect, useState } from "react";

export default function TicketDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/ticket_store_summary.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6 text-center text-xl animate-pulse">Loading dashboard...</div>;

  const stores = Object.entries(data)
    .filter(([store]) => store !== "ALL")
    .sort((a, b) => {
      const aNum = parseInt(a[0].replace("store-", "")) || 9999;
      const bNum = parseInt(b[0].replace("store-", "")) || 9999;
      return aNum - bNum;
    });

  const allStats = data.ALL?.open;

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-gray-900 px-6 py-10">
      <header className="text-center mb-10">
        <img src="/JL_Multicare_Horz_1C.png" alt="Jiffy Lube Logo" className="mx-auto mb-4 max-w-[300px]" />
        <h1 className="text-4xl font-extrabold text-[#73000a]">🎯 Zendesk Ticket Overview</h1>
      </header>

      <main className="max-w-6xl mx-auto">
        <table className="w-full border-collapse shadow-xl">
          <thead>
            <tr>
              <th className="bg-[#73000a] text-white px-4 py-3 text-left">🏪 STORE</th>
              <th className="bg-[#73000a] text-white px-4 py-3 text-left">❌ LOW NPS SCORE</th>
              <th className="bg-[#73000a] text-white px-4 py-3 text-left">⭐ LOW GOOGLE RATING</th>
              <th className="bg-[#73000a] text-white px-4 py-3 text-left">📩 JLI COMPLAINT</th>
              <th className="bg-[#73000a] text-white px-4 py-3 text-left">🗂 OTHER</th>
              <th className="bg-[#73000a] text-white px-4 py-3 text-left">📦 TOTAL</th>
              <th className="bg-[#73000a] text-white px-4 py-3 text-left">⏱ TIME OPEN</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(([store, stats], idx) => {
              const s = stats.open;
              const rowColor = idx % 2 === 0 ? "bg-white" : "bg-[#fdecea]";
              return (
                <tr key={store} className={`${rowColor} text-left`}>
                  <td className="px-4 py-3 font-bold text-[#73000a] whitespace-nowrap">{store}</td>
                  <td className="px-4 py-3 font-bold text-red-600">{s.low_nps}</td>
                  <td className="px-4 py-3">{s.google_low_rating}</td>
                  <td className="px-4 py-3 text-pink-700">{s.jli_complaint}</td>
                  <td className="px-4 py-3">{s.other}</td>
                  <td className="px-4 py-3 font-semibold">{s.total}</td>
                  <td className={`px-4 py-3 font-semibold ${s.average_age_hours > 48 ? "text-red-700" : "text-green-700"}`}>{s.average_age_hours.toFixed(1)}h</td>
                </tr>
              );
            })}

            {allStats && (
              <tr className="bg-[#fdecea] text-left font-bold border-t border-gray-300">
                <td className="px-4 py-4">ALL STORES</td>
                <td className="px-4 py-4 text-red-700">{allStats.low_nps}</td>
                <td className="px-4 py-4">{allStats.google_low_rating}</td>
                <td className="px-4 py-4 text-pink-700">{allStats.jli_complaint}</td>
                <td className="px-4 py-4">{allStats.other}</td>
                <td className="px-4 py-4">{allStats.total}</td>
                <td className="px-4 py-4">{allStats.average_age_hours.toFixed(1)}h</td>
              </tr>
            )}
          </tbody>
        </table>

        <footer className="text-center mt-8 text-sm italic text-gray-600">
          ⏳ Data from Zendesk API · Updated Daily · Red = Over 48h
        </footer>
      </main>
    </div>
  );
}
