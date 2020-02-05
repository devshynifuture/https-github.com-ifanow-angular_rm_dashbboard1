import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfaDetailsComponent } from './ifa-details.component';

describe('IfaDetailsComponent', () => {
  let component: IfaDetailsComponent;
  let fixture: ComponentFixture<IfaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
