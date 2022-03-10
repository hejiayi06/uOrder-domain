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
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ShoppingCartService } from 'src/app/services/apis/shopping-cart.service';
import { DiningTimeService } from 'src/app/services/local/dining-time.service';
import { WindowService } from 'src/app/services/local/window.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { storageKeys } from 'src/app/share/configs';
import {
  DiningTime,
  Item,
  MenuSectionItem,
  MenuSectionModify,
  MenuVariants,
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
  categoryDiningTimes!: DiningTime[];
  sItem!: Item;
  itemPrice!: string;
  variantPrice: string = '0.00';
  totalPrice!: string;
  size: number = 0;
  itemAmount!: number;
  quantity: number = 1;
  itemForm: FormGroup = this.fb.group({
    // item:this.sItem,
    id: [],
    ref_id: [],
    name: [],
    price: [],
    itemModifies: [],
    itemSections: this.fb.array([]),
    itemVariant: [],
    itemInstructions: [],
    quantity: [0],
    checked: [false],
    total: [],
  });
  isLog!: boolean;
  constructor(
    private fb: FormBuilder,
    private winServe: WindowService,
    private shoppingCartServe: ShoppingCartService,
    private messageServe: MessageService,
    public activeModal: NgbActiveModal,
    private diningTimeServe: DiningTimeService,
    private shoppingCartStore$: Store<ShoppingCartStoreModule>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    // document.getElementsByClassName('modal-backdrop')[0]
    //   ? document.getElementsByClassName('modal-backdrop')[0].remove()
    //   : null;
  }

  get itemVariant() {
    return this.itemForm.get('itemVariant');
  }
  get itemModifies() {
    return this.itemForm.get('itemModifies');
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
    this.setInit();
    console.log('this.sItem :>> ', this.sItem);
  }
  setInit(): void {
    this.itemForm = this.fb.group({
      // item:this.sItem,
      id: this.sItem?.id,
      ref_id: this.sItem?.ref_id,
      name: this.sItem?.name,
      price: [this.sItem?.price ? this.sItem?.price : 0],
      itemModifies: [[]],
      itemSections: this.fb.array([]),
      itemVariant: [],
      itemInstructions: [''],
      quantity: [0],
      checked: [false],
      total: ['0'],
    });
    if (this.sItem.price) {
      this.itemPrice = this.sItem.price;
    } else {
      this.itemPrice = '0';
    }
    this.itemPrice = this.sItem.price;
    this.checkPrice();
    if (this.sItem.menu_item_to_modifies?.length) {
      this.setItemModifies(this.sItem);
    }
    if (this.sItem.menu_item_to_sections?.length) {
      this.setItemSections(this.sItem);
    }
    if (this.sItem.menu_item_variants?.length) {
      this.itemVariant?.setValidators(Validators.required);
    }
  }
  itemShow(): boolean {
    if (this.categoryDiningTimes && this.categoryDiningTimes.length) {
      const show = this.diningTimeServe.detectDiningTime(
        this.categoryDiningTimes
      );
      if (!show) {
        return false;
      }
    }
    if (this.sItem.dining_times && this.sItem.dining_times.length) {
      return this.diningTimeServe.detectDiningTime(this.sItem.dining_times);
    }
    return true;
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
      section.menu_section?.menu_section_items?.forEach((item) => {
        item.quantity = 0;
        item.checked = false;
      });
      section.menu_section?.menu_section_modifies?.forEach((modify) => {
        modify.quantity = 0;
        modify.checked = false;
      });
      this.itemSections.push(
        new FormControl({
          id: section.id,
          store_id: section.store_id,
          name: section.menu_section?.name,
          is_multiple_select: section.is_multiple_select,
          is_duplicate: section.is_duplicate,
          min: section.min,
          max: section.max,
          section_created_at: section.created_at,
          section_updated_at: section.updated_at,
          created_at: section.menu_section?.created_at,
          updated_at: section.menu_section?.updated_at,
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
        console.log('option :>> ', option);
        console.log('option.quantity check :>> ', option.quantity);
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
            console.log('this.itemPrice check:>> ', this.itemPrice);
          } else {
            this.itemPrice = (
              Number(this.itemPrice) +
              Number((option as MenuSectionModify).modify.price) *
                option.quantity!
            ).toFixed(2);
            this.checkPrice();
            console.log('this.itemPrice check:>> ', this.itemPrice);
          }
        }
      }
    } else {
      if (option) {
        console.log('option :>> ', option);
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
  variantChange(v: MenuVariants) {
    console.log('v :>> ', v);
    v!.quantity = 1;
    this.itemVariant?.patchValue([v]);
    this.variantPrice = v?.price!;
    console.log('this.itemVariant :>> ', this.itemVariant);
    console.log('this.variantPrice :>> ', this.variantPrice);
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
        () => {
          this.closeModal();
        }
      );
    }
    console.log('this.sItem :>> ', this.sItem);
    console.log('this.itemForm.value', this.itemForm.value);
  }
}
