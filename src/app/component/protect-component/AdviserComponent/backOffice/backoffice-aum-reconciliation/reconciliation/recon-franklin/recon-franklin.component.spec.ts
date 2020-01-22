import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconFranklinComponent } from './recon-franklin.component';

describe('ReconFranklinComponent', () => {
  let component: ReconFranklinComponent;
  let fixture: ComponentFixture<ReconFranklinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconFranklinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconFranklinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
