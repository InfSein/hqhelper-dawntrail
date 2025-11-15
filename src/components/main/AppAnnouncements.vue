<script setup lang="ts">
import ModalDonate from '@/components/modals/ModalDonate.vue'
import { useStore } from '@/store'
import type { MainCacheModel } from '@/models/cache-main'
import {
  visitUrl,
} from '@/tools'
import { useDialog } from '@/tools/dialog'
import {
  qGroupInfo, githubInfo, otherSocialInfo,
} from '@/variables'

const t = inject<(message: string, args?: any) => string>('t')!
const mainCache = inject<Ref<MainCacheModel>>('mainCache')!

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const { confirm } = useDialog(t)

const showDonateModal = ref(false)

interface Announcement {
  id: AnnouncementId,
  hidden?: boolean
  type?: 'info' | 'success' | 'warning' | 'error'
  title: string
  content: string[]
  actions?: {
    label: string
    onClick: () => void
  }[]
}
enum AnnouncementId {
  dawntrailEnd = 1,
}

const announcements = computed(() : Announcement[] => {
  return [
    {
      id: AnnouncementId.dawntrailEnd,
      type: 'success',
      title: t('announcement.title.title_1'),
      content: [
        t('announcement.content.content_1_1'),
        t('announcement.content.content_1_2'),
        t('announcement.content.content_1_3'),
        t('announcement.content.content_1_4'),
      ],
      actions: [
        { label: t('announcement.action.follow_us'), onClick: () => visitUrl('https://weibo.com/u/7870808507') },
        { label: t('announcement.action.join_q_group'), onClick: () => visitUrl(qGroupInfo.groupUrl) },
        { label: t('announcement.action.feedback_github'), onClick: () => visitUrl(githubInfo.newIssueUrl) },
        { label: t('announcement.action.feedback_qquery'), onClick: () => visitUrl(otherSocialInfo.qqQueryUrl) },
        { label: t('common.appfunc.donate_us'), onClick: () => showDonateModal.value = true },
      ]
    }
  ]
})

const announcementsToShow = computed(() : Announcement[] => {
  return announcements.value
    .filter(announcement => {
      return !announcement.hidden && !mainCache.value.ignore_announcements.includes(announcement.id)
    })
    .map(announcement => {
      return {
        ...announcement,
        type: announcement.type ?? 'info',
      }
    })
})

const handleIgnoreAnnouncement = async (aid: AnnouncementId) => {
  if (!await confirm(
    t('announcement.message.ignore_confirm')
    + '\n' + t('common.message.operation_irreversible')
  )) {
    return
  }
  mainCache.value.ignore_announcements.push(aid)
  store.setMainCache(mainCache.value)
  NAIVE_UI_MESSAGE.success(t('announcement.message.ignored'))
}
</script>

<template>
  <div v-if="announcementsToShow.length" class="announcements-container">
    <n-alert
      v-for="announcement in announcementsToShow"
      :key="'anno-' + announcement.id"
      :type="announcement.type"
      :title="announcement.title"
      closable
    >
      <div class="announcement-content">
        <div class="content-text" v-html="announcement.content.join('<br>')" />
        <div class="content-actions-container">
          <n-button quaternary
            v-for="(action, actionIndex) in announcement.actions"
            :key="`anno-${announcement.id}-action-${actionIndex}`"
            type="info" size="small"
            @click="action.onClick"
          >
            {{ action.label }}
          </n-button>
          <n-button quaternary type="error" size="small" @click="handleIgnoreAnnouncement(announcement.id)">
            {{ t('announcement.action.ignore') }}
          </n-button>
        </div>
      </div>
    </n-alert>
    
    <ModalDonate v-model:show="showDonateModal" />
  </div>
</template>

<style scoped>
.announcements-container {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;

  .announcement-content {

    .content-actions-container {
      margin-top: 5px;
      display: flex;
      gap: 0 4px;
      justify-content: flex-end;
      flex-wrap: wrap;
    }
  }
}
</style>