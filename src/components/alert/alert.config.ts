import { faCheck, faXmark, faCircleInfo, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

export const ALERT_CONFIG = {
  success: {
    icon: faCheck,
    markerClass: 'green',
    styleClass: 'success',
  },
  error: {
    icon: faXmark,
    markerClass: 'red',
    styleClass: 'error',
  },
  warning: {
    icon: faTriangleExclamation,
    markerClass: 'yellow',
    styleClass: 'warning',
  },
  info: {
    icon: faCircleInfo,
    markerClass: 'blue',
    styleClass: 'info',
  },
} as const;