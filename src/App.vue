<script setup lang="ts">
import { computed, ref } from 'vue';
import Login from '@/components/Login.vue'
import { useEditor } from '@/hooks/useEditor';
import { useUpload } from '@/hooks/useUpload';
import { useUser } from '@/hooks/useUser';
import { ConfirmProvider, bindings as confirmBindings } from '@/components/confirm';
import { NoticeProvider, bindings as noticeBindings } from '@/components/notice';
import { useInitialInfo } from './hooks/useInitialInfo';

const { upload, uploading } = useUpload()
const { isLogin } = useUser()

const { routeInfo } = useInitialInfo()

const editorRef = ref<HTMLElement>()
const { value: content } = useEditor(editorRef)

const toUpload = () => {
  if (!isLogin.value || !content.value) return;
  console.log(content)
  upload(content.value)

}

const uploadButtonText = computed(() => {
  if (uploading.value) {
    if (routeInfo?.path) return 'Editing...';
    return 'Creating';
  }
  if (routeInfo?.path) return 'Edit';
  return 'Create';
})

</script>

<template>
  <div class="w-full flex justify-between p-2">
    <Login />
    <div class="flex items-center">
      <a class="mr-2" href="" target="_blank">
        <div class="i-mdi:question-mark-circle-outline w-5 h-5 bg-stone-400"></div>
      </a>
      <button :disabled="!isLogin || !content || uploading" class="primary-button" @click="toUpload">{{ uploadButtonText
      }}</button>
    </div>
  </div>
  <div class="flex-1 w-full px-4 py-4 max-w-[1000px] h-[400px]">
    <div ref="editorRef"></div>
  </div>
  <ConfirmProvider :bindings="confirmBindings"></ConfirmProvider>
  <NoticeProvider :bindings="noticeBindings"></NoticeProvider>
</template>
<style lang="scss">
@import "./styles/base.scss";
@import "./styles/editor.scss";
</style>
