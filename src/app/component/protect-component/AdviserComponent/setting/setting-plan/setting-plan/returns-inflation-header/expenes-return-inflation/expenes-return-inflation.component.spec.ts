import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenesReturnInflationComponent } from './expenes-return-inflation.component';

describe('ExpenesReturnInflationComponent', () => {
  let component: ExpenesReturnInflationComponent;
  let fixture: ComponentFixture<ExpenesReturnInflationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenesReturnInflationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenesReturnInflationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
