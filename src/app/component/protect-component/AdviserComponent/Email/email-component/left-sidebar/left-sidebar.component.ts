import { ComposeEmailComponent } from './../compose-email/compose-email.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailServiceService } from './../../email-service.service';
import { Component, OnInit } from '@angular/core';
import { EmailUtilService } from "../../../../../../services/email-util.service";

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
  navList;

  constructor(private emailService: EmailServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private emailUtilService: EmailUtilService) {
  }
  importantCount = 0;
  sentCount = 0;
  draftCount = 0;
  trashCount = 0;

  ngOnInit() {
    this.emailService.getRightSideNavList().subscribe(responseData => {
      this.navList = responseData;
      console.log("check navlist :::", this.navList);
      if (this.navList.length !== 0) {
        this.navList.forEach(element => {
          if (element.labelId === 'IMPORTANT') {
            this.importantCount = element.threadsTotal;
          }
          if (element.labelId === 'SENT') {
            this.sentCount = element.threadsTotal;
          }
          if (element.labelId === 'DRAFT') {
            this.draftCount = element.threadsTotal;
          }
          if (element.labelId === 'THRASH') {
            this.trashCount = element.threadsTotal;
          }
        });
      }
      this.emailUtilService.sendLabelCount({
        sentCount: this.sentCount,
        importantCount: this.importantCount,
        draftCount: this.draftCount,
        trashCount: this.trashCount
      });
    });
  }



  loadList(obj) {
    switch (obj.name.toLowerCase()) {
      case 'inbox':
        this.router.navigate(['inbox'], { relativeTo: this.activatedRoute });
        break;
      case 'sent':
        this.router.navigate(['sent'], { relativeTo: this.activatedRoute });
        break;
      case 'draft':
        this.router.navigate(['draft'], { relativeTo: this.activatedRoute });
        break;
      case 'trash':
        this.router.navigate(['trash'], { relativeTo: this.activatedRoute });
        break;
      // case 'spam': this.router.navigate(['spam'], { relativeTo: this.activatedRoute });
      //   break;
      default:
        this.router.navigate(['inbox'], { relativeTo: this.activatedRoute });
    }
  }

  openCompose() {
    this.emailService.openComposeEmail(null, ComposeEmailComponent, 'email');
  }

}
