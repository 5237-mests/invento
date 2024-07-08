import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Retrieve the session and role cookies
  const currentUser = request.cookies.get('session')?.value;
  const userRole = request.cookies.get('role')?.value;

  if (!currentUser) {
    // Redirect non-logged-in users to the login page
    if (!request.nextUrl.pathname.startsWith('/login')) {
      return Response.redirect(new URL('/login', request.url));
    }
  } else {
    // Redirect based on the user's role
    if (
      userRole === 'admin' &&
      !request.nextUrl.pathname.startsWith('/admin')
    ) {
      return Response.redirect(new URL('/admin', request.url));
    }
    if (
      userRole === 'storekeeper' &&
      !request.nextUrl.pathname.startsWith('/store')
    ) {
      return Response.redirect(new URL('/store', request.url));
    }
    if (
      userRole === 'shopkeeper' &&
      !request.nextUrl.pathname.startsWith('/shop')
    ) {
      return Response.redirect(new URL('/shop', request.url));
    }

    // Redirect to unauthorized page if the role is not recognized
    if (!['admin', 'storekeeper', 'shopkeeper'].includes(`${userRole}`)) {
      return Response.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Allow the request to continue if none of the above conditions are met
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply the middleware to all paths except for API routes, Next.js static files, and image files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
