import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AumCamsComponent } from './aum-cams.component';

describe('AumCamsComponent', () => {
  let component: AumCamsComponent;
  let fixture: ComponentFixture<AumCamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumCamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AumCamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
