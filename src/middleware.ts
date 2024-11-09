import type { MiddlewareNext } from 'astro';
import { defineMiddleware } from 'astro:middleware';
import { firebase } from './firebase';

const privateRoutes = ['/protected'];
const publicRoutes = ['/login', '/register'];

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(
  ({ url, request, locals, redirect }, next) => {
    const authHeaders = request.headers.get('Authorization') ?? '';

    const isLoggedIn = !!firebase.auth.currentUser;
    const user = firebase.auth.currentUser;

    locals.isLoggedIn = isLoggedIn;

    if (user) {
      locals.user = {
        avatar: user.photoURL ?? '',
        email: user.email ?? '',
        name: user.displayName ?? '',
        emailVerified: user.emailVerified,
      };
    }

    if (privateRoutes.includes(url.pathname) && !isLoggedIn) {
      return redirect('/login');
    }

    if (publicRoutes.includes(url.pathname) && isLoggedIn) {
      return redirect('/');
    }

    return next();
  }
);
