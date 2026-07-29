import { useState, useEffect, useCallback } from "react";
import http from "../utils/http";
export default function StatsBand() {
const STATS = [
  { num: "2,400+", lbl: "Residents" },
  { num: "480",    lbl: "Households" },
  { num: "12",     lbl: "Schools" },
  { num: "6",      lbl: "Wards" },
  { num: "1947",   lbl: "Est. Year" },
];
const [stats,setStats]=useState([])

const fetchStats = useCallback(async () => {
    try {
      const res = await http.get("/analytics");
      console.log("Fetched Emergency data:", res.data);
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch Emergency data", err);
    }
  }, []);
  useEffect(() => {
    
    fetchStats();
  }, []);
  return (
    <div className="stats-band">
      {stats.map((s) => (
        <div key={s.lbl} className="s-item">
          <div className="s-num">{s.count}</div>
          <div className="s-lbl">{s.lbl}</div>
        </div>
      ))}
    </div>
  );
}