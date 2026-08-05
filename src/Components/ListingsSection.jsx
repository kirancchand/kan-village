import { useState, useEffect, useCallback } from "react";
import http from "../utils/http";
import SectionTitle from "./SectionTitle";
import { GET_ORGANISATIONS_CATEGORIES } from "../utils/constants";
import { GET_ORGANISATIONS_BY_CATEGORIES } from "../utils/constants";
export default function ListingsSection({ activeCat, onFilter }) {
    const LISTINGS = [
      { name: "Gramam High School",       cat: "school",   icon: "🏫", ph: "+91 474 2760300", ad: "Main Road, Ward 1" },
      { name: "St. Mary's LP School",     cat: "school",   icon: "🏫", ph: "+91 474 2760310", ad: "Church Lane, Ward 2" },
      { name: "Govt. UP School",          cat: "school",   icon: "🏫", ph: "+91 474 2760320", ad: "Market Road, Ward 3" },
      { name: "Tiny Tots Nursery",        cat: "school",   icon: "🎒", ph: "+91 94470 11111", ad: "East Street, Ward 4" },
      { name: "Hari General Stores",      cat: "shop",     icon: "🛒", ph: "+91 94470 22222", ad: "Junction, Ward 1" },
      { name: "Green Fresh Vegetables",   cat: "shop",     icon: "🥦", ph: "+91 94470 33333", ad: "Market Area, Ward 2" },
      { name: "Raju Hardware",            cat: "shop",     icon: "🔧", ph: "+91 94470 44444", ad: "North Road, Ward 3" },
      { name: "Ammu Cloth Centre",        cat: "shop",     icon: "👗", ph: "+91 94470 55555", ad: "South Street, Ward 4" },
      { name: "Kumar Taxi Service",       cat: "taxi",     icon: "🚕", ph: "+91 94470 66666", ad: "Bus Stand, Ward 1" },
      { name: "Rajan Auto",               cat: "taxi",     icon: "🛺", ph: "+91 94470 77777", ad: "Temple Road, Ward 2" },
      { name: "Village Cab",              cat: "taxi",     icon: "🚗", ph: "+91 94470 88888", ad: "Main Road, Ward 3" },
      { name: "PHC Gramam",               cat: "hospital", icon: "🏥", ph: "+91 474 2760400", ad: "Health Centre Rd, Ward 1" },
      { name: "Pillai Medical Clinic",    cat: "hospital", icon: "⚕️", ph: "+91 94470 99999", ad: "West Lane, Ward 2" },
      { name: "Dhanwanthari Pharmacy",    cat: "hospital", icon: "💊", ph: "+91 94471 11111", ad: "Junction, Ward 3" },
      { name: "Sri Krishnaswamy Temple",  cat: "temple",   icon: "🛕", ph: "+91 94471 22222", ad: "Temple Street, Ward 1" },
      { name: "St. George's Church",      cat: "temple",   icon: "⛪", ph: "+91 94471 33333", ad: "Church Road, Ward 2" },
      { name: "Juma Masjid",              cat: "temple",   icon: "🕌", ph: "+91 94471 44444", ad: "Masjid Lane, Ward 3" },
      { name: "State Bank of India",      cat: "bank",     icon: "🏦", ph: "+91 474 2760500", ad: "Main Road, Ward 1" },
      { name: "Kerala Gramin Bank",       cat: "bank",     icon: "🏧", ph: "+91 474 2760510", ad: "North Street, Ward 2" },
      { name: "Co-op Credit Society",     cat: "bank",     icon: "💰", ph: "+91 94471 55555", ad: "Market Road, Ward 3" },
    ];

  const filters = [
    { label: "All", cat: "all" },
    { label: "🏫 Schools", cat: "school" },
    { label: "🛒 Shops", cat: "shop" },
    { label: "🚕 Taxi", cat: "taxi" },
    { label: "🏥 Medical", cat: "hospital" },
    { label: "🛕 Temples", cat: "temple" },
    { label: "🏦 Banks", cat: "bank" },
  ];

  const emoji=["🏫","🛒","🚕","🏥","🛕","🏦","🗂️"];
  const organisationemoji=["🏫", "🛒", "🚕", "🏥", "🛕", "🏦", "🗂️","🔧","💊","💰"];

  const [categories, setCategories] = useState([]);
  const [organisations,setOrganisations]=useState([]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await http.get(GET_ORGANISATIONS_CATEGORIES);
      console.log("Fetched Categories data:", res.data);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch Categories data", err);
    }
  }, []);
  useEffect(() => {
    fetchCategories();
  }, []);

  // const displayed = activeCat === "all" ? LISTINGS : LISTINGS.filter((l) => l.cat === activeCat);
  

  
  const fetchOrganisationById = useCallback(async (activeCat) => {
    try {

      const res = await http.post(GET_ORGANISATIONS_BY_CATEGORIES, { category: activeCat });
      console.log("Fetched Categories data:", res.data);
      setOrganisations(res.data);
    } catch (err) {
      console.error("Failed to fetch Categories data", err);
    }
  }, []);

  useEffect(() => {
     fetchOrganisationById(activeCat);
  }, [activeCat]);

  const displayed = activeCat === "all" ? organisations : organisations.filter((o) => o.organisation_type === activeCat);
  console.log("Displayed Organisations:", activeCat);
  return (
    <section className="sec list-sec" id="listSecAnchor">
      <SectionTitle chip="📋 Contacts" title="Local Directory" />
      <div className="filter-row">
         {categories.map((f,i) => (
          <button
            key={i}
            className={`f-btn${activeCat === f.cat ? " active" : ""}`}
            onClick={() => onFilter(f.cat)}
          >
            {emoji[i]}&nbsp; {f.cat}
          </button>
        ))}
        {/* {filters.map((f) => (
          <button
            key={f.cat}
            className={`f-btn${activeCat === f.cat ? " active" : ""}`}
            onClick={() => onFilter(f.cat)}
          >
            {f.label}
          </button>
        ))} */}
      </div>
      <div className="list-grid">
        {displayed.map((l,i) => (
          <div key={l.name} className="l-card">
            <div className="l-icon">{organisationemoji[i]}</div>
            <div>
              <h4>{l.organisation_name}</h4>
              <div className="l-tag">{l.organisation_type}</div>
              <div className="l-ph">📞 {l.phone}</div>
              <div className="l-ad">📍 {l.contact}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}