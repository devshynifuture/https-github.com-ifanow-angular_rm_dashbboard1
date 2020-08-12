import { SettingSupportComponent } from "./setting-support.component";
import { MaterialModule } from "./../../../../material/material";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SettingSupportRoutingModule } from "./setting-support-routing.module";
import { KnowledgeBaseComponent } from "./knowledge-base/knowledge-base.component";
import { NewReleaseNoteComponent } from "./new-release-note/new-release-note.component";
import { BlogComponent } from "./blog/blog.component";
import { TipsAndTricksComponent } from "./tips-and-tricks/tips-and-tricks.component";
import { RaiseSupportTicketComponent } from "./raise-support-ticket/raise-support-ticket.component";

@NgModule({
  declarations: [
    SettingSupportComponent,
    KnowledgeBaseComponent,
    NewReleaseNoteComponent,
    BlogComponent,
    TipsAndTricksComponent,
    RaiseSupportTicketComponent,
  ],
  imports: [CommonModule, MaterialModule, SettingSupportRoutingModule],
  exports: [],
})
export class SettingSupportModule {}
