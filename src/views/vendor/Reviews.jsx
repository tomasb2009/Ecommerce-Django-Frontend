import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";

import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import VendorLayout from "./VendorLayout";

function Reviews() {
  const userData = UserData();
  const vendorId = userData?.vendor_id;

  const [reviews, setReviews] = useState([]);
  const [savingId, setSavingId] = useState(null);

  const fetchReviews = async () => {
    if (!vendorId) return;
    try {
      const res = await apiInstance.get(`vendor-reviews/${vendorId}/`);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  const updateReview = async (reviewId, payload) => {
    if (!vendorId) return;
    setSavingId(reviewId);
    try {
      await apiInstance.patch(`vendor-reviews/${vendorId}/${reviewId}/`, payload);
      await fetchReviews();
      Swal.fire({ icon: "success", text: "Review updated" });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: "error", text: "Could not update review" });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <VendorLayout>
      <main className="mb-5">
        <div className="container px-4">
          <h3 className="mb-3">
            <i className="fas fa-star text-primary" /> Reviews
          </h3>

          <section className="row rounded shadow p-3">
            <div className="col-lg-12">
              <table className="table align-middle mb-0 bg-white">
                <thead className="bg-light">
                  <tr>
                    <th>Product</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Reply</th>
                    <th>Active</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr key={r.id}>
                      <td>{r.product?.title || "N/A"}</td>
                      <td>{r.rating || "N/A"}</td>
                      <td style={{ maxWidth: 260 }}>{r.review || "-"}</td>
                      <td style={{ minWidth: 220 }}>
                        <textarea
                          className="form-control"
                          rows={2}
                          value={r.reply || ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            setReviews((prev) =>
                              prev.map((x) =>
                                x.id === r.id ? { ...x, reply: v } : x,
                              ),
                            );
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={Boolean(r.active)}
                          onChange={(e) => {
                            const v = e.target.checked;
                            setReviews((prev) =>
                              prev.map((x) =>
                                x.id === r.id ? { ...x, active: v } : x,
                              ),
                            );
                          }}
                        />
                      </td>
                      <td>{moment(r.date).format("MMM D, YYYY")}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={savingId === r.id}
                          onClick={() =>
                            updateReview(r.id, {
                              reply: r.reply || "",
                              active: Boolean(r.active),
                            })
                          }
                        >
                          {savingId === r.id ? "Saving…" : "Save"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {reviews.length < 1 && (
                <h5 className="p-3 mb-0">No reviews yet</h5>
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

export default Reviews;

