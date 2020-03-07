import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewMyfeedComponent } from './overview-myfeed.component';

describe('OverviewMyfeedComponent', () => {
  let component: OverviewMyfeedComponent;
  let fixture: ComponentFixture<OverviewMyfeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewMyfeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewMyfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
