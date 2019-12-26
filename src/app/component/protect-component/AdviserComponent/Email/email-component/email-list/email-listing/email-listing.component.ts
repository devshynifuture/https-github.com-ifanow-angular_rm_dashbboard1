import { ComposeEmailComponent } from './../../compose-email/compose-email.component';
import { ConfirmDialogComponent } from './../../../../../common-component/confirm-dialog/confirm-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatDialog } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';

import { SubscriptionInject } from './../../../../Subscriptions/subscription-inject.service';

import { EmailServiceService } from './../../../email-service.service';
import { EmailInterfaceI, ExtractedGmailDataI, MessageListArray, GmailInboxResponseI } from '../../email.interface';
import { EmailUtilService } from 'src/app/services/email-util.service';

const ELEMENT_DATA: EmailInterfaceI[] = [
  { position: 1, name: 'draft Hydrogen', weight: 1.0079, symbol: 'H', isRead: false },
  { position: 2, name: 'draft Helium', weight: 4.0026, symbol: 'He', isRead: false },
  { position: 3, name: 'draftLithium', weight: 6.941, symbol: 'Li', isRead: false },
  { position: 4, name: 'draft Beryllium', weight: 9.0122, symbol: 'Be', isRead: false },
  { position: 5, name: 'draft Boron', weight: 10.811, symbol: 'B', isRead: false },
  { position: 6, name: 'draft Carbon', weight: 12.0107, symbol: 'C', isRead: false },
  { position: 7, name: 'draft Nitrogen', weight: 14.0067, symbol: 'N', isRead: false },
  { position: 8, name: 'draft Oxygen', weight: 15.9994, symbol: 'O', isRead: false },
  { position: 9, name: 'draft Fluorine', weight: 18.9984, symbol: 'F', isRead: false },
  { position: 10, name: 'draft Neon', weight: 20.1797, symbol: 'Ne', isRead: false },
];


@Component({
  selector: 'app-email-listing',
  templateUrl: './email-listing.component.html',
  styleUrls: ['./email-listing.component.scss']
})
export class EmailListingComponent implements OnInit, OnDestroy {


  constructor(
    private subInjectService: SubscriptionInject,
    private emailService: EmailServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) { }

  paginatorLength;
  paginatorSubscription;
  gmailInboxListSubscription;
  gmailThreads: [];
  nextPageToken;
  messageDetailArray: GmailInboxResponseI[];
  messageListArray;
  dataSource = null;
  selectedThreadsArray: ExtractedGmailDataI[] = [];
  listSubscription;
  trashAction: boolean = false;
  showDraftView: boolean = false;

  displayedColumns: string[] = ['select', 'emailers', 'subjectMessage', 'date'];

  selection = new SelectionModel<MessageListArray>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    let location;
    if (this.router.url === '/') {
      location = 'inbox';
    } else {
      location = this.router.url.split('/')[3];
    }
    (location === 'trash') ? this.trashAction = true : this.trashAction = false;
    (location === 'draft') ? this.showDraftView = true : this.showDraftView = false;
    this.getGmailList(location.toUpperCase());
    this.getPaginatorLengthRes();
  }

  ngOnDestroy() {
    this.paginatorSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
  }

  getPaginatorLengthRes() {
    this.paginatorSubscription = this.emailService.getPaginatorLength().subscribe(response => {
      console.log('paginator response=>>>>', response);
      this.paginatorLength = response.threadsTotal;
    });
  }

  // threads section
  deleteThreadsForeverFromTrash() {
    console.log("this is selected threads array");
    console.log(this.selectedThreadsArray);
    const ids: string[] = [];
    if (this.selectedThreadsArray !== []) {
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

    this.threadsToTrashService(ids);
  }


  // multipleDeletes() {
  //   this.selectedThreadsArray
  // }

}
