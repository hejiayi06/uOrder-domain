import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/apis/menu.service';
import { WindowService } from 'src/app/services/local/window.service';
import { storageKeys } from 'src/app/share/configs';
import { DiningTime, Item } from 'src/app/share/types';
import {
  setShoppingCart,
  setShoppingCartLength,
} from 'src/app/state/shopping-cart/action';
import {
  getShoppingCartLength,
  selectShoppingCartFeature,
} from 'src/app/state/shopping-cart/selectors';
import { ShoppingCartStoreModule } from 'src/app/state/shopping-cart/shopping-cart.store.module';
import { EmptyBagModalComponent } from '../../modals/empty-bag-modal/empty-bag-modal.component';
import { ItemModalComponent } from '../../modals/item-modal/item-modal.component';

@Component({
  selector: 'uo-u-items',
  templateUrl: './u-items.component.html',
  styleUrls: ['./u-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UItemsComponent implements OnInit, OnDestroy {
  @Input() menuItem!: Item;
  @Input() categoryDiningTimes!: DiningTime[];
  @Input() storeId!: string;
  @Output('item') ItemEvent = new EventEmitter<Item>();
  length: number = 0;
  cartSub!: Subscription;
  constructor(
    private menuServe: MenuService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private winServe: WindowService,
    private shoppingCartStore$: Store<ShoppingCartStoreModule>
  ) {}
  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  ngOnInit(): void {}

  getRange(length: any): number[] {
    return Array.from({ length }, (_, index) => index);
  }

  getItem(): void {
    this.cartSub = this.shoppingCartStore$
      .select(selectShoppingCartFeature)
      .pipe(select(getShoppingCartLength))
      .subscribe((res) => {
        if (res) {
          console.log('getShoppingCartLength :>> ', res);
          this.length = res;
        } else {
          this.length = 0;
        }
      });
    if (this.menuItem) {
      this.detectStore(this.menuItem);
    } else {
      this.menuServe
        .getItem(this.storeId, this.menuItem['id'])
        .subscribe((res) => {
          if (res.data) {
            this.detectStore(res.data.item);
          }
        });
    }
  }
  setEmpty(): void {
    this.shoppingCartStore$.dispatch(setShoppingCart({ cart: [] }));
    this.shoppingCartStore$.dispatch(
      setShoppingCartLength({
        length: 0,
      })
    );
    this.winServe.setLocalStorage(storageKeys.shoppingCartStore, '0');
  }
  detectStore(item: Item) {
    const shoppingCartStoreId = this.winServe.getLocalStorage(
      storageKeys.shoppingCartStore
    );
    if (this.length && item.store_id.toString() !== shoppingCartStoreId) {
      const modalRef = this.modalService.open(EmptyBagModalComponent, {
        centered: true,
        scrollable: true,
      });
      modalRef.closed.subscribe((res) => {
        if (res) {
          this.setEmpty();
          this.setItem(item);
        }
      });
    } else {
      this.setItem(item);
    }
  }

  setItem(item: Item): void {
    const modalRef = this.modalService.open(ItemModalComponent, {
      centered: true,
      scrollable: true,
    });
    const itemModalInstance = modalRef.componentInstance;
    itemModalInstance.sItem = item;
    if (this.categoryDiningTimes) {
      itemModalInstance.categoryDiningTimes = this.categoryDiningTimes;
    }
  }
}
