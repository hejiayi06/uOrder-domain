import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionCheckComponent } from './section-check.component';

describe('SectionCheckComponent', () => {
  let component: SectionCheckComponent;
  let fixture: ComponentFixture<SectionCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
