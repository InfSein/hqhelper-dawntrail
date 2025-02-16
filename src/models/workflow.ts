import {
  assignDefaults
} from '@/tools'

export interface Workflow {
  name?: string;
  /** 制作目标; key:item-id, value:amount */
  targetItems: Record<number, number>;
  /** 已有道具; key:item-id, value:amount */
  preparedItems: Record<number, number>;
}
export const defaultWorkflow: Workflow = {
  targetItems: {},
  preparedItems: {}
}

export interface WorkState {
  currentWorkflow: number;
  workflows: Workflow[];
}
export const defaultWorkState: WorkState = {
  currentWorkflow: 0,
  workflows: []
}

export const fixWorkState = (state?: WorkState) : WorkState => {
  if (!state) {
    return defaultWorkState;
  }
  return assignDefaults(defaultWorkState, state || {}) as WorkState
}