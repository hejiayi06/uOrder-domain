import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WindowService } from 'src/app/services/local/window.service';
import { storageKeys } from 'src/app/share/configs';

@Component({
  selector: 'uo-checkout-header',
  templateUrl: './checkout-header.component.html',
  styleUrls: ['./checkout-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutHeaderComponent implements OnInit {
  restaurantId!: string;
  constructor(private winServe: WindowService) {}

  ngOnInit(): void {
    this.restaurantId = this.winServe.getLocalStorage(
      storageKeys.store
    ) as string;
  }
}
