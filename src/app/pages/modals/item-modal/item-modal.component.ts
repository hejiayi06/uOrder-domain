import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ShoppingCartService } from 'src/app/services/apis/shopping-cart.service';
import { WindowService } from 'src/app/services/local/window.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { storageKeys } from 'src/app/share/configs';
import {
  Item,
  MenuSectionItem,
  MenuSectionModify,
  ShoppingCartItem,
} from 'src/app/share/types';
import {
  setShoppingCart,
  setShoppingCartLength,
} from 'src/app/state/shopping-cart/action';
import { ShoppingCartStoreModule } from 'src/app/state/shopping-cart/shopping-cart.store.module';

@Component({
  selector: 'uo-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemModalComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  sItem!: Item;
  itemPrice!: string;
  variantPrice: string = '0.00';
  totalPrice!: string;
  size: number = 0;
  itemAmount!: number;
  quantity: number = 1;
  itemForm: FormGroup = this.fb.group({});
  isLog!: boolean;
  constructor(
    private fb: FormBuilder,
    private winServe: WindowService,
    private shoppingCartServe: ShoppingCartService,
    private messageServe: MessageService,
    public activeModal: NgbActiveModal,
    private shoppingCartStore$: Store<ShoppingCartStoreModule>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    // document.getElementsByClassName('modal-backdrop')[0]
    //   ? document.getElementsByClassName('modal-backdrop')[0].remove()
    //   : null;
  }

  get itemVariant() {
    return this.itemForm.get('itemVariant') as FormArray;
  }
  get itemModifies() {
    return this.itemForm.get('itemModifies') as FormArray;
  }
  get itemSections() {
    return this.itemForm.get('itemSections') as FormArray;
  }
  get itemInstructions() {
    return this.itemForm.get('itemInstructions');
  }
  get itemQuantity() {
    return this.itemForm.get('quantity');
  }
  sectionItems(sectionIndex: number): FormArray {
    return this.itemSections.at(sectionIndex).get('sectionItems') as FormArray;
  }
  sectionModifies(sectionIndex: number): FormArray {
    return this.itemSections
      .at(sectionIndex)
      .get('sectionModifies') as FormArray;
  }
  // getSectionModifyControl(sectionIndex:number,modifyId:number,controlName: string): FormControl {
  //   let arr =(this.itemSections.at(sectionIndex).get('sectionModifies') as FormArray).at(modifyId).get(controlName);
  //   return arr
  // }
  ngOnInit(): void {
    console.log('this.sItem :>> ', this.sItem);
  }

  setItemModifies(item: Item) {
    item?.menu_item_to_modifies?.forEach((modify) => {
      modify.quantity = 0;
      modify.checked = false;
    });
  }

  setItemSections(item: Item) {
    item?.menu_item_to_sections?.forEach((section) => {
      section.selected = 0;
      section.isMax = false;
      section.menu_section.menu_section_items.forEach((item) => {
        item.quantity = 0;
        item.checked = false;
      });
      section.menu_section.menu_section_modifies.forEach((modify) => {
        modify.quantity = 0;
        modify.checked = false;
      });
      this.itemSections.push(
        new FormControl({
          id: section.id,
          store_id: section.store_id,
          name: section.menu_section.name,
          is_multiple_select: section.is_multiple_select,
          is_duplicate: section.is_duplicate,
          min: section.min,
          max: section.max,
          section_created_at: section.created_at,
          section_updated_at: section.updated_at,
          created_at: section.menu_section.created_at,
          updated_at: section.menu_section.updated_at,
        })
      );
    });
  }

  checkPrice() {
    this.totalPrice = (
      (parseFloat(this.itemPrice) + parseFloat(this.variantPrice)) *
      this.quantity
    ).toFixed(2);
  }

  getOptionPrice(secOption: AbstractControl): string {
    let optionPrice: string = '0.00';
    if (secOption.value.price_active) {
      optionPrice = secOption.value.price;
    } else {
      if (secOption.value.item) {
        optionPrice = secOption.value.item.price;
      } else if (secOption.value.modify) {
        optionPrice = secOption.value.modify.price;
      }
    }
    return optionPrice;
  }

  sizerPriceAdjust(price: string, type: boolean) {
    if (type) {
      this.itemPrice = (parseFloat(this.itemPrice) + parseFloat(price)).toFixed(
        2
      );
    } else {
      this.itemPrice = (parseFloat(this.itemPrice) - parseFloat(price)).toFixed(
        2
      );
    }
    this.checkPrice();
  }
  sectionOptionChange(
    option: MenuSectionItem | MenuSectionModify,
    type: boolean,
    e: boolean
  ) {
    if (e) {
      if (option) {
        if (option.price_active) {
          this.itemPrice = (
            parseFloat(this.itemPrice) +
            parseFloat(option.price) * option.quantity!
          ).toFixed(2);
          this.checkPrice();
        } else {
          if (type) {
            this.itemPrice = (
              parseFloat(this.itemPrice) +
              parseFloat((option as MenuSectionItem).item.price) *
                option.quantity!
            ).toFixed(2);
            this.checkPrice();
          } else {
            this.itemPrice = (
              parseFloat(this.itemPrice) +
              parseFloat((option as MenuSectionModify).modify.price) *
                option.quantity!
            ).toFixed(2);
            this.checkPrice();
          }
        }
      }
    } else {
      if (option) {
        console.log('option.quantity uncheck :>> ', option.quantity);
        if (option.price_active) {
          this.itemPrice = (
            Number(this.itemPrice) -
            Number(option.price) * option.quantity!
          ).toFixed(2);
          this.checkPrice();
          console.log('this.itemPrice uncheck:>> ', this.itemPrice);
        } else {
          if (type) {
            this.itemPrice = (
              Number(this.itemPrice) -
              Number((option as MenuSectionItem).item.price) * option.quantity!
            ).toFixed(2);
            console.log('this.itemPrice uncheck:>> ', this.itemPrice);
            this.checkPrice();
          } else {
            this.itemPrice = (
              Number(this.itemPrice) -
              Number((option as MenuSectionModify).modify.price) *
                option.quantity!
            ).toFixed(2);
            console.log('this.itemPrice uncheck:>> ', this.itemPrice);
            this.checkPrice();
          }
        }
        console.log('option.quantity :>> ', option.quantity);
        option.quantity = 0;
      }
    }
  }

  modifyChange(e: Event, price: string) {
    if (e) {
      this.itemPrice = (Number(this.itemPrice) + Number(price)).toFixed(2);
      this.checkPrice();
    } else {
      this.itemPrice = (Number(this.itemPrice) - Number(price)).toFixed(2);
      this.checkPrice();
    }
  }
  // change veriant
  variantChange(e: Event) {
    const value = this.sItem.menu_item_variants?.find(
      (variant) =>
        variant.id.toString() == (e.target as HTMLInputElement).dataset['value']
    );
    if (this.itemVariant.length) {
      this.itemVariant.removeAt(0);
    }
    value!.quantity = 1;
    this.itemVariant.push(new FormControl(value));
    this.variantPrice = value?.price!;
    this.checkPrice();
  }

  stopPropagation(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  //quantity plus
  onPlus() {
    this.quantity++;
    this.checkPrice();
  }

  //quantity minus
  onMinus() {
    if (this.quantity <= 1) {
      this.quantity = 1;
      return;
    }
    this.quantity--;
    this.checkPrice();
  }
  //quantity input
  onInput(event: Event) {
    this.quantity = Number((event.target as HTMLInputElement).value);
    if (this.quantity <= 1) {
      this.quantity = 1;
    }
    this.checkPrice();
  }
  GUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
  setShoppingCart(items: ShoppingCartItem[]): void {
    this.shoppingCartStore$.dispatch(
      setShoppingCart({
        cart: items,
      })
    );
    let length = 0;
    items.forEach((item: { quantity: number }) => {
      length += item.quantity;
    });
    this.shoppingCartStore$.dispatch(
      setShoppingCartLength({
        length: length,
      })
    );
    this.winServe.setLocalStorage(
      storageKeys.shoppingCartStore,
      this.sItem.store_id.toString()
    );
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
  closeModal(): void {
    this.activeModal.close(false);
    this.loading = false;
    this.cdr.detectChanges();
  }
  onSubmit() {
    this.loading = true;
    this.cdr.markForCheck();
    this.checkPrice();

    this.itemForm.get('total')?.patchValue(this.totalPrice);
    this.itemQuantity?.patchValue(this.quantity);

    if (!this.winServe.getLocalStorage(storageKeys.auth)) {
      // this.activeModal.close(false);
      // this.router.navigate(['sign-in']);
      let anonymous_id = '';
      if (!this.winServe.getLocalStorage(storageKeys.anonymous)) {
        anonymous_id = this.GUID();
        this.winServe.setLocalStorage(storageKeys.anonymous, anonymous_id);
      } else {
        anonymous_id = this.winServe.getLocalStorage(
          storageKeys.anonymous
        ) as string;
      }
      console.log('anonymous_id :>> ', anonymous_id);
      this.shoppingCartServe
        .addToAnonymousShoppingCart(this.itemForm.value, anonymous_id)
        .subscribe(
          (res) => {
            console.log('res :>> ', res);
            if (res && res.data) {
              if (res.data.values?.length) {
                this.setShoppingCart(res.data.values);
                this.messageServe.success('Item added to cart');
                this.activeModal.close(length);
                this.loading = false;
                this.cdr.detectChanges();
              } else {
                this.setEmpty();
                this.closeModal();
              }
            }
          },
          (err) => {
            this.closeModal();
          }
        );
    } else {
      this.shoppingCartServe.addToShoppingCart(this.itemForm.value).subscribe(
        (res) => {
          console.log('res :>> ', res);
          if (res && res.data) {
            if (res.data.values?.length) {
              this.setShoppingCart(res.data.values);
              this.messageServe.success('Item added to cart');
              this.activeModal.close(length);
              this.loading = false;
              this.cdr.detectChanges();
            } else {
              this.setEmpty();
              this.closeModal();
            }
          }
        },
        (err) => {
          this.closeModal();
        }
      );
    }
    console.log('this.sItem :>> ', this.sItem);
    console.log('this.itemForm.value', this.itemForm.value);
  }
}
