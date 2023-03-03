const request = async <T>(url: string, options?: RequestInit) => {
    const token = localStorage.getItem('github_access_token')
    const response = await fetch(url, {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        ...options
    })
    const data = await response.json()
    return data as T
}

export type GithubUser = {
    avatar_url: string;
    name: string;
    login: string
}
export const fetchGithubUser = async () => {
    const data = await request<GithubUser>('https://api.github.com/user')
    return data
}

type UploadParam = { user: string, repo: string, name: string, content: string, message: string }
export const postFileToGithub = async ({ user, repo, name, content, message }: UploadParam) => {
    await request(`https://api.github.com/repos/${user}/${repo}/contents/${name}`, { method: 'put', body: JSON.stringify({ content, message }) })
}