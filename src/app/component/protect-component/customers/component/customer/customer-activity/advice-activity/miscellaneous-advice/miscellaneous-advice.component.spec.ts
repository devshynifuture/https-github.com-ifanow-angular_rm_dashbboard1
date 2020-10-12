import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousAdviceComponent } from './miscellaneous-advice.component';

describe('MiscellaneousAdviceComponent', () => {
  let component: MiscellaneousAdviceComponent;
  let fixture: ComponentFixture<MiscellaneousAdviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiscellaneousAdviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
