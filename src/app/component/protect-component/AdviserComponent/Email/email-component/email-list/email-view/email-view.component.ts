// import { EmailUtilService } from './../../../../../../../services/email-util.service';
import { ComposeEmailComponent } from './../../compose-email/compose-email.component';
import { Router, ActivatedRoute } from '@angular/router';
// import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
// import { UtilService } from '../../../../../../../services/util.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmailServiceService } from '../../../email-service.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EmailReplyComponent } from '../email-reply/email-reply.component';
// import { EmailAddTaskComponent } from '../email-add-task/email-add-task.component';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss']
})
export class EmailViewComponent implements OnInit, OnDestroy {
  emailObj: any = null;
  subject: string;
  from: string;
  body;
  emailSubscription: Subscription;
  messagesHeaders: string[];

  constructor(private emailService: EmailServiceService,
    private _bottomSheet: MatBottomSheet,
    private route: Router,
    private location: Location) { }

  ngOnInit() {
    this.getEmailThread();
  }

  ngOnDestroy() {
    this.emailSubscription.unsubscribe();
  }

  getEmailThread() {
    this.emailSubscription = this.emailService.data.subscribe(response => {
      this.emailObj = response;

      console.log("this is email Object passed from list component ->>>  ", this.emailObj);
      if (this.emailObj) {

        let { parsedData: { headers } } = this.emailObj;

        let { messageHeaders } = this.emailObj;
        this.messagesHeaders = messageHeaders;

        let subject = headers.filter((header) => {
          return header.name === 'Subject';
        });

        let from = headers.filter((header) => {
          return header.name === 'From';
        })

        let { parsedData: { decodedPart } } = this.emailObj;

        let { messageDates } = this.emailObj;

        console.log("this are message dates", messageDates);
        console.log("this is decoded part : >>>>>", decodedPart);

        let extractHtmlValue = decodedPart.filter((part, index) => {
          if (index % 2 === 1) {
            return part;
          }
        });

        extractHtmlValue = extractHtmlValue.map((item, index) => {
          return { item, date: messageDates[index] }
        })

        this.body = extractHtmlValue;

        console.log(this.body);

        console.log('this is single thread response ->>>>>>>>>>>>>')

        console.log(response);

        this.subject = subject[0]['value'];
        this.from = from[0]['value'];
        // console.log(response);

      }
    });
  }

  moveMessageToTrash() {
    // id param to work on
    const messageToTrashSubscription = this.emailService.moveMessageToTrashFromView()
      .subscribe(response => {
        console.log(response);
        messageToTrashSubscription.unsubscribe();
      },
        error => {
          console.log(error);
        })
  }

  moveMessageFromTrash() {
    // need to pass ids
    const messageFromTrashSubscription = this.emailService.moveMessagesFromTrashToList()
      .subscribe(response => {
        console.log(response);
        messageFromTrashSubscription.unsubscribe();
      },
        error => {
          console.log(error);
        });
  }

  deleteMessageFromView() {
    // need to pass ids
    const deleteMessageSubscription = this.emailService.deleteMessageFromView().subscribe(response => {
      console.log(response);
      deleteMessageSubscription.unsubscribe();
    }, error => console.log(error));
  }

  openBottomSheet() {
    this._bottomSheet.open(EmailReplyComponent);
  }

  openEmailAddTask(data) {
    this.emailService.openEmailAddTask(data, ComposeEmailComponent);
  }

  openComposeEmail(data) {
    this.emailService.openComposeEmail(data, ComposeEmailComponent);
  }

  goBack() {
    this.location.back();
  }


}
