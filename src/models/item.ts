import type { Component } from "vue"
import type { ItemInfo } from "@/tools/item"

export interface ItemGroup {
  title: string;
  key: string;
  items: ItemInfo[];
}

export interface RecommItemGroup {
  title: string,
  subtitle?: Component,
  icon: string,
  description?: string,
  items: ItemInfo[]
}