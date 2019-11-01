import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityrightComponent } from './liabilityright.component';

describe('LiabilityrightComponent', () => {
  let component: LiabilityrightComponent;
  let fixture: ComponentFixture<LiabilityrightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiabilityrightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityrightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
