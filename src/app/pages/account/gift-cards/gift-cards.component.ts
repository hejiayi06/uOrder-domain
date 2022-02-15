import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uo-gift-cards',
  templateUrl: './gift-cards.component.html',
  styleUrls: ['./gift-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftCardsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
