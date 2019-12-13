import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioFieldComponent } from './portfolio-field.component';

describe('PortfolioFieldComponent', () => {
  let component: PortfolioFieldComponent;
  let fixture: ComponentFixture<PortfolioFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
