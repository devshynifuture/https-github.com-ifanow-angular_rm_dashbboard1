import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileMutualFundDetailsComponent } from './mobile-mutual-fund-details.component';

describe('MobileMutualFundDetailsComponent', () => {
  let component: MobileMutualFundDetailsComponent;
  let fixture: ComponentFixture<MobileMutualFundDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileMutualFundDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileMutualFundDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
