import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'uo-announce',
  templateUrl: './announce.component.html',
  styleUrls: ['./announce.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AnnounceComponent implements OnInit {
  loading: boolean = false;
  announce: any;
  constructor(
    public activeModal: NgbActiveModal,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {}
  parseAnnounce(): any {
    return JSON.parse(this.announce);
  }
  parseHTML(text: string) {
    return this._sanitizer.bypassSecurityTrustHtml(text);
  }
}
