import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathProcedure } from './math-procedure';

describe('MathProcedure', () => {
  let component: MathProcedure;
  let fixture: ComponentFixture<MathProcedure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathProcedure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MathProcedure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
