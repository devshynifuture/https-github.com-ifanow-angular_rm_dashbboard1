import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstatePropertyComponent } from './real-estate-property.component';

describe('RealEstatePropertyComponent', () => {
  let component: RealEstatePropertyComponent;
  let fixture: ComponentFixture<RealEstatePropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealEstatePropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealEstatePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
