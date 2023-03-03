const CLIENT_ID = 'ca9e273e5bec4299799c'
const REDIRECT_URL = `https://linkhub-navy.vercel.app/api/oath/redirect?origin=${window.origin}`// window.location.href

const defaultOptions = {
    width: 626,
    height: 436,
};

const getPopupPos = (w: number, h: number) => {
    const width = window.innerWidth || (document.documentElement.clientWidth || window.screenX);
    const height = window.innerHeight || (document.documentElement.clientHeight || window.screenY);
    const systemZoom = width / window.screen.availWidth;

    const left = (width - w) / 2 / systemZoom + (window.screenLeft !== undefined ? window.screenLeft : window.screenX);
    const top = (height - h) / 2 / systemZoom + (window.screenTop !== undefined ? window.screenTop : window.screenY);
    return {
        left, top,
    };
};

const open = (link: string, name?: string) => {
    const option = { ...defaultOptions };
    const pos = getPopupPos(option.width, option.height);
    return window.open(
        link,
        name,
        `,height=${option.height
        },width=${option.width
        },left=${pos.left
        },top=${pos.top
        },screenX=${pos.left
        },screenY=${pos.top}`,
    );
}

export const TOKEN_STORAGE_NAME = 'github_access_token'

const createLoginHandler = () => {
    const showLogin = () => {
        const opener = open(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo&redirect_uri=${REDIRECT_URL}`, 'login',)
        return new Promise<void>((res) => {
            window.addEventListener('message', (msg) => {
                console.log(msg)
                if (msg.data.accessToken) {
                    console.log('loginsuccess')
                    opener?.close()
                    localStorage.setItem(TOKEN_STORAGE_NAME, msg.data.accessToken)
                    res()
                }
            })
        })
    }
    const logout = () => {
        localStorage.removeItem(TOKEN_STORAGE_NAME);
        location.reload()
    }

    return {
        showLogin, logout
    }
}

export const loginHandler = createLoginHandler()