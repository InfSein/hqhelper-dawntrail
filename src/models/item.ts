import type { ItemInfo } from "@/tools/item"

export interface ItemGroup {
  title: string;
  key: string;
  items: ItemInfo[];
}