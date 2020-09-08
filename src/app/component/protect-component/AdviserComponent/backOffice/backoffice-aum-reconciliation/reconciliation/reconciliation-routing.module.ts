import { ReconFranklinComponent } from './recon-franklin/recon-franklin.component';
import { ReconKarvyComponent } from './recon-karvy/recon-karvy.component';
import { ReconCamsComponent } from './recon-cams/recon-cams.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReconciliationComponent } from './reconciliation.component';


const routes: Routes = [
  {
    path: '',
    component: ReconciliationComponent,
    children: [
      { path: 'cams', component: ReconCamsComponent },
      { path: 'karvy', component: ReconKarvyComponent },
      { path: 'franklin', component: ReconFranklinComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReconciliationRoutingModule { }
