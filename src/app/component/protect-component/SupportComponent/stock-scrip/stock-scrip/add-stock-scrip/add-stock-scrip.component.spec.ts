import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockScripComponent } from './add-stock-scrip.component';

describe('AddStockScripComponent', () => {
  let component: AddStockScripComponent;
  let fixture: ComponentFixture<AddStockScripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStockScripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStockScripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
