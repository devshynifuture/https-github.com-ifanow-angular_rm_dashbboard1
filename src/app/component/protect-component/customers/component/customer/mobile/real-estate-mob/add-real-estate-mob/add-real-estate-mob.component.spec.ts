import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRealEstateMobComponent } from './add-real-estate-mob.component';

describe('AddRealEstateMobComponent', () => {
  let component: AddRealEstateMobComponent;
  let fixture: ComponentFixture<AddRealEstateMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRealEstateMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRealEstateMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
