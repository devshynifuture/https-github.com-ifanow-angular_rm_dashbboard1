import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineTrasactionComponent } from './online-trasaction.component';

describe('OnlineTrasactionComponent', () => {
  let component: OnlineTrasactionComponent;
  let fixture: ComponentFixture<OnlineTrasactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineTrasactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineTrasactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
