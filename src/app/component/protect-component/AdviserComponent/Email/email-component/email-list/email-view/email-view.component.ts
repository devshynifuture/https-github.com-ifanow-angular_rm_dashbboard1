import {AuthService} from './../../../../../../../auth-service/authService';
import {EventService} from './../../../../../../../Data-service/event.service';
import {ComposeEmailComponent} from './../../compose-email/compose-email.component';

import {Component, OnDestroy, OnInit} from '@angular/core';
import {EmailServiceService} from '../../../email-service.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {EmailReplyComponent} from '../email-reply/email-reply.component';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs';
import {EmailUtilService} from 'src/app/services/email-util.service';
import {ActivatedRoute, Router} from '@angular/router';

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
  isLoading = false;
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
  isAttachmentBasedEmail = false;
  isLoadingForAttachment: boolean;

  constructor(private emailService: EmailServiceService,
              private _bottomSheet: MatBottomSheet,
              private location: Location,
              private eventService: EventService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

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
    this.isLoading = true;
    this.isAttachmentBasedEmail = true;
    this.emailService.gmailMessageDetail(id)
      .subscribe((response) => {
        this.isLoading = false;
        console.log('detailed message::', response);
        // gmail api explorer based integration
        const {id} = response;
        this.messageId = id;

        const {payload: {headers}} = response;
        const {payload: {parts}} = response;
        if (response.payload.body !== null) {
          if (response.payload.mimeType === 'text/html') {
            this.decodedPartsDetail.push({
              item: EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(response.payload.body.data),
            });
          } else if (response.payload.mimeType === 'multipart/mixed') {
            if (parts && parts.length !== 0) {
              parts.forEach(multiPartElement => {
                if (multiPartElement.mimeType === 'multipart/alternative') {
                  if (multiPartElement.parts && multiPartElement.parts.length !== 0) {
                    multiPartElement.parts.forEach(multiPartAlternativeElement => {
                      if (multiPartAlternativeElement.mimeType === 'text/html') {
                        this.decodedPartsDetail.push({
                          item: EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(multiPartAlternativeElement.body.data),
                        });
                      }
                    });
                  }
                } else if (multiPartElement.mimeType === 'text/html') {
                  this.decodedPartsDetail.push({
                    item: EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(multiPartElement.body.data),
                  });
                }
              });
            }
          } else if (response.payload.mimeType === 'multipart/alternative') {

            if (response.payload.hasOwnProperty('parts') && response.payload.parts.length !== 0) {
              response.payload.parts.forEach(multiPartAlternativeElement => {
                if (multiPartAlternativeElement.mimeType === 'text/html') {
                  this.decodedPartsDetail.push({
                    item: EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(multiPartAlternativeElement.body.data),
                  });
                }
              });
            }
          } else {
            if (response.payload.hasOwnProperty('parts') && response.payload.parts.length !== 0) {
              response.payload.parts.forEach(part => {
                const {parts} = part;
                if (part.body.data !== null) {
                  this.decodedPartsDetail.push({
                    item: EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(part.body.data),
                  });
                }
                if (part.parts && part.parts.length !== 0) {
                  parts.forEach(part => {
                    const {parts} = part;
                    if (part.body.data !== null) {
                      this.decodedPartsDetail.push({
                        item: EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(part.body.data),
                      });
                    }
                    if (part.parts && part.parts.length !== 0) {
                      parts.forEach(part => {
                        const {parts} = part;
                        if (part.body.data !== null) {
                          this.decodedPartsDetail.push({
                            item: EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(part.body.data),
                          });
                        }
                        if (part.parts && part.parts.length !== 0) {
                          parts.forEach(part => {
                            if (part.body.data !== null) {
                              this.decodedPartsDetail.push({
                                item: EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(part.body.data),
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          }

          if (parts && parts.length != 0) {
            this.isLoadingForAttachment = true;
            parts.forEach((part, index) => {
              if (part.filename !== null) {
                const obj = {
                  userId: AuthService.getUserInfo().advisorId,
                  email: AuthService.getUserInfo().userName,
                  attachmentId: part.body.attachmentId,
                  messageId: this.messageId
                };
                this.emailService.getAttachmentFiles(obj).subscribe(res => {
                  if (res) {
                    const resBase64 = res.data.replace(/\-/g, '+').replace(/_/g, '/');
                    this.creationOfUrlAndBase64File(resBase64, part);
                  }
                  if (index === (parts.length - 1)) {
                    this.isLoadingForAttachment = false;
                  }
                });
              }
            });
          }

        }

        headers.forEach(header => {
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
          if (header.name === 'To') {
            this.toDetailMessage = header.value;
          }
        });

        console.log('this is detailed view json::', this.decodedPartsDetail);

      });
  }

  creationOfUrlAndBase64File(resBase64, part) {
    const blobData = EmailUtilService.convertBase64ToBlobData(resBase64, part.mimeType);

    if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE
      window.navigator.msSaveOrOpenBlob(blobData, part.filename);
    } else { // chrome
      const blob = new Blob([blobData], {type: part.mimeType});
      const url = window.URL.createObjectURL(blob);
      // window.open(url);

      this.attachmentArrayDetail.push({
        filename: part.filename,
        downloadUrl: url
      });
    }
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
      console.log('this is what im getting from listing:::', this.emailObj);
      if (!this.emailObj) {
        this.eventService.openSnackBar('No email data !', 'Dismiss');
        this.router.navigate(['../'], {relativeTo: this.activatedRoute});
      }
      if (this.emailObj) {

        if (this.emailObj.parsedData.decodedPart.length === 0 || (!this.ifDecodedPartIsEmptyString())) {
          this.emailObj.idsOfMessages.forEach((element, index) => {
            const id = element;
            this.getGmailDetailMessageRaw(id);
          });
        }
        const {parsedData: {headers}} = this.emailObj;

        const {messageHeaders} = this.emailObj;
        this.messagesHeaders = messageHeaders;

        const subject = headers.filter((header) => {
          return header.name === 'Subject';
        });

        const from = headers.filter((header) => {
          return header.name === 'From';
        });

        const {parsedData: {decodedPart}} = this.emailObj;
        this.decodedPart = decodedPart;

        const {messageDates} = this.emailObj;

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
          return {item, date: messageDates[index]};
        });

        this.body = extractHtmlValue;

        this.subject = subject[0].value;
        this.from = from[0].value;

      }
    });
  }

  replyToMessage(part) {
  }

  forwardMessage(part) {
  }

  moveMessageToTrash() {
    // id param to work on
    const messageToTrashSubscription = this.emailService.moveMessageToTrashFromView()
      .subscribe(response => {
          messageToTrashSubscription.unsubscribe();
        },
        err => {
          console.error(err);
          this.eventService.showErrorMessage(err);
        });
  }

  moveMessageFromTrash() {
    // need to pass ids
    const messageFromTrashSubscription = this.emailService.moveMessagesFromTrashToList()
      .subscribe(response => {
          messageFromTrashSubscription.unsubscribe();
        },
        error => {
          console.error(error);
          this.eventService.openSnackBar('Something Went wrong', 'DISMISS');
        });
  }

  deleteMessageFromView() {
    // need to pass ids
    const deleteMessageSubscription = this.emailService.deleteMessageFromView().subscribe(response => {
      deleteMessageSubscription.unsubscribe();
    }, error => {
      console.error(error);
      this.eventService.openSnackBar('Something Went wrong', 'DISMISS');
    });
  }

  openBottomSheet() {
    this._bottomSheet.open(EmailReplyComponent);
  }

  openEmailAddTask(data) {
    this.emailService.openEmailAddTask(data, ComposeEmailComponent);
  }

  goBack() {
    this.location.back();
  }


}
