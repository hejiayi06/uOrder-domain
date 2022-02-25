import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LoadingStoreModule } from 'src/app/state/loading/loading.store.module';
import {
  getLoading,
  selectLoadingFeature,
} from 'src/app/state/loading/selectors';

@Component({
  selector: 'uo-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  accountList = [
    { listName: 'Orders' },
    { listName: 'Address' },
    { listName: 'Profile' },
  ];
  loadingSub!: Subscription;
  constructor(
    private loadingStore$: Store<LoadingStoreModule>,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.getLoading();
  }
  getLoading(): void {
    this.loadingSub = this.loadingStore$
      .select(selectLoadingFeature)
      .pipe(select(getLoading))
      .subscribe((res) => {
        console.log('loading res :>> ', res);
        this.loading = res;
        this.cdr.detectChanges();
      });
  }
}
