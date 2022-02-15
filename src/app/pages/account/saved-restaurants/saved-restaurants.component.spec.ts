import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedRestaurantsComponent } from './saved-restaurants.component';

describe('SavedRestaurantsComponent', () => {
  let component: SavedRestaurantsComponent;
  let fixture: ComponentFixture<SavedRestaurantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedRestaurantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedRestaurantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
