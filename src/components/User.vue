<template>
    <div class="flex items-center">
        <template v-if="info">
            <img :src="info.avatar_url" class="w-8 h-8 rounded-full" alt="">
            <div class="px-2">{{ info.name }}</div>
            <button class="normal-button font-bold text-stone-400" @click="$emit('logout')">Log out</button>
        </template>
    </div>
</template>
<script lang="ts" setup>
import type { GithubUser } from '@/api';
defineProps<{ info?: GithubUser }>()

defineEmits<{
    (name: 'logout'): void
}>()

</script>