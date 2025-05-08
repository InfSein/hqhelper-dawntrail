import { NTooltip, type DropdownGroupOption, type DropdownOption, type SelectOption } from "naive-ui"
import { h, type Ref, type VNode } from "vue"

const useUiTools = (
  isMobile: Ref<boolean>,
) => {
  const optionsRenderer = ({ node, option }: { node: VNode, option: DropdownOption | DropdownGroupOption | SelectOption }) => {
    if (option.description) {
      return h(
        NTooltip,
        {
          keepAliveOnHover: false,
          placement: 'right',
          style: {
            width: 'max-content',
            display: isMobile.value ? 'none' : 'inherit',
          }
        },
        {
          trigger: () => [node],
          default: () => option.description
        }
      )
    } else {
      return h(node)
    }
  }

  return {
    optionsRenderer,
  }
}

export default useUiTools