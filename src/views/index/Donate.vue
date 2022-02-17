<template>
    <el-container class="base-body">
        <el-main>
            <h1 style="font-size: 2em;margin-bottom: 20px">捐助</h1>
            <p class="paragraph">如果你喜欢该项目的话，支付宝或微信捐助他一点8 ･ᴗ･</p>
            <div style="text-align: center">
                <AlipayCollectionQRCode/>
                <WechatCollectionQRCode/>
            </div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import AlipayCollectionQRCode from "@/components/AlipayCollectionQRCode.vue";
import WechatCollectionQRCode from "@/components/WechatCollectionQRCode.vue";
</script>

<style scoped>

</style>
