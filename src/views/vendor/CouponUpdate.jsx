import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import VendorLayout from "./VendorLayout";

function CouponUpdate() {
  const userData = UserData();
  const vendorId = userData?.vendor_id;

  const navigate = useNavigate();
  const params = useParams();
  const couponId = params.coupon_id;

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(10);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  useEffect(() => {
    if (!vendorId || !couponId) return;
    setLoadingCoupon(true);
    apiInstance
      .get(`vendor-coupon-detail/${vendorId}/${couponId}/`)
      .then((res) => {
        const c = res.data || {};
        setCode(c.code || "");
        setDiscount(Number(c.discount ?? 10));
        setActive(Boolean(c.active));
      })
      .catch((e) => {
        console.error(e);
        Swal.fire({ icon: "error", text: "Could not load coupon" });
      })
      .finally(() => setLoadingCoupon(false));
  }, [vendorId, couponId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendorId) {
      Swal.fire({ icon: "error", text: "Vendor ID not available" });
      return;
    }

    setLoading(true);
    try {
      await apiInstance.patch(`vendor-coupon-detail/${vendorId}/${couponId}/`, {
        code,
        discount,
        active,
      });
      Swal.fire({ icon: "success", text: "Coupon updated" });
      navigate("/vendor/coupon/");
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        text: e?.response?.data?.detail || "Could not update coupon",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorLayout>
      <main className="mb-5">
        <div className="container px-4">
          <h3 className="mb-3">
            <i className="fas fa-edit text-primary" /> Update Coupon
          </h3>

          {loadingCoupon ? (
                    <div className="row rounded shadow p-3">
                      <p className="mb-0">Loading…</p>
                    </div>
                  ) : (
                    <form
                      className="row rounded shadow p-3"
                      onSubmit={handleSubmit}
                    >
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Code</label>
                        <input
                          className="form-control"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Discount (%)</label>
                        <input
                          className="form-control"
                          type="number"
                          min={1}
                          max={100}
                          value={discount}
                          onChange={(e) => setDiscount(Number(e.target.value))}
                          required
                        />
                      </div>

                      <div className="col-md-12 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            id="active"
                          />
                          <label className="form-check-label" htmlFor="active">
                            Active
                          </label>
                        </div>
                      </div>

                      <div className="col-12 d-flex gap-2">
                        <button className="btn btn-primary" disabled={loading}>
                          {loading ? "Saving…" : "Update"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => navigate("/vendor/coupon/")}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
        </div>
      </main>
    </VendorLayout>
  );
}

export default CouponUpdate;

