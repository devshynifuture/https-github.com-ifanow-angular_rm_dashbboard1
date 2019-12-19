import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviesComponent } from './activies.component';

describe('ActiviesComponent', () => {
  let component: ActiviesComponent;
  let fixture: ComponentFixture<ActiviesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiviesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
