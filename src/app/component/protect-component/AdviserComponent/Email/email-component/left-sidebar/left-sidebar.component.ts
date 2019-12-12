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
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.emailService.getRightSideNavList().subscribe(responseData => {
      this.navList = responseData;
      console.log('this is nav List ->>', this.navList);
    });
  }

  getFileDetails(e) {
    console.log('LeftSidebarComponent getFileDetails e : ', e.target.files[0]);
    const singleFile = e.target.files[0];

    const fileData = [];

    EmailUtilService.getBase64FromFile(singleFile, (successData) => {
      fileData.push({
        filename: singleFile.name,
        size: singleFile.size,
        mimeType: singleFile.type,
        data: successData
      });
      this.createUpdateDraft(null, ['gaurav@futurewise.co.in'],
        'This is a test message', 'This is a test message body', fileData);
    });

  }

  createUpdateDraft(id: string, toAddress: Array<any>, subject: string, bodyMessage: string, fileData: Array<any>) {

    const requestJson = {
      id,
      toAddress,
      subject,
      message: bodyMessage,
      fileData
    };

    console.log('LeftSidebarComponent createUpdateDraft requestJson : ', requestJson);
    this.emailService.createUpdateDraft(requestJson).subscribe((responseJson) => {
    }, (error) => {
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
    this.emailService.openComposeEmail(null);
  }

}
