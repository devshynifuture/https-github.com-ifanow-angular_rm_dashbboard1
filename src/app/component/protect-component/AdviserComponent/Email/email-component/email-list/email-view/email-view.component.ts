import { AuthService } from './../../../../../../../auth-service/authService';
import { EventService } from './../../../../../../../Data-service/event.service';
// import { EmailUtilService } from './../../../../../../../services/email-util.service';
import { ComposeEmailComponent } from './../../compose-email/compose-email.component';
// import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
// import { UtilService } from '../../../../../../../services/util.service';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { EmailServiceService } from '../../../email-service.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EmailReplyComponent } from '../email-reply/email-reply.component';
// import { EmailAddTaskComponent } from '../email-add-task/email-add-task.component';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { EmailUtilService } from 'src/app/services/email-util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EventHandlerVars } from '@angular/compiler/src/compiler_util/expression_converter';
// import { DomSanitizer } from '@angular/platform-browser';


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
  attachmentBase64Code;
  emailSubscription: Subscription;
  isLoading: boolean = false;
  messagesHeaders: string[];
  decodedPart;
  attachmentBase64: string = null;
  downloadFilePath: string;
  generatedImage: string;
  attachmentArray: {}[] = [];
  deliveredTo: any;
  replyTo: any;
  date: any;
  fromDetailMessage: any;
  toDetailMessage: any;
  decodedPartsDetail: {}[] = [];
  attachmentsArray: { filename: string, mimeType: 'string', attachmentId: 'string' }[] = [];
  messageId: any;
  attachmentsData: any;
  attachmentsBase64Data: { filename: string, mimeType: 'string', base64Data: 'string' }[];
  attachmentArrayDetail: Array<any> = [];
  isAttachmentBasedEmail: boolean = false;

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
    this.isAttachmentBasedEmail = true;
    this.emailService.gmailMessageDetail(id)
      .subscribe((response) => {

        console.log("this is gmail detail message response::::", response);

        // gmail api explorer based integration
        const { id } = response;
        this.messageId = id;

        const { payload: { headers } } = response;
        const { payload: { parts } } = response;
        if (response.payload.body !== null) {
          if (response.payload.mimeType === 'text/html') {
            this.decodedPartsDetail.push({
              item: EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(response.payload.body.data),
            })
          }
        }
        headers.forEach(header => {
          console.log(header);
          if (header.name === 'Delivered-To') {
            this.deliveredTo = header.value;
          }

          if (header.name === 'Reply-To') {
            this.replyTo = header.value;
          }

          if (header.name === 'Date') {
            this.date = header.value;
          }
          if (header.name === 'Subject') {
            this.subject = header.value;
          }
          if (header.name === 'From') {
            this.fromDetailMessage = header.value;
          }
          if (header.name === "To") {
            this.toDetailMessage = header.value;
          }
        });

        if (parts !== null) {
          parts.forEach(part => {
            console.log("this is part::::::::::::", part);
            if (part.mimeType === 'text/html') {
              this.decodedPartsDetail.push({
                item: EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(part.body.data),
                date: this.date
              })
            }
            if (part.mimeType !== 'multipart/alternative') {

              if (part.filename !== null) {
                const obj = {
                  userId: AuthService.getUserInfo().advisorId,
                  email: AuthService.getUserInfo().emailId,
                  attachmentId: part.body.attachmentId,
                  messageId: this.messageId
                }

                this.emailService.getAttachmentFiles(obj).subscribe(res => {
                  const resBase64 = res.data.replace(/\-/g, '+').replace(/_/g, '/');
                  this.creationOfUrlAndBase64File(resBase64, part)

                });

              }
            } else if (part.mimeType === 'multipart/alternative') {
              if (part.parts !== null) {
                console.log("im here");
                const { parts } = part;
                parts.forEach(part => {
                  console.log("there is something going on here:::::::::::")
                  if (part.mimeType === 'text/html') {
                    this.decodedPartsDetail.push({
                      item: EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(part.body.data),
                      date: this.date
                    })
                  }
                });
              }
            }
          });
        }

        console.log(this.decodedPartsDetail);

      });
  }

  creationOfUrlAndBase64File(resBase64, part) {
    let blobData = EmailUtilService.convertBase64ToBlobData(resBase64, part.mimeType);

    if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
      window.navigator.msSaveOrOpenBlob(blobData, part.filename);
    } else { // chrome
      const blob = new Blob([blobData], { type: part.mimeType });
      const url = window.URL.createObjectURL(blob);
      // window.open(url);

      this.attachmentArrayDetail.push({
        filename: part.filename,
        downloadUrl: url
      });
    }
    console.log(this.attachmentArrayDetail);
  }

  attachmentDownload(element: any) {
    const link = document.createElement('a');
    link.href = element.downloadUrl;
    link.download = element.filename;
    link.click();
  }

  getEmailThread() {
    this.emailSubscription = this.emailService.data.subscribe(response => {
      this.emailObj = response;
      if (!this.emailObj) {
        this.eventService.openSnackBar("No Email Data !", "DISMISS");
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }
      if (this.emailObj) {

        if (this.emailObj.parsedData.decodedPart.length === 0 || this.ifDecodedPartIsEmptyString()) {
          this.emailObj.idsOfMessages.forEach((element, index) => {
            const id = element;
            this.getGmailDetailMessageRaw(id);
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
        this.decodedPart = decodedPart;

        let { messageDates } = this.emailObj;

        let extractHtmlValue;
        if (decodedPart.length > 2) {

          extractHtmlValue = decodedPart.filter((part, index) => {
            if (index % 2 === 1) {
              return part;
            }
          });

        } else {
          extractHtmlValue = decodedPart;
        }

        extractHtmlValue = extractHtmlValue.map((item, index) => {
          return { item, date: messageDates[index] }
        })

        this.body = extractHtmlValue;

        this.subject = subject[0]['value'];
        this.from = from[0]['value'];
        // console.log(response);

      }
    });
  }

  replyToMessage(part) {
    console.log("some values to handle", part)
  }

  forwardMessage(part) {
    console.log('needs to handle', part);
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
