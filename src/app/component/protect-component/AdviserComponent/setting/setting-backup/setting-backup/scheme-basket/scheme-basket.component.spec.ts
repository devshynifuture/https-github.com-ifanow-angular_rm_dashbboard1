import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeBasketComponent } from './scheme-basket.component';

describe('SchemeBasketComponent', () => {
  let component: SchemeBasketComponent;
  let fixture: ComponentFixture<SchemeBasketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeBasketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
