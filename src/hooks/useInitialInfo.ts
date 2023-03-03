import { fetchGithubFileInfo, GithubFileInfo } from "@/api"
import { useUser } from "@/hooks/useUser"
import { ref } from "vue"

export const useInitialInfo = () => {
    const { userInfo } = useUser()

    const routeInfo = (() => {
        const url = new URL(location.href.replace('/#/', '/'))
        const repo = url.searchParams.get('repo')
        const path = url.searchParams.get('path')

        return (repo && path) ? { repo, path } : undefined
    })()

    const exsitFileInfo = (() => {
        const user = userInfo.value?.login
        if (!user || !routeInfo) return Promise.resolve(undefined)
        const getter = fetchGithubFileInfo({ user, ...routeInfo })
        return getter
    })()

    const loading = ref(!Boolean(routeInfo?.path))
    const initialContent = ref<GithubFileInfo>()
    exsitFileInfo.then((info) => {
        initialContent.value = info;
        loading.value = false
    })
    return {
        routeInfo,
        loading,
        initialContent
    }
}