import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EuinSelectPopUpComponent } from './euin-select-pop-up.component';

describe('EuinSelectPopUpComponent', () => {
  let component: EuinSelectPopUpComponent;
  let fixture: ComponentFixture<EuinSelectPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EuinSelectPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EuinSelectPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
