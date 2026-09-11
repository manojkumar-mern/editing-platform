'use client';

import { useState, useEffect, useRef } from 'react';
import { siteData } from '@/data/siteData';
import { soundManager } from '@/lib/audioManager';

export default function ProjectModal({ isOpen, onClose, initialService = '' }) {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    companyName: '',
    serviceType: initialService || 'Video Editing (Reels/Shorts/YouTube)',
    budgetRange: '$1,500 - $3,500',
    timeline: '1 - 2 Weeks',
    description: '',
    footageLink: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [inquiryResult, setInquiryResult] = useState(null);

  const modalRef = useRef(null);

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, serviceType: initialService }));
    }
  }, [initialService]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (typeof window !== 'undefined' && window.lenis) {
        window.lenis.stop();
      }
      setSubmitted(false);
      setErrorMsg('');
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (typeof window !== 'undefined' && window.lenis) {
        window.lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (typeof window !== 'undefined' && window.lenis) {
        window.lenis.start();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const servicesList = [
    'Video Editing (Reels/Shorts/YouTube)',
    'Commercial Ads & Brand Promos',
    'Motion Graphics & VFX',
    'Color Grading & Audio Mastering',
    'Full Post-Production Suite',
    'Digital Marketing & Meta Campaigns',
  ];

  const budgetOptions = ['$500 - $1,500', '$1,500 - $3,500', '$3,500 - $7,500', '$7,500+'];
  const timelineOptions = ['Urgent (< 48 Hours)', '1 - 2 Weeks', '1 Month', 'Ongoing Retainer'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundManager.playSubBoom();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      setInquiryResult(data);
      setSubmitted(true);
      soundManager.playWhoosh();
    } catch (err) {
      console.error('Inquiry Submission Error:', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate WhatsApp summary text for one-click fast messaging
  const getWhatsAppMessage = () => {
    if (!inquiryResult) return '';
    const text = `Hi ATZYNC Media! 👋
I just submitted a project inquiry on your website:
*Inquiry Code:* ${inquiryResult.inquiryId}
*Name:* ${formData.clientName}
*Company:* ${formData.companyName || 'N/A'}
*Service:* ${formData.serviceType}
*Budget:* ${formData.budgetRange}
*Timeline:* ${formData.timeline}
*Overview:* ${formData.description}
${formData.footageLink ? `*Footage Link:* ${formData.footageLink}` : ''}`;

    return `${siteData.contact.whatsappUrl}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div
      className="project-modal-backdrop"
      data-lenis-prevent="true"
      data-lenis-prevent-touch="true"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="project-modal-container"
        data-lenis-prevent="true"
        data-lenis-prevent-touch="true"
      >
        {/* Close Icon */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease',
          }}
          aria-label="Close Modal"
        >
          ✕
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex-col" style={{ gap: '1.15rem' }}>
            {/* Header */}
            <div className="flex-col" style={{ gap: '0.25rem', paddingRight: '2.5rem' }}>
              <div className="flex-row items-center" style={{ gap: '0.5rem' }}>
                <span className="status-dot"></span>
                <span className="badge-tag" style={{ fontSize: '0.68rem', padding: '0.35rem 0.85rem' }}>ATZYNC STUDIO // INQUIRY FORM</span>
              </div>
              <h2 className="heading-lg" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                START YOUR PROJECT
              </h2>
              <p className="body-regular" style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                Select your required editing service, budget range, and timeline to initiate your project brief.
              </p>
            </div>

            {errorMsg && (
              <div
                style={{
                  padding: '0.65rem 0.95rem',
                  backgroundColor: 'rgba(255, 60, 60, 0.12)',
                  border: '1px solid rgba(255, 60, 60, 0.4)',
                  borderRadius: '12px',
                  color: '#ff6b6b',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            {/* 1. Service Selection */}
            <div className="flex-col" style={{ gap: '0.45rem' }}>
              <label className="meta-tag" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>
                1. SELECT SERVICE REQUIRED *
              </label>
              <div className="flex-row" style={{ flexWrap: 'wrap', gap: '0.45rem' }}>
                {servicesList.map((srv) => {
                  const isActive = formData.serviceType === srv;
                  return (
                    <button
                      key={srv}
                      type="button"
                      className={`inquiry-pill ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        soundManager.playClick();
                        setFormData({ ...formData, serviceType: srv });
                      }}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                    >
                      <span className="check-icon">{isActive ? '✓' : '•'}</span>
                      {srv}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Budget & Timeline */}
            <div className="grid-2col" style={{ gap: '1rem' }}>
              <div className="flex-col" style={{ gap: '0.45rem' }}>
                <label className="meta-tag" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>
                  2. ESTIMATED BUDGET *
                </label>
                <div className="flex-row" style={{ flexWrap: 'wrap', gap: '0.35rem' }}>
                  {budgetOptions.map((bgt) => {
                    const isActive = formData.budgetRange === bgt;
                    return (
                      <button
                        key={bgt}
                        type="button"
                        className={`inquiry-pill ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          soundManager.playClick();
                          setFormData({ ...formData, budgetRange: bgt });
                        }}
                        style={{ padding: '0.42rem 0.85rem', fontSize: '0.73rem' }}
                      >
                        <span className="check-icon">{isActive ? '✓' : '•'}</span>
                        {bgt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-col" style={{ gap: '0.45rem' }}>
                <label className="meta-tag" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>
                  3. TIMELINE / URGENCY *
                </label>
                <div className="flex-row" style={{ flexWrap: 'wrap', gap: '0.35rem' }}>
                  {timelineOptions.map((tml) => {
                    const isActive = formData.timeline === tml;
                    return (
                      <button
                        key={tml}
                        type="button"
                        className={`inquiry-pill ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          soundManager.playClick();
                          setFormData({ ...formData, timeline: tml });
                        }}
                        style={{ padding: '0.42rem 0.85rem', fontSize: '0.73rem' }}
                      >
                        <span className="check-icon">{isActive ? '✓' : '•'}</span>
                        {tml}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Contact Inputs */}
            <div className="grid-2col" style={{ gap: '0.85rem' }}>
              <div className="flex-col" style={{ gap: '0.25rem' }}>
                <label className="meta-tag" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>YOUR FULL NAME *</label>
                <input
                  type="text"
                  name="clientName"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.clientName}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div className="flex-col" style={{ gap: '0.25rem' }}>
                <label className="meta-tag" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>EMAIL ADDRESS *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="alex@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div className="flex-col" style={{ gap: '0.25rem' }}>
                <label className="meta-tag" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>WHATSAPP / PHONE NUMBER *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div className="flex-col" style={{ gap: '0.25rem' }}>
                <label className="meta-tag" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>COMPANY / BRAND NAME (OPTIONAL)</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="e.g. Apex Media House"
                  value={formData.companyName}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* 4. Description & Links */}
            <div className="flex-col" style={{ gap: '0.25rem' }}>
              <label className="meta-tag" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>PROJECT DESCRIPTION & SCOPE *</label>
              <textarea
                name="description"
                required
                rows={2}
                placeholder="Describe your video project goals, required video count, editing style, or reference channels..."
                value={formData.description}
                onChange={handleChange}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <div className="flex-col" style={{ gap: '0.25rem' }}>
              <label className="meta-tag" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>RAW FOOTAGE / REFERENCE LINK (OPTIONAL)</label>
              <input
                type="url"
                name="footageLink"
                placeholder="Paste Google Drive / Frame.io / Dropbox link"
                value={formData.footageLink}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Submit Button */}
            <div className="flex-row items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-heading)', letterSpacing: '0.08em' }}>🔒 STORED IN MONGO DB // ENCRYPTED</span>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ padding: '0.75rem 2rem', minWidth: '190px' }}
              >
                {loading ? 'SAVING TO DATABASE...' : 'SUBMIT INQUIRY →'}
              </button>
            </div>
          </form>
        ) : (
          /* SUCCESS CONFIRMATION SCREEN */
          <div className="flex-col items-center" style={{ gap: '1.5rem', textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                boxShadow: '0 0 30px rgba(255,255,255,0.2)',
              }}
            >
              ✓
            </div>

            <div className="flex-col items-center" style={{ gap: '0.5rem' }}>
              <span className="badge-tag" style={{ fontSize: '0.75rem' }}>
                INQUIRY CODE: {inquiryResult?.inquiryId || 'AM-CONFIRMED'}
              </span>
              <h2 className="heading-lg" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', textTransform: 'uppercase' }}>
                INQUIRY SAVED TO DATABASE!
              </h2>
              <p className="body-regular" style={{ maxWidth: '520px', opacity: 0.85, fontSize: '0.9rem' }}>
                Thank you, <strong>{formData.clientName}</strong>! Your project details have been recorded in our database. Our lead editor will review your scope and contact you within <strong>&lt; 2 Hours</strong>.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex-col items-center" style={{ gap: '0.75rem', width: '100%', maxWidth: '420px', marginTop: '0.5rem' }}>
              <a
                href={getWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ width: '100%', textDecoration: 'none' }}
                onClick={() => soundManager.playClick()}
              >
                💬 SEND DIRECT SUMMARY TO WHATSAPP →
              </a>

              <button
                type="button"
                className="btn-secondary"
                style={{ width: '100%' }}
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
              >
                DONE / CLOSE WINDOW
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.95rem',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: '10px',
  color: '#ffffff',
  fontFamily: 'var(--font-body)',
  fontSize: '0.85rem',
  outline: 'none',
  transition: 'all 0.2s ease',
};
