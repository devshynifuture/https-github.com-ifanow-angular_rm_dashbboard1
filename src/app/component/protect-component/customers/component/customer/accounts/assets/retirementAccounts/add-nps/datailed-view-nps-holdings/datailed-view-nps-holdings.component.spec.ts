import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatailedViewNpsHoldingsComponent } from './datailed-view-nps-holdings.component';

describe('DatailedViewNpsHoldingsComponent', () => {
  let component: DatailedViewNpsHoldingsComponent;
  let fixture: ComponentFixture<DatailedViewNpsHoldingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatailedViewNpsHoldingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatailedViewNpsHoldingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
