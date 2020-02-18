import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModelPortfolioComponent } from './add-model-portfolio.component';

describe('AddModelPortfolioComponent', () => {
  let component: AddModelPortfolioComponent;
  let fixture: ComponentFixture<AddModelPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddModelPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModelPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
