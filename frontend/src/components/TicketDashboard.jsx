import React, { useEffect, useState } from "react";

export default function TicketDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/ticket_store_summary.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-4">Loading...</div>;

  const stores = Object.entries(data);

  const renderRow = (store, stats, status) => {
    const s = stats[status];
    const isSummary = store === "ALL";
    return (
      <tr key={`${store}-${status}`} className={isSummary ? "font-bold bg-gray-100" : ""}>
        <td>{isSummary ? "ALL STORES" : store}</td>
        <td>{status}</td>
        <td>{s.low_nps}</td>
        <td>{s.google_low_rating}</td>
        <td>{s.jli_complaint}</td>
        <td>{s.other}</td>
        <td>{s.total}</td>
        <td className={s.average_age_hours > 48 ? "text-red-600" : ""}>{s.average_age_hours}</td>
      </tr>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Zendesk Ticket Dashboard</h1>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-left p-2">Store</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Low-NPS</th>
            <th className="text-left p-2">Google</th>
            <th className="text-left p-2">JLI</th>
            <th className="text-left p-2">Other</th>
            <th className="text-left p-2">Total</th>
            <th className="text-left p-2">Avg Age (hrs)</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(([store, stats]) => (
            <React.Fragment key={store}>
              {renderRow(store, stats, "open")}
              {renderRow(store, stats, "solved")}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
