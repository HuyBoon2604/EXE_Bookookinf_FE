import { useState, useEffect } from "react";
import { FiArrowUp, FiArrowDown, FiFilter, FiRefreshCw } from "react-icons/fi";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("7days");

  const salesData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sales",
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1
      }
    ]
  };

  const categoryData = {
    labels: ["Electronics", "Clothing", "Food", "Books"],
    datasets: [
      {
        data: [30, 25, 20, 25],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0"
        ]
      }
    ]
  };

  const performanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Performance",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgba(54, 162, 235, 0.5)"
      }
    ]
  };

  const kpis = [
    { title: "Total Revenue", value: "$157,892", trend: "up", percentage: "12%" },
    { title: "Avg Order Value", value: "$248", trend: "up", percentage: "8%" },
    { title: "Conversion Rate", value: "3.2%", trend: "down", percentage: "2%" },
    { title: "Active Users", value: "1,578", trend: "up", percentage: "15%" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
      
    <div id="Dashboard">
    <div className="container-dash">
      {/* Header */}
      <div className="header">
        <h1>Sales Dashboard</h1>
        <div className="filters">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="select-box"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <button className="button button-filter">
            <FiFilter /> Filter
          </button>
          <button className="button button-refresh">
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-cards">
        {kpis.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <p>{kpi.title}</p>
            <h2>{kpi.value}</h2>
            <div className={`kpi-percentage ${kpi.trend === "up" ? "text-green" : "text-red"}`}>
              {kpi.trend === "up" ? <FiArrowUp /> : <FiArrowDown />}
              <span>{kpi.percentage}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart-card">
          <h3>Sales Trend</h3>
          <Line data={salesData} options={{ responsive: true }} />
        </div>
        <div className="chart-card">
          <h3>Performance Metrics</h3>
          <Bar data={performanceData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Product Table */}
      <div className="table-container">
        <h3>Top Products</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Sales</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Product A</td>
              <td>1,234</td>
              <td>$12,340</td>
            </tr>
            <tr>
              <td>Product B</td>
              <td>987</td>
              <td>$9,870</td>
            </tr>
            <tr>
              <td>Product C</td>
              <td>756</td>
              <td>$7,560</td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
    </div>
    
  );
};

export default Dashboard;
