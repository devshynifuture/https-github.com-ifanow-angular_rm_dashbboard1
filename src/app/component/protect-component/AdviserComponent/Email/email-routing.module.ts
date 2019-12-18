import { EmailListComponent } from './email-component/email-list/email-list.component';
import { EmailComponent } from './email-component/email.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailSentComponent } from './email-component/email-sent/email-sent.component';
import { EmailDraftComponent } from './email-component/email-draft/email-draft.component';
import { EmailArchiveComponent } from './email-component/email-archive/email-archive.component';
import { EmailTrashComponent } from './email-component/email-trash/email-trash.component';
import { EmailViewComponent } from './email-component/email-list/email-view/email-view.component';


const routes: Routes = [
  {
    path: '',
    component: EmailComponent,
    children: [
      {
        path: 'inbox',
        loadChildren: () => import('./email-component/email-list/email-list.module')
          .then(m => m.EmailListModule)
      },
      {
        path: 'sent',
        loadChildren: () => import('./email-component/email-list/email-list.module')
          .then(m => m.EmailListModule)
      },
      {
        path: 'draft',
        loadChildren: () => import('./email-component/email-list/email-list.module')
          .then(m => m.EmailListModule)
        // component: EmailDraftComponent
      },
      {
        path: 'archive',
        component: EmailArchiveComponent
      },
      {
        path: 'trash',
        loadChildren: () => import('./email-component/email-list/email-list.module')
          .then(m => m.EmailListModule)
      },
      {
        path: '',
        redirectTo: 'inbox',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailRoutingModule { }
