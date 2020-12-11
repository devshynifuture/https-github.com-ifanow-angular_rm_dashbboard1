import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersAssetsComponent } from './others-assets.component';

describe('OthersAssetsComponent', () => {
  let component: OthersAssetsComponent;
  let fixture: ComponentFixture<OthersAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OthersAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
