import { TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

export type MessageType =
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'danger'
  | 'primary'
  | 'light'
  | 'dark';

export interface MessageOptions {
  type?: MessageType;
  duration?: number;
  showClose?: boolean;
  pauseOnHover?: boolean;
  countDown?: number;
  maxStack?: number;
  animate?: boolean;
}

export interface MessageItemData {
  messageId: string;
  content: string | TemplateRef<void>;
  onClose: Subject<void>;
  state: 'enter' | 'leave';
  options?: MessageOptions;
}
