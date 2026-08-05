import { useState, useEffect, useCallback } from "react";
import http from "../utils/http";
import SectionTitle from "./SectionTitle";
import { Icon } from "@iconify/react";
import { GET_EMERGENCY_ORGANISATION } from "../utils/constants";
// https://icon-sets.iconify.design/?query=Fire
export default function EmergencySection() {
const EMERGENCY = [
  { icon: "🚔", name: "Police Station",  num: "100",             sub: "24 × 7 Available" },
  { icon: "🔥", name: "Fire Station",    num: "101",             sub: "+91 474 2760101" },
  { icon: "🚑", name: "Ambulance",       num: "108",             sub: "Free Emergency" },
  { icon: "⚡", name: "KSEB Helpline",   num: "1912",            sub: "Power Complaints" },
  { icon: "💧", name: "Water Authority", num: "1916",            sub: "Water Complaints" },
  { icon: "🏛️", name: "Panchayat Office",num: "+91 474 2760200", sub: "Mon–Sat 9AM–5PM" },
];

// const emoji=["🚔","🔥","🚑","⚡","💧","🏛️"];
const [emergency, setEmergency] = useState([]);


const fetchEmergency = useCallback(async () => {
    try {
      const res = await http.get(GET_EMERGENCY_ORGANISATION);
      console.log("Fetched Emergency data:", res.data);
      setEmergency(res.data);
    } catch (err) {
      console.error("Failed to fetch Emergency data", err);
    }
  }, []);
  useEffect(() => {
    
    fetchEmergency();
  }, []);

  return (
    <section className="sec emerg-sec" id="emergency">
      <SectionTitle chip="🚨 Emergency" title="Emergency Contacts" subtitle="Tap any card to instantly view the emergency contact number." />
      <div className="e-grid">
        {emergency.map((e,i) => (
          console.log(e.icon),
          <div key={i} className="e-card" onClick={() => alert(`${e.icon} ${e.organisation_name}: ${e.contact}`)}>
            <div className="e-icon-wrap"><Icon icon={e.icon} width={36} height={36} />
              {/* {Icon && <Icon size={32} />} */}
            {/* {emoji[i]} */}
            </div>
            <div className="e-name">{e.organisation_name}</div>
            <div className="e-num">{e.contact}</div>
            <div className="e-sub">{e.owner}</div>
          </div>
        ))}
      </div>
    </section>
  );
}