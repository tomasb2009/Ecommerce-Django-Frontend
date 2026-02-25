import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment";

import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import VendorLayout from "./VendorLayout";

function normalizeBool(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return ["true", "1", "yes", "on"].includes(value.trim().toLowerCase());
  }
  return Boolean(value);
}

function Products() {
  const userData = UserData();
  const vendorId = userData?.vendor_id;

  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    if (!vendorId) return;
    setLoading(true);
    try {
      const url =
        filter && filter !== "all"
          ? `vendor-prodct-filter/${vendorId}/?filter=${encodeURIComponent(filter)}`
          : `vendor/products/${vendorId}/`;
      const res = await apiInstance.get(url);
      const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setProducts(data);
    } catch (e) {
      console.error(e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId, filter]);

  const counts = useMemo(() => {
    const c = { all: 0, published: 0, in_review: 0, draft: 0, disabled: 0 };
    c.all = products.length;
    for (const p of products) {
      if (p?.status && c[p.status] !== undefined) c[p.status] += 1;
    }
    return c;
  }, [products]);

  const handleDelete = async (productId) => {
    if (!vendorId) return;
    const result = await Swal.fire({
      title: "Delete product?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;

    try {
      await apiInstance.delete(`vendor/product/${vendorId}/${productId}/`);
      await fetchProducts();
      Swal.fire({ icon: "success", text: "Product deleted" });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: "error", text: "Could not delete product" });
    }
  };

  return (
    <VendorLayout>
      <main className="mb-5">
        <div className="container px-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="mb-0">
              <i className="fas fa-boxes text-primary" /> Products
            </h3>
            <Link className="btn btn-primary" to="/vendor/product/new/">
              <i className="fas fa-plus" /> Add product
            </Link>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Filter</label>
              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All ({counts.all})</option>
                <option value="published">
                  Published ({counts.published})
                </option>
                <option value="in_review">
                  In Review ({counts.in_review})
                </option>
                <option value="draft">Draft ({counts.draft})</option>
                <option value="disabled">
                  Disabled ({counts.disabled})
                </option>
              </select>
            </div>
          </div>

          <section className="row rounded shadow p-3">
            <div className="col-lg-12 mb-4 mb-lg-0 h-100">
              <table className="table align-middle mb-0 bg-white">
                <thead className="bg-light">
                  <tr>
                    <th>Product</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {p.image && (
                            <img
                              src={p.image}
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 10,
                              }}
                              alt={p.title || "Product"}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          <div className={p.image ? "ms-3" : ""}>
                            <p className="fw-bold mb-1">{p.title || "No title"}</p>
                            <p className="text-muted mb-0">
                              #{p.pid || "N/A"} • {p.slug || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {String(p.status || "").toUpperCase()}
                        </span>
                      </td>
                      <td>${p.price || "0.00"}</td>
                      <td>
                        {normalizeBool(p.in_stock) ? (
                          <span className="badge bg-success">
                            In stock ({p.stock_qty})
                          </span>
                        ) : (
                          <span className="badge bg-danger">
                            Out of stock
                          </span>
                        )}
                      </td>
                      <td>{moment(p.date).format("MMM D, YYYY")}</td>
                      <td>
                        <Link
                          className="btn btn-link btn-sm btn-rounded"
                          to={`/vendor/product/${p.id}/edit/`}
                        >
                          Edit <i className="fas fa-edit" />
                        </Link>
                        <button
                          className="btn btn-link btn-sm btn-rounded text-danger"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete <i className="fas fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {loading && <p className="p-3 mb-0">Loading…</p>}
              {!loading && products.length < 1 && (
                <h5 className="p-3 mb-0">No products yet</h5>
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

export default Products;

