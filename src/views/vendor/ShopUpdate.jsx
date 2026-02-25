import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import VendorLayout from "./VendorLayout";

function ShopUpdate() {
  const userData = UserData();
  const vendorId = userData?.vendor_id;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingShop, setLoadingShop] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mobile, setMobile] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    if (!vendorId) return;
    setLoadingShop(true);
    apiInstance
      .get(`vendor/shop/${vendorId}/`)
      .then((res) => {
        const v = res.data || {};
        setName(v.name || "");
        setDescription(v.description || "");
        setMobile(v.mobile || "");
        setCurrentImage(v.image || "");
      })
      .catch((e) => {
        console.error(e);
        Swal.fire({ icon: "error", text: "Could not load shop" });
      })
      .finally(() => setLoadingShop(false));
  }, [vendorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendorId) {
      Swal.fire({ icon: "error", text: "Vendor ID not available" });
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);
      fd.append("mobile", mobile);
      if (image) fd.append("image", image);

      await apiInstance.patch(`vendor/shop/${vendorId}/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({ icon: "success", text: "Shop updated" });
      navigate("/vendor/shop/");
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        text: e?.response?.data?.detail || "Could not update shop",
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
            <i className="fas fa-edit text-primary" /> Update Shop
          </h3>

          {loadingShop ? (
                    <div className="row rounded shadow p-3">
                      <p className="mb-0">Loading…</p>
                    </div>
                  ) : (
                    <form
                      className="row rounded shadow p-3"
                      onSubmit={handleSubmit}
                    >
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Shop name</label>
                        <input
                          className="form-control"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Mobile</label>
                        <input
                          className="form-control"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Image</label>
                        {currentImage && (
                          <div className="mb-2">
                            <img
                              alt="Current"
                              src={currentImage}
                              style={{
                                width: 120,
                                height: 120,
                                objectFit: "cover",
                                borderRadius: 10,
                              }}
                            />
                          </div>
                        )}
                        <input
                          className="form-control"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImage(e.target.files?.[0] || null)}
                        />
                      </div>

                      <div className="col-12 d-flex gap-2">
                        <button className="btn btn-primary" disabled={loading}>
                          {loading ? "Saving…" : "Update"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => navigate("/vendor/shop/")}
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

export default ShopUpdate;

