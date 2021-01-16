import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarAccountAndBllingComponent } from './top-bar-account-and-blling.component';

describe('TopBarAccountAndBllingComponent', () => {
  let component: TopBarAccountAndBllingComponent;
  let fixture: ComponentFixture<TopBarAccountAndBllingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopBarAccountAndBllingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarAccountAndBllingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
