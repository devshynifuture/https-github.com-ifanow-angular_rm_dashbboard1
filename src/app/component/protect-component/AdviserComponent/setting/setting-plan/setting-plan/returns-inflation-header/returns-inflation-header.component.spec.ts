import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnsInflationHeaderComponent } from './returns-inflation-header.component';

describe('ReturnsInflationHeaderComponent', () => {
  let component: ReturnsInflationHeaderComponent;
  let fixture: ComponentFixture<ReturnsInflationHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnsInflationHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnsInflationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
