<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import CraftActionButton from '@/components/custom/action/CraftActionButton.vue'
import { XivCraftActionGroups, XivCraftActions } from '@/assets/data'
import { type UserConfigModel } from '@/models/config-user'
import { type FuncConfigModel } from '@/models/config-func'
import UseConfig from '@/tools/use-config'

const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const {
  uiLanguage,
} = UseConfig(userConfig, funcConfig)

const craftActions = defineModel<{
  id: number,
  val: number,
}[]>('craftActions', { required: true })
const craftActionIndex = defineModel<number>('craftActionIndex', { required: true })

interface CraftMacroEditorProps {
  containerId?: string
}
const props = defineProps<CraftMacroEditorProps>()

</script>

<template>
  <div class="editor-wrapper">
    <VueDraggable
      v-model="craftActions"
      :animation="150"
      id="panel-existed-actions"
    >
      <div class="actions-container">
        <CraftActionButton
          v-for="item in craftActions"
          :key="item.id"
          :craft-action="XivCraftActions[item.val]"
        />
      </div>
    </VueDraggable>
    <div id="panel-add-action">
      <div
        v-for="[groupKey, groupInfo] in Object.entries(XivCraftActionGroups)"
        :key="groupKey"
        class="action-group"
      >
        <div class="action-group-title">{{ groupInfo[`name_${uiLanguage}`] }}</div>
        <div class="action-group-content actions-container">
          <CraftActionButton
            v-for="(action, actionIndex) in groupInfo.actions"
            :key="groupKey + '-action-' + actionIndex"
            :craft-action="XivCraftActions[action]"
            :btn-size="32"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-wrapper {
  display: grid;
  grid-template-columns: auto auto;
  gap: 5px;

  .actions-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
}
</style>