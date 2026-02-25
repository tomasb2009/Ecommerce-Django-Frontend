import { useState, useEffect } from "react";
import VendorLayout from "./VendorLayout";
import apiInstance from "../../utils/axios";
import UserData from "../plugins/UserData";
import { Line, Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [orderChartData, setOrderChartData] = useState([]);
  const [productsChartData, setProductsChartData] = useState([]);

  const fetchCartData = async (vendorId) => {
    try {
      const order_response = await apiInstance.get(
        `vendor-orders-chart/${vendorId}`,
      );
      setOrderChartData(Array.isArray(order_response.data) ? order_response.data : []);

      const product_response = await apiInstance.get(
        `vendor-products-chart/${vendorId}`,
      );
      setProductsChartData(Array.isArray(product_response.data) ? product_response.data : []);
    } catch (error) {
      console.error("Error fetching vendor chart data:", error);
      setOrderChartData([]);
      setProductsChartData([]);
    }
  };

  useEffect(() => {
    const userData = UserData();
    const vendorId = userData?.vendor_id;

    if (!vendorId) {
      console.warn(
        "Vendor ID no disponible. ¿El usuario tiene perfil de vendor?",
      );
      return;
    }

    apiInstance
      .get(`vendor/stats/${vendorId}`)
      .then((response) => {
        // El backend devuelve un array con un objeto
        const data = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        setStats({
          products: data?.products ?? 0,
          orders: data?.orders ?? 0,
          revenue: data?.revenue ?? 0,
        });
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        setStats({ products: 0, orders: 0, revenue: 0 });
      });

    // Cargar datos de los gráficos usando el mismo vendorId válido
    fetchCartData(vendorId);
  }, []);

  // Backend keys:
  // - /vendor-orders-chart/ -> [{ month: 1..12, orders: N }]
  // - /vendor-products-chart/ -> [{ month: 1..12, product: N }]
  const order_months = Array.isArray(orderChartData) 
    ? orderChartData.map((item) => item.month).filter(Boolean)
    : [];
  const order_count = Array.isArray(orderChartData)
    ? orderChartData.map((item) => item.orders || 0)
    : [];

  const products_months = Array.isArray(productsChartData)
    ? productsChartData.map((item) => item.month).filter(Boolean)
    : [];
  const products_count = Array.isArray(productsChartData)
    ? productsChartData.map((item) => item.product || 0)
    : [];

  const order_data = {
    labels: order_months.length > 0 ? order_months : ["No data"],
    datasets: [
      {
        label: "Total Orders",
        data: order_count.length > 0 ? order_count : [0],
        fill: true,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };
  const products_data = {
    labels: products_months.length > 0 ? products_months : ["No data"],
    datasets: [
      {
        label: "Total Products",
        data: products_count.length > 0 ? products_count : [0],
        fill: true,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return (
    <VendorLayout>
      <div className="row mb-3">
        <div className="col-xl-3 col-lg-6 mb-2">
          <div className="card card-inverse card-success">
            <div className="card-block bg-success p-3">
              <div className="rotate">
                <i className="bi bi-grid fa-5x" />
              </div>
              <h6 className="text-uppercase">Products</h6>
              <h1 className="display-1">{stats.products}</h1>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 mb-2">
          <div className="card card-inverse card-danger">
            <div className="card-block bg-danger p-3">
              <div className="rotate">
                <i className="bi bi-cart-check fa-5x" />
              </div>
              <h6 className="text-uppercase">Orders</h6>
              <h1 className="display-1">{stats.orders}</h1>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 mb-2">
          <div className="card card-inverse card-warning">
            <div className="card-block bg-warning p-3">
              <div className="rotate">
                <i className="bi bi-currency-dollar fa-5x" />
              </div>
              <h6 className="text-uppercase">Revenue</h6>
              <h1 className="display-1">${stats.revenue || "0.00"}</h1>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="container">
        <div className="row my-3">
          <div className="col-12">
            <h4>Chart Analytics</h4>
          </div>
        </div>
        <div className="row my-2">
          <div className="col-lg-6 col-md-12 py-1">
            <div className="card h-100">
              <div
                className="card-body"
                style={{ height: 320, position: "relative" }}
              >
                <h6 className="mb-3">Orders per month</h6>
                <Bar
                  data={order_data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 py-1">
            <div className="card h-100">
              <div
                className="card-body"
                style={{ height: 320, position: "relative" }}
              >
                <h6 className="mb-3">Products per month</h6>
                <Bar
                  data={products_data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}

export default Dashboard;
