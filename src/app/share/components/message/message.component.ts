import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
} from '@angular/core';
import { MessageItemData, MessageOptions } from './types';

@Component({
  selector: 'uc-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent implements OnInit {
  readonly defaultConfig: Required<MessageOptions> = {
    type: 'info',
    duration: 3000,
    showClose: false,
    pauseOnHover: false,
    countDown: 0,
    maxStack: 5,
    animate: true,
  };
  messages: MessageItemData[] = [];
  empty = new EventEmitter();
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  createMessage(message: MessageItemData): void {
    message.options = { ...this.defaultConfig, ...message.options };
    if (
      message.options.maxStack! > 0 &&
      this.messages.length >= message.options.maxStack!
    ) {
      this.removeMessage(this.messages[0].messageId);
    }
    this.messages.push(message);
    // console.log('messages :>> ', this.messages);
    this.cdr.markForCheck();
  }

  removeMessage(id: string): void {
    // console.log('id :>> ', id);
    const targetIndex = this.messages.findIndex(
      (item) => item.messageId === id
    );
    if (targetIndex > -1) {
      this.messages[targetIndex].onClose.next();
      this.messages[targetIndex].onClose.complete();
      this.messages.splice(targetIndex, 1);
      this.cdr.markForCheck();
    }
    if (this.messages.length === 0) {
      this.empty.emit();
    }
    // console.log('this.message :>> ', this.messages);
  }
}
