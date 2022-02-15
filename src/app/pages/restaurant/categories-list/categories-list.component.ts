import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category, Group } from 'src/app/share/types';

@Component({
  selector: 'uo-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesListComponent implements OnInit {
  @Input() menuList!: Category[];
  @Output('category') categoryEvent = new EventEmitter<Category>();
  constructor() {}

  ngOnInit(): void {}

  onCategory(category: Category) {
    // this.listCategory1
    console.log('this.menuList :>> ', this.menuList);
    this.categoryEvent.emit(category);
  }
}
