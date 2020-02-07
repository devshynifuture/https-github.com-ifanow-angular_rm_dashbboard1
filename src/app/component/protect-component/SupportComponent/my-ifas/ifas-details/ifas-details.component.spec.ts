import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfasDetailsComponent } from './ifas-details.component';

describe('IfasDetailsComponent', () => {
  let component: IfasDetailsComponent;
  let fixture: ComponentFixture<IfasDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfasDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfasDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
