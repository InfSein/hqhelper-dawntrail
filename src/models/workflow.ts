import {
  assignDefaults,
  deepCopy
} from '@/tools'

export interface Workflow {
  name?: string;
  /** 制作目标; key:item-id, value:amount */
  targetItems: Record<number, number>;
  /** 已有道具; key:item-id, value:amount */
  preparedItems: {
    craftTarget: Record<number, number>,
    materialsLv1: Record<number, number>,
    materialsLvBase: Record<number, number>
  }
}
const defaultWorkflow: Workflow = {
  targetItems: {},
  preparedItems: {
    craftTarget: {},
    materialsLv1: {},
    materialsLvBase: {},
  }
}
export const getDefaultWorkflow = () => deepCopy(defaultWorkflow)
export const _VAR_MAX_WORKFLOW = 5;

export interface WorkState {
  currentWorkflow: number;
  workflows: Workflow[];
}
export const defaultWorkState: WorkState = {
  currentWorkflow: 0,
  workflows: [getDefaultWorkflow()]
}

export const fixWorkState = (state?: WorkState) : WorkState => {
  return assignDefaults(defaultWorkState, state || {}) as WorkState
}