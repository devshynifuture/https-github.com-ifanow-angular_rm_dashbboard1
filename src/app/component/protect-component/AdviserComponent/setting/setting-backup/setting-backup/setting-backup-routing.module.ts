import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingBackupComponent } from '../setting-backup.component';


const routes: Routes = [
  {
    path: '',
    component: SettingBackupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingBackupRoutingModule { }
