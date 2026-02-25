import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment";

import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import VendorLayout from "./VendorLayout";

function Coupon() {
  const userData = UserData();
  const vendorId = userData?.vendor_id;

  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState({ total_coupons: 0, active_coupons: 0 });

  const fetchCoupons = async () => {
    if (!vendorId) return;
    try {
      const res = await apiInstance.get(`vendor-coupon-list/${vendorId}/`);
      setCoupons(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setCoupons([]);
    }
  };

  const fetchStats = async () => {
    if (!vendorId) return;
    try {
      const res = await apiInstance.get(`vendor-coupon-stats/${vendorId}/`);
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      setStats({
        total_coupons: data?.total_coupons ?? 0,
        active_coupons: data?.active_coupons ?? 0,
      });
    } catch (e) {
      console.error(e);
      setStats({ total_coupons: 0, active_coupons: 0 });
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  const handleDelete = async (couponId) => {
    if (!vendorId) return;
    const result = await Swal.fire({
      title: "Delete coupon?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;

    try {
      await apiInstance.delete(`vendor-coupon-detail/${vendorId}/${couponId}/`);
      await fetchCoupons();
      await fetchStats();
      Swal.fire({ icon: "success", text: "Coupon deleted" });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: "error", text: "Could not delete coupon" });
    }
  };

  return (
    <VendorLayout>
      <main className="mb-5">
        <div className="container px-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="mb-0">
              <i className="fas fa-tag text-primary" /> Coupons
            </h3>
            <Link className="btn btn-primary" to="/vendor/coupon/new/">
              <i className="fas fa-plus" /> New coupon
            </Link>
          </div>

          <section className="mb-4">
            <div className="row gx-xl-5">
              <div className="col-lg-6 mb-4 mb-lg-0">
                        <div className="rounded shadow" style={{ backgroundColor: "#9CD5FF" }}>
                  <div className="card-body">
                    <p className="mb-1">Total coupons</p>
                    <h2 className="mb-0">{stats.total_coupons}</h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-4 mb-lg-0">
                        <div className="rounded shadow" style={{ backgroundColor: "#7AAACE" }}>
                  <div className="card-body">
                    <p className="mb-1">Active coupons</p>
                    <h2 className="mb-0">{stats.active_coupons}</h2>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="row rounded shadow p-3">
            <div className="col-lg-12">
              <table className="table align-middle mb-0 bg-white">
                <thead className="bg-light">
                  <tr>
                    <th>Code</th>
                    <th>Discount %</th>
                    <th>Active</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id}>
                      <td className="fw-bold">{c.code || "N/A"}</td>
                      <td>{c.discount || 0}%</td>
                      <td>
                        {c.active ? (
                          <span className="badge bg-success">YES</span>
                        ) : (
                          <span className="badge bg-secondary">NO</span>
                        )}
                      </td>
                      <td>
                        {c.date ? moment(c.date).format("MMM D, YYYY") : "N/A"}
                      </td>
                      <td>
                        <Link
                          className="btn btn-link btn-sm btn-rounded"
                          to={`/vendor/coupon/${c.id}/edit/`}
                        >
                          Edit <i className="fas fa-edit" />
                        </Link>
                        <button
                          className="btn btn-link btn-sm btn-rounded text-danger"
                          onClick={() => handleDelete(c.id)}
                        >
                          Delete <i className="fas fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {coupons.length < 1 && (
                <h5 className="p-3 mb-0">No coupons yet</h5>
              )}
              {!vendorId && (
                <h5 className="p-3 mb-0">
                  Vendor ID not available for this user.
                </h5>
              )}
            </div>
          </section>
        </div>
      </main>
    </VendorLayout>
  );
}

export default Coupon;

