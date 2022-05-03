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
    private cdr: ChangeDetectorRef,
    private router: Router,
    private messageServe: MessageService,
    private shoppingCartServe: ShoppingCartService,
    private shoppingCartStore$: Store<ShoppingCartStoreModule>
  ) {}

  ngOnInit(): void {}
  googleAuth(): void {
    let domain = window.location.hostname;
    window.location.href =
      'https://api.uorder.io/login/socialite/google/auth?domain=' + domain;
  }
  onSubmit(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.authServe.login(this.loginForm.value).subscribe(
      (res) => {
        console.log('res :>> ', res);
        this.messageServe.success('Login');
        this.winServe.setLocalStorage(storageKeys.auth, res.data.token);
        this.winServe.setLocalStorage(storageKeys.user, res.data.user_id);
        this.winServe.setLocalStorage(
          storageKeys.userFirstName,
          res.data.first_name
        );
        this.winServe.setLocalStorage(
          storageKeys.userLastName,
          res.data.last_name
        );
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
                this.dispatchZero();
              }
              this.loading = false;
              this.cdr.markForCheck();
              this.router.navigate(['']);
            },
            (err) => {
              this.dispatchZero();
              this.loading = false;
              this.cdr.markForCheck();
              this.router.navigate(['']);
            }
          );
      },
      (err) => {
        console.log('err :>> ', err);
        this.errRes = err;
        if (err.status === 400) {
          this.errCode = err.error.code;
        } else {
          this.errCode = err.status;
        }
        this.loading = false;
        this.cdr.markForCheck();
      }
    );
  }
  dispatchZero(): void {
    this.shoppingCartStore$.dispatch(setShoppingCartLength({ length: 0 }));
    this.shoppingCartStore$.dispatch(
      setShoppingCart({
        cart: [],
      })
    );
  }
}
