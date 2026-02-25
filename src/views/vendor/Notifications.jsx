import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";

import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import VendorLayout from "./VendorLayout";

function Notifications() {
  const userData = UserData();
  const vendorId = userData?.vendor_id;

  const [notifications, setNotifications] = useState([]);
  const [summary, setSummary] = useState({ total: 0, unseen: 0 });

  const fetchNoti = async () => {
    if (!vendorId) return;
    try {
      const res = await apiInstance.get(`vendor/notification/${vendorId}/`);
      const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setNotifications(data);
    } catch (e) {
      console.error(e);
      setNotifications([]);
    }
  };

  const fetchSummary = async () => {
    if (!vendorId) return;
    try {
      const res = await apiInstance.get(`vendor/notification-summary/${vendorId}/`);
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      setSummary({ total: data?.total ?? 0, unseen: data?.unseen ?? 0 });
    } catch (e) {
      console.error(e);
      setSummary({ total: 0, unseen: 0 });
    }
  };

  useEffect(() => {
    fetchNoti();
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  const markAsSeen = async (notiId) => {
    if (!vendorId) return;
    try {
      await apiInstance.get(`vendor/notification/${vendorId}/${notiId}/`);
      await fetchNoti();
      await fetchSummary();
      Swal.fire({ icon: "success", text: "Notification marked as seen" });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: "error", text: "Could not mark as seen" });
    }
  };

  return (
    <VendorLayout>
      <main className="mb-5">
        <div className="container px-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="mb-0">
              <i className="fas fa-bell text-primary" /> Notifications
            </h3>
            <div className="text-muted">
              Total: {summary.total} • Unseen: {summary.unseen}
            </div>
          </div>

          <div className="list-group">
            {notifications?.map((n) => {
              const oid = n?.order?.oid ?? n?.order;
              const title = oid ? `New sale: #${oid}` : "New notification";
              const subtitle = n?.order_item?.product?.title
                ? `Product: ${n.order_item.product.title}`
                : "You have a new event in your shop";

              return (
                <div
                  key={n.id}
                  className="list-group-item list-group-item-action"
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{title}</h5>
                    <small className="text-muted">
                      {moment(n.date).format("MMM D, YYYY")}
                    </small>
                  </div>
                  <p className="mb-1">{subtitle}</p>
                  <button
                    className="btn btn-success mt-2"
                    onClick={() => markAsSeen(n.id)}
                  >
                    <i className="fas fa-eye" /> Mark as seen
                  </button>
                </div>
              );
            })}

            {notifications.length < 1 && (
              <h4 className="p-4">No Notifications Yet</h4>
            )}
            {!vendorId && (
              <h4 className="p-4">
                Vendor ID not available for this user.
              </h4>
            )}
          </div>
        </div>
      </main>
    </VendorLayout>
  );
}

export default Notifications;

