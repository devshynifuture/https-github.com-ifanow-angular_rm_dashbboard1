import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiabilitiesComponent } from './liabilities.component';


const routes: Routes = [{ path: '', component: LiabilitiesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiabilitiesRoutingModule { }
