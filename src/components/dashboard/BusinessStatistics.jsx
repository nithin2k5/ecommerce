import React, { useState, useEffect } from 'react';
import {
  FaChartLine, 
  FaShoppingCart, 
  FaDollarSign, 
  FaUsers, 
  FaBox, 
  FaPercent, 
  FaLayerGroup,
  FaExchangeAlt,
  FaCalendarAlt,
  FaChartBar
} from 'react-icons/fa';
import './BusinessStatistics.css';

const BusinessStatistics = ({ businessId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week');
  const [stats, setStats] = useState({
    revenue: {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      lastMonth: 0,
      growth: 0
    },
    orders: {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      last30Days: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    },
    products: {
      total: 0,
      active: 0,
      outOfStock: 0,
      lowStock: 0
    },
    customers: {
      total: 0,
      new: 0,
      returning: 0
    },
    topProducts: [],
    topCategories: [],
    salesByDay: []
  });

  // Fetch statistics when component mounts or timeframe/businessId changes
  useEffect(() => {
    fetchStatistics();
  }, [timeframe, businessId]);

  // Fetch business statistics from API (mock data for demo)
  const fetchStatistics = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Normally would call API, using mock data for now
      // const response = await businessService.getStatistics(businessId, timeframe);
      // setStats(response);
      
      // Mock data for demo
      setStats({
        revenue: {
          total: 1642899.50,
          today: 24850.75,
          thisWeek: 147500.25,
          thisMonth: 503875.50,
          lastMonth: 453875.50,
          growth: 11.02
        },
        orders: {
          total: 2874,
          today: 37,
          thisWeek: 235,
          thisMonth: 878,
          last30Days: 837,
          pending: 28,
          processing: 42,
          shipped: 97,
          delivered: 2641,
          cancelled: 66
        },
        products: {
          total: 372,
          active: 349,
          outOfStock: 8,
          lowStock: 15
        },
        customers: {
          total: 1253,
          new: 168,
          returning: 1085
        },
        topProducts: [
          { id: 1, name: 'iPhone 14 Pro Max', sales: 87, revenue: 130500.00 },
          { id: 2, name: 'Samsung 55" QLED TV', sales: 42, revenue: 63000.00 },
          { id: 3, name: 'Nike Air Max 270', sales: 36, revenue: 5400.00 },
          { id: 4, name: 'Sony WH-1000XM4', sales: 29, revenue: 8700.00 },
          { id: 5, name: 'MacBook Pro M2', sales: 24, revenue: 43200.00 }
        ],
        topCategories: [
          { id: 1, name: 'Electronics', sales: 524, revenue: 786000.00 },
          { id: 2, name: 'Mobile Phones', sales: 342, revenue: 512000.00 },
          { id: 3, name: 'Fashion', sales: 826, revenue: 165200.00 },
          { id: 4, name: 'Appliances', sales: 187, revenue: 112200.00 },
          { id: 5, name: 'Provisions', sales: 995, revenue: 67500.00 }
        ],
        salesByDay: [
          { day: 'Monday', orders: 127, revenue: 76200.00 },
          { day: 'Tuesday', orders: 118, revenue: 70800.00 },
          { day: 'Wednesday', orders: 132, revenue: 79200.00 },
          { day: 'Thursday', orders: 141, revenue: 84600.00 },
          { day: 'Friday', orders: 152, revenue: 91200.00 },
          { day: 'Saturday', orders: 187, revenue: 112200.00 },
          { day: 'Sunday', orders: 165, revenue: 99000.00 }
        ]
      });
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calculate percentage change
  const calculateChange = (current, previous) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  if (isLoading) {
    return <div className="statistics-loading">Loading statistics...</div>;
  }

  return (
    <div className="business-statistics">
      <div className="statistics-header">
        <h2>Business Analytics</h2>
        <div className="timeframe-selector">
          <button 
            className={timeframe === 'week' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('week')}
          >
            This Week
          </button>
          <button 
            className={timeframe === 'month' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('month')}
          >
            This Month
          </button>
          <button 
            className={timeframe === 'quarter' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('quarter')}
          >
            This Quarter
          </button>
          <button 
            className={timeframe === 'year' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('year')}
          >
            This Year
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon revenue-icon">
            <FaDollarSign />
          </div>
          <div className="stat-details">
            <h3>Total Revenue</h3>
            <p className="stat-number">{formatCurrency(stats.revenue.total)}</p>
            <span className="stat-info">
              <span className={`growth ${stats.revenue.growth >= 0 ? 'positive' : 'negative'}`}>
                {stats.revenue.growth >= 0 ? '+' : ''}{stats.revenue.growth.toFixed(1)}%
              </span> vs last period
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon order-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-details">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.orders.total.toLocaleString()}</p>
            <span className="stat-info">
              {stats.orders.today} today | {stats.orders.thisWeek} this week
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon product-icon">
            <FaBox />
          </div>
          <div className="stat-details">
            <h3>Products</h3>
            <p className="stat-number">{stats.products.total.toLocaleString()}</p>
            <span className="stat-info">
              {stats.products.lowStock > 0 && (
                <span className="low-stock-alert">{stats.products.lowStock} low stock</span>
              )}
              {stats.products.outOfStock > 0 && (
                <span className="out-of-stock-alert"> | {stats.products.outOfStock} out of stock</span>
              )}
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon customer-icon">
            <FaUsers />
          </div>
          <div className="stat-details">
            <h3>Customers</h3>
            <p className="stat-number">{stats.customers.total.toLocaleString()}</p>
            <span className="stat-info">
              {stats.customers.new} new | {stats.customers.returning} returning
            </span>
          </div>
        </div>
      </div>

      {/* Order Status Section */}
      <div className="stats-section">
        <div className="section-header">
          <h3>Order Status</h3>
          <div className="section-icon"><FaExchangeAlt /></div>
        </div>
        <div className="order-status-grid">
          <div className="status-card pending">
            <div className="status-number">{stats.orders.pending}</div>
            <div className="status-label">Pending</div>
          </div>
          <div className="status-card processing">
            <div className="status-number">{stats.orders.processing}</div>
            <div className="status-label">Processing</div>
          </div>
          <div className="status-card shipped">
            <div className="status-number">{stats.orders.shipped}</div>
            <div className="status-label">Shipped</div>
          </div>
          <div className="status-card delivered">
            <div className="status-number">{stats.orders.delivered}</div>
            <div className="status-label">Delivered</div>
          </div>
          <div className="status-card cancelled">
            <div className="status-number">{stats.orders.cancelled}</div>
            <div className="status-label">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Two-column layout for reports */}
      <div className="stats-columns">
        <div className="stats-column">
          {/* Top Selling Products */}
          <div className="stats-section">
            <div className="section-header">
              <h3>Top Selling Products</h3>
              <div className="section-icon"><FaBox /></div>
            </div>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sales</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.topProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sales}</td>
                    <td>{formatCurrency(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="stats-column">
          {/* Top Categories */}
          <div className="stats-section">
            <div className="section-header">
              <h3>Top Categories</h3>
              <div className="section-icon"><FaLayerGroup /></div>
            </div>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Sales</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.topCategories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.sales}</td>
                    <td>{formatCurrency(category.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sales by Day of Week */}
      <div className="stats-section">
        <div className="section-header">
          <h3>Sales by Day of Week</h3>
          <div className="section-icon"><FaCalendarAlt /></div>
        </div>
        <div className="day-sales-grid">
          {stats.salesByDay.map((day) => (
            <div key={day.day} className="day-card">
              <div className="day-name">{day.day}</div>
              <div className="day-orders">
                <span className="day-orders-icon"><FaShoppingCart /></span>
                <span className="day-orders-value">{day.orders}</span>
              </div>
              <div className="day-revenue">
                <span className="day-revenue-icon"><FaDollarSign /></span>
                <span className="day-revenue-value">{formatCurrency(day.revenue)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Trend - Placeholder for chart */}
      <div className="stats-section">
        <div className="section-header">
          <h3>Revenue Trend</h3>
          <div className="section-icon"><FaChartBar /></div>
        </div>
        <div className="chart-container">
          <div className="chart-placeholder">
            <FaChartBar className="chart-icon" />
            <div className="chart-message">Chart visualization coming soon</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessStatistics; 