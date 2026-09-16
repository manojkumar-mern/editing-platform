'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  // Login Form state (starts empty for clean user typing)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Tab state: 'overview' | 'table'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dashboard Data state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Add Booking Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newForm, setNewForm] = useState({
    clientName: '',
    companyName: '',
    email: '',
    phone: '',
    serviceType: 'Branding Films',
    budgetRange: '$3,000 - $5,000',
    timeline: 'Standard (2-4 Weeks)',
    description: '',
    footageLink: '',
    status: 'pending',
  });

  // Verify auth session on load
  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch('/api/admin/me');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setAdminUser(data.user);
          loadBookings();
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyAuth();
  }, []);

  // Fetch bookings
  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch('/api/admin/bookings');
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setAdminUser(data.user);
        loadBookings();
      } else {
        setAuthError(data.error || 'Authentication failed. Invalid email or password.');
      }
    } catch (err) {
      setAuthError('Connection error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  // Update Status
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId || b.inquiryId === bookingId ? { ...b, status: newStatus } : b))
        );
        if (selectedBooking && (selectedBooking._id === bookingId || selectedBooking.inquiryId === bookingId)) {
          setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  // Handle Mark as Contacted & Navigate back to Registry
  const handleMarkContactedAndReturn = async (bookingId) => {
    await handleStatusChange(bookingId, 'contacted');
    setSelectedBooking(null);
    setActiveTab('table');
  };

  // Delete Booking
  const handleDeleteBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking record?')) return;
    try {
      const res = await fetch(`/api/admin/bookings?id=${bookingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.filter((b) => b._id !== bookingId && b.inquiryId !== bookingId));
        if (selectedBooking && (selectedBooking._id === bookingId || selectedBooking.inquiryId === bookingId)) {
          setSelectedBooking(null);
        }
      }
    } catch (err) {
      alert('Failed to delete booking.');
    }
  };

  // Create Manual Booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm),
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBookings((prev) => [data.booking, ...prev]);
        setIsAddModalOpen(false);
        setNewForm({
          clientName: '',
          companyName: '',
          email: '',
          phone: '',
          serviceType: 'Branding Film & Commercial',
          budgetRange: '$3,000 - $5,000',
          timeline: 'Standard (2-4 Weeks)',
          description: '',
          footageLink: '',
          status: 'pending',
        });
      } else {
        alert(data.error || 'Failed to create booking.');
      }
    } catch (err) {
      alert('Error creating booking.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Calculated Dashboard Analytics
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'pending').length;
    const reviewed = bookings.filter((b) => b.status === 'reviewed').length;
    const contacted = bookings.filter((b) => b.status === 'contacted').length;
    const archived = bookings.filter((b) => b.status === 'archived').length;

    let pipelineVal = 0;
    bookings.forEach((b) => {
      if (b.budgetRange?.includes('10,000')) pipelineVal += 8000;
      else if (b.budgetRange?.includes('5,000')) pipelineVal += 4000;
      else if (b.budgetRange?.includes('3,000')) pipelineVal += 2500;
      else if (b.budgetRange?.includes('1,500')) pipelineVal += 1800;
      else pipelineVal += 1500;
    });

    return { total, pending, reviewed, contacted, archived, pipelineVal };
  }, [bookings]);

  // Chart 1: Monthly Volume distribution
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthCounts = new Array(12).fill(0);

    bookings.forEach((b) => {
      const date = new Date(b.createdAt || Date.now());
      const m = date.getMonth();
      monthCounts[m] += 1;
    });

    const maxVal = Math.max(...monthCounts, 4);
    return months.map((m, idx) => ({
      month: m,
      count: monthCounts[idx],
      heightPct: Math.round(((monthCounts[idx] || (idx >= 6 ? (idx % 3) + 1 : 1)) / maxVal) * 100),
    }));
  }, [bookings]);

  // Chart 2: Service Distribution
  const serviceStats = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      const st = b.serviceType || 'Other Video Editing';
      map[st] = (map[st] || 0) + 1;
    });

    const total = bookings.length || 1;
    return Object.entries(map).map(([service, count]) => ({
      service,
      count,
      pct: Math.round((count / total) * 100),
    }));
  }, [bookings]);

  // Filtered Bookings for Table
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        b.clientName.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        (b.companyName && b.companyName.toLowerCase().includes(q)) ||
        b.serviceType.toLowerCase().includes(q) ||
        (b.inquiryId && b.inquiryId.toLowerCase().includes(q));

      return matchesStatus && matchesQuery;
    });
  }, [bookings, filterStatus, searchQuery]);

  if (checkingAuth) {
    return (
      <div className="admin-body-wrap flex-col items-center justify-center" style={{ minHeight: '100vh', gap: '1rem' }}>
        <div className="badge-tag" style={{ fontSize: '0.85rem' }}>
          VERIFYING ATZYNC ADMIN CREDENTIALS...
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LOGIN SCREEN WITH BACK TO WEBSITE BUTTON & PLACEHOLDERS
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="admin-body-wrap">
        <div className="admin-login-container">
          <div className="admin-card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
            <div className="flex-col items-center" style={{ gap: '0.5rem', marginBottom: '2rem', textAlign: 'center' }}>
              <Link href="/" className="brand-logo flex-row items-center" style={{ textDecoration: 'none' }}>
                <img
                  src="/logo-white.webp"
                  alt="ATZYNC Media"
                  style={{
                    height: '54px',
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </Link>
              <p style={{ fontSize: '0.8125rem', color: '#a0a0a8', marginTop: '0.25rem' }}>
                Secure Studio Booking & Analytics System
              </p>
            </div>

            {authError && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 59, 48, 0.15)',
                  border: '1px solid rgba(255, 59, 48, 0.3)',
                  borderRadius: '8px',
                  color: '#ff453a',
                  fontSize: '0.8125rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                }}
              >
                {authError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="flex-col" style={{ gap: '1.25rem' }}>
              <div className="flex-col" style={{ gap: '0.4rem' }}>
                <label className="stat-label">Admin Email</label>
                <input
                  type="email"
                  required
                  className="admin-input"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter admin email"
                />
              </div>

              <div className="flex-col" style={{ gap: '0.4rem' }}>
                <label className="stat-label">Admin Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="admin-input"
                    style={{ paddingRight: '4.25rem' }}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.6rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '4px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      padding: '0.25rem 0.55rem',
                      zIndex: 2,
                    }}
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loginLoading} className="admin-btn admin-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.85rem' }}>
                {loginLoading ? 'AUTHENTICATING...' : 'LOGIN TO ADMIN DASHBOARD'}
              </button>

              <Link
                href="/"
                className="admin-btn admin-btn-secondary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem', textDecoration: 'none' }}
              >
                ← BACK TO WEBSITE
              </Link>
            </form>

            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.7rem', color: '#666670' }}>
              ATZYNC MEDIA STUDIO — PRIVATE SYSTEM
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // DASHBOARD SCREEN WITH BACK TO SITE LINK & CONTACTED RETURN
  // -------------------------------------------------------------
  return (
    <div className="admin-body-wrap">
      <div className="admin-layout-wrapper">
        {/* CLEAN LEFT SIDEBAR */}
        <aside className="admin-sidebar">
          {/* Logo Branding + Mobile Hamburger Toggle */}
          <div className="admin-sidebar-header flex-row items-center justify-between">
            <Link href="/" className="brand-logo flex-row items-center" style={{ textDecoration: 'none' }}>
              <img
                src="/logo-white.webp"
                alt="ATZYNC Media"
                style={{
                  height: '38px',
                  width: 'auto',
                  maxWidth: '175px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Link>

            <button
              className="admin-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              <span>{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className={`admin-sidebar-nav-container flex-col ${mobileMenuOpen ? 'open' : ''}`}>
            <span className="stat-label" style={{ fontSize: '0.68rem', marginBottom: '0.65rem', paddingLeft: '0.5rem', color: '#888892' }}>
              NAVIGATION MENU
            </span>

            <button
              onClick={() => {
                setActiveTab('overview');
                setMobileMenuOpen(false);
              }}
              className={`sidebar-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <span>📊</span>
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('table');
                setMobileMenuOpen(false);
              }}
              className={`sidebar-nav-btn ${activeTab === 'table' ? 'active' : ''}`}
            >
              <span>📋</span>
              <span>Bookings Registry ({bookings.length})</span>
            </button>

            <button
              onClick={() => {
                setIsAddModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="sidebar-nav-btn"
              style={{ color: '#ffffff', marginTop: '0.25rem' }}
            >
              <span>➕</span>
              <span>Add New Booking</span>
            </button>

            {/* BACK TO SITE LINK IN SIDEBAR */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="sidebar-nav-btn"
              style={{ color: '#a0a0a8', textDecoration: 'none', marginTop: 'auto' }}
            >
              <span>←</span>
              <span>Back to Website</span>
            </Link>

            {/* Sidebar Footer User Info */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#ffffff', fontWeight: 600 }}>
                {adminUser?.email || 'atzyncmedia@gmail.com'}
              </div>
              <button
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', color: '#ff453a', fontSize: '0.725rem', cursor: 'pointer', padding: 0, marginTop: '0.4rem', fontWeight: 600 }}
              >
                Log out session →
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <main className="admin-main-content">
          {/* Top Navbar Header */}
          <header className="admin-navbar">
            <div className="flex-row items-center admin-nav-title-group" style={{ gap: '1rem' }}>
              <h1 className="admin-nav-heading">
                {activeTab === 'overview' ? 'Dashboard Analytics & Insights' : 'Bookings & Inquiries Registry'}
              </h1>
            </div>

            <div className="flex-row items-center admin-nav-actions" style={{ gap: '0.75rem' }}>
              {activeTab === 'table' && (
                <input
                  type="text"
                  className="admin-input admin-search-input"
                  placeholder="Search clients, email, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              )}

              <button onClick={() => setIsAddModalOpen(true)} className="admin-btn admin-btn-primary">
                + ADD BOOKING
              </button>

              <Link href="/" className="admin-btn admin-btn-secondary" style={{ textDecoration: 'none' }}>
                ← WEBSITE
              </Link>
            </div>
          </header>

          {/* Workspace Body Container */}
          <div className="admin-content-body">
            {/* Metric Stats Cards Row */}
            <div className="admin-stats-grid">
              <div className="admin-card flex-col justify-between">
                <span className="stat-label">Total Booked Clients</span>
                <div className="stat-val">{stats.total}</div>
                <div style={{ fontSize: '0.75rem', color: '#a0a0a8', marginTop: '0.6rem' }}>All Recorded Inquiries</div>
              </div>

              <div className="admin-card flex-col justify-between">
                <span className="stat-label">Pending Action</span>
                <div className="stat-val" style={{ color: '#ffc107' }}>
                  {stats.pending}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a0a0a8', marginTop: '0.6rem' }}>Needs Review</div>
              </div>

              <div className="admin-card flex-col justify-between">
                <span className="stat-label">Contacted Clients</span>
                <div className="stat-val" style={{ color: '#10b981' }}>
                  {stats.contacted}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a0a0a8', marginTop: '0.6rem' }}>In Negotiation</div>
              </div>

              <div className="admin-card flex-col justify-between">
                <span className="stat-label">Reviewed Inquiries</span>
                <div className="stat-val" style={{ color: '#ffffff' }}>
                  {stats.reviewed}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a0a0a8', marginTop: '0.6rem' }}>Scoped & Ready</div>
              </div>
            </div>

            {/* TAB 1: DASHBOARD OVERVIEW ONLY */}
            {activeTab === 'overview' && (
              <div className="grid-2col admin-dashboard-grid" style={{ gap: '1.75rem' }}>
                {/* Chart 1: STYLISH METALLIC BAR GRAPH */}
                <div className="admin-card">
                  <div className="flex-row items-center justify-between" style={{ marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Booking Velocity & Trends</h3>
                      <p style={{ fontSize: '0.75rem', color: '#a0a0a8', marginTop: '0.2rem' }}>12-Month distribution of client inquiries</p>
                    </div>
                    <span className="badge-tag" style={{ fontSize: '0.65rem' }}>BAR GRAPH</span>
                  </div>

                  {/* STYLISH BAR CHART */}
                  <div className="bar-chart-wrapper flex-row items-end justify-between" style={{ paddingBottom: '1.5rem', borderBottom: '1px dashed rgba(255, 255, 255, 0.15)', gap: '0.35rem' }}>
                    {chartData.map((item, idx) => (
                      <div key={idx} className="chart-bar-container">
                        <div className="chart-tooltip">{item.count} Bookings</div>
                        <div
                          className={`chart-bar ${item.count > 0 ? 'chart-bar-active' : 'chart-bar-empty'}`}
                          style={{
                            height: `${Math.max(item.heightPct, 12)}%`,
                          }}
                        ></div>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#a0a0a8' }}>{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart 2: Service Demand Breakdown */}
                <div className="admin-card">
                  <div className="flex-row items-center justify-between" style={{ marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Service Type Demand</h3>
                      <p style={{ fontSize: '0.75rem', color: '#a0a0a8', marginTop: '0.2rem' }}>Category demand analytics</p>
                    </div>
                    <span className="badge-tag" style={{ fontSize: '0.65rem' }}>DEMAND METRICS</span>
                  </div>

                  <div className="flex-col" style={{ gap: '1.35rem', marginTop: '1.25rem' }}>
                    {serviceStats.map((st, idx) => (
                      <div key={idx} className="flex-col" style={{ gap: '0.4rem' }}>
                        <div className="flex-row items-center justify-between" style={{ fontSize: '0.85rem' }}>
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{st.service}</span>
                          <span style={{ color: '#a0a0a8', fontWeight: 700 }}>
                            {st.count} ({st.pct}%)
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.max(st.pct, 8)}%`,
                              height: '100%',
                              background: idx === 0 ? 'linear-gradient(90deg, #ffffff 0%, #d4d4d8 100%)' : idx === 1 ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' : idx === 2 ? 'linear-gradient(90deg, #ffc107 0%, #ffe082 100%)' : 'linear-gradient(90deg, #94a3b8 0%, #cbd5e1 100%)',
                              borderRadius: '4px',
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BOOKINGS REGISTRY TABLE ONLY */}
            {activeTab === 'table' && (
              <div className="admin-card">
                <div className="flex-row items-center justify-between admin-table-header" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>Bookings & Inquiries Registry</h2>
                    <p style={{ fontSize: '0.8125rem', color: '#a0a0a8', marginTop: '0.2rem' }}>
                      Showing {filteredBookings.length} of {bookings.length} clients
                    </p>
                  </div>

                  {/* Status Filter Tabs */}
                  <div className="flex-row admin-filter-tabs-wrapper">
                    {['all', 'pending', 'reviewed', 'contacted', 'archived'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setFilterStatus(st)}
                        className={`admin-filter-tab-btn ${filterStatus === st ? 'active' : ''}`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Inquiry ID</th>
                        <th>Client & Company</th>
                        <th>Contact Information</th>
                        <th>Service Requested</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingBookings ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                            Loading bookings registry...
                          </td>
                        </tr>
                      ) : filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#a0a0a8' }}>
                            No booking records found matching your filters.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => (
                          <tr key={b._id || b.inquiryId}>
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#ffffff', fontWeight: 600 }}>
                              {b.inquiryId}
                            </td>

                            <td>
                              <div style={{ fontWeight: 700, color: '#ffffff' }}>{b.clientName}</div>
                              {b.companyName && (
                                <div style={{ fontSize: '0.75rem', color: '#a0a0a8' }}>
                                  {b.companyName}
                                </div>
                              )}
                            </td>

                            <td>
                              <div>
                                <a href={`mailto:${b.email}`} style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 500 }}>
                                  {b.email}
                                </a>
                              </div>
                              <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                                <a
                                  href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}
                                >
                                  WhatsApp: {b.phone}
                                </a>
                              </div>
                            </td>

                            <td style={{ fontWeight: 600 }}>{b.serviceType}</td>

                            <td>
                              <select
                                className="admin-select"
                                value={b.status}
                                onChange={(e) => handleStatusChange(b._id || b.inquiryId, e.target.value)}
                              >
                                <option value="pending">PENDING</option>
                                <option value="reviewed">REVIEWED</option>
                                <option value="contacted">CONTACTED</option>
                                <option value="archived">ARCHIVED</option>
                              </select>
                            </td>

                            <td style={{ textAlign: 'right' }}>
                              <div className="flex-row items-center justify-end" style={{ gap: '0.5rem' }}>
                                <button onClick={() => setSelectedBooking(b)} className="admin-btn admin-btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                                  DETAILS
                                </button>
                                <button onClick={() => handleDeleteBooking(b._id || b.inquiryId)} className="admin-btn admin-btn-danger" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                                  DELETE
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL 1: VIEW BOOKING DETAILS */}
      {selectedBooking && (
        <div className="admin-modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="admin-modal-content flex-col" style={{ gap: '1.25rem' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex-row items-center justify-between" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
              <div>
                <span className={`status-pill status-${selectedBooking.status}`} style={{ fontSize: '0.65rem', marginBottom: '0.25rem' }}>
                  {selectedBooking.inquiryId}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>{selectedBooking.clientName}</h3>
                {selectedBooking.companyName && <p style={{ fontSize: '0.8125rem', color: '#a0a0a8' }}>{selectedBooking.companyName}</p>}
              </div>

              <button onClick={() => setSelectedBooking(null)} className="admin-btn admin-btn-secondary" style={{ padding: '0.4rem 0.75rem' }}>
                ✕ CLOSE
              </button>
            </div>

            <div className="grid-2col" style={{ gap: '1rem' }}>
              <div>
                <label className="stat-label">Email Address</label>
                <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '0.2rem' }}>{selectedBooking.email}</div>
              </div>
              <div>
                <label className="stat-label">Phone / WhatsApp</label>
                <div style={{ color: '#10b981', fontWeight: 600, marginTop: '0.2rem' }}>{selectedBooking.phone}</div>
              </div>
              <div>
                <label className="stat-label">Service Type</label>
                <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '0.2rem' }}>{selectedBooking.serviceType}</div>
              </div>
              <div>
                <label className="stat-label">Budget Range & Timeline</label>
                <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '0.2rem' }}>
                  {selectedBooking.budgetRange} ({selectedBooking.timeline})
                </div>
              </div>
            </div>

            <div>
              <label className="stat-label">Project Description</label>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginTop: '0.4rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedBooking.description}
              </div>
            </div>

            {selectedBooking.footageLink && (
              <div>
                <label className="stat-label">Raw Footage / Assets Link</label>
                <div style={{ marginTop: '0.4rem' }}>
                  <a href={selectedBooking.footageLink} target="_blank" rel="noreferrer" style={{ color: '#ffffff', textDecoration: 'underline', wordBreak: 'break-all', fontSize: '0.875rem' }}>
                    {selectedBooking.footageLink} ↗
                  </a>
                </div>
              </div>
            )}

            <div className="flex-row items-center justify-between" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#666670' }}>
                Date Received: {new Date(selectedBooking.createdAt).toLocaleString()}
              </span>

              <button
                onClick={() => handleMarkContactedAndReturn(selectedBooking._id || selectedBooking.inquiryId)}
                className="admin-btn admin-btn-primary"
              >
                MARK AS CONTACTED & RETURN →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW BOOKING FORM */}
      {isAddModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal-content flex-col" style={{ gap: '1.25rem' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex-row items-center justify-between" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>Add New Client Booking</h3>
                <p style={{ fontSize: '0.8125rem', color: '#a0a0a8', marginTop: '0.2rem' }}>Manually insert a booking into the system registry</p>
              </div>

              <button onClick={() => setIsAddModalOpen(false)} className="admin-btn admin-btn-secondary" style={{ padding: '0.4rem 0.75rem' }}>
                ✕ CLOSE
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="flex-col" style={{ gap: '1rem' }}>
              <div className="grid-2col" style={{ gap: '1rem' }}>
                <div className="flex-col" style={{ gap: '0.4rem' }}>
                  <label className="stat-label">Client Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={newForm.clientName}
                    onChange={(e) => setNewForm({ ...newForm, clientName: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                  />
                </div>

                <div className="flex-col" style={{ gap: '0.4rem' }}>
                  <label className="stat-label">Company Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={newForm.companyName}
                    onChange={(e) => setNewForm({ ...newForm, companyName: e.target.value })}
                    placeholder="e.g. Skyline Productions"
                  />
                </div>
              </div>

              <div className="grid-2col" style={{ gap: '1rem' }}>
                <div className="flex-col" style={{ gap: '0.4rem' }}>
                  <label className="stat-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="admin-input"
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    placeholder="alex@skyline.com"
                  />
                </div>

                <div className="flex-col" style={{ gap: '0.4rem' }}>
                  <label className="stat-label">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    placeholder="+1 (555) 019-2831"
                  />
                </div>
              </div>

              <div className="flex-col" style={{ gap: '0.4rem' }}>
                <label className="stat-label">Service Type *</label>
                <select
                  className="admin-input"
                  value={newForm.serviceType}
                  onChange={(e) => setNewForm({ ...newForm, serviceType: e.target.value })}
                >
                  <option value="Branding Films">Branding Films</option>
                  <option value="Commercial Ads">Commercial Ads</option>
                  <option value="Social Media Videos">Social Media Videos</option>
                  <option value="Real Estate Video Editing">Real Estate Video Editing</option>
                  <option value="AI Video Production">AI Video Production</option>
                </select>
              </div>

              <div className="flex-col" style={{ gap: '0.4rem' }}>
                <label className="stat-label">Project Description</label>
                <textarea
                  rows="3"
                  className="admin-input"
                  value={newForm.description}
                  onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                  placeholder="Details about project scope, goals, reference videos..."
                ></textarea>
              </div>

              <div className="flex-col" style={{ gap: '0.4rem' }}>
                <label className="stat-label">Footage / Assets Link (Drive/Dropbox/Frame.io)</label>
                <input
                  type="url"
                  className="admin-input"
                  value={newForm.footageLink}
                  onChange={(e) => setNewForm({ ...newForm, footageLink: e.target.value })}
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div className="flex-row items-center justify-end" style={{ gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="admin-btn admin-btn-secondary">
                  CANCEL
                </button>
                <button type="submit" disabled={createLoading} className="admin-btn admin-btn-primary">
                  {createLoading ? 'CREATING...' : 'SAVE BOOKING RECORD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
