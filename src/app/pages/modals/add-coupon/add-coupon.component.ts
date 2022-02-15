import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'uo-add-coupon',
  templateUrl: './add-coupon.component.html',
  styleUrls: ['./add-coupon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCouponComponent implements OnInit {
  loading: boolean = false;
  coupon!: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
  applyCoupon(): void {
    this.activeModal.close(this.coupon);
  }
}
