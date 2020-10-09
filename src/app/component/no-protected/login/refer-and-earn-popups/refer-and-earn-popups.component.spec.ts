import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferAndEarnPopupsComponent } from './refer-and-earn-popups.component';

describe('ReferAndEarnPopupsComponent', () => {
  let component: ReferAndEarnPopupsComponent;
  let fixture: ComponentFixture<ReferAndEarnPopupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferAndEarnPopupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferAndEarnPopupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
