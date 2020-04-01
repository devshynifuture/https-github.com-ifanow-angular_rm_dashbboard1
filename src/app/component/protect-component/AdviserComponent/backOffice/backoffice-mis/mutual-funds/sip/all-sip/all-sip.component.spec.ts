import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSipComponent } from './all-sip.component';

describe('AllSipComponent', () => {
  let component: AllSipComponent;
  let fixture: ComponentFixture<AllSipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllSipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
