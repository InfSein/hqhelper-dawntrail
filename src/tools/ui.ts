import { NTooltip, type DropdownGroupOption, type DropdownOption } from "naive-ui"
import { h, type Ref, type VNode } from "vue"

const useUiTools = (
  isMobile: Ref<boolean>,
) => {
  const dropdownOptionsRenderer = ({ node, option }: { node: VNode, option: DropdownOption | DropdownGroupOption }) => {
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
    dropdownOptionsRenderer,
  }
}

export default useUiTools