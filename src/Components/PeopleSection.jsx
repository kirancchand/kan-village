import { useState, useEffect, useCallback } from "react";
import http from "../utils/http";
import SectionTitle from "./SectionTitle";
import { GET_PEOPLES_LIST } from "../utils/constants";
export default function PeopleSection() {
//     const PEOPLE = [
//   { name: "Anitha Raj",      ward: "Ward 1", addr: "Puthenveedu, Main Road",     ph: "+91 94472 11111" },
//   { name: "Babu Thomas",     ward: "Ward 2", addr: "Valiyaparambil, Church Lane", ph: "+91 94472 22222" },
//   { name: "Cathy Mathew",    ward: "Ward 1", addr: "Kovilkadavil, East Street",   ph: "+91 94472 33333" },
//   { name: "Dileep Kumar",    ward: "Ward 3", addr: "Mangattil House, North Rd",   ph: "+91 94472 44444" },
//   { name: "Esha Menon",      ward: "Ward 4", addr: "Karinkulam, Temple Road",     ph: "+91 94472 55555" },
//   { name: "Francis Xavier",  ward: "Ward 2", addr: "Kizhakkedan, South St",       ph: "+91 94472 66666" },
//   { name: "Geetha Nair",     ward: "Ward 5", addr: "Thoppil House, West Lane",    ph: "+91 94472 77777" },
//   { name: "Hari Varma",      ward: "Ward 3", addr: "Parvathy Sadanam, Mkt Rd",    ph: "+91 94472 88888" },
//   { name: "Indira Pillai",   ward: "Ward 6", addr: "Sreelakshmi, North St",       ph: "+91 94472 99999" },
//   { name: "Jose Kuriakose",  ward: "Ward 1", addr: "Parathodiyil, Church Rd",     ph: "+91 94473 11111" },
//   { name: "Kavitha Suresh",  ward: "Ward 4", addr: "Mannil House, East Rd",       ph: "+91 94473 22222" },
//   { name: "Lakshmanan P",    ward: "Ward 2", addr: "Krishnavilasam, Masjid Ln",   ph: "+91 94473 33333" },
//   { name: "Maya Krishnan",   ward: "Ward 5", addr: "Thekkedan, Temple St",        ph: "+91 94473 44444" },
//   { name: "Narayanan R",     ward: "Ward 3", addr: "Aswathy Bhavan, Main Rd",     ph: "+91 94473 55555" },
//   { name: "Omana Varghese",  ward: "Ward 6", addr: "Nellimoottil, South Lane",    ph: "+91 94473 66666" },
//   { name: "Pradeep Nambiar", ward: "Ward 1", addr: "Bhagavathy Nivas, Mkt Rd",    ph: "+91 94473 77777" },
// ];
const [page, setPage] = useState(1);
const [totalCount, setTotalCount] = useState(0);
const [start, setStart] = useState(0);
const sizePerPage =10;

const [peoples, setPeoples] = useState([]);


const fetchPeoples = useCallback(async (startValue = start) => {
    try {
      const payload = {
        "start": startValue,
        "numberofRows": sizePerPage,
        "filter": [
        ],
        "sort": [
          {
            "columnName": "villageapp_userid",
            "sortOrder": "DESC"
          }
        ]
      }
      console.log(sizePerPage)
      const res = await http.post(GET_PEOPLES_LIST, payload);
      console.log("Fetched Peoples data:", res.data.result);
      setPeoples(res.data.result);
      setTotalCount(res.data.totalCount);
    } catch (err) {
      console.error("Failed to fetch Peoples data", err);
    }
  }, []);
  useEffect(() => {
    fetchPeoples(start);
  }, []);

const handleNext = async () => {
  const newStart = start + sizePerPage;
  setStart(newStart);
  fetchPeoples(newStart);
};

const handlePrev = async () => {
  if (start === 0) return;

  const newStart = Math.max(0, start - sizePerPage);
  setStart(newStart);
  fetchPeoples(newStart);
};

  const [query, setQuery] = useState("");
  // const filtered = peoples.length>0?peoples.filter(
  //   (p) =>
  //     // console.log(p);
  //     // console.log(p.villageapp_username.toLowerCase().includes(query.toLowerCase())||p.contact.toLowerCase().includes(query.toLowerCase()));
  //     // (p.villageapp_username!=null)?p.villageapp_username.toLowerCase().includes(query.toLowerCase()):"" ||
  //     // // // p.ward.toLowerCase().includes(query.toLowerCase()) ||
  //     // p.contact!=null?p.contact.toLowerCase().includes(query.toLowerCase()):""

  //     p.villageapp_username!=null?p.villageapp_username.toLowerCase():"" || p.contact!=null?p.contact.toLowerCase():""
  //     // return null;

  // ):[];

  return (
    <section className="sec ppl-sec">
      <SectionTitle chip="👥 Residents" title="Village Directory" subtitle="Search by name, ward or address to find any resident quickly." />
      <div className="search-wrap">
        <span className="s-ico">🔍</span>
        <input
          type="text" value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, ward or address…"
        />
      </div>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              {/* <th>Ward</th> */}
              <th>Address</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {peoples.map((p) => {
              const ini = p.villageapp_username!=null? p.villageapp_username.split(" ").map((w) => w[0]).join("").slice(0, 2):"";
              // const ini = p.villageapp_username[0];
              return (
                <tr key={p.villageapp_userid}>
                  <td>
                    <div className="av-cell">
                      <div className="mini-av">{ini}</div>
                      <div>
                        <div className="p-nm">{p.villageapp_username}</div>
                        {/* <div className="p-wd">{p.villageapp_ward}</div> */}
                      </div>
                    </div>
                  </td>
                  {/* <td style={{ color: "#64748b", fontWeight: 600, fontSize: "0.83rem" }}>{p.villageapp_ward}</td> */}
                  <td style={{ color: "#64748b", fontSize: "0.82rem" }}>📍 {p.address!=""?p.address:"No Address"}</td>
                  <td><span className="ph-chip">📞 {p.contact!=""?p.contact:"No Contact"}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="sec-title" >
        <div className="d-flex align-items-center justify-content-center" style={{ paddingTop: "20px" }}>
            <div
              className="sec-chip"
              style={{ cursor: start === 0  ? "not-allowed" : "pointer" }}
              onClick={handlePrev}
            >
              {"<<"} Prev
            </div>
          <span className="mx-3">
            {/* Page {currentPage} of {totalPages || 1} */}
          </span>
          &nbsp;
          <div
            className="sec-chip ms-3"
            style={{
              cursor: totalCount > start+sizePerPage ? "pointer" : "not-allowed",
              opacity: totalCount > start+sizePerPage ? 1 : 0.5,
            }}
            onClick={totalCount > start+sizePerPage ? handleNext : undefined}
          >
            Next {">>"}
          </div>
        </div>
      </div>
    </section>
  );
}