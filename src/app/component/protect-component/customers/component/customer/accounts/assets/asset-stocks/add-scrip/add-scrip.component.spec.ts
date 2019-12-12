import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScripComponent } from './add-scrip.component';

describe('AddScripComponent', () => {
  let component: AddScripComponent;
  let fixture: ComponentFixture<AddScripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddScripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
