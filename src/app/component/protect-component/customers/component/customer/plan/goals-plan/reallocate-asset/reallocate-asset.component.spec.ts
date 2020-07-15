import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReallocateAssetComponent } from './reallocate-asset.component';

describe('ReallocateAssetComponent', () => {
  let component: ReallocateAssetComponent;
  let fixture: ComponentFixture<ReallocateAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReallocateAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReallocateAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
