import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
  TemplateRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { MessageComponent } from './message.component';
import { MessageModule } from './message.module';
import { uniqueId } from 'lodash';
import { MessageItemData, MessageOptions } from './types';

@Injectable({
  providedIn: MessageModule,
})
export class MessageService {
  private message!: MessageComponent | null;
  private componentRef!: ComponentRef<MessageComponent>;
  private rd2!: Renderer2;
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private cfr: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private rd2Factory: RendererFactory2
  ) {
    this.rd2 = this.rd2Factory.createRenderer(null, null);
  }

  info(
    content: string | TemplateRef<void>,
    options?: MessageOptions
  ): MessageItemData {
    return this.create(content, { ...options, type: 'info' });
  }
  dark(
    content: string | TemplateRef<void>,
    options?: MessageOptions
  ): MessageItemData {
    return this.create(content, { ...options, type: 'dark' });
  }
  light(
    content: string | TemplateRef<void>,
    options?: MessageOptions
  ): MessageItemData {
    return this.create(content, { ...options, type: 'light' });
  }
  primary(
    content: string | TemplateRef<void>,
    options?: MessageOptions
  ): MessageItemData {
    return this.create(content, { ...options, type: 'primary' });
  }
  warning(
    content: string | TemplateRef<void>,
    options?: MessageOptions
  ): MessageItemData {
    return this.create(content, { ...options, type: 'warning' });
  }
  success(
    content: string | TemplateRef<void>,
    options?: MessageOptions
  ): MessageItemData {
    return this.create(content, { ...options, type: 'success' });
  }
  danger(
    content: string | TemplateRef<void>,
    options?: MessageOptions
  ): MessageItemData {
    return this.create(content, { ...options, type: 'danger' });
  }
  // error(
  //   content: string | TemplateRef<void>,
  //   options?: MessageOptions
  // ): MessageItemData {
  //   return this.create(content, { ...options, type: 'error' });
  // }
  private create(
    content: string | TemplateRef<void>,
    options?: MessageOptions
  ): MessageItemData {
    const messageItemData: MessageItemData = {
      messageId: uniqueId('message_'),
      content,
      onClose: new Subject<void>(),
      state: 'enter',
      options,
    };
    if (isPlatformBrowser(this.platformId)) {
      if (!this.message) {
        this.message = this.getMessage();
      }
      // console.log('this.message :>> ', this.message);
      this.message.createMessage(messageItemData);
    }
    return messageItemData;
  }
  private getMessage(): MessageComponent {
    const factory = this.cfr.resolveComponentFactory(MessageComponent);
    this.componentRef = factory.create(this.injector);
    this.appRef.attachView(this.componentRef.hostView);
    this.rd2.appendChild(
      this.doc.body,
      this.componentRef.location.nativeElement
    );
    const { instance } = this.componentRef;
    this.componentRef.onDestroy(() => {
      console.log('destory :>>');
    });
    instance.empty.subscribe(() => {
      this.destory();
    });
    return instance;
  }
  private destory(): void {
    this.componentRef.destroy();
    this.message = null;
  }
}
