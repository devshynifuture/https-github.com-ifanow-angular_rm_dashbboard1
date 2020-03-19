import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewEmailComponent } from './overview-email.component';

describe('OverviewEmailComponent', () => {
  let component: OverviewEmailComponent;
  let fixture: ComponentFixture<OverviewEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
