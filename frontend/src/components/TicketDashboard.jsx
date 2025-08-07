import React, { useEffect, useState } from "react";

export default function TicketDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/ticket_store_summary.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div style={{ padding: 20, textAlign: "center", fontSize: "1.5em" }}>Loading dashboard...</div>;

  const stores = Object.entries(data)
    .filter(([store]) => store !== "ALL")
    .sort((a, b) => {
      const aNum = parseInt(a[0].replace("store-", "")) || 9999;
      const bNum = parseInt(b[0].replace("store-", "")) || 9999;
      return aNum - bNum;
    });

  const allStats = data.ALL?.open;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f5f5f5", padding: 20 }}>
      <header style={{ textAlign: "center", marginBottom: 20 }}>
        <img src="/JL_Multicare_Horz_1C.png" alt="Jiffy Lube Logo" style={{ maxWidth: 300 }} />
        <h1 style={{ color: "#0006b0", margin: "10px 0" }}>🎯 Zendesk Ticket Overview</h1>
      </header>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
        <thead>
          <tr>
            <th style={thStyle}>🏪 STORE</th>
            <th style={thStyle}>❌ LOW NPS SCORE</th>
            <th style={thStyle}>⭐ LOW GOOGLE RATING</th>
            <th style={thStyle}>📩 JLI COMPLAINT</th>
            <th style={thStyle}>🗂 OTHER</th>
            <th style={thStyle}>📦 TOTAL</th>
            <th style={thStyle}>⏱ TIME OPEN</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(([store, stats], idx) => {
            const metrics = stats.open;
            const bgColor = idx % 2 === 0 ? "#ffffff" : "#0591fc";
            return (
              <tr key={store} style={{ backgroundColor: bgColor }}>
                <td style={tdStyleBold}>{store}</td>
                <td style={{ ...tdStyle, color: "#000000", fontWeight: "bold" }}>{metrics.low_nps}</td>
                <td style={tdStyle}>{metrics.google_low_rating}</td>
                <td style={{ ...tdStyle, color: "#000000" }}>{metrics.jli_complaint}</td>
                <td style={tdStyle}>{metrics.other}</td>
                <td style={{ ...tdStyle, fontWeight: "bold" }}>{metrics.total}</td>
                <td style={{ ...tdStyle, fontWeight: "bold", color: metrics.average_age_hours > 48 ? "#b91c1c" : "#000000" }}>
                  {metrics.average_age_hours.toFixed(1)}h
                </td>
              </tr>
            );
          })}

          {allStats && (
            <tr style={{ backgroundColor: "#0591fc", fontWeight: "bold" }}>
              <td style={tdStyle}>ALL STORES</td>
              <td style={{ ...tdStyle, color: "#000000" }}>{allStats.low_nps}</td>
              <td style={tdStyle}>{allStats.google_low_rating}</td>
              <td style={{ ...tdStyle, color: "#000000" }}>{allStats.jli_complaint}</td>
              <td style={tdStyle}>{allStats.other}</td>
              <td style={tdStyle}>{allStats.total}</td>
              <td style={{ ...tdStyle, fontWeight: "bold", color: allStats.average_age_hours > 48 ? "#b91c1c" : "#000000" }}>
                {allStats.average_age_hours.toFixed(1)}h
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <footer style={{ marginTop: 30, textAlign: "center" }}>
        <p style={{ fontWeight: "bold", fontStyle: "italic", color: "#555" }}>
          ⏳ Data from Zendesk API · Updated Every 4 Hours · Red = Over 48h
        </p>
      </footer>
    </div>
  );
}

const thStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
  backgroundColor: "#0006b0",
  color: "white",
  textAlign: "center",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
  textAlign: "center",
};

const tdStyleBold = {
  ...tdStyle,
  fontWeight: "bold",
  color: "#000000",
  whiteSpace: "nowrap",
};

