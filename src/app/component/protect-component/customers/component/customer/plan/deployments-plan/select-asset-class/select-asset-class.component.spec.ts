import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAssetClassComponent } from './select-asset-class.component';

describe('SelectAssetClassComponent', () => {
  let component: SelectAssetClassComponent;
  let fixture: ComponentFixture<SelectAssetClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAssetClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAssetClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
