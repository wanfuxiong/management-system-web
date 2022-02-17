<template>
    <router-link to="/" id="index-link">
        <img id="index-link-image" src="@/assets/images/management-system-logo-text.png" alt="">
    </router-link>
</template>

<script setup lang="ts">

</script>

<style scoped>
#index-link {
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
}

#index-link-image {
    height: 40px;
    margin: 0 10px;
}
</style>