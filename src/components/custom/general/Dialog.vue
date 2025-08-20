<script setup lang="ts">
import { ref } from "vue"

interface DialogProps {
  title: string
  message: string
  type: "alert" | "confirm"
  resolve: (value: boolean | void) => void
}
const props = defineProps<DialogProps>()

const visible = ref(true)

function handleOk() {
  visible.value = false
  if (props.type === 'confirm') {
    props.resolve(true)
  } else {
    props.resolve()
  }
}
function handleCancel() {
  visible.value = false
  props.resolve(false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="dialog-mask"
      >
        <Transition name="scale">
          <div v-if="visible" class="dialog">
            <div class="dialog-header">
              <span class="dialog-icon">⚡</span>
              <h2 class="dialog-title">{{ title }}</h2>
            </div>
            <div class="dialog-content">
              {{ message }}
            </div>
            <div class="dialog-actions">
              <button
                v-if="type === 'confirm'"
                class="btn cancel"
                @click="handleCancel"
              >
                取消
              </button>
              <button class="btn confirm" @click="handleOk">
                确定
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 遮罩层 */
.dialog-mask {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(30, 30, 30, 0.4);
  backdrop-filter: blur(8px);
  z-index: 1000;
}

/* 对话框主体 */
.dialog {
  width: 360px;
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  animation: pop 0.25s ease-out;
}

/* 标题区 */
.dialog-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.dialog-icon {
  font-size: 22px;
  margin-right: 8px;
}
.dialog-title {
  font-size: 18px;
  font-weight: 600;
}

/* 内容区 */
.dialog-content {
  font-size: 15px;
  line-height: 1.6;
  color: #444;
  margin-bottom: 20px;
}

/* 按钮区 */
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 渐变按钮 */
.btn {
  min-width: 80px;
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.btn.cancel {
  background: #f0f0f0;
  color: #333;
}
.btn.confirm {
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: white;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

@keyframes pop {
  from {
    transform: scale(0.9);
    opacity: 0.5;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
