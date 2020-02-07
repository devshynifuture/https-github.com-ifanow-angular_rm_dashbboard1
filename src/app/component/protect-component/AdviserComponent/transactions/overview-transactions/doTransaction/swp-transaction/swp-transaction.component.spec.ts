import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwpTransactionComponent } from './swp-transaction.component';

describe('SwpTransactionComponent', () => {
  let component: SwpTransactionComponent;
  let fixture: ComponentFixture<SwpTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwpTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwpTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
