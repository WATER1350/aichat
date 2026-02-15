import { mapValues } from 'lodash'
import type { Session, SessionMeta } from 'src/shared/types'
import { migrateMessage } from './message'

export function migrateSession(session: Session): Session {
  return {
    ...session,
    settings: {
      // temperature未设置的时候使用默认值undefined，这样才能覆盖全局设置
      temperature: undefined,
      ...session.settings,
    },
    messages: session.messages?.map((m) => migrateMessage(m)) || [],
    threads: session.threads?.map((t) => ({
      ...t,
      messages: t.messages.map((m) => migrateMessage(m)) || [],
    })),
    messageForksHash: mapValues(session.messageForksHash || {}, (forks) => ({
      ...forks,
      lists:
        forks.lists?.map((list) => ({
          ...list,
          messages: list.messages?.map((m) => migrateMessage(m)) || [],
        })) || [],
    })),
  }
}

export function sortSessions(sessions: SessionMeta[]): SessionMeta[] {
  const reversed: SessionMeta[] = []
  const pinned: SessionMeta[] = []
  let justChat: SessionMeta | null = null

  for (const sess of sessions) {
    // 将 Just Chat 会话单独处理，始终排在最前面
    if (sess.id === 'justchat-b612-406a-985b-3ab4d2c482ff') {
      justChat = sess
      continue
    }
    if (sess.starred) {
      pinned.push(sess)
      continue
    }
    reversed.unshift(sess)
  }

  // 返回顺序: Just Chat (如果有) -> 其他置顶会话 -> 非置顶会话
  const result: SessionMeta[] = []
  if (justChat) {
    result.push(justChat)
  }
  return result.concat(pinned, reversed)
}
