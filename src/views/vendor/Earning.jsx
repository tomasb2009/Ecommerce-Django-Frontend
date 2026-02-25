import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";

import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import VendorLayout from "./VendorLayout";

function Earning() {
  const userData = UserData();
  const vendorId = userData?.vendor_id;

  const [earning, setEarning] = useState({ monthly_revenue: 0, total_revenue: 0 });
  const [tracker, setTracker] = useState([]);

  useEffect(() => {
    if (!vendorId) return;

    apiInstance
      .get(`vendor-earning/${vendorId}/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setEarning({
          monthly_revenue: data?.monthly_revenue ?? 0,
          total_revenue: data?.total_revenue ?? 0,
        });
      })
      .catch((e) => {
        console.error(e);
        setEarning({ monthly_revenue: 0, total_revenue: 0 });
      });

    apiInstance
      .get(`vendor-monthly-earning/${vendorId}/`)
      .then((res) => setTracker(Array.isArray(res.data) ? res.data : []))
      .catch((e) => {
        console.error(e);
        setTracker([]);
      });
  }, [vendorId]);

  const chartData = useMemo(() => {
    if (!Array.isArray(tracker) || tracker.length === 0) {
      return {
        labels: ["No data"],
        datasets: [
          {
            label: "Earning",
            data: [0],
            backgroundColor: "rgb(75, 192, 192)",
            borderColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      };
    }
    const months = tracker.map((t) => t.month || 0).filter(Boolean);
    const totals = tracker.map((t) => parseFloat(t.total_earning || 0));
    return {
      labels: months.length > 0 ? months : ["No data"],
      datasets: [
        {
          label: "Earning",
          data: totals.length > 0 ? totals : [0],
          backgroundColor: "rgb(75, 192, 192)",
          borderColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    };
  }, [tracker]);

  return (
    <VendorLayout>
      <main className="mb-5">
        <div className="container px-4">
          <h3 className="mb-3">
            <i className="fas fa-dollar-sign text-primary" /> Earnings
          </h3>

          <section className="mb-5">
            <div className="row gx-xl-5">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <div className="rounded shadow" style={{ backgroundColor: "#9CD5FF" }}>
                  <div className="card-body">
                    <p className="mb-1">Last 28 days</p>
                    <h2 className="mb-0">${earning.monthly_revenue}</h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-4 mb-lg-0">
                <div className="rounded shadow" style={{ backgroundColor: "#7AAACE" }}>
                  <div className="card-body">
                    <p className="mb-1">All time</p>
                    <h2 className="mb-0">${earning.total_revenue}</h2>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="row rounded shadow p-3">
            <div className="col-lg-12">
              <h5 className="mb-3">Monthly tracker</h5>
              <div style={{ height: 360, position: "relative" }}>
                <Bar
                  data={chartData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </VendorLayout>
  );
}

export default Earning;

