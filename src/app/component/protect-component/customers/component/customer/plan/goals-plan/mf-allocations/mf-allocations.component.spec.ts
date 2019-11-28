import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MfAllocationsComponent } from './mf-allocations.component';

describe('MfAllocationsComponent', () => {
  let component: MfAllocationsComponent;
  let fixture: ComponentFixture<MfAllocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MfAllocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfAllocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
