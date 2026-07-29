import { useState, useEffect, useCallback } from "react";
import http from "../utils/http";
import SectionTitle from "./SectionTitle";
export default function ImportantPersonsSection() {
const PERSONS = [
  { emoji: "👨‍💼", name: "Rajan Pillai",   role: "Panchayat President", badge: "President",   grad: "linear-gradient(135deg,#0f766e,#0284c7)", ph: "+91 94470 12345" },
  { emoji: "👩‍💼", name: "Latha Nair",     role: "Panchayat Secretary", badge: "Secretary",   grad: "linear-gradient(135deg,#0284c7,#14b8a6)", ph: "+91 94470 23456" },
  { emoji: "👨‍🏫", name: "Suresh Kumar",   role: "Ward Member – 1",     badge: "Ward Member", grad: "linear-gradient(135deg,#0369a1,#0f766e)", ph: "+91 94470 34567" },
  { emoji: "👨‍⚕️", name: "Dr. Priya Menon", role: "PHC Doctor",         badge: "PHC Doctor",  grad: "linear-gradient(135deg,#0e7490,#0f766e)", ph: "+91 94470 45678" },
];

const emoji=["👨‍💼","👩‍💼","👨‍🏫","👨‍⚕️"];
const linearGradients = [
  "linear-gradient(135deg,#0f766e,#0284c7)",
  "linear-gradient(135deg,#0284c7,#14b8a6)",
  "linear-gradient(135deg,#0369a1,#0f766e)",
  "linear-gradient(135deg,#0e7490,#0f766e)"
];

const [person, setPerson] = useState([]);

const fetchImportantPersons = useCallback(async () => {
    try {
      const res = await http.get("/users/getImportantPersons");
      console.log("Fetched Important Persons data:", res.data);
      setPerson(res.data);
    } catch (err) {
      console.error("Failed to fetch Important Persons data", err);
    }
  }, []);
  useEffect(() => {

    fetchImportantPersons();
  }, []);


  return (
    <section className="sec persons-sec">
      <SectionTitle chip="🏛️ Leadership" title="Important Persons" subtitle="Meet the dedicated people serving and shaping the future of our beautiful village." />
      <div className="persons-grid">
        {person.map((p,i) => (
          <div key={i} className="p-card">
            <div className="p-top" style={{ background: linearGradients[i % linearGradients.length] }}>
              <div className="p-badge">{p.badge}</div>
              <div className="p-avatar-ring">
                <div className="p-avatar-inner" style={{ background: p.grad }}>{emoji[i % emoji.length]}</div>
              </div>
            </div>
            <div className="p-body">
              <h3>{p.villageapp_username}</h3>
              <div className="p-role">{p.contact}</div>
              <div className="p-line" />
              <button className="p-btn" onClick={() => alert(`📞 ${p.ph}`)}>📞 Contact</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}