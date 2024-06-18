export default {
  async fetch(request, env) {
    let url = new URL(request.url);
    if (url.pathname.startsWith('/surge-proxy')) {
      url.pathname = url.pathname.replace('/surge-proxy', '');
      url.hostname = 'surge.surge.sh';
      let new_request = new Request(url, request);
      return fetch(new_request);
    }
    return env.ASSETS.fetch(request);
  },
};
