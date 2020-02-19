import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoricalFileComponent } from './order-historical-file.component';

describe('OrderHistoricalFileComponent', () => {
  let component: OrderHistoricalFileComponent;
  let fixture: ComponentFixture<OrderHistoricalFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderHistoricalFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoricalFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
