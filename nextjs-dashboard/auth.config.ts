import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnLogin = nextUrl.pathname === '/login';

      // Original version of the code in the course
      // if (isOnDashboard) {
      //   if (isLoggedIn) return true;
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/dashboard', nextUrl));
      // }

      /**
       * Improved version of the code: https://claude.ai/share/c56583b4-0dc2-4dfa-a295-a58512770587
       * 
       * 1. Redirect unauthenticated users to login page
       * 2. Redirect authenticated users to dashboard if they access login page
       * 3. Allow access to other pages (including home, about, etc.)
       */

      // 1. Redirect unauthenticated users to login page
      if (isOnDashboard && !isLoggedIn) {
        return false; // Automatically redirect to pages.signIn
      }

      // 2. Redirect authenticated users to dashboard if they access login page
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // 3. Allow access to other pages (including home, about, etc.)
      return true;

    },
  },
  
  /**
   * Session configuration
   * https://claude.ai/share/c56583b4-0dc2-4dfa-a295-a58512770587
   * 
   * strategy: 'jwt' | 'database'
   * maxAge: number of seconds
   * updateAge: number of seconds
   */
  session: {
    strategy: 'jwt',  // or 'database'


    maxAge: 15 * 60, // 30 days (seconds)
    updateAge: 5 * 60,   // 24 hours (seconds)


    /**
     * Default configuration for Auth.js
     * maxAge: 30 * 24 * 60 * 60, // 30 days (seconds)
     * updateAge: 24 * 60 * 60,   // 24 hours (seconds)  
     * 
     * Bank 
     * maxAge: 15 * 60,      // 15 seconds
     * updateAge: 5 * 60,    // 5 seconds
     * 
     * Saas 
     * maxAge: 7 * 24 * 60 * 60,   // 7 days
     * updateAge: 24 * 60 * 60,    // 24 hours
     * 
     * Social media 
     * maxAge: 30 * 24 * 60 * 60,  // 30 days (default)
     * updateAge: 24 * 60 * 60,    // 24 hours
     * 
     * Remember Me
     * maxAge: 90 * 24 * 60 * 60,  // 90 days
     * updateAge: 7 * 24 * 60 * 60, // 7 days
     * 
     */
    
  },


  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;