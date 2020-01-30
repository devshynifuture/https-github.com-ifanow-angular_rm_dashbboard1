import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceLibilitiesComponent } from './advice-libilities.component';

describe('AdviceLibilitiesComponent', () => {
  let component: AdviceLibilitiesComponent;
  let fixture: ComponentFixture<AdviceLibilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceLibilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceLibilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
