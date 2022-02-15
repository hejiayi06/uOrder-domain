import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDefaultAddressComponent } from './set-default-address.component';

describe('SetDefaultAddressComponent', () => {
  let component: SetDefaultAddressComponent;
  let fixture: ComponentFixture<SetDefaultAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetDefaultAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDefaultAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
