import { onMounted, ref, Ref, watchEffect } from "vue";
import Vditor from '@glink25/vditor'
import "@glink25/vditor/src/assets/less/index.less"
import { useInitialInfo } from "./useInitialInfo";
import { Base64 } from "js-base64";
import { LocalAssetsServer } from "@/utils/localAssetsServer";

export const useEditor = (elRef: Ref<HTMLElement | undefined>) => {
    const value = ref('')

    const { initialContent } = useInitialInfo()


    const assetsSite = (() => {
        const url = new URL(location.href.replace('/#/', '/'))
        return url.searchParams.get('assets_site') ?? 'https://local.assets.server'
    })()

    let editor: Vditor
    onMounted(() => {
        if (!elRef.value) return;
        editor = new Vditor(elRef.value, {
            cache: { enable: false },
            upload: {
                processor: (_, files) => {
                    return LocalAssetsServer.handler(files)
                },
            },
            placeholder: 'Type here',
            input: (text) => {
                value.value = text
            },
        })
        watchEffect(async () => {
            if (initialContent.value) {
                const text = Base64.decode(initialContent.value.content)
                editor.setValue(text)
            }
        })
    })
    return {
        value
    }
}