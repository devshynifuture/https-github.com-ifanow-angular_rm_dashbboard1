import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePortfoiloComponent } from './mobile-portfoilo.component';

describe('MobilePortfoiloComponent', () => {
  let component: MobilePortfoiloComponent;
  let fixture: ComponentFixture<MobilePortfoiloComponent>;
 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilePortfoiloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilePortfoiloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
