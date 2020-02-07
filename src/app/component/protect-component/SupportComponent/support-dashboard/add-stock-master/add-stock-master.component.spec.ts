import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockMasterComponent } from './add-stock-master.component';

describe('AddStockMasterComponent', () => {
  let component: AddStockMasterComponent;
  let fixture: ComponentFixture<AddStockMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStockMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStockMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
