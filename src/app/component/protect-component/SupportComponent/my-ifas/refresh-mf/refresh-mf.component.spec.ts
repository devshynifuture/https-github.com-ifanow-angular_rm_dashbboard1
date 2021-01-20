import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshMfComponent } from './refresh-mf.component';

describe('RefreshMfComponent', () => {
  let component: RefreshMfComponent;
  let fixture: ComponentFixture<RefreshMfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefreshMfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshMfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
