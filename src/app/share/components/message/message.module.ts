import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageItemComponent } from './message-item/message-item.component';
import { MessageComponent } from './message.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [MessageComponent, MessageItemComponent],
  imports: [CommonModule],
  exports: [MessageComponent, MessageItemComponent],
})
export class MessageModule {}
