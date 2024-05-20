<script lang="ts" setup>
import { useLayoutMode } from "@/hooks/useLayoutMode"
import logo from "@/assets/layouts/logo.png?url"
import logoText1 from "@/assets/layouts/logo-text-1.png?url"

interface Props {
  collapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapse: true
})

const { isTop } = useLayoutMode()
</script>

<template>
  <div class="layout-logo-container" :class="{ collapse: props.collapse, 'layout-mode-top': isTop }">后台管理系统</div>
</template>

<style lang="scss" scoped>
.layout-logo-container {
  position: relative;
  width: 100%;
  height: var(--v3-header-height);
  line-height: var(--v3-header-height);
  text-align: center;
  color: white;
  font-size: 22px;
  overflow: hidden;
}
</style>
