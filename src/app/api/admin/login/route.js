import { NextResponse } from 'next/server';
import { signJwt } from '@/lib/jwt';

export async function POST(request) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('[API Error /api/admin/login]: ADMIN_EMAIL or ADMIN_PASSWORD environment variable is missing.');
      return NextResponse.json(
        { success: false, error: 'Server authentication configuration error.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail !== adminEmail.trim().toLowerCase() || password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin email or password credentials.' },
        { status: 401 }
      );
    }

    const token = signJwt(
      {
        role: 'admin',
        email: adminEmail,
        name: 'ATZYNC Admin',
      },
      24 * 60 * 60 * 1000 // 24 hours
    );

    const response = NextResponse.json(
      {
        success: true,
        message: 'Admin authentication successful.',
        user: {
          email: adminEmail,
          name: 'ATZYNC Admin',
          role: 'admin',
        },
        token,
      },
      { status: 200 }
    );

    // Set HTTP-only secure session cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('[API Error /api/admin/login]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during authentication.' },
      { status: 500 }
    );
  }
}
