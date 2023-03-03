<template>
    <button v-if="!isLogin" class="primary-button text-white font-bold" @click="login">login</button>
    <User :info="userInfo" @logout="logout"></User>
</template>
<script lang="ts" setup>
import User from "./User.vue";
import { useUser } from '@/hooks/useUser';

const { login, userInfo, isLogin, logout } = useUser()
</script>