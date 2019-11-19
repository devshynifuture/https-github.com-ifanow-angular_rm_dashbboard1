import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TexesPlanComponent } from './texes-plan.component';

describe('TexesPlanComponent', () => {
  let component: TexesPlanComponent;
  let fixture: ComponentFixture<TexesPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TexesPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TexesPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
