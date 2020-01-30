import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceAllPortfolioComponent } from './advice-all-portfolio.component';

describe('AdviceAllPortfolioComponent', () => {
  let component: AdviceAllPortfolioComponent;
  let fixture: ComponentFixture<AdviceAllPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceAllPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceAllPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
