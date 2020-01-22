import { EventService } from './../../../../../../../Data-service/event.service';
// import { EmailUtilService } from './../../../../../../../services/email-util.service';
import { ComposeEmailComponent } from './../../compose-email/compose-email.component';
// import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
// import { UtilService } from '../../../../../../../services/util.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmailServiceService } from '../../../email-service.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EmailReplyComponent } from '../email-reply/email-reply.component';
// import { EmailAddTaskComponent } from '../email-add-task/email-add-task.component';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { EmailUtilService } from 'src/app/services/email-util.service';
import { Router, ActivatedRoute } from '@angular/router';

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
  raw;
  emailSubscription: Subscription;
  isLoading: boolean = true;
  messagesHeaders: string[];

  constructor(private emailService: EmailServiceService,
    private _bottomSheet: MatBottomSheet,
    private location: Location,
    private eventService: EventService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getEmailThread();
  }

  ngOnDestroy() {
    this.emailSubscription.unsubscribe();
  }

  ifDecodedPartIsEmptyString() {
    if (JSON.stringify(this.emailObj.parsedData.decodedPart) === `[""]`) {
      return true;
    } else {
      return false;
    }
  }

  getGmailDetailMessageRaw(id) {

    this.emailService.gmailMessageDetail(id)
      .subscribe((response) => {

        console.log("this is response of detailed api:::::::::::::::", response)

        this.raw = EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(response.raw);
        this.isLoading = false;

        console.log('response of detailed gmail threadL:::::::', response);
        console.log("this is raw of detail api...::::::::::::", this.raw);

      });
  }

  getEmailThread() {
    this.emailSubscription = this.emailService.data.subscribe(response => {
      this.emailObj = response;
      if (!this.emailObj) {
        this.eventService.openSnackBar("No Email Data !", "DISMISS");
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }
      console.log("this is email Object passed from list component ->>>  ", this.emailObj);
      if (this.emailObj) {

        if (this.emailObj.parsedData.decodedPart.length === 0 || this.ifDecodedPartIsEmptyString()) {
          this.emailObj.idsOfMessages.forEach((element, index) => {
            const id = element;
            this.getGmailDetailMessageRaw(id);

            console.log('detailed api data merged ::::::::', this.emailObj);
            //       console.log("this is result of async await", res);
            //       part.body.data = res;
          });
          // thread.messages.forEach((message) => {
          // const id = thread.id;
          // if (message.payload.parts !== null) {
          //   const newParts = message.payload.parts.map((part)=>{
          //     if(part.body.data === null){
          //       const res = this.getGmailDetailMessageRaw(id);
          //       console.log("this is result of async await", res);
          //       part.body.data = res;
          //     }
          //     return part
          //   });
          //   message.payload.parts = newParts;
          // }

          // if (message.payload.parts !== null){ 
          //   const newParts = message.payload.parts.map((part) => {
          //     if (part.body.data == null) {
          //       // get message object;
          //       console.log("tghi sus to debug:::::::::::::" ,part.body.data);
          //       this.emailService.gmailMessageDetail(id)
          //         .subscribe((response) => {
          //           const raw = EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(response.raw);
          //           // console.log('response of detailed gmail threadL:::::::', response);
          //           // console.log("this is raw of detail api...::::::::::::", raw);
          //           if(raw !== null){
          //             part.body.data = raw;
          //             console.log("this is raw value of detailed gmail thread::::::::::" ,raw)
          //             console.log("tghis is part boyd data of gmail thread :::::::::::;", part.body.data);
          //           }
          //         });
          //     }
          //     return part;
          //   });
          //   message.payload.parts = newParts;
          // }
          // });
        }
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
