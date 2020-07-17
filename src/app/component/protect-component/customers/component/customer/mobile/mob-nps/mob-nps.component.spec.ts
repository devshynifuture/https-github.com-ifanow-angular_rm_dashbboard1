import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobNpsComponent } from './mob-nps.component';

describe('MobNpsComponent', () => {
  let component: MobNpsComponent;
  let fixture: ComponentFixture<MobNpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobNpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobNpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
