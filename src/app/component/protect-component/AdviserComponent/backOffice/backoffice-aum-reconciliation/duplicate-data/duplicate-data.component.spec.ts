import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateDataComponent } from './duplicate-data.component';

describe('DuplicateDataComponent', () => {
  let component: DuplicateDataComponent;
  let fixture: ComponentFixture<DuplicateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
