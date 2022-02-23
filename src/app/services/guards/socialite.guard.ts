import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { storageKeys } from 'src/app/share/configs';
import { WindowService } from '../local/window.service';

@Injectable({
  providedIn: 'root',
})
export class SocialiteGuard implements CanActivate {
  constructor(private winServe: WindowService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (route.queryParams['user_id']) {
      this.winServe.setLocalStorage(
        storageKeys.user,
        route.queryParams['user_id']
      );
      this.winServe.setLocalStorage(
        storageKeys.auth,
        route.queryParams['token']
      );
      this.router.navigateByUrl('');
    }
    return true;
  }
}
