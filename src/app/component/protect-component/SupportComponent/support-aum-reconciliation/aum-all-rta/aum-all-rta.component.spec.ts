import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AumAllRtaComponent } from './aum-all-rta.component';

describe('AumAllRtaComponent', () => {
  let component: AumAllRtaComponent;
  let fixture: ComponentFixture<AumAllRtaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumAllRtaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AumAllRtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
