import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoSavingsMobComponent } from './po-savings-mob.component';

describe('PoSavingsMobComponent', () => {
  let component: PoSavingsMobComponent;
  let fixture: ComponentFixture<PoSavingsMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoSavingsMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSavingsMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
