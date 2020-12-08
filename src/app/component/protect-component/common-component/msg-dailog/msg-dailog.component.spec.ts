import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgDailogComponent } from './msg-dailog.component';

describe('MsgDailogComponent', () => {
  let component: MsgDailogComponent;
  let fixture: ComponentFixture<MsgDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
