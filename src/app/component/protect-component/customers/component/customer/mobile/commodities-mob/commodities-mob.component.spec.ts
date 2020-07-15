import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoditiesMobComponent } from './commodities-mob.component';

describe('CommoditiesMobComponent', () => {
  let component: CommoditiesMobComponent;
  let fixture: ComponentFixture<CommoditiesMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommoditiesMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoditiesMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
