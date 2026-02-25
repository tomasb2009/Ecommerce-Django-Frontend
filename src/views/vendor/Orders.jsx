import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import VendorLayout from "./VendorLayout";

function Orders() {
  const userData = UserData();
  const vendorId = userData?.vendor_id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!vendorId) return;
    setLoading(true);
    apiInstance
      .get(`vendor/orders/${vendorId}/`)
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error(err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [vendorId]);

  const statusCounts = useMemo(() => {
    return orders.reduce((counts, order) => {
      const status = order.order_status;
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});
  }, [orders]);

  return (
    <VendorLayout>
      <main className="mb-5">
        <div className="container px-4">
          <section className="mb-5">
            <h3 className="mb-3">
              <i className="fas fa-shopping-cart text-primary" /> Orders
            </h3>
            <div className="row gx-xl-5">
              <div className="col-lg-4 mb-4 mb-lg-0">
                        <div className="rounded shadow" style={{ backgroundColor: "#9CD5FF" }}>
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div>
                        <p className="mb-1">Orders</p>
                        <h2 className="mb-0">{orders.length}</h2>
                      </div>
                      <div className="flex-grow-1 ms-5">
                        <div className="p-3 badge-primary rounded-4">
                          <i
                            className="fas fa-shopping-cart fs-4"
                            style={{ color: "#004D40" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mb-4 mb-lg-0">
                        <div className="rounded shadow" style={{ backgroundColor: "#7AAACE" }}>
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div>
                        <p className="mb-1">Pending</p>
                        <h2 className="mb-0">
                          {statusCounts["pending"] || 0}
                        </h2>
                      </div>
                      <div className="flex-grow-1 ms-5">
                        <div className="p-3 badge-primary rounded-4">
                          <i
                            className="fas fa-clock fs-4"
                            style={{ color: "#6200EA" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mb-4 mb-lg-0">
                        <div className="rounded shadow" style={{ backgroundColor: "#355872", color: "#fff" }}>
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div>
                        <p className="mb-1">Fulfilled</p>
                        <h2 className="mb-0">
                          {statusCounts["fulfilled"] || 0}
                        </h2>
                      </div>
                      <div className="flex-grow-1 ms-5">
                        <div className="p-3 badge-primary rounded-4">
                          <i
                            className="fas fa-check-circle fs-4"
                            style={{ color: "#01579B" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="row rounded shadow p-3">
              <div className="col-lg-12 mb-4 mb-lg-0 h-100">
                <table className="table align-middle mb-0 bg-white">
                  <thead className="bg-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <p className="fw-bold mb-1">#{o.oid}</p>
                          <p className="text-muted mb-0">
                            {moment(o.date).format("MMMM Do YYYY")}
                          </p>
                        </td>
                        <td>
                          <p className="fw-normal mb-1">
                            {String(o.payment_status || "").toUpperCase()}
                          </p>
                        </td>
                        <td>
                          <p className="fw-normal mb-1">
                            {String(o.order_status || "").toUpperCase()}
                          </p>
                        </td>
                        <td>${o.total}</td>
                        <td>
                          <Link
                            className="btn btn-link btn-sm btn-rounded"
                            to={`/vendor/orders/${o.oid}/`}
                          >
                            View <i className="fas fa-eye" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {loading && <p className="p-3 mb-0">Loading…</p>}
                {!loading && orders.length < 1 && (
                  <h5 className="p-3 mb-0">No orders yet</h5>
                )}
                {!vendorId && (
                  <h5 className="p-3 mb-0">
                    Vendor ID not available for this user.
                  </h5>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </VendorLayout>
  );
}

export default Orders;

