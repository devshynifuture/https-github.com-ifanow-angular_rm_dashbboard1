import { BlogComponent } from "./blog/blog.component";
import { NewReleaseNoteComponent } from "./new-release-note/new-release-note.component";
import { RaiseSupportTicketComponent } from "./raise-support-ticket/raise-support-ticket.component";
import { TipsAndTricksComponent } from "./tips-and-tricks/tips-and-tricks.component";
import { KnowledgeBaseComponent } from "./knowledge-base/knowledge-base.component";
import { SettingSupportComponent } from "./setting-support.component";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

const routes = [
  {
    path: "",
    component: SettingSupportComponent,
    children: [
      {
        path: "pricing",
        loadChildren: () =>
          import(
            "./setting-support-pricing/setting-support-pricing.module"
          ).then((m) => m.SettingSupportPricingModule),
      },
      { path: "knowledge-base", component: KnowledgeBaseComponent },
      { path: "tips-and-tricks", component: TipsAndTricksComponent },
      { path: "raise-support-ticket", component: RaiseSupportTicketComponent },
      { path: "new-release-note", component: NewReleaseNoteComponent },
      { path: "blog", component: BlogComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingSupportRoutingModule {}
