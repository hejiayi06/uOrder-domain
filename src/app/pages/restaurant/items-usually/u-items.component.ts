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
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/apis/menu.service';
import { ErrorsService } from 'src/app/services/local/errors.service';
import { WindowService } from 'src/app/services/local/window.service';
import { storageKeys } from 'src/app/share/configs';
import { Item } from 'src/app/share/types';
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
  @Input() storeId!: string;
  @Output('item') ItemEvent = new EventEmitter<Item>();
  length: number = 0;
  cartSub!: Subscription;
  constructor(
    private route: ActivatedRoute,
    private menuServe: MenuService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private winServe: WindowService,
    private shoppingCartStore$: Store<ShoppingCartStoreModule>,
    private errorServe: ErrorsService
  ) {}
  ngOnDestroy(): void {
    // this.cartSub.unsubscribe();
  }

  ngOnInit(): void {}

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
      // this.setItem(this.menuItem);
      this.detectStore(this.menuItem);
    } else {
      this.menuServe.getItem(this.storeId, this.menuItem['id']).subscribe(
        (res) => {
          if (res.data) {
            // this.setItem(res.data.item);
            this.detectStore(res.data.item);
          }
        },
        (err) => {}
      );
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
    let itemModalInstance = modalRef.componentInstance;
    itemModalInstance.sItem = item;
    itemModalInstance.itemForm = this.fb.group({
      // item:this.sItem,
      id: item?.id,
      ref_id: item.ref_id,
      name: item?.name,
      price: [item?.price ? item.price : 0],
      itemModifies: [[]],
      itemSections: this.fb.array([]),
      itemVariant: this.fb.array([]),
      itemInstructions: [''],
      quantity: [0],
      checked: [false],
      total: ['0'],
    });

    itemModalInstance.quantity = 1;
    itemModalInstance.variantPrice = '0.00';
    if (item.price) {
      itemModalInstance.itemPrice = item.price;
    } else {
      itemModalInstance.itemPrice = 0;
    }
    itemModalInstance.checkPrice();
    if (item.menu_item_to_modifies?.length) {
      itemModalInstance.setItemModifies(item);
    }
    if (item.menu_item_to_sections?.length) {
      itemModalInstance.setItemSections(item);
    }
    // if(changes.sItem.currentValue.menu_item_variants.length) {
    //   this.setItemSections(this.sItem);
    // }
    if (item.menu_item_variants?.length) {
      itemModalInstance.itemVariant.setValidators(Validators.required);
    }
  }
}
