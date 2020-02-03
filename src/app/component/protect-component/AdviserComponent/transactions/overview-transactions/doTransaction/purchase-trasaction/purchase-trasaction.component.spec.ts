import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTrasactionComponent } from './purchase-trasaction.component';

describe('PurchaseTrasactionComponent', () => {
  let component: PurchaseTrasactionComponent;
  let fixture: ComponentFixture<PurchaseTrasactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseTrasactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseTrasactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
