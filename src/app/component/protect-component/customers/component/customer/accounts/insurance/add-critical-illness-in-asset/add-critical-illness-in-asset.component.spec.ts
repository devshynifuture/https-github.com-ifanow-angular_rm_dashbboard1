import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCriticalIllnessInAssetComponent } from './add-critical-illness-in-asset.component';

describe('AddCriticalIllnessInAssetComponent', () => {
  let component: AddCriticalIllnessInAssetComponent;
  let fixture: ComponentFixture<AddCriticalIllnessInAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCriticalIllnessInAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCriticalIllnessInAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
