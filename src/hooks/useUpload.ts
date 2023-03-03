import { postFileToGithub } from "@/api"
import { showNotice } from "@/components/notice"
import { useUser } from "@/hooks/useUser"
import { ref } from "vue"
import { useInitialInfo } from "./useInitialInfo"
import { Base64 } from "js-base64";


export const useUpload = () => {
    const { userInfo } = useUser()

    const { routeInfo: info, initialContent } = useInitialInfo()

    const uploading = ref(false)
    const upload = async (content: string) => {
        const user = userInfo.value?.login
        if (!user || !info) {
            showNotice({ type: 'warning', content: 'user, path or repo not in url' })
            return
        };
        uploading.value = true
        try {
            await postFileToGithub({
                user,
                repo: info.repo,
                message: 'feat: edit or add file by linkhub',
                path: info.path,
                content: Base64.encode(content),
                sha: initialContent.value?.sha
            })
            showNotice({ type: 'success', content: 'Upload success!' })
        } catch (error) {
            showNotice({ type: 'error', content: error as any })
        }
        uploading.value = false
    }
    return {
        upload,
        uploading
    }
}