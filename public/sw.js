const createRouter = () => {
  const routes = [];
  const use2 = (route) => {
    routes.push(route);
  };
  const router2 = (event) => {
    const pro = new Promise(async (res, rej) => {
      for await (const route of routes) {
        const matched = event.request.method === route.method && await route.matcher(event.request.url);
        if (matched) {
          try {
            const data = await route.handler(event.request.clone());
            res(data);
          } catch (error) {
            rej(error);
          }
          return;
        }
      }
      res(fetch(event.request));
    });
    event.respondWith(pro);
  };
  return {
    use: use2,
    router: router2
  };
};
const { router, use } = createRouter();
const getLocationConfig = async () => {
  const [client] = await self.clients.matchAll();
  const url = new URL(client.url.replace("/#/", "/"));
  return url;
};
const createLocalImageServer = () => {
  const getLocalAssetsServer = async () => {
    const url = await getLocationConfig();
    return url.searchParams.get("assets_site") ?? "https://local.assets.server";
  };
  const createIndex = (() => {
    let i = 0;
    return () => {
      return i += 1;
    };
  })();
  const fileMap = /* @__PURE__ */ new Map();
  const uploadFile = async (file) => {
    const name = `${createIndex()}.${file.name.split(".").pop() ?? "jpg"}`;
    fileMap.set(name, file);
    return `${await getLocalAssetsServer()}/${name}`;
  };
  const get = {
    matcher: async (url) => url.startsWith(await getLocalAssetsServer()),
    method: "GET",
    handler: async (req) => {
      const name = req.url.split("/").pop() ?? "";
      const file = fileMap.get(name);
      if (file) {
        return new Response(file.stream());
      }
      throw new Error("assets not found");
    }
  };
  const post = {
    matcher: async (url) => url.startsWith(await getLocalAssetsServer()),
    method: "POST",
    handler: async (req) => {
      const formBody = await req.formData();
      const files = formBody.getAll("file[]");
      const resultFiles = Object.fromEntries(await Promise.all(files.map(async (file) => [file.name, await uploadFile(file)])));
      return new Response(JSON.stringify(
        {
          "msg": "",
          "code": 0,
          "data": {
            "errFiles": [],
            "succMap": resultFiles
          }
        }
      ));
    }
  };
  return [get, post];
};
createLocalImageServer().forEach((route) => use(route));
console.log("registed");
self.addEventListener("fetch", router);
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
