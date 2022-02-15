import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionArrayComponent } from './section-array.component';

describe('SectionArrayComponent', () => {
  let component: SectionArrayComponent;
  let fixture: ComponentFixture<SectionArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionArrayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
