import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonalAccidentInAssetComponent } from './add-personal-accident-in-asset.component';

describe('AddPersonalAccidentInAssetComponent', () => {
  let component: AddPersonalAccidentInAssetComponent;
  let fixture: ComponentFixture<AddPersonalAccidentInAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPersonalAccidentInAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPersonalAccidentInAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
