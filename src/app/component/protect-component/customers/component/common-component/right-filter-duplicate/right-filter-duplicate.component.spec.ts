import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightFilterDuplicateComponent } from './right-filter-duplicate.component';

describe('RightFilterDuplicateComponent', () => {
  let component: RightFilterDuplicateComponent;
  let fixture: ComponentFixture<RightFilterDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightFilterDuplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightFilterDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
