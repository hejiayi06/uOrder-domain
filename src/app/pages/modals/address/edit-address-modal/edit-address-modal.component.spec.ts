import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddressModalComponent } from './edit-address-modal.component';

describe('EditAddressModalComponent', () => {
  let component: EditAddressModalComponent;
  let fixture: ComponentFixture<EditAddressModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAddressModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAddressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
