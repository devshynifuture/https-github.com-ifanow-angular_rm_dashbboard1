import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGratuityComponent } from './add-gratuity.component';

describe('AddGratuityComponent', () => {
  let component: AddGratuityComponent;
  let fixture: ComponentFixture<AddGratuityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGratuityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGratuityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
