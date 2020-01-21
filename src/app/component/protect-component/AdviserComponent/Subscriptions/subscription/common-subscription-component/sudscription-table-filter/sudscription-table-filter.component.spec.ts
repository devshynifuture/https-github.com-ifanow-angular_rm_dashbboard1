import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SudscriptionTableFilterComponent } from './sudscription-table-filter.component';

describe('SudscriptionTableFilterComponent', () => {
  let component: SudscriptionTableFilterComponent;
  let fixture: ComponentFixture<SudscriptionTableFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SudscriptionTableFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SudscriptionTableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
