import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitReviewInnComponent } from './submit-review-inn.component';

describe('SubmitReviewInnComponent', () => {
  let component: SubmitReviewInnComponent;
  let fixture: ComponentFixture<SubmitReviewInnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitReviewInnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitReviewInnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
