import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOthersAssetComponent } from './add-others-asset.component';

describe('AddOthersAssetComponent', () => {
  let component: AddOthersAssetComponent;
  let fixture: ComponentFixture<AddOthersAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOthersAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOthersAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
