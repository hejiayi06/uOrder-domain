import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseAddressesModalComponent } from './choose-addresses-modal.component';

describe('ChooseAddressesModalComponent', () => {
  let component: ChooseAddressesModalComponent;
  let fixture: ComponentFixture<ChooseAddressesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseAddressesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseAddressesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
