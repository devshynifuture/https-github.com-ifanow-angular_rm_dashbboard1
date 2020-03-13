import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewNpsComponent } from './detailed-view-nps.component';

describe('DetailedViewNpsComponent', () => {
  let component: DetailedViewNpsComponent;
  let fixture: ComponentFixture<DetailedViewNpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewNpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewNpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
