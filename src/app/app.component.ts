import { Component } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { fromEvent, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UpdateService } from './services/service-workers/update.service';

@Component({
  selector: 'uo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'uOrder';
  private touchStartSubscription!: Subscription;
  private touchEndSubscription!: Subscription;
  constructor(private updateServe: UpdateService) {
    this.updateServe;
    this.googleMap();
    this.doubleClick();
  }
  private doubleClick(): void {
    this.touchStartSubscription && this.touchStartSubscription.unsubscribe();
    this.touchEndSubscription && this.touchEndSubscription.unsubscribe();
    let lastTouch = 0;
    this.touchStartSubscription = fromEvent(window, 'touchstart').subscribe(
      (event) => {
        if ((event as TouchEvent).touches.length > 1) {
          event.preventDefault();
        }
      }
    );
    this.touchEndSubscription = fromEvent(window, 'touchend').subscribe(
      (event) => {
        const now = new Date().getTime();
        if (now - lastTouch <= 300) {
          event.preventDefault();
          lastTouch = now;
        }
      }
    );
  }
  googleMap(): void {
    new Loader({
      apiKey: environment['googleMapsApiKey'],
      version: 'weekly',
      // libraries:['']
    })
      .load()
      .then(() => {
        console.log('🚀 ~ GoogleMapsService ~ google maps api lazy loaded');
      });
  }
}
