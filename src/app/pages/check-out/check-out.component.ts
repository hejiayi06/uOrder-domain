import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PhoneNumberModalComponent } from '../modals/phone-number-modal/phone-number-modal.component';
import { TimeModalComponent } from '../modals/time-modal/time-modal.component';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CheckoutService } from 'src/app/services/apis/checkout.service';
import { WindowService } from 'src/app/services/local/window.service';
import { storageKeys } from 'src/app/share/configs';
import {
  Checkout,
  DeliveryInfo,
  MinimumPay,
  OrderType,
  PaymentType,
  ShoppingCartItem,
  Tips,
} from 'src/app/share/types';
import { MessageService } from 'src/app/share/components/message/message.service';
import { AddAddressModalComponent } from '../modals/address/add-address-modal/add-address-modal.component';
import { ChooseAddressesModalComponent } from '../modals/address/choose-addresses-modal/choose-addresses-modal.component';
import { ShoppingCartStoreModule } from 'src/app/state/shopping-cart/shopping-cart.store.module';
import { Store } from '@ngrx/store';
import { UserAddressService } from 'src/app/services/apis/user-address.service';
import { CustomTipsModalComponent } from '../modals/custom-tips-modal/custom-tips-modal.component';
import {
  setShoppingCart,
  setShoppingCartLength,
} from 'src/app/state/shopping-cart/action';
import { setPlacedOrder } from 'src/app/state/placed-order/action';
import { PlacedOrderStoreModule } from 'src/app/state/placed-order/placed-order.store.module';
import { AddCouponComponent } from '../modals/add-coupon/add-coupon.component';
import { PromotionService } from 'src/app/services/apis/promotion.service';
import { ModalDeleteComponent } from '../modals/delete/modal-delete/modal-delete.component';
import { cloneDeep } from 'lodash';
import { NameModalComponent } from '../modals/name-modal/name-modal.component';
import { UserNameService } from 'src/app/services/apis/user-name.service';

@Component({
  selector: 'uo-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckOutComponent implements OnInit, AfterViewInit {
  is_utenstil:any = 0;
  loading: boolean = false;
  feeLoading: boolean = false;
  isCheckout: boolean = false;
  orderScheduleValue!: {
    endHour: number;
    endMinute: number;
    note: string;
    startHour: number;
    startMinute: number;
  };
  tableWare: string = 'None';
  submitName: string | null = null;
  submitPhone: string | null = null;
  coupon_number: string = '';
  deliveryFeeRes!: DeliveryInfo;
  apiLoaded: boolean = false;
  isCustomTips: boolean = false;
  addressString!: string;
  addressId!: number;
  tipsId!: number;
  checkout!: Checkout;
  items!: ShoppingCartItem[];
  orderType!: OrderType;
  paymentType!: PaymentType;
  minimumPay!: MinimumPay;
  googleMapCenter!: google.maps.LatLngLiteral;
  googleMapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    center: null,
    maxZoom: 15,
    panControl: true,
    minZoom: 8,
  };
  marker!: {
    position: { lat: number; lng: number };
  };
  tipsAmount!: string;
  placeOrderBoxHeight!: number;
  @ViewChild('creditCardNumber') ccNumberField!: ElementRef;
  @ViewChild('expirationDate') expirationDateField!: ElementRef;
  @ViewChild('banners') bannersElement!: ElementRef;
  placeOrderForm = this.fb.group({
    store_id: ['', [Validators.required, Validators.minLength(1)]],
    estimate: ['20-30 min'],
    schedule_time: [''],
    order_type: [
      { value: '', disabled: this.feeLoading },
      [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(1),
      ],
    ],
    name: ['', Validators.required],
    phone_number: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(14)],
    ],
    payment_type: [
      { value: '', disabled: this.feeLoading },
      [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(1),
      ],
    ],
    tableWare: ['None'],
    delivery_address: [, [Validators.required]],
    notes: [''],
    credit_card: this.fb.group({
      card_number: [
        '',
        [
          Validators.required,
          Validators.minLength(17),
          // Validators.maxLength(19)
        ],
      ],
      expiration_date: [
        '',
        [
          Validators.required,
          Validators.pattern('([0-9]{2}[/]?){2}'),
          Validators.minLength(5),
        ],
      ],
      name: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      cvv: ['', [Validators.required]],
    }),
  });
  checkoutForm!: FormGroup;
  get store_id(): AbstractControl | null {
    return this.placeOrderForm.get('store_id');
  }
  get schedule_time(): AbstractControl | null {
    return this.placeOrderForm.get('schedule_time');
  }
  get order_type(): AbstractControl | null {
    return this.placeOrderForm.get('order_type');
  }
  get name(): AbstractControl | null {
    return this.placeOrderForm.get('name');
  }
  get phone_number(): AbstractControl | null {
    return this.placeOrderForm.get('phone_number');
  }
  get payment_type(): AbstractControl | null {
    return this.placeOrderForm.get('payment_type');
  }
  get delivery_address(): AbstractControl | null {
    return this.placeOrderForm.get('delivery_address');
  }
  get credit_card(): FormGroup {
    return this.placeOrderForm.get('credit_card') as FormGroup;
  }
  get card_number(): AbstractControl | null {
    return this.credit_card.get('card_number');
  }
  get expiration_date(): AbstractControl | null {
    return this.credit_card.get('expiration_date');
  }
  get zipcode(): AbstractControl | null {
    return this.credit_card.get('zipcode');
  }
  get cvv(): AbstractControl | null {
    return this.credit_card.get('cvv');
  }
  get cardName(): AbstractControl | null {
    return this.credit_card.get('name');
  }
  get estimate(): AbstractControl | null {
    return this.placeOrderForm.get('estimate');
  }
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private winServe: WindowService,
    private messageServe: MessageService,
    private checkoutServe: CheckoutService,
    private addressServe: UserAddressService,
    private shoppingCartStore$: Store<ShoppingCartStoreModule>,
    private placedOrderStore$: Store<PlacedOrderStoreModule>,
    private promoServe: PromotionService,
    private cdr: ChangeDetectorRef,
    private userServe: UserNameService
  ) {}
  ngAfterViewInit(): void {
    this.getFixedBox();
  }
  ngOnInit(): void {
    this.is_utenstil = this.winServe.getLocalStorage(storageKeys.is_utensil)
    this.getCheckout();
    this.userServe.getName().subscribe((res) => {
      this.submitName =
        res.data.item.name == null
          ? localStorage.getItem('userFirstName') +
            ' ' +
            localStorage.getItem('userLastName')
          : res.data.item.name;
      this.placeOrderForm.controls['name'].setValue(this.submitName);
      this.submitPhone = res.data.item.phone;
      this.placeOrderForm.controls['phone_number'].setValue(this.formatPhoneNumber(this.submitPhone));
      this.submitPhone = this.formatPhoneNumber(this.submitPhone)
    });
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    if(getState(JSON.parse(localStorage.getItem('storeInfo') as string)["zipcode"])=== "NY"){
      this.tableWare = "None"
      this.placeOrderForm.get('tableWare')?.patchValue("None")
   }else{
     this.tableWare = "Default";
     this.placeOrderForm.get('tableWare')?.patchValue("Default")
   };
    if (!this.orderType?.['1'] && this.orderType?.['2']) {
      this.placeOrderForm.removeControl('delivery_address');
      console.log('this.placeOrderForm.value :>> ', this.placeOrderForm.value);
      this.feeLoading = true;
      this.cdr.markForCheck();
      this.winServe.setLocalStorage(storageKeys.orderStatus, '2');
      this.checkoutForm = this.fb.group({
        order_type: '2',
        payment_type: this.checkout.orderParams.paymentType,
      });
      this.setTips();
      console.log('this.checkoutForm.value :>> ', this.checkoutForm.value);
      this.checkoutServe.getCheckout(this.checkoutForm.value).subscribe(
        (res) => {
          this.checkout = res.data;
          console.log('getCheckout :>> ', this.checkout);
          this.setCheckout();
          // this.getFixedBox();
          this.endLoading();
        },
        (err) => {
          this.endLoading();
        }
      );
    }
  }

  changeTableWare(v: any): void {
    this.tableWare = v;
    this.cdr.detectChanges();
  }

  getFixedBox(): void {
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
    };
    const observer = new MutationObserver((mutation) => {
      this.placeOrderBoxHeight = this.bannersElement.nativeElement.clientHeight;
      this.cdr.markForCheck();
    });
    observer.observe(this.bannersElement.nativeElement, config);
  }

  getCheckout(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.checkoutForm = this.fb.group({
      show_item: [1],
    });
    // if (this.store.tips.length) {
    //   this.tipsId = this.store.tips[0].id;
    //   this.checkoutForm.addControl('tips_id', this.fb.control(this.tipsId));
    // }
    this.checkoutServe.getCheckout(this.checkoutForm.value).subscribe(
      (res) => {
        this.checkout = res.data;
        console.log('getCheckout :>> ', this.checkout);
        console.log('this.items :>> ', this.items);
        this.items = cloneDeep(res.data.cart);
        this.isCheckout = false;
        this.items.forEach((i) => {
          if (i.options.expired) {
            this.isCheckout = true;
            return;
          }
        });
        this.setCheckout();
        this.initTypes();
        if (this.checkout.deliveryInfo.phone) {
          this.phone_number?.setValue(this.checkout.deliveryInfo.phone);
        }
        if (this.items.length == 0) {
          this.router.navigate(['store/' + this.checkout.orderParams.storeId]);
          this.messageServe.warning('No item founded!');
        }

        // console.log('this.checkout :>> ', this.checkout);
        this.loading = false;
        this.feeLoading = false;
        console.log('this.feeLoading :>> ', this.feeLoading);
        console.log(
          'this.placeOrderForm.value :>> ',
          this.placeOrderForm.value
        );
        this.cdr.detectChanges();
      },
      () => {
        this.endLoading();
      }
    );
  }
  setCheckout(): void {
    // if (
    //   !this.checkout.orderParams.orderType ||
    //   !this.checkout.orderParams.paymentType
    // ) {
    //   this.messageServe.danger(
    //     'Store data exception. Cannot execute checkout! Please contact store or admins!'
    //   );
    //   this.router.navigateByUrl('restaurant/' + this.checkout.store.id);
    // }
    // if (!this.checkout.store.latitude || !this.checkout.store.longitude) {
    //   this.messageServe.danger(
    //     'Store latitude and longitude required. Cannot execute checkout! Please contact store or admins!'
    //   );
    //   this.router.navigateByUrl('restaurant/' + this.checkout.store.id);
    // }
    this.tipsAmount = this.checkout.tips;
    console.log('this.tipsAmount :>> ', this.tipsAmount);
    this.tipsId = this.checkout.orderParams.tips.id;
    if (!this.tipsId) {
      this.isCustomTips = true;
      this.tipsId = -1;
    }
    console.log('this.tipsId :>> ', this.tipsId);
    this.winServe.setLocalStorage(
      storageKeys.orderStatus,
      this.checkout.orderParams.orderType
    );
    this.winServe.setLocalStorage(
      storageKeys.payment,
      this.checkout.orderParams.paymentType
    );
    this.initTypes();
    if (this.checkout.store.minimum_pay) {
      this.minimumPay = JSON.parse(this.checkout.store.minimum_pay);
    } else {
      this.minimumPay = { 1: 0, 2: 0 };
    }
    console.log('this.minimumPay :>> ', this.minimumPay);
    this.orderType = JSON.parse(this.checkout.store.order_type);
    console.log('this.orderType :>> ', this.orderType);
    this.paymentType = JSON.parse(this.checkout.store.payment_type);
    this.winServe.setLocalStorage(
      storageKeys.storeInfo,
      JSON.stringify(this.checkout.store)
    );

    if (this.checkout.orderSchedule) {
      const date = new Date();
      const orderScheduleValueParse = JSON.parse(
        this.checkout.orderSchedule.value
      ).find((o: { day: number }) => o.day == date.getDay());
      console.log('orderScheduleValueParse :>> ', orderScheduleValueParse);
      this.orderScheduleValue = orderScheduleValueParse.time.find(
        (t: {
          startHour: number;
          endHour: number;
          note: string;
          startMinute: number;
          endMinute: number;
        }) => {
          const hour = date.getHours();
          const minute = date.getMinutes();
          console.log('hour :>> ', hour);
          console.log('minute :>> ', minute);
          return (
            (hour > t.startHour && hour < t.endHour) ||
            (hour == t.startHour &&
              minute >= t.startMinute &&
              hour <= t.endHour) ||
            (hour == t.endHour && minute <= t.endMinute && hour >= t.startHour)
          );
        }
      );
      if (this.orderScheduleValue?.note!) {
        this.estimate?.patchValue(this.orderScheduleValue?.note);
      }
      console.log('this.orderScheduleValue :>> ', this.orderScheduleValue);
    }

    this.googleMapCenter = this.googleMapOptions.center = {
      lat: parseFloat(this.checkout.store.latitude) as any,
      lng: parseFloat(this.checkout.store.longitude) as any,
    };
    this.marker = {
      position: {
        lat: parseFloat(this.checkout.store.latitude),
        lng: parseFloat(this.checkout.store.longitude),
      },
    };
    // this.tipsId = this.checkout.store.tips[0].id;
    this.order_type?.patchValue(this.checkout.orderParams.orderType.toString());
    console.log('order_type :>> ', this.order_type!.value);
    this.payment_type?.patchValue(
      this.checkout.orderParams.paymentType.toString()
    );

    this.placeOrderForm
      .get('store_id')
      ?.setValue(this.checkout.orderParams.storeId);
    if (this.checkout.deliveryInfo) {
      if (this.checkout.deliveryInfo.code == 101) {
        this.messageServe.danger(this.checkout.deliveryInfo.message);
      } else {
        if (this.checkout.deliveryInfo.destination_addresses) {
          this.addressString =
            this.checkout.deliveryInfo.destination_addresses[0];
        }
        if (this.checkout.deliveryInfo.user_address_id) {
          this.addressId = this.checkout.deliveryInfo.user_address_id;
        }
      }
    }
    this.store_id?.patchValue(this.checkout.orderParams.storeId);
  }
  initTypes(): void {
    if (this.checkout.orderParams.orderType.toString() == '1') {
      // if (this.checkout.tips) {
      //   this.tipsAmount = this.checkout.tips;
      // }
      this.delivery_address?.setValue(this.addressId);
      console.log('this.addressId :>> ', this.addressId);
    }
    if (this.checkout.orderParams.orderType.toString() == '2') {
      this.tipsAmount = '0';
      this.isCustomTips = true;
      this.placeOrderForm.removeControl('delivery_address');
      // this.phone_number?.patchValue(this.checkout)
    }
    if (this.checkout.orderParams.paymentType.toString() == '1') {
      this.placeOrderForm.addControl(
        'credit_card',
        this.fb.group({
          card_number: [
            '',
            [
              Validators.required,
              Validators.minLength(17),
              // Validators.maxLength(19)
            ],
          ],
          expiration_date: [
            '',
            [
              Validators.required,
              Validators.pattern('([0-9]{2}[/]?){2}'),
              Validators.minLength(5),
            ],
          ],
          name: ['', [Validators.required]],
          zipcode: ['', [Validators.required]],
          cvv: ['', [Validators.required]],
        })
      );
    }
    if (this.checkout.orderParams.paymentType.toString() == '2') {
      this.placeOrderForm.removeControl('credit_card');
    }
  }
  minimumDeliveryCompare() {
    if (this.minimumPay[1]) {
      return parseFloat(this.checkout.subtotal) < this.minimumPay[1];
    }
    return false;
  }
  minimumPickupCompare() {
    if (this.minimumPay[2]) {
      return parseFloat(this.checkout.subtotal) < this.minimumPay[2];
    }
    return false;
  }
  onDelivery(e: Event): void {
    if ((e.target as HTMLInputElement).checked) {
      if (this.addressId) {
        this.placeOrderForm.addControl(
          'delivery_address',
          this.fb.control(this.addressId)
        );
      }
      console.log('this.placeOrderForm.value :>> ', this.placeOrderForm.value);
      this.feeLoading = true;
      console.log('this.feeLoading :>> ', this.feeLoading);
      this.order_type?.patchValue('1');
      this.winServe.setLocalStorage(storageKeys.orderStatus, '1');
      this.cdr.detectChanges();
      this.checkoutForm = this.fb.group({
        order_type: '1',
        payment_type: this.checkout.orderParams.paymentType,
      });
      this.setTips();
      if (this.addressId) {
        this.checkoutForm.addControl(
          'delivery_address',
          this.fb.control(this.addressId)
        );
      }
      // if()
      this.checkoutServe.getCheckout(this.checkoutForm.value).subscribe(
        (res) => {
          this.checkout = res.data;
          console.log('getCheckout :>> ', this.checkout);
          this.setCheckout();
          // this.getFixedBox();
          this.endLoading();
        },
        (err) => {
          this.endLoading();
        }
      );
    }
  }
  onPickup(e: Event): void {
    if ((e.target as HTMLInputElement).checked) {
      this.placeOrderForm.removeControl('delivery_address');
      console.log('this.placeOrderForm.value :>> ', this.placeOrderForm.value);
      this.feeLoading = true;
      this.cdr.markForCheck();
      this.winServe.setLocalStorage(storageKeys.orderStatus, '2');
      this.checkoutForm = this.fb.group({
        order_type: '2',
        payment_type: this.checkout.orderParams.paymentType,
      });
      this.setTips();
      console.log('this.checkoutForm.value :>> ', this.checkoutForm.value);
      this.checkoutServe.getCheckout(this.checkoutForm.value).subscribe(
        (res) => {
          this.checkout = res.data;
          console.log('getCheckout :>> ', this.checkout);
          this.setCheckout();
          // this.getFixedBox();
          this.endLoading();
        },
        (err) => {
          this.endLoading();
        }
      );
    }
  }
  changeTime(): void {
    const modalRef = this.modalService.open(TimeModalComponent, {
      centered: true,
      scrollable: true,
    });
    modalRef.componentInstance.orderScheduleValue = this.orderScheduleValue;
    modalRef.componentInstance.restaurantName = this.checkout.store.store_name;
    modalRef.componentInstance.orderType = this.checkout.orderParams.orderType;
    modalRef.closed.subscribe((res) => {
      console.log('changeTime :>> ', res);
      this.placeOrderForm.get('schedule_time')?.setValue(res);
      this.schedule_time?.patchValue(res);
      this.checkout.orderParams.scheduleTime = res;
      this.cdr.markForCheck();
    });
  }
  changeName(): void {
    const modalRef = this.modalService.open(NameModalComponent, {
      centered: true,
      scrollable: true,
    });
    modalRef.closed.subscribe((res) => {
      if (res) {
        this.name?.patchValue(res);
        this.cdr.markForCheck();
      }
    });
  }
  changePhone(): void {
    const modalRef = this.modalService.open(PhoneNumberModalComponent, {
      centered: true,
      scrollable: true,
    });
    modalRef.componentInstance.data = this.phone_number?.value;
    modalRef.closed.subscribe((res) => {
      if (res) {
        this.phone_number?.setValue(res);
        console.log('this.phone_number.value :>> ', this.phone_number?.value);
        this.cdr.markForCheck();
      }
    });
  }
  checkoutWithAddressId(): void {
    this.loading = true;
    this.delivery_address?.patchValue(this.addressId);
    this.cdr.markForCheck();
    this.checkoutForm = this.fb.group({
      order_type: '1',
      payment_type: this.checkout.orderParams.paymentType,
      delivery_address: this.addressId,
    });
    this.setTips();
    console.log('this.checkoutForm.value :>> ', this.checkoutForm.value);
    this.checkoutServe.getCheckout(this.checkoutForm.value).subscribe(
      (res) => {
        this.checkout = res.data;
        this.setCheckout();
        this.endLoading();
      },
      (err) => {
        this.endLoading();
      }
    );
  }
  addAddress(): void {
    const modalRef = this.modalService.open(AddAddressModalComponent, {
      centered: true,
      scrollable: true,
    });
    modalRef.closed.subscribe((res) => {
      if (res) {
        this.addressId = res.id;
        this.checkoutWithAddressId();
      }
    });
  }
  chooseAddress(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.addressServe.getAddresses().subscribe(
      (res) => {
        this.loading = false;
        this.cdr.markForCheck();
        const modalRef = this.modalService.open(ChooseAddressesModalComponent, {
          centered: true,
          scrollable: true,
        });
        modalRef.componentInstance.addresses = res.data.items;
        modalRef.componentInstance.addressId = this.addressId;
        console.log(' this.addressId :>> ', this.addressId);
        modalRef.closed.subscribe((res) => {
          if (res) {
            // this.checkout.user_address.push(res);
            if (res == 'add') {
              this.addAddress();
            } else {
              this.addressId = res;
              this.checkoutWithAddressId();
            }
          }
        });
      },
      (err) => {
        this.messageServe.danger('Something wrong!');
        this.endLoading();
      }
    );
  }
  payByCreditCard(e: Event): void {
    if ((e.target as HTMLInputElement).checked) {
      this.placeOrderForm.addControl(
        'credit_card',
        this.fb.group({
          card_number: [
            '',
            [
              Validators.required,
              // Validators.maxLength(19)
            ],
          ],
          expiration_date: [
            '',
            [
              Validators.required,
              Validators.pattern('([0-9]{2}[/]?){2}'),
              Validators.minLength(5),
            ],
          ],
          name: ['', [Validators.required]],
          zipcode: ['', [Validators.required]],
          cvv: ['', [Validators.required]],
        })
      );
      this.checkoutForm = this.fb.group({
        order_type: this.checkout.orderParams.orderType.toString(),
        payment_type: '1',
        delivery_address: [],
      });
      this.setTips();
      this.setOrderType();
      this.feeLoading = true;
      this.cdr.markForCheck();
      this.checkoutServe.getCheckout(this.checkoutForm.value).subscribe(
        (res) => {
          this.checkout = res.data;
          console.log('this.checkout :>> ', this.checkout);
          this.setCheckout();

          console.log(
            'this.placeOrderForm.value :>> ',
            this.placeOrderForm.value
          );
          this.endLoading();
        },
        (err) => {
          this.endLoading();
        }
      );
    }
  }
  setTips(): void {
    console.log('this.tipsId :>> ', this.tipsId);
    if (this.tipsId > 0) {
      this.checkoutForm.setControl(
        'tips_amount',
        this.fb.control(this.tipsAmount)
      );
      this.checkoutForm.setControl('tips_id', this.fb.control(-1));
    } else {
      this.checkoutForm.setControl('tips_id', this.fb.control(this.tipsId));
    }
  }
  payInStore(e: Event): void {
    if ((e.target as HTMLInputElement).checked) {
      this.checkoutForm = this.fb.group({
        order_type: this.checkout.orderParams.orderType.toString(),
        payment_type: '2',
        delivery_address: [],
        tips_id: -1,
        tips_amount: 0,
      });
      // this.setTips();
      this.setOrderType();
      this.feeLoading = true;
      this.cdr.markForCheck();
      this.checkoutServe.getCheckout(this.checkoutForm.value).subscribe(
        (res) => {
          this.checkout = res.data;
          console.log('this.checkout :>> ', this.checkout);
          this.setCheckout();
          this.placeOrderForm.removeControl('credit_card');
          console.log(
            'this.placeOrderForm.value :>> ',
            this.placeOrderForm.value
          );
          this.endLoading();
        },
        (err) => {
          this.endLoading();
        }
      );
    }
  }
  creditCardNumberSpacing() {
    const input = this.ccNumberField.nativeElement;
    const { selectionStart } = input;
    let trimmedCardNum = this.card_number!.value.replace(/\s+/g, '');
    console.log('trimmedCardNum :>> ', trimmedCardNum);
    if (trimmedCardNum.length > 16) {
      trimmedCardNum = trimmedCardNum.substr(0, 16);
    }
    /* Handle American Express 4-6-5 spacing */
    const partitions =
      trimmedCardNum.startsWith('34') || trimmedCardNum.startsWith('37')
        ? [4, 6, 5]
        : [4, 4, 4, 4];
    const numbers: number[] = [];
    let position = 0;
    partitions.forEach((partition) => {
      const part = trimmedCardNum.substr(position, partition);
      if (part) numbers.push(part);
      position += partition;
    });
    this.card_number!.setValue(numbers.join(' '));
    /* Handle caret position if user edits the number later */
    if (selectionStart < this.card_number!.value.length - 1) {
      input.setSelectionRange(selectionStart, selectionStart, 'none');
    }
  }
  expirationDateFormat() {
    const input = this.expirationDateField.nativeElement;
    const { selectionStart } = input;
    let trimmedExpirationDate = this.expiration_date!.value.replace(/\/+/g, '');
    console.log('trimmedExpirationDate :>> ', trimmedExpirationDate);
    if (trimmedExpirationDate.length > 4) {
      trimmedExpirationDate = trimmedExpirationDate.substr(0, 4);
    }
    const partitions = [2, 2];
    const numbers: number[] = [];
    let position = 0;
    partitions.forEach((partition) => {
      const part = trimmedExpirationDate.substr(position, partition);
      if (part) numbers.push(part);
      position += partition;
    });
    console.log('111 :>> ', 111);
    this.expiration_date!.setValue(numbers.join('/'));
    /* Handle caret position if user edits the number later */
    if (selectionStart < this.expiration_date!.value.length - 1) {
      input.setSelectionRange(selectionStart, selectionStart, 'none');
    }
  }
  selectTips(e: Event, tip: Tips): void {
    this.feeLoading = true;
    if ((e.target as HTMLInputElement).checked) {
      this.isCustomTips = false;
      this.checkoutForm = this.fb.group({
        order_type: this.checkout.orderParams.orderType,
        payment_type: this.checkout.orderParams.paymentType,
        delivery_address: [],
        tips_id: [tip.id],
        tips_amount: [-1],
      });
      this.setOrderType();
      console.log('this.checkoutForm.value :>> ', this.checkoutForm.value);
      this.cdr.markForCheck();
      this.checkoutServe.getCheckout(this.checkoutForm.value).subscribe(
        (res) => {
          this.checkout = res.data;
          console.log('this.checkout :>> ', this.checkout);
          this.setCheckout();
          this.endLoading();
        },
        (err) => {
          this.endLoading();
        }
      );
    } else {
      this.feeLoading = false;
      this.cdr.markForCheck();
    }
  }

  customTips(e: Event): void {
    const modalRef = this.modalService.open(CustomTipsModalComponent, {
      centered: true,
      scrollable: true,
    });
    modalRef.componentInstance.tipsAmount = this.checkout.tips;
    modalRef.closed.subscribe((res) => {
      this.isCustomTips = true;
      this.feeLoading = true;
      this.tipsId = -1;
      this.cdr.markForCheck();
      console.log('CustomTipsModalRes :>> ', res);
      this.checkoutForm = this.fb.group({
        order_type: this.checkout.orderParams.orderType,
        payment_type: this.checkout.orderParams.paymentType,
        delivery_address: [],
        tips_id: -1,
        tips_amount: -1,
      });
      if (res || res == 0) {
        this.checkoutForm.get('tips_amount')?.setValue(res);
      } else {
        this.checkoutForm
          .get('tips_amount')
          ?.setValue(parseFloat(this.tipsAmount) | 0);
      }
      console.log(
        'this.checkoutForm.get :>> ',
        this.checkoutForm.get('tips_amount')!.value
      );
      this.setOrderType();
      console.log('this.checkoutForm.value :>> ', this.checkoutForm.value);
      this.checkoutServe.getCheckout(this.checkoutForm.value).subscribe(
        (data) => {
          console.log('data :>> ', data);
          this.checkout = data.data;
          this.setCheckout();
          this.endLoading();
        },
        (err) => {
          this.endLoading();
        }
      );
    });
  }
  addCoupon(): void {
    // const modalRef = this.modalService.open(AddCouponComponent, {
    //   centered: true,
    //   scrollable: true,
    // });
    // modalRef.closed.subscribe((res) => {
    //   console.log('addCoupon :>> ', res);
    const promoForm = this.fb.group({
      coupon_number: [this.coupon_number],
      merchant_id: [this.checkout.store.merchant_id],
      store_id: [this.checkout.store.id],
    });
    this.loading = true;
    this.cdr.markForCheck();
    this.promoServe
      .applyCoupon(promoForm.value, this.checkout.store.merchant_id.toString())
      .subscribe(
        (data) => {
          if (data.data) {
            const value = data.data.value;
            if (value) {
              this.messageServe.warning(value);
            } else {
              this.checkout = data.data;
              this.messageServe.success('Coupon Added!');
            }
          }
          this.loading = false;
          this.coupon_number = '';
          this.cdr.markForCheck();
        },
        (err) => {
          this.messageServe.danger(err.error.message);
          this.loading = false;
          this.cdr.markForCheck();
        }
      );
    // });
  }
  deleteCoupon(coupon: string): void {
    const modalRef = this.modalService.open(ModalDeleteComponent, {
      centered: true,
      scrollable: true,
    });
    modalRef.componentInstance.modalType = 21;
    modalRef.componentInstance.coupon = coupon;
    modalRef.componentInstance.merchantId = this.checkout.store.merchant_id;
    modalRef.closed.subscribe((res) => {
      if (res) {
        this.checkout = res;
        console.log('this.checkout :>> ', this.checkout);
        this.setCheckout();
        this.cdr.markForCheck();
      }
    });
  }
  navigateToRestaurant(): void {
    this.router.navigate([
      'store/' + this.winServe.getLocalStorage(storageKeys.store),
    ]);
  }

  onDelete($event: Event): void {
    console.log('delete event :>> ', $event);
    $event.stopPropagation();
    // event.preventDefault();
  }
  bottomChange(e: Event): void {
    const element = e.target as HTMLElement;
    console.log('e.element:>> ', element);
  }
  setOrderType(): void {
    if (this.checkout.orderParams.orderType == '1') {
      if (this.addressId) {
        this.checkoutForm.get('delivery_address')?.patchValue(this.addressId);
      }
    }
    if (this.checkout.orderParams.orderType == '2') {
      this.checkoutForm.removeControl('delivery_address');
    }
  }
  endLoading(): void {
    this.loading = false;
    this.feeLoading = false;
    this.cdr.markForCheck();
  }
  onInput(event: any): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    const newString = `${input.value}`
    const formattedPhoneNumber = this.formatPhoneNumber(input.value);
    this.placeOrderForm.get("phone_number")?.patchValue(formattedPhoneNumber);
    // Restore cursor position after formatting
    const newCursorPosition = this.getNewCursorPosition(cursorPosition, newString, formattedPhoneNumber);
    input.setSelectionRange(newCursorPosition, newCursorPosition);
  }
  private formatPhoneNumber(input: string): string {
    const cleanedInput = input.replace(/\D/g, ''); // Remove all non-digit characters
    const phoneNumberLength = 10; // Change this to adjust the phone number length

    // Format the phone number
    let formattedPhoneNumber = '';
    if (cleanedInput.length <= phoneNumberLength) {
      formattedPhoneNumber = cleanedInput.replace(/(\d{3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
      if(formattedPhoneNumber.endsWith("-")){
        formattedPhoneNumber = formattedPhoneNumber.substring(0,formattedPhoneNumber.length-1);
      }
      if(formattedPhoneNumber.endsWith(" ")){
        formattedPhoneNumber = formattedPhoneNumber.substring(1,formattedPhoneNumber.length-2);
      }
    } else {
      // If the phone number is longer than the maximum length, truncate it
      formattedPhoneNumber = cleanedInput.substr(0, phoneNumberLength);
      formattedPhoneNumber = formattedPhoneNumber.replace(/(\d{3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    }

    return formattedPhoneNumber;
  }

  private getNewCursorPosition(cursorPosition: number, oldValue: string, newValue: string): number {
    if (oldValue.length === newValue.length) {
      return cursorPosition; // Cursor position unchanged if the lengths are the same
    }

    const diff = newValue.length - oldValue.length;
    const start = cursorPosition + diff;
    const end = start;

    return start > newValue.length ? newValue.length : start < 0 ? 0 : start;
  }

  onPlaceOrder(): void {
    this.loading = true;
    this.cdr.markForCheck();
    console.log('this.phone_number :>> ', this.phone_number);
    if (typeof this.phone_number?.value == 'string') {
      let phoneValue: string = this.phone_number!.value.replace(/\D/g, '');
      this.phone_number?.setValue(phoneValue);
    }
    this.store_id?.patchValue(this.checkout.store.id);
    console.log('this.placeOrderForm.value:>> ', this.placeOrderForm.value);
    let temp = this.placeOrderForm
      .get('notes')
      ?.value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');
    if (
      !(this.tableWare === 'None' || this.tableWare === 'Add notes for more')
    ) {
      temp = temp + ' ' + this.tableWare + ' utensil. ';
    }
    this.placeOrderForm.get('notes')?.setValue(temp);
    this.checkoutServe.placeOrder(this.placeOrderForm.value).subscribe(
      (res) => {
        console.log('res :>> ', res);
        if (res.data) {
          if (res.data.orderId) {
            this.messageServe.success('Order placed!~');
            this.shoppingCartStore$.dispatch(
              setShoppingCartLength({ length: 0 })
            );
            this.shoppingCartStore$.dispatch(
              setShoppingCart({
                cart: [],
              })
            );
            this.placedOrderStore$.dispatch(
              setPlacedOrder({
                placedOrder: res.data,
              })
            );
            this.loading = false;
            this.cdr.markForCheck();
            this.router.navigate([
              'order-placed',
              { orderId: res.data.orderId },
            ]);
          } else {
            this.loading = false;
            this.cdr.markForCheck();
          }
        } else {
          this.messageServe.danger('Failed! Please try again!');
          this.loading = false;
          this.cdr.markForCheck();
        }
      },
      (err) => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    );
  }
  test(): void {
    console.log('this.placeOrderForm ', this.placeOrderForm);
  }
  // private setCurrentPosition() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       // this.googleMapCenter = this.googleMapOptions.center = {
  //       //   lat: position.coords.latitude,
  //       //   lng: position.coords.longitude,
  //       // };
  //       console.log('this.googleMapCenter :>> ', this.googleMapCenter);
  //       this.googleMapOptions.zoom = 12;
  //       this.cdr.markForCheck();
  //     });
  //   }
  // }
}

function getState(zipString:any) {

  /* Ensure param is a string to prevent unpredictable parsing results */
  if (typeof zipString !== 'string') {
      console.error('Must pass the zipcode as a string.');
      return;
  }

  /* Ensure we have exactly 5 characters to parse */
  if (zipString.length !== 5) {
      console.error('Must pass a 5-digit zipcode.');
      return;
  }

  /* Ensure we don't parse strings starting with 0 as octal values */
  const zipcode = parseInt(zipString, 10);

  let st;
  let state;

  /* Code cases alphabetized by state */
  if (zipcode >= 35000 && zipcode <= 36999) {
      st = 'AL';
      state = 'Alabama';
  } else if (zipcode >= 99500 && zipcode <= 99999) {
      st = 'AK';
      state = 'Alaska';
  } else if (zipcode >= 85000 && zipcode <= 86999) {
      st = 'AZ';
      state = 'Arizona';
  } else if (zipcode >= 71600 && zipcode <= 72999) {
      st = 'AR';
      state = 'Arkansas';
  } else if (zipcode >= 90000 && zipcode <= 96699) {
      st = 'CA';
      state = 'California';
  } else if (zipcode >= 80000 && zipcode <= 81999) {
      st = 'CO';
      state = 'Colorado';
  } else if ((zipcode >= 6000 && zipcode <= 6389) || (zipcode >= 6391 && zipcode <= 6999)) {
      st = 'CT';
      state = 'Connecticut';
  } else if (zipcode >= 19700 && zipcode <= 19999) {
      st = 'DE';
      state = 'Delaware';
  } else if (zipcode >= 32000 && zipcode <= 34999) {
      st = 'FL';
      state = 'Florida';
  } else if ( (zipcode >= 30000 && zipcode <= 31999) || (zipcode >= 39800 && zipcode <= 39999) ) {
      st = 'GA';
      state = 'Georgia';
  } else if (zipcode >= 96700 && zipcode <= 96999) {
      st = 'HI';
      state = 'Hawaii';
  } else if (zipcode >= 83200 && zipcode <= 83999 && zipcode != 83414) {
      st = 'ID';
      state = 'Idaho';
  } else if (zipcode >= 60000 && zipcode <= 62999) {
      st = 'IL';
      state = 'Illinois';
  } else if (zipcode >= 46000 && zipcode <= 47999) {
      st = 'IN';
      state = 'Indiana';
  } else if (zipcode >= 50000 && zipcode <= 52999) {
      st = 'IA';
      state = 'Iowa';
  } else if (zipcode >= 66000 && zipcode <= 67999) {
      st = 'KS';
      state = 'Kansas';
  } else if (zipcode >= 40000 && zipcode <= 42999) {
      st = 'KY';
      state = 'Kentucky';
  } else if (zipcode >= 70000 && zipcode <= 71599) {
      st = 'LA';
      state = 'Louisiana';
  } else if (zipcode >= 3900 && zipcode <= 4999) {
      st = 'ME';
      state = 'Maine';
  } else if (zipcode >= 20600 && zipcode <= 21999) {
      st = 'MD';
      state = 'Maryland';
  } else if ( (zipcode >= 1000 && zipcode <= 2799) || (zipcode == 5501) || (zipcode == 5544 ) ) {
      st = 'MA';
      state = 'Massachusetts';
  } else if (zipcode >= 48000 && zipcode <= 49999) {
      st = 'MI';
      state = 'Michigan';
  } else if (zipcode >= 55000 && zipcode <= 56899) {
      st = 'MN';
      state = 'Minnesota';
  } else if (zipcode >= 38600 && zipcode <= 39999) {
      st = 'MS';
      state = 'Mississippi';
  } else if (zipcode >= 63000 && zipcode <= 65999) {
      st = 'MO';
      state = 'Missouri';
  } else if (zipcode >= 59000 && zipcode <= 59999) {
      st = 'MT';
      state = 'Montana';
  } else if (zipcode >= 27000 && zipcode <= 28999) {
      st = 'NC';
      state = 'North Carolina';
  } else if (zipcode >= 58000 && zipcode <= 58999) {
      st = 'ND';
      state = 'North Dakota';
  } else if (zipcode >= 68000 && zipcode <= 69999) {
      st = 'NE';
      state = 'Nebraska';
  } else if (zipcode >= 88900 && zipcode <= 89999) {
      st = 'NV';
      state = 'Nevada';
  } else if (zipcode >= 3000 && zipcode <= 3899) {
      st = 'NH';
      state = 'New Hampshire';
  } else if (zipcode >= 7000 && zipcode <= 8999) {
      st = 'NJ';
      state = 'New Jersey';
  } else if (zipcode >= 87000 && zipcode <= 88499) {
      st = 'NM';
      state = 'New Mexico';
  } else if ( (zipcode >= 10000 && zipcode <= 14999) || (zipcode == 6390) || (zipcode == 501) || (zipcode == 544) ) {
      st = 'NY';
      state = 'New York';
  } else if (zipcode >= 43000 && zipcode <= 45999) {
      st = 'OH';
      state = 'Ohio';
  } else if ((zipcode >= 73000 && zipcode <= 73199) || (zipcode >= 73400 && zipcode <= 74999) ) {
      st = 'OK';
      state = 'Oklahoma';
  } else if (zipcode >= 97000 && zipcode <= 97999) {
      st = 'OR';
      state = 'Oregon';
  } else if (zipcode >= 15000 && zipcode <= 19699) {
      st = 'PA';
      state = 'Pennsylvania';
  } else if (zipcode >= 300 && zipcode <= 999) {
      st = 'PR';
      state = 'Puerto Rico';
  } else if (zipcode >= 2800 && zipcode <= 2999) {
      st = 'RI';
      state = 'Rhode Island';
  } else if (zipcode >= 29000 && zipcode <= 29999) {
      st = 'SC';
      state = 'South Carolina';
  } else if (zipcode >= 57000 && zipcode <= 57999) {
      st = 'SD';
      state = 'South Dakota';
  } else if (zipcode >= 37000 && zipcode <= 38599) {
      st = 'TN';
      state = 'Tennessee';
  } else if ( (zipcode >= 75000 && zipcode <= 79999) || (zipcode >= 73301 && zipcode <= 73399) ||  (zipcode >= 88500 && zipcode <= 88599) ) {
      st = 'TX';
      state = 'Texas';
  } else if (zipcode >= 84000 && zipcode <= 84999) {
      st = 'UT';
      state = 'Utah';
  } else if (zipcode >= 5000 && zipcode <= 5999) {
      st = 'VT';
      state = 'Vermont';
  } else if ( (zipcode >= 20100 && zipcode <= 20199) || (zipcode >= 22000 && zipcode <= 24699) || (zipcode == 20598) ) {
      st = 'VA';
      state = 'Virginia';
  } else if ( (zipcode >= 20000 && zipcode <= 20099) || (zipcode >= 20200 && zipcode <= 20599) || (zipcode >= 56900 && zipcode <= 56999) ) {
      st = 'DC';
      state = 'Washington DC';
  } else if (zipcode >= 98000 && zipcode <= 99499) {
      st = 'WA';
      state = 'Washington';
  } else if (zipcode >= 24700 && zipcode <= 26999) {
      st = 'WV';
      state = 'West Virginia';
  } else if (zipcode >= 53000 && zipcode <= 54999) {
      st = 'WI';
      state = 'Wisconsin';
  } else if ( (zipcode >= 82000 && zipcode <= 83199) || zipcode == 83414 ) {
      st = 'WY';
      state = 'Wyoming';
  } else {
      st = 'none';
      state = 'none';
      console.log('No state found matching', zipcode);
  }

  return st;
}
