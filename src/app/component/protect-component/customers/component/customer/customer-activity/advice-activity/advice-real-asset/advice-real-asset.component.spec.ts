import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceRealAssetComponent } from './advice-real-asset.component';

describe('AdviceRealAssetComponent', () => {
  let component: AdviceRealAssetComponent;
  let fixture: ComponentFixture<AdviceRealAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceRealAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceRealAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
