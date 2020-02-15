import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArnRiaDetailsComponent } from './arn-ria-details.component';

describe('ArnRiaDetailsComponent', () => {
  let component: ArnRiaDetailsComponent;
  let fixture: ComponentFixture<ArnRiaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArnRiaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArnRiaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
