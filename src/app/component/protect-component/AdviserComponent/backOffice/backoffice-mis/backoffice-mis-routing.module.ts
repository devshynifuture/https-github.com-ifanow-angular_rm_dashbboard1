import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackofficeMisComponent } from './backoffice-mis.component';

const routes: Routes = [
  {
    path: '',
    component: BackofficeMisComponent,
    children:
      [
        {
          path: 'mutual-funds',
          loadChildren: () => import('./mutual-funds/mutual-funds.module').then(m => m.MutualFundsModule)
        },
        {
          path: 'life-insurance',
          loadChildren: () => import('./mis-life-insurance/mis-life-insurance.module').then(m => m.MisLifeInsuranceModule)
        },
        {
          path: 'general-insurance',
          loadChildren: () => import('./mis-general-insurance/mis-general-insurance.module').then(m => m.MisGeneralInsuranceModule)
        },
        {
          path: '',
          redirectTo: 'mutual-funds',
          pathMatch: 'full'
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeMisRoutingModule { }
