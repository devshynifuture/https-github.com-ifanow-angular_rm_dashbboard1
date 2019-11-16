import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScssComponent } from './add-scss.component';

describe('AddScssComponent', () => {
  let component: AddScssComponent;
  let fixture: ComponentFixture<AddScssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddScssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
