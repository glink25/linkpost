import { onMounted, ref, Ref } from "vue";
import Vditor from 'vditor'
import "vditor/src/assets/less/index.less"

export const useEditor = (elRef: Ref<HTMLElement | undefined>) => {
    const value = ref('')


    const assetsSite = (() => {
        const url = new URL(location.href.replace('/#/', '/'))
        return url.searchParams.get('assets_site') ?? 'https://local.assets.server'
    })()

    let editor: Vditor
    onMounted(() => {
        if (!elRef.value) return;
        editor = new Vditor(elRef.value, {
            cache: { enable: false },
            upload: { url: assetsSite },
            placeholder: 'Type here',
            input: (text) => {
                value.value = text
            }
        })
    })
    return {
        value
    }
}