import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkEmailReviewSendComponent } from './bulk-email-review-send.component';

describe('BulkEmailReviewSendComponent', () => {
  let component: BulkEmailReviewSendComponent;
  let fixture: ComponentFixture<BulkEmailReviewSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkEmailReviewSendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkEmailReviewSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
