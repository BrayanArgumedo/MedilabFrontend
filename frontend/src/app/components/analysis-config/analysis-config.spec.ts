import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisConfig } from './analysis-config';

describe('AnalysisConfig', () => {
  let component: AnalysisConfig;
  let fixture: ComponentFixture<AnalysisConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
