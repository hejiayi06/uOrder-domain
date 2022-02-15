import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[uoImgLazy]',
})
export class ImgLazyDirective implements AfterViewInit, OnDestroy {
  @Input('uoImgLazy') src = '';
  @HostBinding('attr.src')
  readonly defaultSrc = '../../../assets/images/default/defaultpic.png';
  private io!: IntersectionObserver;
  private changeTimes = 0;
  private host!: HTMLElement;
  constructor(private el: ElementRef, private rd2: Renderer2) {}
  ngOnDestroy(): void {
    this.io.unobserve(this.host);
  }
  ngAfterViewInit(): void {
    this.host = this.el.nativeElement;
    this.io = new IntersectionObserver((entries) => {
      const ratio = entries[0].intersectionRatio;
      if (ratio > 0 && this.changeTimes === 0) {
        this.changeSrc();
      }
    });
    this.io.observe(this.host);
  }
  private changeSrc(): void {
    this.changeTimes++;
    const img = new Image();
    img.src = this.src || '';
    this.rd2.listen(img, 'load', () => {
      this.rd2.setProperty(this.host, 'src', this.src);
    });
  }
}
