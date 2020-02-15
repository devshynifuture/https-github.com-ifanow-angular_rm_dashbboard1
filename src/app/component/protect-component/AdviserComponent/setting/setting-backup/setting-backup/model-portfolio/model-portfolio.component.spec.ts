import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPortfolioComponent } from './model-portfolio.component';

describe('ModelPortfolioComponent', () => {
  let component: ModelPortfolioComponent;
  let fixture: ComponentFixture<ModelPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
