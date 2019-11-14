import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNPSComponent } from './add-nps.component';

describe('AddNPSComponent', () => {
  let component: AddNPSComponent;
  let fixture: ComponentFixture<AddNPSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNPSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNPSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
