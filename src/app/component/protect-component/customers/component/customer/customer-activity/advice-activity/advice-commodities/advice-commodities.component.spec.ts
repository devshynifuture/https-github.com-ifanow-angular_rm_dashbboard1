import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceCommoditiesComponent } from './advice-commodities.component';

describe('AdviceCommoditiesComponent', () => {
  let component: AdviceCommoditiesComponent;
  let fixture: ComponentFixture<AdviceCommoditiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceCommoditiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceCommoditiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
