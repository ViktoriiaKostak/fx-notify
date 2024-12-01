export const NotificationStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
} as const;

export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus]