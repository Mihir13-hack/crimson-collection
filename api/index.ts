import server from "../dist/server/index.js";

export default {
  async fetch(request: Request) {
    return server.fetch(request, undefined, undefined);
  },
};
