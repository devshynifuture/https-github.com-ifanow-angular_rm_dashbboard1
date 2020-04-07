import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyMoreInfoComponent } from './company-more-info.component';

describe('CompanyMoreInfoComponent', () => {
  let component: CompanyMoreInfoComponent;
  let fixture: ComponentFixture<CompanyMoreInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyMoreInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
