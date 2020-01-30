import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceAssetsComponent } from './advice-assets.component';

describe('AdviceAssetsComponent', () => {
  let component: AdviceAssetsComponent;
  let fixture: ComponentFixture<AdviceAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
