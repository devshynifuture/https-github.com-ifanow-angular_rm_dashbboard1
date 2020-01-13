import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from './../../../../../../../Data-service/event.service';
import { ComposeEmailComponent } from './../../compose-email/compose-email.component';
import { ConfirmDialogComponent } from './../../../../../common-component/confirm-dialog/confirm-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatDialog } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';

import { EmailServiceService } from './../../../email-service.service';
import { ExtractedGmailDataI, MessageListArray, GmailInboxResponseI } from '../../email.interface';
import { EmailUtilService } from 'src/app/services/email-util.service';

@Component({
  selector: 'app-email-listing',
  templateUrl: './email-listing.component.html',
  styleUrls: ['./email-listing.component.scss']
})
export class EmailListingComponent implements OnInit{


  constructor(
    private emailService: EmailServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private eventService: EventService,
    private authService: AuthService) { }

  paginatorLength;
  paginatorSubscription;
  gmailInboxListSubscription;
  gmailThreads: [];
  nextPageToken;
  messageDetailArray: GmailInboxResponseI[];
  messageListArray;
  dataSource = null;
  selectedThreadsArray: ExtractedGmailDataI[] = [];
  listSubscription = null;
  trashAction: boolean = false;
  showDraftView: boolean = false;

  displayedColumns: string[] = ['select', 'emailers', 'subjectMessage', 'date'];

  selection = new SelectionModel<MessageListArray>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    let location;
    console.log(this.router);

    if (this.router.url === '/') {
      location = 'inbox';
    } else {
      location = this.router.url.split('/')[3];
    }
    (location === 'trash') ? this.trashAction = true : this.trashAction = false;
    (location === 'draft') ? this.showDraftView = true : this.showDraftView = false;
    this.getPaginatorLengthRes(location);
  }

  redirectMessages(element){
    element.labelIdsfromMessages.forEach(labelArr => {
      labelArr.labelIds.forEach(label => {
        if(label === 'DRAFT'){
          this.showDraftView = true;
        }
      });
    });
    this.showDraftView ? this.openDraftView(element): this.gotoEmailView(element);
  }

  ngOnDestroy() {
    this.paginatorSubscription.unsubscribe();
    if(this.listSubscription !== null){
      this.listSubscription.unsubscribe();
    }
  }

  getPaginatorLengthRes(location) {
    if(localStorage.getItem('associatedGoogleEmailId')){
      const userInfo = AuthService.getUserInfo();
      userInfo['emailId'] = localStorage.getItem('associatedGoogleEmailId');
      this.authService.setUserInfo(userInfo);
    }

    this.paginatorSubscription = this.emailService.getProfile().subscribe(response => {
      console.log('paginator response=>>>>', response);
      if(response === undefined){
        this.eventService.openSnackBar("You must connect your gmail account", "DISMISS");
        this.router.navigate(['google-connect'], { relativeTo: this.activatedRoute });
      } else {
        
        this.paginatorLength = response.threadsTotal;
        this.getGmailList(location.toUpperCase());
      }
    });
  }

  // threads section
  deleteThreadsForeverFromTrash() {
    console.log("this is selected threads array");
    console.log(this.selectedThreadsArray);
    const ids: string[] = [];
    if (this.selectedThreadsArray.length !== 0) {
      this.selectedThreadsArray.forEach((selectedThread) => {
        const { idsOfThread: { id } } = selectedThread;
        ids.push(id);
      });

      const dialogData = {
        header: 'DELETE',
        body: 'Are you sure you want to delete the selected mails?',
        body2: 'This cannot be undone',
        btnYes: 'DELETE',
        btnNo: 'CANCEL',
        positiveMethod: () => {
          const deleteFromTrashSubscription = this.emailService.deleteThreadsFromTrashForever(ids)
            .subscribe(response => {
              console.log(response);
              deleteFromTrashSubscription.unsubscribe();
              this.ngOnInit();
            }, error => console.error(error));

        },
        negativeMethod: () => {
          console.log('aborted');
        }

      }
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: dialogData,
        autoFocus: false,
      });

      dialogRef.afterClosed().subscribe(result => {

      });
    } else {
      const dialogData = {
        header: 'Warning',
        body: 'No Mails selected. Cannot delete',
        body2: 'Please Select atleast one mail before Deleting!',
        // btnYes: '',
        btnNo: 'CANCEL',
        positiveMethod: () => {
          console.log('aborted')
        },
        negativeMethod: () => {
          console.log('aborted');
        }

      }
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: dialogData,
        autoFocus: false,
      });

      dialogRef.afterClosed().subscribe(result => {

      });
    }

  }

  openDraftView(dataObj) {
    const idArray = [];
    this.messageListArray.forEach((item) => {
      idArray.push(item["idsOfThread"]["id"]);
    })
    this.emailService.sendNextData({ dataObj, idArray });
    this.emailService.openComposeEmail({ dataObj, idArray }, ComposeEmailComponent);
    this.showDraftView = false;
  }

  // move single thread to trash
  moveThreadToTrash(element) {
    console.log('this needs to be deleted ->>>', element);
    const { idsOfThread: { id } } = element;
    const ids: string[] = [];
    ids.push(id);
    // {"ids":["abc","xyz"],"userId":2727,"emailId":"gaurav@futurewise.co.in"}
    this.threadsToTrashService(ids);

  }

  // move threads from trash
  moveThreadsFromTrash() {
    console.log("this is selected threads array");
    console.log(this.selectedThreadsArray);
    const ids: string[] = [];
    this.selectedThreadsArray.forEach((selectedThread) => {
      const { idsOfThread: { id } } = selectedThread;
      ids.push(id);
    });
    console.log(ids);
    const untrashSubscription = this.emailService.moveThreadsFromTrashToList(ids).subscribe(response => {
      console.log(response);
      untrashSubscription.unsubscribe();
      this.ngOnInit();
    }, error => console.error(error));
  }

  threadsToTrashService(ids) {
    const threadsToTrashSubscription = this.emailService.moveThreadsToTrashFromList(ids)
      .subscribe(response => {
        console.log(response);
        threadsToTrashSubscription.unsubscribe();
        this.ngOnInit();
      });
  }

  // get List view
  getGmailList(data) {
    this.listSubscription = this.emailService.getMailInboxList(data)
      .subscribe(responseData => {
        let tempArray1 = [];
        // console.log('this is gmails inbox data ->');
        // console.log('responseData from service ->>', responseData);
        // const parsedResponseData = JSON.parse(EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(responseData));

        // console.log('parsed Data from parseBase64AndDecodeGoogleUrlEncoding->> ', responseData);
        // const { gmailThreads, nextPageToken } = parsedResponseData;
        const { gmailThreads, nextPageToken } = responseData;

        this.nextPageToken = nextPageToken;
        this.gmailThreads = gmailThreads;
        gmailThreads.forEach((thread: GmailInboxResponseI, index: number) => {
          // thread.messages.map((message) => {
          //   message.payload.body.data = btoa(message.payload.body.data);
          // });
          console.log("this is main thread -:::::", thread);


          thread.messages.forEach((message) => {
            const id = thread.id;
            if (message.payload.parts !== null) {
              const newParts = message.payload.parts.map((part)=>{
                if(part.body.data === null){
                  const res = this.getGmailDetailMessageRaw(id);
                  console.log("this is result of async await", res);
                  part.body.data = res;
                }
                return part
              });
              message.payload.parts = newParts;
            }

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
          });

          console.log("modified thread::::::::::::::::::",thread);
          let parsedData: any; // object containing array of decoded parts and headers
          let idsOfThread: any; // Object of historyId and Id of thread
          let dateIdsSnippetsOfMessages: any; // array of Objects having ids, date snippets of messages
          let labelIdsfromMessages;
          let extractSubjectFromHeaders;
          let extractAttachmentFiles = null;
          let attachmentFiles;
          let messageCountInAThread: number;
          let messageDates: number[] = [];

          parsedData = EmailUtilService.decodeGmailThreadExtractMessage(thread);
          idsOfThread = EmailUtilService.getIdsOfGmailThreads(thread);
          dateIdsSnippetsOfMessages = EmailUtilService.getIdAndDateAndSnippetOfGmailThreadMessages(thread);
          labelIdsfromMessages = EmailUtilService.getGmailLabelIdsFromMessages(thread);
          extractSubjectFromHeaders = EmailUtilService.getSubjectAndFromOfGmailHeaders(thread);
          messageCountInAThread = Math.ceil(parsedData.decodedPart.length / 2);

          dateIdsSnippetsOfMessages.forEach(element => {
            const { internalDate } = element;
            messageDates.push(internalDate);
          });

          extractAttachmentFiles = EmailUtilService.getAttachmentFileData(thread);

          if (extractAttachmentFiles !== null) {
            attachmentFiles = extractAttachmentFiles;
          } else {
            attachmentFiles = '';
          }
          const Obj1 = {
            position: index + 1,
            idsOfThread,
            parsedData,
            attachmentFiles,
            messageHeaders: extractSubjectFromHeaders['headerFromArray'],
            messageDates,
            messageCount: messageCountInAThread,
            labelIdsfromMessages,
            emailers: `${typeof (extractSubjectFromHeaders['headerFromArray'][0]) === 'string' ? extractSubjectFromHeaders['headerFromArray'][0].split('<')[0].trim() : ''}`,
            subjectMessage: {
              subject: extractSubjectFromHeaders['headerSubjectArray'][0],
              message: dateIdsSnippetsOfMessages[0]['snippet']
            },
            date: `${dateIdsSnippetsOfMessages[0]['internalDate']}`
          }

          // console.log(Obj1);

          // tempArray.push(Obj);
          tempArray1.push(Obj1);
          // console.log('headers subbect and from');
          // console.log(extractSubjectFromHeaders);
        });

        this.messageListArray = tempArray1;
        // this.messageDetailArray = tempArray;
        // console.log('this is decoded object data ->>>>');
        // console.log(this.messageDetailArray);

        console.log(this.messageListArray);
        this.dataSource = new MatTableDataSource<MessageListArray>(this.messageListArray);
        this.dataSource.paginator = this.paginator;

      }, error => console.error(error));
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

  getGmailDetailMessageRaw(id): string{
    let raw;
    this.emailService.gmailMessageDetail(id)
      .then((response) => {
        if(raw){
          raw = EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(response.raw);
        }
        console.log('response of detailed gmail threadL:::::::', response);
        console.log("this is raw of detail api...::::::::::::", raw);

      });
      return raw;

  }

  createUpdateDraft(id: string, toAddress: Array<any>, subject: string, bodyMessage: string, fileData: Array<any>) {
    const requestJson = {
      id,
      toAddress,
      subject: subject,
      message: bodyMessage,
      fileData
    };

    console.log('LeftSidebarComponent createUpdateDraft requestJson : ', requestJson);
    const createUpdateDraftSubscription = this.emailService.createUpdateDraft(requestJson)
      .subscribe((responseJson) => {
        console.log(requestJson);
        console.log("+++++++++++++++");
        console.log(responseJson);
        createUpdateDraftSubscription.unsubscribe();
      }, (error) => {
        console.error(error);
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    if (this.dataSource) {
      const numRows = this.dataSource.data.length;

      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedThreadsArray = [];
    } else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        this.selectedThreadsArray.push(row);
      });
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: MessageListArray): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`; //
  }

  // routing to view page
  gotoEmailView(dataObj: Object) {
    
    console.log("this is dataObject  =>>>>>>>>>>>>>", dataObj);
    
    this.emailService.sendNextData(dataObj);
    this.router.navigate(['view'], { relativeTo: this.activatedRoute });
  }

  doRefresh() {
    this.ngOnInit();
  }

  // ui select highlight
  highlightSelectedRow(row: ExtractedGmailDataI) {
    if (this.selectedThreadsArray.includes(row)) {
      let indexOf = this.selectedThreadsArray.indexOf(row);
      let removedRow = this.selectedThreadsArray.splice(indexOf, 1);
      console.log('removed row -> ', removedRow);
    } else {
      this.selectedThreadsArray.push(row);
      console.log('added row -> ', row);
    }
    console.log(this.selectedThreadsArray);
  }

  multipleMoveToTrash() {
    const selectedArray = this.selectedThreadsArray;
    // const { idsOfThread: { id } } =
    let ids = [];
    selectedArray.forEach((item) => {
      const { idsOfThread: { id } } = item;
      ids.push(id);
    });

    if(ids.length === 0){
      this.eventService.openSnackBar("Please select email or emails to Delete!", "DISMISS");
    } else {
      this.threadsToTrashService(ids);
    }

  }


  // multipleDeletes() {
  //   this.selectedThreadsArray
  // }

}
