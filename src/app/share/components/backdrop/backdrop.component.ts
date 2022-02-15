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
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { empty, merge, of, Subscription } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import {
  OverlayRef,
  OverlayService,
} from 'src/app/services/tools/overlay.service';

@Component({
  selector: 'backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('loading', [
      transition(':enter', [
        style({
          opacity: 1,
          transform: 'translateX(0)',
        }),
        animate(
          '.2s',
          style({
            opacity: 1,
            transform: 'translateX(0)',
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '.3s',
          style({
            opacity: 1,
            transform: 'translateX(0)',
          })
        ),
      ]),
    ]),
  ],
})
export class BackdropComponent implements OnInit {
  @Input() show: boolean = true;
  @Output() hide = new EventEmitter<void>();
  visible: boolean = false;
  refresh: boolean = false;
  overlayRef!: OverlayRef | null;
  overlaySub!: Subscription | null;
  constructor(
    private cdr: ChangeDetectorRef,
    // private messageServe: MessageService,
    private overlayServe: OverlayService
  ) {}

  ngOnInit(): void {}
  ngOnChanges(): void {
    if (this.show) {
      this.showOverlay();
    } else {
      this.visible = false;
      this.refresh = false;
    }
  }
  animationDone(event: AnimationEvent): void {
    // console.log('animationDone :>> ');
    if (event.toState === 'void') {
      this.hideOverlay();
    }
  }
  hideOverlay() {
    if (this.overlaySub) {
      this.overlaySub.unsubscribe();
      this.overlaySub = null;
    }
    if (this.overlayRef) {
      // console.log('dispose :>> ');
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
  showOverlay(): void {
    if (!this.refresh) {
      // console.log('this.create :>> ');
      this.overlayRef = this.overlayServe.create({
        fade: false,
        // responseEvent: false,
      });
    }
    this.refresh = true;
    this.visible = true;
    this.mergeEvent();
  }
  mergeEvent() {
    this.overlaySub = merge(
      this.overlayRef!.backdropClick(),
      this.overlayRef!.backdropKeyup().pipe(
        pluck('key'),
        switchMap((key) => {
          return key.toUpperCase() === 'ESCAPE' ? of(key) : empty();
        })
      )
    ).subscribe(() => {
      this.hide.emit();
    });
  }
}
