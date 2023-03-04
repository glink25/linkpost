export const createLocalAssetsServer = <R>(responseTransformer: (results: [string, string][]) => R = (res) => res as R) => {
    const createKey = (() => {
        let i = 0;
        return (name?: string) => {
            const key = `assets-server-local/${i}/${name}`
            i += 1;
            return key
        }
    })()
    const fileMap = new Map<string, { file: File, url: string }>()

    const pushFile = (file: File) => {
        const url = URL.createObjectURL(file)
        const key = createKey(file.name)
        fileMap.set(key, { file, url })
        return [key, url] as [string, string]
    }


    const handler = (files: File[]) => {
        const results = files.map(pushFile)
        const response = responseTransformer(results)
        return response
    }

    return {
        handler,
        fileMap
    }
}

const vditorResponseTransformer = (results: [string, string][]) => {
    return JSON.stringify({
        "msg": "",
        "code": 0,
        "data": {
            "errFiles": [],
            "succMap": Object.fromEntries(results)
        }
    }
    )
}

export const LocalAssetsServer = createLocalAssetsServer(vditorResponseTransformer)