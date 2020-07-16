import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GratuityMobComponent } from './gratuity-mob.component';

describe('GratuityMobComponent', () => {
  let component: GratuityMobComponent;
  let fixture: ComponentFixture<GratuityMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GratuityMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GratuityMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
