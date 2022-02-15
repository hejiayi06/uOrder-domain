import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'uo-custom-tips-modal',
  templateUrl: './custom-tips-modal.component.html',
  styleUrls: ['./custom-tips-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTipsModalComponent implements OnInit {
  loading: boolean = false;
  tipsAmount!: number;
  constructor(public activeModal: NgbActiveModal) {}
  ngOnInit(): void {}
  updateTips(): void {
    this.activeModal.close(this.tipsAmount);
  }
}
