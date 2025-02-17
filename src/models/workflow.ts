import {
  assignDefaults
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
export const defaultWorkflow: Workflow = {
  targetItems: {},
  preparedItems: {
    craftTarget: {},
    materialsLv1: {},
    materialsLvBase: {},
  }
}
export const _VAR_MAX_WORKFLOW = 5;

export interface WorkState {
  currentWorkflow: number;
  workflows: Workflow[];
}
export const defaultWorkState: WorkState = {
  currentWorkflow: 0,
  workflows: [defaultWorkflow]
}

export const fixWorkState = (state?: WorkState) : WorkState => {
  return assignDefaults(defaultWorkState, state || {}) as WorkState
}