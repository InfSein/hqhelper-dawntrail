import {
  assignDefaults,
  deepCopy
} from '@/tools'

export interface Workflow {
  name?: string;
  /** 临时ID, 目前只用于 vue-draggable 渲染 */
  tempId?: number;
  /** 制作目标; key:item-id, value:amount */
  targetItems: Record<number, number>;
  /** 已有道具; key:item-id, value:amount */
  preparedItems: {
    craftTarget: Record<number, number>,
    materialsLv1: Record<number, number>,
    materialsLvBase: Record<number, number>
  },
  recommData: {
    hideChsOfflineItems: boolean,
    expandedBlocks: Record<number, string[]>,
    /** (groupId, (itemId, checked)) */
    completedItems: Record<number, Record<number, boolean>>
  }
}
const defaultWorkflow: Workflow = {
  targetItems: {},
  preparedItems: {
    craftTarget: {},
    materialsLv1: {},
    materialsLvBase: {},
  },
  recommData: {
    hideChsOfflineItems: false,
    expandedBlocks: {},
    completedItems: {}
  }
}
export const getDefaultWorkflow = () => deepCopy(defaultWorkflow)
export const _VAR_MAX_WORKFLOW = 5;

export interface WorkState {
  currentWorkflow: number;
  lastjoinWorkflow: number;
  workflows: Workflow[];
}
export const defaultWorkState: WorkState = {
  currentWorkflow: 0,
  lastjoinWorkflow: 0,
  workflows: [getDefaultWorkflow()]
}

export const fixWorkState = (state?: WorkState) : WorkState => {
  const _state = assignDefaults(defaultWorkState, state || {}) as WorkState
  _state.workflows.forEach(workflow => {
    if (!workflow.recommData) {
      workflow.recommData = deepCopy(defaultWorkflow.recommData)
    } else if (workflow.recommData.hideChsOfflineItems === undefined) {
      workflow.recommData.hideChsOfflineItems = false
    }
  })
  return _state
}