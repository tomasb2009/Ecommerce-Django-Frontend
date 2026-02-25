import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import VendorLayout from "./VendorLayout";

function matchesVendor(itemVendor, vendorId) {
  const a = Number(itemVendor?.id ?? itemVendor);
  const b = Number(vendorId);
  return Number.isFinite(a) && Number.isFinite(b) && a === b;
}

function OrderDetail() {
  const userData = UserData();
  const vendorId = userData?.vendor_id;

  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const params = useParams();

  useEffect(() => {
    if (!vendorId || !params.order_oid) return;
    setLoading(true);
    apiInstance
      .get(`vendor/orders/${vendorId}/${params.order_oid}/`)
      .then((res) => {
        const o = res.data || {};
        setOrder(o);
        const items = Array.isArray(o.orderitem) ? o.orderitem : [];
        setOrderItems(items);
      })
      .catch((err) => {
        console.error(err);
        setOrder({});
        setOrderItems([]);
      })
      .finally(() => setLoading(false));
  }, [vendorId, params.order_oid]);

  const vendorItems = useMemo(() => {
    if (!Array.isArray(orderItems) || !vendorId) return [];
    return orderItems.filter((i) => {
      if (!i || !i.vendor) return false;
      return matchesVendor(i.vendor, vendorId);
    });
  }, [orderItems, vendorId]);

  return (
    <VendorLayout>
      <main className="mb-5">
        <div className="container px-4">
          <section className="mb-5">
            <h3 className="mb-3">
              <i className="fas fa-shopping-cart text-primary" /> #
              {order.oid}
            </h3>

            {loading ? (
                      <div className="row rounded shadow p-3">
                        <p className="mb-0">Loading…</p>
                      </div>
                    ) : (
                      <div className="row gx-xl-5">
                        <div className="col-lg-3 mb-4 mb-lg-0">
                        <div className="rounded shadow" style={{ backgroundColor: "#9CD5FF" }}>
                            <div className="card-body">
                              <p className="mb-1">Total</p>
                              <h2 className="mb-0">${order.total}</h2>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 mb-4 mb-lg-0">
                        <div className="rounded shadow" style={{ backgroundColor: "#7AAACE" }}>
                            <div className="card-body">
                              <p className="mb-1">Payment</p>
                              <h2 className="mb-0">
                                {String(order?.payment_status || "").toUpperCase()}
                              </h2>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 mb-4 mb-lg-0">
                        <div className="rounded shadow" style={{ backgroundColor: "#355872", color: "#fff" }}>
                            <div className="card-body">
                              <p className="mb-1">Order status</p>
                              <h2 className="mb-0">
                                {String(order?.order_status || "").toUpperCase()}
                              </h2>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 mb-4 mb-lg-0">
                        <div className="rounded shadow" style={{ backgroundColor: "#F7F8F0" }}>
                            <div className="card-body">
                              <p className="mb-1">Date</p>
                              <h2 className="mb-0">
                                {order?.date ? moment(order.date).format("MMM D") : "-"}
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
          </section>

          <section>
            <div className="row rounded shadow p-3">
              <div className="col-lg-12 mb-4 mb-lg-0">
                <h5 className="mb-3">Items (this vendor)</h5>
                <table className="table align-middle mb-0 bg-white">
                  <thead className="bg-light">
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorItems.map((i) => (
                      <tr key={i.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {i.product?.image && (
                              <img
                                src={i.product.image}
                                style={{
                                  width: 80,
                                  height: 80,
                                  objectFit: "cover",
                                  borderRadius: 10,
                                }}
                                alt={i.product?.title || "Product"}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            )}
                            <p className="text-muted mb-0 ms-3">
                              {i.product?.title || "Product"}
                            </p>
                          </div>
                        </td>
                        <td>${i.price || "0.00"}</td>
                        <td>{i.qty || 0}</td>
                        <td>${i.total || "0.00"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!loading && vendorItems.length < 1 && (
                  <h6 className="p-3 mb-0">No items for this vendor.</h6>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </VendorLayout>
  );
}

export default OrderDetail;

