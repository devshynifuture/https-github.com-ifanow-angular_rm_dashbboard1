import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertToPaidComponent } from './convert-to-paid.component';

describe('ConvertToPaidComponent', () => {
  let component: ConvertToPaidComponent;
  let fixture: ComponentFixture<ConvertToPaidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertToPaidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertToPaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
