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
  constructor(private updateServe: UpdateService) {
    this.updateServe;
  }
}
