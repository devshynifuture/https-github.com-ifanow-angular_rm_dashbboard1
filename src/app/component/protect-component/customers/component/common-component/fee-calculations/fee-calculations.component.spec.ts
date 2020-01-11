import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCalculationsComponent } from './fee-calculations.component';

describe('FeeCalculationsComponent', () => {
  let component: FeeCalculationsComponent;
  let fixture: ComponentFixture<FeeCalculationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeCalculationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeCalculationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
