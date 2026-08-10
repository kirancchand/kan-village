import { useState, useEffect, useCallback } from "react";
import http from "../utils/http";
import SectionTitle from "./SectionTitle";
import { GET_CATEGORIES } from "../utils/constants";
import { Icon } from "@iconify/react";
export default function CategoriesSection({ onFilter }) {
const CATEGORIES = [
  { icon: "🏫", name: "Schools",      cat: "school",   count: 4 },
  { icon: "🛒", name: "Shops",        cat: "shop",     count: 4 },
  { icon: "🚕", name: "Taxi / Auto",  cat: "taxi",     count: 3 },
  { icon: "🏥", name: "Medical",      cat: "hospital", count: 3 },
  { icon: "🛕", name: "Temples",      cat: "temple",   count: 3 },
  { icon: "🏦", name: "Banks",        cat: "bank",     count: 3 },
  { icon: "🗂️", name: "All Services", cat: "all",      count: 20 },
];

const emoji=["🏫","🛒","🚕","🏥","🛕","🏦","🗂️"];
const [categories, setCategories] = useState([]);

const fetchCategories = useCallback(async () => {
    try {
      const res = await http.get(GET_CATEGORIES);
      console.log("Fetched Categories data:", res.data);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch Categories data", err);
    }
  }, []);
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="sec cat-sec">
      <SectionTitle chip="📂 Browse" title="Service Categories" subtitle="Tap any category card to quickly jump to those listings." />
      <div className="cat-grid">
        {categories.map((c,i) => (
          console.log(c.icon),
          <div key={i} className="cat-c" onClick={() => onFilter(c.cat)}>
            <div className="cat-icon-b">{c.icon!=null ? <Icon icon={c.icon} width={24} height={24} /> : emoji[i]}</div>
            <h3>{c.cat}</h3>
            <span>{c.count} listings</span>
          </div>
        ))}
      </div>
    </section>
  );
}