import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkEmailTestComponent } from './bulk-email-test.component';

describe('BulkEmailTestComponent', () => {
  let component: BulkEmailTestComponent;
  let fixture: ComponentFixture<BulkEmailTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkEmailTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkEmailTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
