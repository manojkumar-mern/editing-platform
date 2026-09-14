import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { verifyJwt } from '@/lib/jwt';

// Shared fallback memory store for local testing/offline MongoDB mode
const initialFallbackBookings = [
  {
    _id: 'b101',
    inquiryId: 'AM-2026-X892',
    clientName: 'Sarah Jenkins',
    companyName: 'Apex Gaming Studio',
    email: 'sarah.jenkins@apexgaming.io',
    phone: '+1 (555) 382-9102',
    serviceType: 'Social Media Videos',
    budgetRange: '$1,500 - $3,000',
    timeline: 'Urgent (1-2 Weeks)',
    description: 'Need high-energy fast-cut montage editing for 15 YouTube Shorts and Instagram Reels targeting esports fans.',
    footageLink: 'https://drive.google.com/drive/folders/demo-gameplay-footage',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    _id: 'b102',
    inquiryId: 'AM-2026-V410',
    clientName: 'Marcus Vance',
    companyName: 'Vance Fashion House',
    email: 'marcus@vancefashion.com',
    phone: '+1 (555) 749-2049',
    serviceType: 'Branding Films',
    budgetRange: '$5,000 - $10,000',
    timeline: 'Standard (2-4 Weeks)',
    description: 'Full color grading, editorial sound design, and 4K master edit for Autumn / Winter apparel launch video.',
    footageLink: 'https://frame.io/projects/vance-fashion-raw',
    status: 'reviewed',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    _id: 'b103',
    inquiryId: 'AM-2026-M931',
    clientName: 'Elena Rostova',
    companyName: 'NovaTech AI',
    email: 'elena@novatechai.co',
    phone: '+44 7700 900382',
    serviceType: 'AI Video Production',
    budgetRange: '$3,000 - $5,000',
    timeline: 'Standard (2-4 Weeks)',
    description: 'Sleek UI motion graphics and voiceover sync for tech product promo video to show on landing page and investors deck.',
    footageLink: 'https://dropbox.com/sh/novatech-demo-assets',
    status: 'contacted',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    _id: 'b104',
    inquiryId: 'AM-2026-K105',
    clientName: 'David Krol',
    companyName: 'Krol Fitness Global',
    email: 'david@krolfitness.com',
    phone: '+1 (555) 912-3841',
    serviceType: 'Real Estate Video Editing',
    budgetRange: '$1,000 - $2,500',
    timeline: 'Flexible',
    description: 'Cinematic color treatment and kinetic typography for workout series course trailers.',
    footageLink: '',
    status: 'archived',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
  },
];

// Global in-memory cache reference across requests
if (!global._adminBookingsCache) {
  global._adminBookingsCache = [...initialFallbackBookings];
}

function checkAuth(request) {
  let token = request.cookies.get('admin_token')?.value;
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  if (!token) return null;
  return verifyJwt(token);
}

// GET: Fetch all bookings
export async function GET(request) {
  const user = checkAuth(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();
        const dbInquiries = await Inquiry.find({}).sort({ createdAt: -1 });
        if (dbInquiries && dbInquiries.length > 0) {
          return NextResponse.json({
            success: true,
            source: 'database',
            count: dbInquiries.length,
            bookings: dbInquiries,
          });
        }
      } catch (dbErr) {
        console.warn('[Admin API Warning]: MongoDB fetch error, falling back to local memory:', dbErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      source: 'memory',
      count: global._adminBookingsCache.length,
      bookings: global._adminBookingsCache,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add a new booking manually
export async function POST(request) {
  const user = checkAuth(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      clientName,
      email,
      phone,
      companyName = '',
      serviceType,
      budgetRange = 'Flexible',
      timeline = 'Standard',
      description = '',
      footageLink = '',
      status = 'pending',
    } = body;

    if (!clientName || !email || !phone || !serviceType) {
      return NextResponse.json(
        { success: false, error: 'Client name, email, phone, and service type are required.' },
        { status: 400 }
      );
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = Date.now().toString(36).toUpperCase().slice(-4);
    const inquiryId = `AM-${code}-${randomSuffix}`;

    const newBooking = {
      _id: `b_${Date.now()}`,
      inquiryId,
      clientName: clientName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      companyName: companyName.trim(),
      serviceType,
      budgetRange,
      timeline,
      description: description.trim(),
      footageLink: footageLink.trim(),
      status,
      createdAt: new Date().toISOString(),
    };

    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();
        const saved = await Inquiry.create(newBooking);
        return NextResponse.json({ success: true, booking: saved, message: 'Booking created in database' });
      } catch (dbErr) {
        console.warn('[Admin API]: DB save failed, saving to local memory:', dbErr.message);
      }
    }

    global._adminBookingsCache.unshift(newBooking);
    return NextResponse.json({ success: true, booking: newBooking, message: 'Booking created successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Update booking status or details
export async function PATCH(request) {
  const user = checkAuth(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, inquiryId, status, description, notes } = body;

    const targetId = id || inquiryId;
    if (!targetId) {
      return NextResponse.json({ success: false, error: 'Booking ID required' }, { status: 400 });
    }

    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();
        const updated = await Inquiry.findOneAndUpdate(
          { $or: [{ _id: targetId }, { inquiryId: targetId }] },
          { $set: { status, ...(description && { description }) } },
          { new: true }
        );
        if (updated) {
          return NextResponse.json({ success: true, booking: updated });
        }
      } catch (dbErr) {
        console.warn('[Admin API]: DB update failed, attempting local cache update:', dbErr.message);
      }
    }

    const idx = global._adminBookingsCache.findIndex(
      (b) => b._id === targetId || b.inquiryId === targetId
    );
    if (idx !== -1) {
      if (status) global._adminBookingsCache[idx].status = status;
      if (description) global._adminBookingsCache[idx].description = description;
      return NextResponse.json({ success: true, booking: global._adminBookingsCache[idx] });
    }

    return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a booking
export async function DELETE(request) {
  const user = checkAuth(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();
        await Inquiry.findOneAndDelete({ $or: [{ _id: id }, { inquiryId: id }] });
      } catch (dbErr) {
        console.warn('[Admin API]: DB delete failed:', dbErr.message);
      }
    }

    global._adminBookingsCache = global._adminBookingsCache.filter(
      (b) => b._id !== id && b.inquiryId !== id
    );

    return NextResponse.json({ success: true, message: 'Booking removed successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
