import { ComposeEmailComponent } from './../compose-email/compose-email.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailServiceService } from './../../email-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {

  constructor(private emailService: EmailServiceService) { }


  ngOnInit() {
  }

  // loadList(obj) {
  //   switch (obj.name.toLowerCase()) {
  //     case 'inbox':
  //       this.router.navigate(['inbox'], { relativeTo: this.activatedRoute });
  //       break;
  //     case 'sent':
  //       this.router.navigate(['sent'], { relativeTo: this.activatedRoute });
  //       break;
  //     case 'draft':
  //       this.router.navigate(['draft'], { relativeTo: this.activatedRoute });
  //       break;
  //     case 'trash':
  //       this.router.navigate(['trash'], { relativeTo: this.activatedRoute });
  //       break;
  //     // case 'spam': this.router.navigate(['spam'], { relativeTo: this.activatedRoute });
  //     //   break;
  //     default:
  //       this.router.navigate(['inbox'], { relativeTo: this.activatedRoute });
  //   }
  // }

  openCompose() {
    this.emailService.openComposeEmail(null, ComposeEmailComponent, 'email');
  }

}
