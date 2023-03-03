import { readonly, ref } from "vue"
import { fetchGithubUser, GithubUser } from "@/api"
import { loginHandler } from "@/utils/login"
import { pick } from "@/utils/pick"

const getLocalToken = () => localStorage.getItem('github_access_token')

const getLocalUserInfo = () => {
    const item = localStorage.getItem('github_user_info');
    if (!item) return;
    return JSON.parse(item)
}

export const useUser = (() => {

    const isLogin = ref(Boolean(getLocalToken()))
    const userInfo = ref<GithubUser>(getLocalUserInfo())

    const updateUserInfo = async () => {
        const info = await fetchGithubUser()
        userInfo.value = pick(info, ['name', 'login', 'avatar_url'])
        localStorage.setItem('github_user_info', JSON.stringify(info))
    }

    const login = async () => {
        await loginHandler.showLogin()
        isLogin.value = Boolean(getLocalToken())
        await updateUserInfo()
    }
    const logout = () => {
        localStorage.removeItem('github_user_info')
        loginHandler.logout()
    }

    if (isLogin.value) {
        updateUserInfo()
    }

    return () => ({
        login,
        logout,
        userInfo: readonly(userInfo),
        isLogin: readonly(isLogin),
    })
})()