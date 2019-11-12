import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilitiesDetailComponent } from './liabilities-detail.component';

describe('LiabilitiesDetailComponent', () => {
  let component: LiabilitiesDetailComponent;
  let fixture: ComponentFixture<LiabilitiesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiabilitiesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilitiesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
