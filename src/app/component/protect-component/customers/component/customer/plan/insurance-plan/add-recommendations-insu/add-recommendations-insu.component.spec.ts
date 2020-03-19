import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecommendationsInsuComponent } from './add-recommendations-insu.component';

describe('AddRecommendationsInsuComponent', () => {
  let component: AddRecommendationsInsuComponent;
  let fixture: ComponentFixture<AddRecommendationsInsuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRecommendationsInsuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecommendationsInsuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
