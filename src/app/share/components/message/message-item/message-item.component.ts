import {
  animate,
  style,
  transition,
  trigger,
  AnimationEvent,
} from '@angular/animations';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { interval, Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { MessageComponent } from '../message.component';
import { MessageItemData } from '../types';

@Component({
  selector: 'uc-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('moveUpMotion', [
      transition('* => enter', [
        style({
          opacity: 0,
          transform: 'translateY(-100%)',
        }),
        animate(
          '.2s',
          style({
            opacity: 1,
            transform: 'translateY(0)',
          })
        ),
      ]),
      transition('* => leave', [
        animate(
          '.3s',
          style({
            opacity: 1,
            transform: 'translateY(-100%)',
          })
        ),
      ]),
    ]),
  ],
})
export class MessageItemComponent implements OnInit, OnDestroy {
  @Input() message!: MessageItemData;
  @Input() index = 0;
  private timer$!: Subscription | null;
  private autoClose = true;
  countDown = 0;
  // showCountDown = false;
  constructor(
    private parent: MessageComponent,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const { duration, countDown } = this.message.options!;
    this.autoClose = this.message.options?.duration! > 0;
    this.countDown = this.message.options?.countDown!;
    if (this.autoClose) {
      if (this.countDown > 0) {
        this.createTimer((countDown! as number) * 1000);
        this.count(this.countDown);
      } else {
        this.createTimer(duration as number);
      }
    }
  }
  enter(): void {
    if (this.autoClose && this.message.options?.pauseOnHover) {
      this.clearTimer();
    }
  }
  leave(): void {
    if (this.autoClose && this.message.options?.pauseOnHover) {
      this.createTimer(this.message.options.duration!);
    }
  }
  private createTimer(duration: number): void {
    this.timer$ = timer(duration).subscribe(() => {
      this.close();
    });
  }

  count(count: number): void {
    const numbers = interval(1000).pipe(take(count));
    numbers.subscribe((res) => {
      // if (this.countDown) {
      //   this.showCountDown = true;
      // } else {
      //   this.showCountDown = false;
      // }
      this.countDown = count - res - 1;
      this.cdr.markForCheck();
    });
  }
  close(): void {
    this.message.state = 'leave';
    this.cdr.markForCheck();
  }
  animationDone(e: AnimationEvent): void {
    if (e.toState == 'leave') {
      this.parent.removeMessage(this.message.messageId);
    }
  }
  get itemClass(): string {
    return 'alert-' + this.message.options?.type;
  }

  clearTimer(): void {
    if (this.timer$) {
      this.timer$.unsubscribe();
      this.timer$ = null;
    }
  }
  ngOnDestroy(): void {
    this.clearTimer();
  }
}
