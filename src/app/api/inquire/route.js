import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      clientName,
      email,
      phone,
      companyName = '',
      serviceType,
      budgetRange,
      timeline,
      description,
      footageLink = '',
    } = body;

    // Server-side validation
    if (!clientName || !email || !phone || !serviceType || !budgetRange || !timeline || !description) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Generate unique inquiry ID (e.g. AM-2026-X892)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = Date.now().toString(36).toUpperCase().slice(-4);
    const inquiryId = `AM-${code}-${randomSuffix}`;

    const inquiryPayload = {
      inquiryId,
      clientName: clientName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      companyName: companyName.trim(),
      serviceType,
      budgetRange,
      timeline,
      description: description.trim(),
      footageLink: footageLink.trim(),
      status: 'pending',
    };

    let dbSaved = false;
    let savedInquiry = null;

    try {
      await connectToDatabase();
      savedInquiry = await Inquiry.create(inquiryPayload);
      dbSaved = true;
      console.log(`[API] Saved Project Inquiry to MongoDB: ${inquiryId}`);
    } catch (dbError) {
      console.warn(`[API] MongoDB offline or fallback active: ${dbError.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        dbSaved,
        inquiryId,
        inquiry: savedInquiry || inquiryPayload,
        message: dbSaved
          ? 'Project inquiry saved successfully in database!'
          : 'Project inquiry processed successfully!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API Error /api/inquire]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inquiries from database' },
      { status: 500 }
    );
  }
}
