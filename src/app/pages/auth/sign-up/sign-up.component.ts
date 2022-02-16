import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/services/apis/auth.service';
import { ShoppingCartService } from 'src/app/services/apis/shopping-cart.service';
import { WindowService } from 'src/app/services/local/window.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { storageKeys } from 'src/app/share/configs';
import {
  setShoppingCart,
  setShoppingCartLength,
} from 'src/app/state/shopping-cart/action';
import { ShoppingCartStoreModule } from 'src/app/state/shopping-cart/shopping-cart.store.module';

@Component({
  selector: 'uo-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit {
  pwToggle: boolean = true;
  loading: boolean = false;
  emailInput!: string;
  emailToggle: boolean = false;
  errCode: number = -1;
  private getDataTerms = new Subject<string>();
  registerForm: FormGroup = this.fb.group({
    first_name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
    ],
    last_name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
  });
  get firstName() {
    return this.registerForm.get('first_name');
  }
  get lastName() {
    return this.registerForm.get('last_name');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  constructor(
    private fb: FormBuilder,
    private authServe: AuthService,
    private winServe: WindowService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private shoppingCartStore$: Store<ShoppingCartStoreModule>,
    private messageServe: MessageService,
    private shoppingCartServe: ShoppingCartService
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.getDataTerms
      .pipe(
        // 请求防抖 300毫秒
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((term) => {
        // 此处进行httpClient的请求
        // term是用户输入的值
        this.authServe.checkEmail(term).subscribe((res) => {
          this.emailToggle = res.data.CheckEmail;
          console.log('res :>> ', res);
          this.cdr.markForCheck();
        });
      });
  }
  getDataList(): void {
    throw new Error('Method not implemented.');
  }

  // passwordToggle(): void {
  //   this.pwToggle = !this.pwToggle;
  // }
  emailCheck(email: string): void {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
      this.getDataTerms.next(email);
    }
  }
  onSubmit(): void {
    // let registerFormValue = JSON.stringify(this.registerForm.value);
    // console.log('registerFormValue :>> ', registerFormValue);
    this.loading = true;
    this.cdr.markForCheck();
    this.authServe.register(this.registerForm.value).subscribe(
      (res) => {
        this.messageServe.success('Register successfully!');
        this.errCode = -1;
        this.winServe.setLocalStorage(storageKeys.auth, res.data.access_token);
        this.winServe.setLocalStorage(storageKeys.user, res.data.user_id);
        this.shoppingCartServe
          .renewShoppingCart(
            this.winServe.getLocalStorage(storageKeys.anonymous) as string
          )
          .subscribe(
            (renewRes) => {
              let items = renewRes.data.values;
              if (items.length) {
                this.shoppingCartStore$.dispatch(
                  setShoppingCart({
                    cart: items,
                  })
                );
                let len = 0;
                items.forEach((i: { quantity: number }) => {
                  len += i.quantity;
                });
                this.shoppingCartStore$.dispatch(
                  setShoppingCartLength({ length: len })
                );
              } else {
                this.shoppingCartStore$.dispatch(
                  setShoppingCartLength({ length: 0 })
                );
                this.shoppingCartStore$.dispatch(
                  setShoppingCart({
                    cart: [],
                  })
                );
              }
              let storeId = this.winServe.getLocalStorage(storageKeys.store);
              this.loading = false;
              this.cdr.markForCheck();
              // if (storeId) {
              //   this.router.navigate(['restaurant/' + storeId]);
              // } else {
              //   this.router.navigate(['home']);
              // }
            },
            (err) => {
              this.shoppingCartStore$.dispatch(
                setShoppingCartLength({ length: 0 })
              );
              this.shoppingCartStore$.dispatch(
                setShoppingCart({
                  cart: [],
                })
              );
              let storeId = this.winServe.getLocalStorage(storageKeys.store);
              this.loading = false;
              this.cdr.markForCheck();
              // if (storeId) {
              //   this.router.navigate(['restaurant/' + storeId]);
              // } else {
              //   this.router.navigate(['home']);
              // }
            }
          );
      },
      (err) => {
        if (err.status) {
          this.errCode = err.status;
          this.cdr.markForCheck();
        } else {
          this.errCode = err.error.code;
          this.cdr.markForCheck();
        }
        this.loading = false;
        this.cdr.markForCheck();
      }
    );
  }
}
