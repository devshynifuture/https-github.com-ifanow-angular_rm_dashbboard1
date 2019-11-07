import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePayeeComponent } from './change-payee.component';

describe('ChangePayeeComponent', () => {
  let component: ChangePayeeComponent;
  let fixture: ComponentFixture<ChangePayeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePayeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePayeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
