import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
import { UpdateService } from './services/service-workers/update.service';

@Component({
  selector: 'uo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'uOrder';
  constructor(private updateServe: UpdateService) {
    this.updateServe;
    this.googleMap();
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
