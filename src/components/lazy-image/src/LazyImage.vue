<template>
  <div class="LazyImage" ref="imageContainer" v-loading="loading">
    <el-image
      v-if="isIntersecting"
      :src="props.src"
      fit="contain"
      @load="handleLoad"
      @error="handleError"
    />
    <el-empty v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { ElImage, ElMessage, ElEmpty } from "element-plus";
const props = defineProps<{
  src: string;
}>();

const isIntersecting = ref(false);
const loading = ref(true);
const imageContainer = ref(null);
const observer = ref<IntersectionObserver | null>(null);

const observeImage = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        isIntersecting.value = true;
        observer.disconnect();
      }
    },
    { threshold: 0.1 }
  );

  if (imageContainer.value) {
    observer.observe(imageContainer.value);
  }
};

const handleLoad = () => {
  loading.value = false;
};

const handleError = () => {
  loading.value = false;
  ElMessage.error(`图片加载失败，尝试使用vpn重新加载`);
};

onMounted(() => {
  observeImage();
});

onUnmounted(() => {
  // 清理观察器
  if (imageContainer.value) {
    observer.value?.disconnect();
  }
});
</script>

<style scoped lang="less">
.LazyImage {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
