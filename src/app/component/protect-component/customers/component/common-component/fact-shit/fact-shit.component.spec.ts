import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactShitComponent } from './fact-shit.component';

describe('FactShitComponent', () => {
  let component: FactShitComponent;
  let fixture: ComponentFixture<FactShitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactShitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactShitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
