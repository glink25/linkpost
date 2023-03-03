<script setup lang="ts">
import { ref } from 'vue';
import Login from '@/components/Login.vue'
import { useEditor } from '@/hooks/useEditor';
import { useUpload } from '@/hooks/useUpload';
import { useUser } from '@/hooks/useUser';

const { upload, uploading } = useUpload()
const { isLogin } = useUser()

const editorRef = ref<HTMLElement>()
const { value: content } = useEditor(editorRef)

const toUpload = () => {
  if (!isLogin.value || !content.value) return;
  console.log(content)
  upload(content.value)

}

</script>

<template>
  <div class="w-full flex justify-between p-2">
    <Login />
    <button :disabled="!isLogin || !content || uploading" class="primary-button"
      @click="toUpload">{{ uploading ? 'Uploading' : 'Upload' }}</button>
  </div>
  <div class="flex-1 w-full px-4 py-4 max-w-[1000px] h-[400px]">
    <div ref="editorRef"></div>
  </div>
</template>
<style lang="scss">
@import "./styles/base.scss";
@import "./styles/editor.scss";

</style>
