'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { siteData } from '@/data/siteData';

const SERVICE_COLORS = [
  { main: '#00f2fe', bg: 'rgba(0, 242, 254, 0.12)', border: 'rgba(0, 242, 254, 0.35)', text: '#00f2fe', lightBg: '#e0f2fe', lightText: '#0284c7', lightBorder: '#93c5fd' }, // Electric Cyan
  { main: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.35)', text: '#34d399', lightBg: '#d1fae5', lightText: '#047857', lightBorder: '#6ee7b7' }, // Emerald
  { main: '#ffc107', bg: 'rgba(255, 193, 7, 0.12)', border: 'rgba(255, 193, 7, 0.35)', text: '#ffc107', lightBg: '#fef3c7', lightText: '#b45309', lightBorder: '#fcd34d' }, // Amber
  { main: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.35)', text: '#fb7185', lightBg: '#ffe4e6', lightText: '#e11d48', lightBorder: '#fda4af' }, // Neon Rose
  { main: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.35)', text: '#c084fc', lightBg: '#ede9fe', lightText: '#6d28d9', lightBorder: '#c4b5fd' }, // Violet
  { main: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.35)', text: '#60a5fa', lightBg: '#dbeafe', lightText: '#1d4ed8', lightBorder: '#93c5fd' }, // Blue
  { main: '#f97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.35)', text: '#fb923c', lightBg: '#ffedd5', lightText: '#c2410c', lightBorder: '#fdba74' }, // Orange
  { main: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.35)', text: '#22d3ee', lightBg: '#cffafe', lightText: '#0e7490', lightBorder: '#67e8f9' }, // Teal
  { main: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.35)', text: '#f472b6', lightBg: '#fce7f3', lightText: '#be185d', lightBorder: '#f9a8d4' }, // Pink
  { main: '#eab308', bg: 'rgba(234, 179, 8, 0.12)', border: 'rgba(234, 179, 8, 0.35)', text: '#fde047', lightBg: '#fef9c3', lightText: '#a16207', lightBorder: '#fde047' }, // Yellow
  { main: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.35)', text: '#818cf8', lightBg: '#e0e7ff', lightText: '#4338ca', lightBorder: '#a5b4fc' }, // Indigo
  { main: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.35)', text: '#d8b4fe', lightBg: '#f3e8ff', lightText: '#7e22ce', lightBorder: '#d8b4fe' }, // Purple
];

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Admin Theme state: 'dark' | 'light'
  const [adminTheme, setAdminTheme] = useState('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('atzync_admin_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setAdminTheme(savedTheme);
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = adminTheme === 'dark' ? 'light' : 'dark';
    setAdminTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('atzync_admin_theme', nextTheme);
    }
  };

  // Dashboard Data state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [hoveredServiceIndex, setHoveredServiceIndex] = useState(null);

  // Add Booking Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newForm, setNewForm] = useState({
    clientName: '',
    companyName: '',
    email: '',
    phone: '',
    serviceType: siteData.services?.[0]?.title || 'Commercial Ad Film',
    description: '',
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
          serviceType: 'Commercial Ad Film',
          description: '',
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

    return { total, pending, reviewed, contacted, archived };
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

  // 6 Official Services list from siteData
  const OFFICIAL_SERVICES = useMemo(
    () =>
      siteData.services?.map((s) => s.title) || [
        'Commercial Ad Film',
        'Product Photography',
        'Corporate Videos',
        'Real Estate Videos',
        'Promotional Videos',
        'Meta Ads',
      ],
    []
  );

  // Chart 2: Service Distribution & Donut Pie Segments (Strictly 6 Official Services)
  const serviceStats = useMemo(() => {
    const map = {};
    OFFICIAL_SERVICES.forEach((s) => {
      map[s] = 0;
    });

    bookings.forEach((b) => {
      const rawSt = b.serviceType || '';
      let matched = OFFICIAL_SERVICES.find((s) => s.toLowerCase() === rawSt.toLowerCase());
      if (!matched) {
        const lower = rawSt.toLowerCase();
        if (lower.includes('photo')) matched = 'Product Photography';
        else if (lower.includes('corp')) matched = 'Corporate Videos';
        else if (lower.includes('estate') || lower.includes('real')) matched = 'Real Estate Videos';
        else if (lower.includes('promo')) matched = 'Promotional Videos';
        else if (lower.includes('meta')) matched = 'Meta Ads';
        else matched = 'Commercial Ad Film';
      }
      map[matched] = (map[matched] || 0) + 1;
    });

    const total = bookings.length;
    return OFFICIAL_SERVICES.map((service) => {
      const count = map[service] || 0;
      return {
        service,
        count,
        pct: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });
  }, [bookings, OFFICIAL_SERVICES]);

  const pieSegments = useMemo(() => {
    const total = bookings.length;
    const radius = 78;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    return serviceStats.map((st, idx) => {
      const color = SERVICE_COLORS[idx % SERVICE_COLORS.length];
      const ratio = total > 0 ? st.count / total : 0;
      const rawStrokeLength = ratio * circumference;
      const gap = total > 1 && serviceStats.length > 1 ? 2.5 : 0;
      const strokeLength = Math.max(0, rawStrokeLength - gap);
      const strokeOffset = -accumulatedOffset;
      accumulatedOffset += rawStrokeLength;

      return {
        ...st,
        color,
        ratio,
        strokeLength,
        strokeOffset,
        circumference,
      };
    });
  }, [serviceStats, bookings.length]);

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
      <div className={`admin-body-wrap ${adminTheme === 'light' ? 'light-mode' : ''}`}>
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
    <div className={`admin-body-wrap ${adminTheme === 'light' ? 'light-mode' : ''}`}>
      <div className="admin-layout-wrapper">
        {/* CLEAN LEFT SIDEBAR */}
        <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          {/* Logo Branding / ChatGPT-Style Slim Toggle Header */}
          <div className="admin-sidebar-header flex-row items-center justify-between" style={{ width: '100%', minHeight: '44px', marginBottom: '1.25rem' }}>
            {sidebarCollapsed ? (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="admin-sidebar-top-toggle sidebar-tooltip-trigger"
                title="Expand Sidebar (»)"
                aria-label="Expand Sidebar"
              >
                <span className="brand-mini-icon">A</span>
                <span className="toggle-square-icon">
                  {/* Double Right Arrow Icon » */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m13 17 5-5-5-5" />
                    <path d="m6 17 5-5-5-5" />
                  </svg>
                </span>
                <span className="sidebar-tooltip">Expand Sidebar (»)</span>
              </button>
            ) : (
              <>
                <Link href="/" className="brand-logo flex-row items-center" style={{ textDecoration: 'none' }}>
                  <img
                    src="/logo-white.webp"
                    alt="ATZYNC Media"
                    style={{
                      height: '38px',
                      width: 'auto',
                      maxWidth: '145px',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </Link>

                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="admin-sidebar-toggle-btn"
                  title="Collapse Sidebar"
                  aria-label="Collapse Sidebar"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                </button>
              </>
            )}

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

            <button
              onClick={() => {
                setActiveTab('overview');
                setMobileMenuOpen(false);
              }}
              className={`sidebar-nav-btn sidebar-tooltip-trigger ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <span className="sidebar-nav-icon">📊</span>
              <span className="sidebar-nav-text">Dashboard Overview</span>
              {sidebarCollapsed && <span className="sidebar-tooltip">Dashboard Overview</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab('table');
                setMobileMenuOpen(false);
              }}
              className={`sidebar-nav-btn sidebar-tooltip-trigger ${activeTab === 'table' ? 'active' : ''}`}
            >
              <span className="sidebar-nav-icon">📋</span>
              <span className="sidebar-nav-text">Bookings Registry ({bookings.length})</span>
              {sidebarCollapsed && <span className="sidebar-tooltip">Bookings Registry ({bookings.length})</span>}
            </button>

            <button
              onClick={() => {
                setIsAddModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="sidebar-nav-btn sidebar-tooltip-trigger"
              style={{ color: '#ffffff' }}
            >
              <span className="sidebar-nav-icon">➕</span>
              <span className="sidebar-nav-text">Add New Booking</span>
              {sidebarCollapsed && <span className="sidebar-tooltip">Add New Booking</span>}
            </button>

            {/* BACK TO SITE LINK IN SIDEBAR */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="sidebar-nav-btn sidebar-tooltip-trigger"
              style={{ color: '#a0a0a8', textDecoration: 'none', marginTop: 'auto' }}
            >
              <span className="sidebar-nav-icon">←</span>
              <span className="sidebar-nav-text">Back to Website</span>
              {sidebarCollapsed && <span className="sidebar-tooltip">Back to Website</span>}
            </Link>

            {/* Sidebar Footer Log out */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', marginTop: '1rem' }}>
              <button
                onClick={handleLogout}
                className="sidebar-nav-btn sidebar-tooltip-trigger admin-sidebar-logout-btn"
                style={{ color: '#ff453a', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <span className="sidebar-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff453a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </span>
                <span className="sidebar-nav-text">Log out session →</span>
                {sidebarCollapsed && <span className="sidebar-tooltip">Log out session</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <main className="admin-main-content">
          {/* Top Navbar Header */}
          <header className="admin-navbar">
            <div className="flex-row items-center admin-nav-title-group">
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

              {/* Sun / Moon Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="admin-theme-toggle-btn"
                title={`Switch to ${adminTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label={`Switch to ${adminTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {adminTheme === 'dark' ? (
                  /* Moon Icon for Dark Mode */
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  /* Sun Icon for Light Mode */
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                )}
              </button>

              <button onClick={() => setIsAddModalOpen(true)} className="admin-btn admin-btn-primary">
                + ADD BOOKING
              </button>

              <Link href="/" className="admin-btn admin-btn-secondary" style={{ textDecoration: 'none' }}>
                ← WEBSITE
              </Link>
            </div>
          </header>

          {/* Workspace Body Container */}
          <div className="admin-content-body" data-lenis-prevent>
            {/* Metric Stats Cards Row */}
            <div className="admin-stats-grid">
              <div className="admin-card flex-col justify-between">
                <span className="stat-label">Total Booked Clients</span>
                <div className="stat-val stat-val-total">{stats.total}</div>
                <div style={{ fontSize: '0.75rem', color: '#a0a0a8', marginTop: '0.6rem' }}>All Recorded Inquiries</div>
              </div>

              <div className="admin-card flex-col justify-between">
                <span className="stat-label">Pending Action</span>
                <div className="stat-val stat-val-pending" style={{ color: '#ffc107' }}>
                  {stats.pending}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a0a0a8', marginTop: '0.6rem' }}>Needs Review</div>
              </div>

              <div className="admin-card flex-col justify-between">
                <span className="stat-label">Contacted Clients</span>
                <div className="stat-val stat-val-contacted" style={{ color: '#10b981' }}>
                  {stats.contacted}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a0a0a8', marginTop: '0.6rem' }}>In Negotiation</div>
              </div>

              <div className="admin-card flex-col justify-between">
                <span className="stat-label">Reviewed Inquiries</span>
                <div className="stat-val stat-val-reviewed" style={{ color: '#818cf8' }}>
                  {stats.reviewed}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a0a0a8', marginTop: '0.6rem' }}>Scoped & Ready</div>
              </div>
            </div>

            {/* TAB 1: DASHBOARD OVERVIEW ONLY */}
            {activeTab === 'overview' && (
              <div className="admin-dashboard-grid">
                {/* Chart 1: STYLISH METALLIC BAR GRAPH */}
                <div className="admin-card admin-dashboard-card">
                  <div>
                    <div className="flex-row items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Booking Velocity & Trends</h3>
                        <p style={{ fontSize: '0.75rem', color: '#a0a0a8', marginTop: '0.2rem' }}>12-Month distribution of client inquiries</p>
                      </div>
                      <span className="badge-tag" style={{ fontSize: '0.65rem' }}>BAR GRAPH</span>
                    </div>

                    {/* STYLISH BAR CHART */}
                    <div className="bar-chart-wrapper flex-row items-end justify-between" style={{ paddingBottom: '1rem', borderBottom: '1px dashed rgba(255, 255, 255, 0.15)', gap: '0.35rem' }}>
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

                  {/* Bar Chart Summary Footer */}
                  <div className="flex-row items-center justify-between" style={{ marginTop: '0.85rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.75rem', color: '#a0a0a8' }}>
                    <span>Peak Month: <strong style={{ color: '#ffffff' }}>Sep 2026</strong></span>
                    <span>Recorded Inquiries: <strong style={{ color: '#ffffff' }}>{stats.total} Clients</strong></span>
                  </div>
                </div>

                {/* Chart 2: Service Demand Breakdown - Interactive Donut Circle Pie Chart */}
                <div className="admin-card admin-dashboard-card">
                  <div className="flex-row items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Service Type Demand</h3>
                      <p style={{ fontSize: '0.75rem', color: '#a0a0a8', marginTop: '0.2rem' }}>Category demand distribution</p>
                    </div>
                    <span className="badge-tag" style={{ fontSize: '0.65rem' }}>DEMAND METRICS</span>
                  </div>

                  {/* CIRCULAR DONUT PIE CHART GRAPH */}
                  <div className="donut-chart-wrapper">
                    <svg
                      viewBox="0 0 220 220"
                      onMouseLeave={() => setHoveredServiceIndex(null)}
                      style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', overflow: 'visible' }}
                    >
                      {/* Background track circle */}
                      <circle
                        className="donut-bg-circle"
                        cx="110"
                        cy="110"
                        r="78"
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.06)"
                        strokeWidth="18"
                        style={{ pointerEvents: 'none' }}
                      />

                      {/* Donut Segments - ONLY stroke triggers hover */}
                      {pieSegments.map((seg, idx) => {
                        const isHovered = hoveredServiceIndex === idx;
                        const isAnyHovered = hoveredServiceIndex !== null;

                        return (
                          <circle
                            key={idx}
                            cx="110"
                            cy="110"
                            r="78"
                            fill="transparent"
                            stroke={seg.color.main}
                            strokeWidth={isHovered ? 24 : 18}
                            strokeDasharray={`${seg.strokeLength} ${seg.circumference - seg.strokeLength}`}
                            strokeDashoffset={seg.strokeOffset}
                            onMouseEnter={() => setHoveredServiceIndex(idx)}
                            onMouseLeave={() => setHoveredServiceIndex(null)}
                            style={{
                              cursor: 'pointer',
                              pointerEvents: 'stroke',
                              transition: 'stroke-width 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, filter 0.25s ease',
                              opacity: isAnyHovered ? (isHovered ? 1 : 0.35) : 1,
                              filter: isHovered ? `drop-shadow(0 0 10px ${seg.color.main})` : 'none',
                            }}
                          />
                        );
                      })}
                    </svg>

                    {/* Center Hover Details / Summary Text - pointerEvents: none */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        textAlign: 'center',
                        padding: '0.5rem',
                        boxSizing: 'border-box',
                      }}
                    >
                      {hoveredServiceIndex !== null && pieSegments[hoveredServiceIndex] ? (
                        <>
                          <span
                            className="donut-hover-pct"
                            style={{
                              fontSize: '1.6rem',
                              fontWeight: 900,
                              color: adminTheme === 'light' ? (pieSegments[hoveredServiceIndex].color.lightText || pieSegments[hoveredServiceIndex].color.text) : pieSegments[hoveredServiceIndex].color.text,
                              lineHeight: 1,
                              textShadow: adminTheme === 'light' ? 'none' : `0 0 12px ${pieSegments[hoveredServiceIndex].color.main}66`,
                            }}
                          >
                            {pieSegments[hoveredServiceIndex].pct}%
                          </span>
                          <span
                            className="donut-hover-title"
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              color: '#ffffff',
                              marginTop: '0.25rem',
                              maxWidth: '115px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {pieSegments[hoveredServiceIndex].service}
                          </span>
                          <span className="donut-hover-count" style={{ fontSize: '0.625rem', color: '#a0a0a8', marginTop: '0.12rem', fontWeight: 600 }}>
                            {pieSegments[hoveredServiceIndex].count} {pieSegments[hoveredServiceIndex].count === 1 ? 'Inquiry' : 'Inquiries'}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="donut-center-val" style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
                            {stats.total}
                          </span>
                          <span className="donut-center-label" style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', color: '#a0a0a8', marginTop: '0.25rem' }}>
                            TOTAL INQUIRIES
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* SCROLLABLE LEGEND BREAKDOWN */}
                  <div
                    className="demand-metrics-legend"
                    data-lenis-prevent="true"
                    data-lenis-prevent-touch="true"
                  >
                    {pieSegments.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#a0a0a8', fontSize: '0.8rem', padding: '1rem' }}>
                        No service demand data yet.
                      </div>
                    ) : (
                      pieSegments.map((seg, idx) => {
                        const isHovered = hoveredServiceIndex === idx;
                        const isLight = adminTheme === 'light';

                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setHoveredServiceIndex(idx)}
                            onMouseLeave={() => setHoveredServiceIndex(null)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.45rem 0.65rem',
                              borderRadius: '8px',
                              background: isHovered
                                ? (isLight ? (seg.color.lightBg || seg.color.bg) : seg.color.bg)
                                : (isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)'),
                              border: `1px solid ${
                                isHovered
                                  ? (isLight ? (seg.color.lightBorder || seg.color.border) : seg.color.border)
                                  : (isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.05)')
                              }`,
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                              <span
                                style={{
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  background: seg.color.main,
                                  boxShadow: isHovered ? `0 0 8px ${seg.color.main}` : 'none',
                                  flexShrink: 0,
                                }}
                              />
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: isHovered ? 700 : 600,
                                  color: isLight
                                    ? (isHovered ? (seg.color.lightText || '#0f172a') : '#1e293b')
                                    : (isHovered ? '#ffffff' : '#d4d4d8'),
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {seg.service}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isLight ? '#475569' : '#a0a0a8' }}>
                                {seg.count}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '5px',
                                  background: isLight ? (seg.color.lightBg || seg.color.bg) : seg.color.bg,
                                  color: isLight ? (seg.color.lightText || seg.color.text) : seg.color.text,
                                  border: `1px solid ${isLight ? (seg.color.lightBorder || seg.color.border) : seg.color.border}`,
                                }}
                              >
                                {seg.pct}%
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
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
                <h3 className="modal-client-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>{selectedBooking.clientName}</h3>
                {selectedBooking.companyName && <p style={{ fontSize: '0.8125rem', color: '#a0a0a8' }}>{selectedBooking.companyName}</p>}
              </div>

              <button onClick={() => setSelectedBooking(null)} className="admin-btn admin-btn-secondary" style={{ padding: '0.4rem 0.75rem' }}>
                ✕ CLOSE
              </button>
            </div>

            <div className="grid-2col" style={{ gap: '1rem' }}>
              <div>
                <label className="stat-label">Email Address</label>
                <div className="modal-detail-val" style={{ color: '#ffffff', fontWeight: 600, marginTop: '0.2rem' }}>{selectedBooking.email}</div>
              </div>
              <div>
                <label className="stat-label">Phone / WhatsApp</label>
                <div style={{ color: '#10b981', fontWeight: 600, marginTop: '0.2rem' }}>{selectedBooking.phone}</div>
              </div>
              <div>
                <label className="stat-label">Service Type</label>
                <div className="modal-detail-val" style={{ color: '#ffffff', fontWeight: 600, marginTop: '0.2rem' }}>{selectedBooking.serviceType}</div>
              </div>
              <div>
                <label className="stat-label">Company / Brand</label>
                <div className="modal-detail-val" style={{ color: '#ffffff', fontWeight: 600, marginTop: '0.2rem' }}>
                  {selectedBooking.companyName || 'N/A'}
                </div>
              </div>
            </div>

            <div>
              <label className="stat-label">Project Description</label>
              <div
                className="modal-desc-box"
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

            <div className="flex-row items-center justify-between" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <span className="modal-footer-date" style={{ fontSize: '0.75rem', color: '#666670' }}>
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
                  {siteData.services?.map((srv) => (
                    <option key={srv.id || srv.title} value={srv.title}>
                      {srv.title}
                    </option>
                  ))}
                  <option value="Other Video Editing">Other Video Editing</option>
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
