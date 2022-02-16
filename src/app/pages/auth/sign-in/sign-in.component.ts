import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/apis/auth.service';
import { ShoppingCartService } from 'src/app/services/apis/shopping-cart.service';
import { UserService } from 'src/app/services/apis/user.service';
import { WindowService } from 'src/app/services/local/window.service';
import { MessageService } from 'src/app/share/components/message/message.service';
import { storageKeys } from 'src/app/share/configs';
import {
  setShoppingCart,
  setShoppingCartLength,
} from 'src/app/state/shopping-cart/action';
import { ShoppingCartStoreModule } from 'src/app/state/shopping-cart/shopping-cart.store.module';

@Component({
  selector: 'uo-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
  pwToggle: boolean = true;
  loading: boolean = false;
  errCode: number = -1;
  errRes: any;
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
  });
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  constructor(
    private fb: FormBuilder,
    private authServe: AuthService,
    private winServe: WindowService,
    private userServe: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private messageServe: MessageService,
    private shoppingCartServe: ShoppingCartService,
    private shoppingCartStore$: Store<ShoppingCartStoreModule>
  ) {}

  ngOnInit(): void {
    // window.scrollTo(0, 0);
  }
  // passwordToggle() {
  //   this.pwToggle = !this.pwToggle;
  // }
  testToken(): void {
    if (this.winServe.getLocalStorage(storageKeys.auth)) {
      // this.winServe.getLocalStorage(storageKeys.auth)
      this.userServe.profile().subscribe(
        (res) => {
          console.log('res :>> ', res);
        },
        (err) => {
          console.log('err :>> ', err);
        }
      );
    }
  }
  onSubmit(): void {
    // let loginFormValue = JSON.stringify(this.loginForm.value);
    // console.log('registerFormValue :>> ', loginFormValue);
    this.loading = true;
    this.cdr.markForCheck();
    this.authServe.login(this.loginForm.value).subscribe(
      (res) => {
        console.log('res :>> ', res);
        this.messageServe.success('Login');
        this.winServe.setLocalStorage(storageKeys.auth, res.data.token);
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
              this.router.navigate(['']);
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
              this.router.navigate(['']);
              // if (storeId) {
              //   this.router.navigate(['restaurant/' + storeId]);
              // } else {
              //   this.router.navigate(['home']);
              // }
            }
          );
      },
      (err) => {
        console.log('err :>> ', err);
        this.errRes = err;
        if (err.status === 400) {
          this.errCode = err.error.code;
          this.cdr.markForCheck();
        } else {
          this.errCode = err.status;
          this.cdr.markForCheck();
        }
        this.loading = false;
        this.cdr.markForCheck();
      }
    );
  }
}
