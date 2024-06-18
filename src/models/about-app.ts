export interface Staff {
  group_name_zh: string;
  group_name_en: string;
  group_name_ja: string;
  sub_groups: StaffGroup[];
}
export interface StaffGroup {
  group_name_zh: string;
  group_name_en: string;
  group_name_ja: string;
  members: GroupMember[];
}
export interface GroupMember {
  name: string;
  avatar_url: string;
  pages: MemberPage[];
}
export interface MemberPage {
  name: string;
  url: string;
}