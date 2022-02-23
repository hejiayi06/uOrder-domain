import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uo-socialite',
  templateUrl: './socialite.component.html',
  styleUrls: ['./socialite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialiteComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
