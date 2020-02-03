import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAdviceCommoditiesComponent } from './all-advice-commodities.component';

describe('AllAdviceCommoditiesComponent', () => {
  let component: AllAdviceCommoditiesComponent;
  let fixture: ComponentFixture<AllAdviceCommoditiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAdviceCommoditiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAdviceCommoditiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
