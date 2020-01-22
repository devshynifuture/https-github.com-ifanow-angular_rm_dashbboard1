import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcWiseComponent } from './amc-wise.component';

describe('AmcWiseComponent', () => {
  let component: AmcWiseComponent;
  let fixture: ComponentFixture<AmcWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmcWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmcWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
