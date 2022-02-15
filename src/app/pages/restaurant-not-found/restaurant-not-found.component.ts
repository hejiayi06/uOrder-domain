import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uo-restaurant-not-found',
  templateUrl: './restaurant-not-found.component.html',
  styleUrls: ['./restaurant-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
