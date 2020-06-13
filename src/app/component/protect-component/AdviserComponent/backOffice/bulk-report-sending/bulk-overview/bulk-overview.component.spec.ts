import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkOverviewComponent } from './bulk-overview.component';

describe('BulkOverviewComponent', () => {
  let component: BulkOverviewComponent;
  let fixture: ComponentFixture<BulkOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
