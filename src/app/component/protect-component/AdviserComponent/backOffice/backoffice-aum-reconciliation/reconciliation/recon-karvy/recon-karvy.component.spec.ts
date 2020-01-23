import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconKarvyComponent } from './recon-karvy.component';

describe('ReconKarvyComponent', () => {
  let component: ReconKarvyComponent;
  let fixture: ComponentFixture<ReconKarvyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconKarvyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconKarvyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
