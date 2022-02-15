import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { storageKeys } from 'src/app/share/configs';
import {
  getShoppingCartLength,
  selectShoppingCartFeature,
} from 'src/app/state/shopping-cart/selectors';
import { ShoppingCartStoreModule } from 'src/app/state/shopping-cart/shopping-cart.store.module';
import { WindowService } from '../local/window.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutGuard implements CanActivate {
  length!: number;
  cartSub!: Subscription;
  constructor(
    private winServe: WindowService,
    private router: Router,
    private shoppingCartStore$: Store<ShoppingCartStoreModule>
  ) {
    // this.getStoreShoppingCartLength();
  }
  // getStoreShoppingCartLength(): void {
  //   this.cartSub = this.shoppingCartStore$
  //     .select(selectShoppingCartFeature)
  //     .pipe(select(getShoppingCartLength))
  //     .subscribe((res: number) => {
  //       if (res) {
  //         this.length = res;
  //       } else if (res == 0) {
  //         this.length = 0;
  //       }
  //     });
  // }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.winServe.getLocalStorage(storageKeys.auth)) {
      this.router.navigate(['sign-in']);
      return false;
    }
    return true;
  }
}
