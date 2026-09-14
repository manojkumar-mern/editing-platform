import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

export async function GET(request) {
  try {
    // 1. Check HTTP cookie
    let token = request.cookies.get('admin_token')?.value;

    // 2. Fallback to Authorization Header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json({ authenticated: false, error: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyJwt(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ authenticated: false, error: 'Invalid or expired token' }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: 'Auth check failed' }, { status: 500 });
  }
}
