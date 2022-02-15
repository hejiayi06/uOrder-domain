import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyArrayComponent } from './modify-array.component';

describe('ModifyArrayComponent', () => {
  let component: ModifyArrayComponent;
  let fixture: ComponentFixture<ModifyArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyArrayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
