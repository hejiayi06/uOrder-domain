import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uo-saved-restaurants',
  templateUrl: './saved-restaurants.component.html',
  styleUrls: ['./saved-restaurants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavedRestaurantsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
