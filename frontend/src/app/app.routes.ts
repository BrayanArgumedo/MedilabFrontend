//src/app/app.routes.ts
import { Routes } from '@angular/router';
import { SolverComponent } from './pages/solver/solver';
import { HistoryComponent } from './pages/history/history';
import { CompareComponent } from './pages/compare/compare';

export const routes: Routes = [
  { path: '', redirectTo: 'solver', pathMatch: 'full' },
  { path: 'solver', component: SolverComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'compare', component: CompareComponent },
  { path: '**', redirectTo: 'solver' }
];