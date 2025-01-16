export interface StaffMember {
  name: string
  avatar_url: string
  introductions: string[]
  pages: {
    name: string
    url: string
  }[]
}