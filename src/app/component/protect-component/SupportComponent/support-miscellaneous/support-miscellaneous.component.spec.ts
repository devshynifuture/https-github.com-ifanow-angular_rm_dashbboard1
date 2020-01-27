import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportMiscellaneousComponent } from './support-miscellaneous.component';

describe('SupportMiscellaneousComponent', () => {
  let component: SupportMiscellaneousComponent;
  let fixture: ComponentFixture<SupportMiscellaneousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportMiscellaneousComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportMiscellaneousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
