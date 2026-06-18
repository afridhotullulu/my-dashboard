import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Ganti 'token' dengan nama cookie/session login yang kamu gunakan
  const cookieLogin = request.cookies.get('token'); 

  // Jika user mencoba masuk ke dashboard tapi belum login
  if (!cookieLogin && request.nextUrl.pathname.startsWith('/dashboard')) {
    // Alihkan paksa (redirect) ke halaman login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Tentukan halaman mana saja yang mau dilindungi oleh middleware ini
export const config = {
  matcher: ['/dashboard/:path*'],
};