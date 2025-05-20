export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // If the request is for a file that exists in the assets directory, serve it
    if (url.pathname.startsWith('/assets/')) {
      return env.SITE.fetch(request);
    }

    // For all other routes, serve index.html
    return env.SITE.fetch(new Request(new URL('/index.html', request.url)));
  }
}; 