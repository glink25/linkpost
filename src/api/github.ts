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

type UploadParam = { user: string, repo: string, path: string, content: string, message: string, sha?: string }
export const postFileToGithub = async ({ user, repo, path, content, message, sha }: UploadParam) => {
    await request(`https://api.github.com/repos/${user}/${repo}/contents/${path}`, { method: 'put', body: JSON.stringify({ content, message, sha }) })
}

export type GithubFileInfo = { sha: string, content: string, name: string, path: string }
type InfoParam = { user: string, repo: string, path: string }
export const fetchGithubFileInfo = async ({ user, repo, path }: InfoParam) => request<GithubFileInfo>(`https://api.github.com/repos/${user}/${repo}/contents/${path}`, { method: 'get' })
