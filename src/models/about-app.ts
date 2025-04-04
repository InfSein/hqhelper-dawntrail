export interface StaffMember {
  name: string
  avatar_url: string
  desc: string
  introductions: string[]
  pages: {
    name: string
    url: string
  }[]
}

export const createStaffMember = (
  name: string,
  avatar_url: string,
  desc: string,
  introductions: string[],
  pages: { name: string; url: string }[]
) : StaffMember => {
  return {
    name,
    avatar_url,
    desc,
    introductions,
    pages
  }
}