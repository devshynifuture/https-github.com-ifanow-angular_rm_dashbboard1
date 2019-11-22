import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScenariosComponent } from './add-scenarios.component';

describe('AddScenariosComponent', () => {
  let component: AddScenariosComponent;
  let fixture: ComponentFixture<AddScenariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddScenariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
