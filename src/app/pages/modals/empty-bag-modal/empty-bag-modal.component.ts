import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShoppingCartService } from 'src/app/services/apis/shopping-cart.service';
import { ErrorsService } from 'src/app/services/local/errors.service';
import { WindowService } from 'src/app/services/local/window.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { storageKeys } from 'src/app/share/configs';

@Component({
  selector: 'uo-empty-bag-modal',
  templateUrl: './empty-bag-modal.component.html',
  styleUrls: ['./empty-bag-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyBagModalComponent implements OnInit {
  loading: boolean = false;
  constructor(
    private messageServe: MessageService,
    private winServe: WindowService,
    private shoppingCartServe: ShoppingCartService,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private errorServe: ErrorsService
  ) {}

  ngOnInit(): void {}
  emptyBag(): void {
    this.loading = true;
    this.cdr.markForCheck();
    if (!this.winServe.getLocalStorage(storageKeys.auth)) {
      this.shoppingCartServe
        .deleteAnonymousShoppingCartAll(
          this.winServe.getLocalStorage(storageKeys.anonymous) as string
        )
        .subscribe(
          (res) => {
            console.log('deleteAnonymousShoppingCartAll :>> ', res);
            if (res.data.value) {
              this.messageServe.success('Shopping cart is empty now!');
              this.activeModal.close(true);
            } else {
              this.activeModal.close(false);
            }
            this.loading = false;
            this.cdr.markForCheck();
          },
          (err) => {
            this.loading = false;
            this.cdr.markForCheck();
          }
        );
    } else {
      this.shoppingCartServe.deleteShoppingCartAll().subscribe(
        (res) => {
          console.log('deleteShoppingCartAll :>> ', res);
          if (res.data.value) {
            this.messageServe.success('Shopping cart is empty now!');
            this.activeModal.close(true);
          } else {
            this.activeModal.close(false);
          }
          this.loading = false;
          this.cdr.markForCheck();
        },
        (err) => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      );
    }
  }
}
