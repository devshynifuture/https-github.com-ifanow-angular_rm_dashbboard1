import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileMyfeedComponent } from './mobile-myfeed.component';

describe('MobileMyfeedComponent', () => {
  let component: MobileMyfeedComponent;
  let fixture: ComponentFixture<MobileMyfeedComponent>; 

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileMyfeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileMyfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
