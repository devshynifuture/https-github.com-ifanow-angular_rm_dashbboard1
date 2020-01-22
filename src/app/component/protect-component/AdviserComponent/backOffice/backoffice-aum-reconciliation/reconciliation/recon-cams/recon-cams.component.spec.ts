import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconCamsComponent } from './recon-cams.component';

describe('ReconCamsComponent', () => {
  let component: ReconCamsComponent;
  let fixture: ComponentFixture<ReconCamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconCamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconCamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
