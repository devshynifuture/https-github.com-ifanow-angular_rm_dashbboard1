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
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

import { saveAs } from 'file-saver';

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
  private _htmlString: string;
  downloadFilePath: string;
  generatedImage: string;

  constructor(private emailService: EmailServiceService,
    private _bottomSheet: MatBottomSheet,
    private location: Location,
    private eventService: EventService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _sanitizer: DomSanitizer) { }

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

  convertBase64ToBlobData(base64Data: string, contentType: string, sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  getGmailDetailMessageRaw(id) {

    this.emailService.gmailMessageDetail(id)
      .subscribe((response) => {

        this.raw = EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(response.raw);
        let fileData = this.extractValuesFromDetailView();
        this.attachmentBase64 = "data: image/jpeg; base64," + this.raw.match(/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/gm);
        let base64Data = this.raw.match(/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/gm).join("")
        // let fileDataObj = {
        //   ...fileData,
        //   base64: base64Data,
        //   fileContent: this.attachmentBase64
        // }
        // if()
        let blobData = this.convertBase64ToBlobData(base64Data, fileData.fileType);
        if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
          window.navigator.msSaveOrOpenBlob(blobData, fileData.fileName);
        } else { // chrome
          const blob = new Blob([blobData], { type: fileData.fileType });
          const url = window.URL.createObjectURL(blob);
          // window.open(url);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileData.fileName;
          link.click();
        }

        this.isLoading = false;

        // this.attachmentBase64Code = this.raw.forEach(part => {
        //   part.item
        // });


      });
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

  extractValuesFromDetailView() {

    let base64Value = this.raw.split('Content-ID')[1];
    let messageValue = this.raw.split('Content-ID')[0];
    let lastContentTypeIndex = messageValue.lastIndexOf('Content-Type');
    let nameIndex = messageValue.indexOf('name');
    let fileTypeString = messageValue.slice(lastContentTypeIndex, nameIndex).split(":")[1].slice(0, -2);

    let filenameIndex = messageValue.indexOf('filename');
    let contentTransferIndex = messageValue.indexOf('Content-Transfer');
    let filenameString = messageValue.slice(filenameIndex, contentTransferIndex).split('=')[1].slice(1, -3);
    console.log("this is filename ::::::::::::::", filenameString, fileTypeString);

    return { fileName: filenameString, fileType: fileTypeString }

    // while ((m = keyValueRegex.exec(messageValue)) !== null) {
    //   keys.push(m[1]);
    //   values.push(m[2]);
    // }

    // console.log(keys);
    // console.log(values);
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
