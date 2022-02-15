import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { WindowService } from 'src/app/services/local/window.service';
import { storageKeys } from 'src/app/share/configs';
import { AuthService } from 'src/app/services/apis/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'src/app/share/components/message/message.service';
import { StoreService } from 'src/app/services/apis/store.service';
import { StoreRes } from 'src/app/share/types';
import { StoreInfoStoreModule } from 'src/app/state/store-info/store-info.store.module';
import { Store } from '@ngrx/store';
import { setStoreInfo } from 'src/app/state/store-info/action';
import { ShoppingCartStoreModule } from 'src/app/state/shopping-cart/shopping-cart.store.module';
import {
  setShoppingCart,
  setShoppingCartLength,
} from 'src/app/state/shopping-cart/action';
import { ErrorsService } from 'src/app/services/local/errors.service';
// import {Location, Appearance, GermanAddress} from '@angular-material-extensions/google-maps-autocomplete';

@Component({
  selector: 'uo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  loading: boolean = false;
  isLog: boolean = false;
  restaurantUrl: string = '';
  placePredictions?: any[];
  addressForm: FormGroup = this.fb.group({
    address: this.fb.control(''),
  });
  stores!: StoreRes[];
  constructor(
    private router: Router,
    private winServe: WindowService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private storeServe: StoreService,
    private messageServe: MessageService,
    private storeStore$: Store<StoreInfoStoreModule>,
    private shoppingCartStore$: Store<ShoppingCartStoreModule>,
    private authServe: AuthService,
    private errorServe: ErrorsService // private mapsAPILoader: MapsAPILoader,
  ) {}

  ngOnInit(): void {
    this.setIsLog();
    this.getStores();
  }
  setIsLog(): void {
    if (this.winServe.getLocalStorage(storageKeys.auth)) {
      this.isLog = true;
    }
  }
  storeTrackBy(index: number, store: StoreRes): number {
    return store.id;
  }
  // findAdress(){
  //   this.mapsAPILoader.load().then(() => {
  //        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
  //        autocomplete.addListener("place_changed", () => {
  //          this.ngZone.run(() => {
  //            // some details
  //            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  //            this.address = place.formatted_address;
  //            this.web_site = place.website;
  //            this.name = place.name;
  //            this.zip_code = place.address_components[place.address_components.length - 1].long_name;
  //            //set latitude, longitude and zoom
  //            this.latitude = place.geometry.location.lat();
  //            this.longitude = place.geometry.location.lng();
  //            this.zoom = 12;
  //          });
  //        });
  //      });
  //  }
  getStores(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.storeServe.getStores().subscribe(
      (res) => {
        console.log('res :>> ', res);
        this.stores = res.data.values;
        this.loading = false;
        this.cdr.markForCheck();
      },
      (err) => {
        this.errorServe.errorHandler(err);
      }
    );
  }
  selectStore(store: StoreRes): void {
    this.storeStore$.dispatch(setStoreInfo(store));
    this.winServe.setLocalStorage(storageKeys.store, store.id.toString());
    this.router.navigate(['/restaurant', store.id]);
  }
  onInput(event?: Event) {
    const value = (event!.target as HTMLInputElement).value;
    // if (value) {
    //   this.placePredictionServe.getPlacePredictions(value).subscribe((res) => {
    //     console.log('this.placePredictions :>> ', this.placePredictions);
    //     this.placePredictions = res;
    //   });
    // }
  }
  onLogout() {
    this.isLog = false;
    this.messageServe.warning('Log out');
    this.cdr.markForCheck();
    this.authServe
      .logout(this.winServe.getLocalStorage(storageKeys.user) as string)
      .subscribe(
        (res) => {
          console.log('res :>> ', res);
          this.winServe.removeLocalStorage(storageKeys.auth);
          this.winServe.removeLocalStorage(storageKeys.user);
          this.shoppingCartStore$.dispatch(
            setShoppingCartLength({ length: 0 })
          );
          this.shoppingCartStore$.dispatch(
            setShoppingCart({
              cart: [],
            })
          );
        },
        (err) => {
          this.winServe.removeLocalStorage(storageKeys.auth);
          this.winServe.removeLocalStorage(storageKeys.user);
          this.shoppingCartStore$.dispatch(
            setShoppingCartLength({ length: 0 })
          );
          this.shoppingCartStore$.dispatch(
            setShoppingCart({
              cart: [],
            })
          );
          this.errorServe.errorHandler(err);
        }
      );
  }
  onSignUp() {
    this.router.navigate(['sign-up']);
  }
  onSignIn() {
    this.router.navigate(['sign-in']);
  }
}
