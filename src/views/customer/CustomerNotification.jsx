import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import apiInstante from "../../utils/axios";
import UserData from "../plugins/UserData";
import Swal from "sweetalert2";
import moment from "moment";

function CustomerNotification() {
  const [notifications, setNotifications] = useState([]);

  const fetchNoti = () => {
    apiInstante
      .get(`customer/notification/${UserData().user_id}`)
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        setNotifications(data);
      });
  };

  useEffect(() => {
    fetchNoti();
  }, []);

  const MarkNotiAsSeen = (userId, notiId) => {
    apiInstante.get(`customer/notification/${userId}/${notiId}/`).then(() => {
      fetchNoti();

      Swal.fire({
        text: "Notification marked as seen",
        icon: "success",
      });
    });
  };

  return (
    <main className="mt-5">
      <div className="container">
        <section className="">
          <div className="row">
            {/* Sidebar Here */}

            <SideBar />

            <div className="col-lg-9 mt-1">
              <section className="">
                <main className="mb-5" style={{}}>
                  <div className="container px-4">
                    <section className="">
                      <h3 className="mb-3">
                        <i className="fas fa-bell" /> Notifications{" "}
                      </h3>
                      <div className="list-group">
                        {notifications?.map((n, index) => (
                          <a
                            href="#"
                            className="list-group-item list-group-item-action"
                            aria-current="true"
                          >
                            <div className="d-flex w-100 justify-content-between">
                              <h5 className="mb-1">Order Confirmed</h5>
                              <small className="text-muted">
                                {moment(n.date).format("MMM D, YYYY")}
                              </small>
                            </div>
                            <p className="mb-1">
                              Your order has been confirmed
                            </p>

                            <button
                              className="btn btn-success mt-3"
                              onClick={() =>
                                MarkNotiAsSeen(UserData()?.user_id, n.id)
                              }
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          </a>
                        ))}

                        {notifications.length < 1 && (
                          <h4 className="p-4">No Notifications Yet</h4>
                        )}
                      </div>
                    </section>
                  </div>
                </main>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CustomerNotification;
