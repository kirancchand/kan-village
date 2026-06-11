export default function StatsBand() {
const STATS = [
  { num: "2,400+", lbl: "Residents" },
  { num: "480",    lbl: "Households" },
  { num: "12",     lbl: "Schools" },
  { num: "6",      lbl: "Wards" },
  { num: "1947",   lbl: "Est. Year" },
];
  return (
    <div className="stats-band">
      {STATS.map((s) => (
        <div key={s.lbl} className="s-item">
          <div className="s-num">{s.num}</div>
          <div className="s-lbl">{s.lbl}</div>
        </div>
      ))}
    </div>
  );
}