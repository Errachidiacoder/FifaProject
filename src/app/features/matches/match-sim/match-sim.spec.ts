import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSim } from './match-sim';

describe('MatchSim', () => {
  let component: MatchSim;
  let fixture: ComponentFixture<MatchSim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchSim]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchSim);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
