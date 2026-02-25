import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import VendorLayout from "./VendorLayout";

function Shop() {
  const userData = UserData();
  const vendorId = userData?.vendor_id;

  const [shop, setShop] = useState(null);

  useEffect(() => {
    if (!vendorId) return;
    apiInstance
      .get(`vendor/shop/${vendorId}/`)
      .then((res) => setShop(res.data))
      .catch((e) => {
        console.error(e);
        setShop(null);
      });
  }, [vendorId]);

  return (
    <VendorLayout>
      <main className="mb-5">
        <div className="container px-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="mb-0">
              <i className="fas fa-store text-primary" /> Your Shop
            </h3>
            <Link className="btn btn-primary" to="/vendor/shop/update/">
              <i className="fas fa-edit" /> Update shop
            </Link>
          </div>

          <section className="row rounded shadow p-3">
            {!vendorId && <h5 className="mb-0">Vendor ID not available.</h5>}
            {vendorId && !shop && <h5 className="mb-0">Loading shop…</h5>}
            {shop && (
              <>
                <div className="col-md-3">
                  {shop.image && (
                    <img
                      src={shop.image}
                      alt={shop.name || "Shop"}
                      style={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 12,
                      }}
                    />
                  )}
                </div>
                <div className="col-md-9">
                  <h4 className="mb-1">{shop.name || "No name"}</h4>
                  <p className="text-muted mb-2">{shop.slug || "-"}</p>
                  <p className="mb-2">{shop.description || "-"}</p>
                  <p className="mb-0">
                    <strong>Mobile:</strong> {shop.mobile || "-"}
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </VendorLayout>
  );
}

export default Shop;

