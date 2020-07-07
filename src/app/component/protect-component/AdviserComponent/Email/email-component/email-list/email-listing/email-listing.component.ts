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
import { UtilService } from '../../../../../../../services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-email-listing',
  templateUrl: './email-listing.component.html',
  styleUrls: ['./email-listing.component.scss']
})
export class EmailListingComponent implements OnInit {
  isLoading: boolean = false;
  totalListSize: number = 0;
  maxListRes: number = 0;
  resultSizeEstimate: any;
  currentList: number = 0;
  showNextPaginationBtn: boolean;
  showPrevPaginationBtn: boolean;
  navList: any;
  importantCount: any = 0;
  sentCount: any = 0;
  draftCount: any = 0;
  trashCount: any = 0;
  showOptions: boolean = false;
  starredCount: any;
  advisorEmail;
  isCustomerEmail: boolean;
  unreadCount: any;


  constructor(
    private emailService: EmailServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private eventService: EventService,
    private authService: AuthService,
    private emailUtilService: EmailUtilService,
    private subInjectService: SubscriptionInject) { }

  paginatorLength;
  paginatorSubscription;
  gmailInboxListSubscription;
  gmailThreads: [];
  nextPageToken = null;
  messageDetailArray: GmailInboxResponseI[];
  messageListArray;
  dataSource = null;
  selectedThreadsArray: ExtractedGmailDataI[] = [];
  listSubscription = null;
  trashAction: boolean = false;
  showDraftView: boolean = false;
  currentPage: number = 1;
  toShowMaxThreadsLength;

  displayedColumns: string[] = ['select', 'emailers', 'subjectMessage', 'date'];

  selection = new SelectionModel<MessageListArray>(true, []);
  location = '';
  secondInit = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.advisorEmail = AuthService.getUserInfo().userName;
    this.initPoint();
  }

  initPoint() {
    this.isLoading = true;
    let location;
    location = this.router.url.split('/')[this.router.url.split('/').length - 1];

    console.log("this is router url:", this.router.url);
    if (this.router.url.split('/').includes('admin')) {
      if (this.router.url === '/') {
        location = 'inbox';
      }
      this.isCustomerEmail = false;
    } else if (this.router.url.split('/').includes('customer')) {
      this.isCustomerEmail = true;
    }

    (location === 'trash') ? this.trashAction = true : this.trashAction = false;
    (location === 'draft') ? this.showDraftView = true : this.showDraftView = false;
    this.location = location;
    this.totalListSize = 0;
    this.currentList = 0;
    this.maxListRes = 0;

    if (!this.isCustomerEmail) {
      this.totalListSize = this.totalListSize - 50;
      this.currentList = this.maxListRes + 1;

      if (this.currentList <= 1) {
        this.showPrevPaginationBtn = false;
      } else {
        this.showPrevPaginationBtn == true;
      }
    }

    this.getPaginatorLengthRes(location);
  }


  redirectMessages(element, index) {
    let gmailThread;
    gmailThread = this.gmailThreads[index];
    console.log("this is some listing ::element;::::", element);
    if (element.labelIdsfromMessages[0].labelIds.includes('DRAFT') && this.location === 'draft') {
      this.showDraftView = true;
    } else {
      this.showDraftView = false;
    }
    this.showDraftView ? this.openDraftView(element, gmailThread) : this.gotoEmailView(element);
  }

  ngOnDestroy() {
    this.paginatorSubscription.unsubscribe();
    if (this.listSubscription !== null) {
      this.listSubscription.unsubscribe();
    }
  }

  getPaginatorLengthRes(location) {
    if (localStorage.getItem('associatedGoogleEmailId')) {
      const userInfo = AuthService.getUserInfo();
      userInfo['email'] = localStorage.getItem('associatedGoogleEmailId');
      this.authService.setUserInfo(userInfo);
    }

    this.paginatorSubscription = this.emailService.getProfile()
      .subscribe(response => {
        if (!response) {
          this.isLoading = false;
          this.eventService.openSnackBar("You must connect your gmail account", "Dismiss");
          if (localStorage.getItem('successStoringToken')) {
            localStorage.removeItem('successStoringToken');
          }
          this.router.navigate(['google-connect'], { relativeTo: this.activatedRoute });
        } else {
          // this.paginatorLength = response.threadsTotal;
          this.getRightSideNavListCount(location);
        }
      }, err => {
        this.eventService.openSnackBar("You must connect your gmail account", "Dismiss");
        if (localStorage.getItem('successStoringToken')) {
          localStorage.removeItem('successStoringToken');
        }
        this.router.navigate(['google-connect'], { relativeTo: this.activatedRoute });
      });
  }

  getRightSideNavListCount(location) {
    this.isLoading = true;
    this.emailService.getRightSideNavList().subscribe(responseData => {
      this.navList = responseData;
      console.log("check navlist :::", this.navList);
      if (this.navList.length !== 0) {
        this.navList.forEach(element => {
          switch (element.labelId) {
            case 'IMPORTANT':
              this.importantCount = element.threadsTotal;
              break;
            case 'SENT':
              this.sentCount = element.threadsTotal;
              break;
            case 'DRAFT':
              this.draftCount = element.threadsTotal;
              break;
            case 'TRASH':
              this.trashCount = element.threadsTotal;
              break;
          }
          if ((this.location.toUpperCase() === 'INBOX' ? 'IMPORTANT' : '') === element.labelId) {
            this.unreadCount = parseInt(element.threadsUnread);
          }
        });

        switch (location) {
          case 'inbox':
            this.paginatorLength = this.importantCount;
            break;
          case 'sent': this.paginatorLength = this.sentCount;
            break;
          case 'draft': this.paginatorLength = this.draftCount;
            break;
          case 'trash': this.paginatorLength = this.trashCount;
            break;
          case 'starred': this.paginatorLength = this.starredCount;
            break;
        }

        if (!this.isCustomerEmail) {
          this.totalListSize = this.paginatorLength;
          if (this.paginatorLength <= 50) {
            this.maxListRes = this.paginatorLength;
            this.showNextPaginationBtn = false;
            this.showPrevPaginationBtn = false;
          } else if (this.paginatorLength > 50) {
            this.maxListRes = this.maxListRes + 50;
          }

          let valueOfNextPagination = this.maxListRes + 50;
          if (valueOfNextPagination >= this.paginatorLength) {
            this.showNextPaginationBtn = false;
          } else if (valueOfNextPagination > this.paginatorLength) {
            this.showNextPaginationBtn = false;
          } else if (this.maxListRes < this.paginatorLength) {
            this.showNextPaginationBtn = true;
          }
        }

        this.getGmailList(location.toUpperCase(), '');

      }
    });
  }

  // threads section
  deleteThreadsForeverFromTrash() {
    const ids: string[] = [];
    if (this.selectedThreadsArray.length !== 0) {
      this.selectedThreadsArray.forEach((selectedThread) => {
        const { idsOfThread: { id } } = selectedThread;
        ids.push(id);
      });

      const dialogData = {
        header: 'DELETE',
        body: 'Are you sure you want to delete the selected mails?',
        body2: 'This cannot be undone.',
        btnNo: 'DELETE',
        btnYes: 'CANCEL',
        positiveMethod: () => {
          this.emailService.deleteThreadsFromTrashForever(ids)
            .subscribe(response => {
              this.selection.clear();
              dialogRef.close();
              this.initPoint();
            }, error => console.error(error));

        },
        negativeMethod: () => {
          dialogRef.close();
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
          dialogRef.close()
        },
        negativeMethod: () => {
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

  openDraftView(dataObj, gmailThread) {

    const threadIdsArray = [];
    this.messageListArray.forEach((item) => {
      threadIdsArray.push(item["idsOfThread"]["id"]);
    });

    const fragmentData = {
      flag: 'composeEmail',
      data: { dataToSend: dataObj, choice: 'draft' },
      id: 1,
      state: 'open35',
      componentName: ComposeEmailComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.initPoint();
          }
          rightSideDataSub.unsubscribe();

        }
      }
    );



    this.emailService.sendNextData({ dataObj, threadIdsArray, gmailThread });
    this.emailService.openComposeEmail({ dataObj, threadIdsArray, gmailThread }, ComposeEmailComponent, 'draft');
    this.showDraftView = false;
  }

  // move single thread to trash
  moveThreadToTrash(element) {
    const { idsOfThread: { id } } = element;
    const ids: string[] = [];
    ids.push(id);
    // {"ids":["abc","xyz"],"userId":2727,"emailId":"gaurav@futurewise.co.in"}
    this.threadsToTrashService(ids);
  }

  // move threads from trash
  moveThreadsFromTrash() {
    const ids: string[] = [];
    this.selectedThreadsArray.forEach((selectedThread) => {
      const { idsOfThread: { id } } = selectedThread;
      ids.push(id);
    });
    const untrashSubscription = this.emailService.moveThreadsFromTrashToList(ids).subscribe(response => {
      untrashSubscription.unsubscribe();
      this.ngOnInit();
    }, error => console.error(error));
  }

  threadsToTrashService(ids) {
    this.isLoading = true;
    const threadsToTrashSubscription = this.emailService.moveThreadsToTrashFromList(ids)
      .subscribe(response => {
        this.isLoading = false;
        if (response) {
          this.eventService.openSnackBar('Deleted Successfully!! Updating list', "DISMISS");
          this.selection.clear();
          threadsToTrashSubscription.unsubscribe();
          this.ngOnInit();
        }
      });
  }



  // get List view
  getGmailList(data, page) {
    this.showNextPaginationBtn = false;
    this.showPrevPaginationBtn = false;

    if (data === 'INBOX') {
      data = 'IMPORTANT';
    }

    let clientData;
    let receiverEmail;
    if (this.isCustomerEmail) {
      clientData = JSON.parse(sessionStorage.getItem('clientData'));
      receiverEmail = clientData.emailList[0].email;
      // receiverEmail = 'abhishek@futurewise.co.in';
    }

    if (this.isCustomerEmail) {
      let queryParams = '';
      if (this.location === 'inbox') {
        queryParams = `{ from: ${receiverEmail} }`;
      } else if (this.location === 'sent') {
        queryParams = `{ to: ${receiverEmail} }`;
      } else if (this.location === 'draft') {
        queryParams = `{ in:draft } { (from to): ${receiverEmail} }`
      } else if (this.location === 'trash') {
        queryParams = `{ in:trash } { (from to): ${receiverEmail} }`
      } else {
        queryParams = `{ (from to): ${receiverEmail} }`;
      }

      data = {
        labelIds: data,
        pageToken: (page == 'next') ? (this.nextPageToken ? this.nextPageToken : '') : '',
        maxResults: 50,
        q: queryParams
      }
    } else {
      data = {
        labelIds: data,
        pageToken: (page == 'next') ? (this.nextPageToken ? this.nextPageToken : '') : '',
        maxResults: 50
      }
    }
    // console.log("this is query parameters: ", encodeURIComponent(queryParams));

    this.listSubscription = this.emailService.getMailInboxList(data)
      .subscribe(responseData => {
        if (responseData) {
          if (responseData.nextPageToken) {
            this.nextPageToken = responseData.nextPageToken;
            if (this.isCustomerEmail) {
              this.showNextPaginationBtn = true;
            }
          } else {
            if (this.isCustomerEmail) {
              this.showNextPaginationBtn = false;
            }
          }

          this.resultSizeEstimate = responseData.resultSizeEstimate;
          let tempArray1 = [];

          // const parsedResponseData = JSON.parse(EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(responseData));

          // const { gmailThreads, nextPageToken } = parsedResponseData;
          const { gmailThreads, nextPageToken } = responseData;

          this.nextPageToken = nextPageToken;
          this.gmailThreads = gmailThreads;
          console.log("this is response data::::", responseData);
          gmailThreads.forEach((thread: GmailInboxResponseI, index: number) => {
            // thread.messages.map((message) => {
            //   message.payload.body.data = btoa(message.payload.body.data);
            // });

            let parsedData: any; // object containing array of decoded parts and headers
            let idsOfThread: any; // Object of historyId and Id of thread
            let idsOfMessages: string[]; // ids of messages
            let dateIdsSnippetsOfMessages: any; // array of Objects having ids, date snippets of messages
            let labelIdsfromMessages;
            let extractSubjectFromHeaders;
            let extractAttachmentFiles = null;
            let attachmentFiles;
            let attachmentArrayObjects = [];
            let messageCountInAThread: number;
            let messageDates: number[] = [];

            parsedData = EmailUtilService.decodeGmailThreadExtractMessage(thread);
            attachmentArrayObjects = EmailUtilService.getAttachmentObjectFromGmailThread(thread);
            idsOfThread = EmailUtilService.getIdsOfGmailThreads(thread);
            idsOfMessages = EmailUtilService.getIdsOfGmailMessages(thread);
            dateIdsSnippetsOfMessages = EmailUtilService.getIdAndDateAndSnippetOfGmailThreadMessages(thread);
            labelIdsfromMessages = EmailUtilService.getGmailLabelIdsFromMessages(thread);
            extractSubjectFromHeaders = EmailUtilService.getSubjectAndFromOfGmailHeaders(thread);
            messageCountInAThread = Math.ceil(parsedData.decodedPart.length / 2);

            dateIdsSnippetsOfMessages.forEach((element, index) => {
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
              idsOfMessages,
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
              date: `${dateIdsSnippetsOfMessages[0]['internalDate']}`,
              attachmentArrayObjects,
              isRead: (index + 1) <= this.unreadCount ? true : false
            }


            // tempArray.push(Obj);
            tempArray1.push(Obj1);
          });


          this.messageListArray = tempArray1;
          // this.messageDetailArray = tempArray;

          this.isLoading = false;
          if (!this.isCustomerEmail) {
            if (this.maxListRes < this.paginatorLength) {
              this.showNextPaginationBtn = true;
            }
            if (this.currentList > 50) {
              this.showPrevPaginationBtn = true;
            }
          }
          this.dataSource = new MatTableDataSource<MessageListArray>(this.messageListArray);
          this.dataSource.paginator = this.paginator;
        } else {
          this.isLoading = false;
        }
      }, error => console.error(error));
  }

  getUnreadCountValue(index) {
    return index + 1 <= parseInt(this.unreadCount) ? true : false;
  }

  nextPagesList() {
    let aheadPaginatorVal = this.maxListRes + 50;
    if (aheadPaginatorVal <= this.paginatorLength || this.maxListRes <= this.paginatorLength) {
      this.totalListSize = this.totalListSize - 50;
      this.currentList = this.maxListRes + 1;
      this.maxListRes = this.maxListRes + 50;
      if (!this.isCustomerEmail) {
        if (this.currentList > 50) {
          this.showPrevPaginationBtn = true;
        }
        if (this.maxListRes >= this.paginatorLength) {
          this.maxListRes = this.paginatorLength;
        }
      }
      this.isLoading = true;
      this.getGmailList(this.location.toUpperCase(), 'next');
    } else {
      this.showNextPaginationBtn = false;
    }

  }

  previousPagesList() {

    this.totalListSize = 0 + 50;
    this.maxListRes = 50;
    this.currentList = 1;

    this.isLoading = true;

    this.getGmailList(this.router.url.split('/')[3].toUpperCase(), 'prev');

  }

  // getFileDetails(e): void {
  //   const singleFile = e.target.files[0];

  //   const fileData = [];

  //   EmailUtilService.getBase64FromFile(singleFile, (successData) => {
  //     fileData.push({
  //       filename: singleFile.name,
  //       size: singleFile.size,
  //       mimeType: singleFile.type,
  //       data: successData
  //     });
  //     this.createUpdateDraft(null, ['gaurav@futurewise.co.in'],
  //       'This is a test message', 'This is a test message body', fileData);
  //   });

  // }

  // createUpdateDraft(id: string, toAddress: Array<any>, subject: string, bodyMessage: string, fileData: Array<any>) {
  //   const requestJson = {
  //     id,
  //     toAddress,
  //     subject: subject,
  //     message: bodyMessage,
  //     fileData
  //   };

  //   const createUpdateDraftSubscription = this.emailService.createUpdateDraft(requestJson, null)
  //     .subscribe((responseJson) => {
  //       createUpdateDraftSubscription.unsubscribe();
  //     }, (error) => {
  //       console.error(error);
  //     });
  // }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    if (this.dataSource) {
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedThreadsArray = [];
      this.showOptions = false;
    } else {
      this.showOptions = true;
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

  // routing to view pageF`
  gotoEmailView(dataObj: Object): void {


    this.emailService.sendNextData(dataObj);
    this.router.navigate(['view'], { relativeTo: this.activatedRoute });
  }

  // ui select highlight
  highlightSelectedRow(row: ExtractedGmailDataI): void {
    if (this.selectedThreadsArray.includes(row)) {

      let index = this.selectedThreadsArray.indexOf(row);
      this.selectedThreadsArray.splice(index, 1);
      if (this.selectedThreadsArray.length == 0) {
        this.showOptions = false;
      }
    } else {
      this.showOptions = true;
      this.selectedThreadsArray.push(row);
    }
  }

  multipleMoveToTrash(): void {
    const selectedArray = this.selectedThreadsArray;
    // const { idsOfThread: { id } } =
    let ids = [];
    selectedArray.forEach((item) => {
      const { idsOfThread: { id } } = item;
      ids.push(id);
    });

    if (ids.length === 0) {
      this.eventService.openSnackBar("Please select email or emails to delete!", "Dismiss");
    } else {
      this.threadsToTrashService(ids);
    }

  }

}
