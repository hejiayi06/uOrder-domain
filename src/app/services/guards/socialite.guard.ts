import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { storageKeys } from 'src/app/share/configs';
import {
  setShoppingCart,
  setShoppingCartLength,
} from 'src/app/state/shopping-cart/action';
import { ShoppingCartStoreModule } from 'src/app/state/shopping-cart/shopping-cart.store.module';
import { ShoppingCartService } from '../apis/shopping-cart.service';
import { WindowService } from '../local/window.service';

@Injectable({
  providedIn: 'root',
})
export class SocialiteGuard implements CanActivate {
  constructor(
    private winServe: WindowService,
    private router: Router,
    private shoppingCartServe: ShoppingCartService,
    private shoppingCartStore$: Store<ShoppingCartStoreModule>
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.updateToken(route);
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
          this.navigate();
        },
        (err) => {
          this.dispatchZero();
          this.navigate();
        }
      );

    return true;
  }
  dispatchZero(): void {
    this.shoppingCartStore$.dispatch(setShoppingCartLength({ length: 0 }));
    this.shoppingCartStore$.dispatch(
      setShoppingCart({
        cart: [],
      })
    );
  }
  updateToken(route: ActivatedRouteSnapshot) {
    if (route.queryParams['user_id']) {
      this.winServe.setLocalStorage(
        storageKeys.user,
        route.queryParams['user_id']
      );
      this.winServe.setLocalStorage(
        storageKeys.auth,
        route.queryParams['token']
      );
    }
  }
  navigate(): void {
    let storeId = this.winServe.getLocalStorage(storageKeys.store);
    if (storeId) {
      this.router.navigateByUrl('/restaurant/' + storeId);
    } else {
      this.router.navigateByUrl('');
    }
  }
}
