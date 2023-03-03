import { postFileToGithub } from "@/api"
import { useUser } from "@/hooks/useUser"
import { ref } from "vue"

export const useUpload = () => {
    const { userInfo } = useUser()

    const uploading = ref(false)
    const upload = async (content: string) => {
        const info = (() => {
            const url = new URL(location.href.replace('/#/', '/'))
            const repo = url.searchParams.get('repo')
            const name = url.searchParams.get('name')

            return (repo && name) ? { repo, name } : undefined
        })()
        const user = userInfo.value?.login
        if (!user || !info) return
        uploading.value = true
        try {
            await postFileToGithub({
                user,
                repo: info.repo,
                message: 'feat: edit or add file by linkhub',
                name: info.name,
                content: btoa(content)
            })
        } catch (error) {

        }
        uploading.value = false
    }
    return {
        upload,
        uploading
    }
}