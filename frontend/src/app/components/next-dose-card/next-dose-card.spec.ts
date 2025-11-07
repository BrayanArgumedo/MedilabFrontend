import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextDoseCard } from './next-dose-card';

describe('NextDoseCard', () => {
  let component: NextDoseCard;
  let fixture: ComponentFixture<NextDoseCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextDoseCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextDoseCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
