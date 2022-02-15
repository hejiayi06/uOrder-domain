import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { UpdateService } from './services/service-workers/update.service';

@Component({
  selector: 'uo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'uOrder';
  constructor(
    // private httpClient: HttpClient,
    private updateServe: UpdateService
  ) {}
  // private config!: { version: string };
  ngOnInit() {
    this.updateServe;
    // this.config = require('./../assets/config.json');
    // console.log('this.config :>> ', this.config);
    // const headers = new HttpHeaders()
    //   .set('Cache-Control', 'no-cache')
    //   .set('Pragma', 'no-cache');
    // this.httpClient
    //   .get<{ version: string }>('../assets/config.json', { headers })
    //   .subscribe((config) => {
    //     console.log('config :>> ', config);
    //     if (config.version !== this.config.version) {
    //       this.httpClient
    //         .get('', { headers, responseType: 'text' })
    //         .subscribe(() => location.reload());
    //     }
    //   });
  }
}
