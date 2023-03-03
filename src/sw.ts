declare const self: ServiceWorkerGlobalScope;
export { }

type Route = { matcher: (url: string) => Promise<boolean>, method: string, handler: (req: Request) => Promise<Response> }
const createRouter = () => {
    const routes: Route[] = []
    const use = (route: Route) => {
        routes.push(route)
    }
    const router = (event: FetchEvent) => {
        const pro = new Promise<Response>(async (res, rej) => {
            for await (const route of routes) {
                const matched = event.request.method === route.method && await route.matcher(event.request.url)
                if (matched) {
                    try {
                        const data = await route.handler(event.request.clone())
                        res(data)
                    } catch (error) {
                        rej(error)
                    }
                    return
                }
            }
            res(fetch(event.request))
        })
        event.respondWith(pro)
    }
    return {
        use,
        router
    }
}

const { router, use } = createRouter();

const getLocationConfig = async () => {
    const [client] = await self.clients.matchAll()
    const url = new URL(client.url.replace('/#/', '/'))
    return url
}

const createLocalImageServer = () => {
    const getLocalAssetsServer = async () => {
        const url = await getLocationConfig()
        return url.searchParams.get('assets_site') ?? 'https://local.assets.server'
    }
    const createIndex = (() => {
        let i = 0
        return () => {
            return i += 1
        }
    })()

    const fileMap = new Map<string, File>()
    const uploadFile = async (file: File) => {
        const name = `${createIndex()}.${file.name.split('.').pop() ?? 'jpg'}`
        fileMap.set(name, file)
        return `${await getLocalAssetsServer()}/${name}`
    }
    const get: Route = {
        matcher: async (url) => url.startsWith(await getLocalAssetsServer()),
        method: 'GET',
        handler: async (req) => {
            const name = req.url.split("/").pop() ?? ''
            const file = fileMap.get(name)
            if (file) {
                return new Response(file.stream())
            }
            throw new Error("assets not found");
        }
    }
    const post: Route = {
        matcher: async (url) => url.startsWith(await getLocalAssetsServer()),
        method: 'POST',
        handler: async (req) => {
            const formBody = await req.formData()
            const files = formBody.getAll('file[]') as File[]
            const resultFiles = Object.fromEntries(await Promise.all(files.map(async (file) => [file.name, await uploadFile(file)])))
            return new Response(JSON.stringify({
                "msg": "",
                "code": 0,
                "data": {
                    "errFiles": [],
                    "succMap": resultFiles
                }
            }
            ))
        }
    };
    return [get, post]
}
createLocalImageServer().forEach(route => use(route));


console.log('registed');
self.addEventListener('fetch', router);
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());

});