import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSharebleLinkComponent } from './get-shareble-link.component';

describe('GetSharebleLinkComponent', () => {
  let component: GetSharebleLinkComponent;
  let fixture: ComponentFixture<GetSharebleLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetSharebleLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetSharebleLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
