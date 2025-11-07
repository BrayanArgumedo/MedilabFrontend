import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolverForm } from './solver-form';

describe('SolverForm', () => {
  let component: SolverForm;
  let fixture: ComponentFixture<SolverForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolverForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolverForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
