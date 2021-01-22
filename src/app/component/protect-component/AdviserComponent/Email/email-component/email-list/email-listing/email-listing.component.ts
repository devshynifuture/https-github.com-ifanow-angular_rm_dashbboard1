import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { EmailDataStorageService } from './../../../email-data-storage.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from './../../../../../../../Data-service/event.service';
import { ComposeEmailComponent } from './../../compose-email/compose-email.component';
import { ConfirmDialogComponent } from './../../../../../common-component/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatPaginator } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';

import { EmailServiceService } from './../../../email-service.service';
import { ExtractedGmailDataI, GmailInboxResponseI, MessageListArray, } from '../../email.interface';
import { EmailUtilService } from 'src/app/services/email-util.service';
import { UtilService } from '../../../../../../../services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { RoleService } from 'src/app/auth-service/role.service';

@Component({
  selector: 'app-email-listing',
  templateUrl: './email-listing.component.html',
  styleUrls: ['./email-listing.component.scss'],
})
export class EmailListingComponent implements OnInit {
  isLoading = false;
  totalListSize = 0;
  maxListRes = 0;
  resultSizeEstimate: any;
  currentList = 0;
  showNextPaginationBtn: boolean;
  showPrevPaginationBtn: boolean;
  navList: any;
  importantCount: any = 0;
  sentCount: any = 0;
  draftCount: any = 0;
  trashCount: any = 0;
  showOptions = false;
  starredCount: any = 0;
  advisorEmail;
  isCustomerEmail: boolean;
  unreadCount: any;
  inboxCountSubs: Subscription;
  sentCountSubs: Subscription;
  starredCountSubs: Subscription;
  draftCountSubs: Subscription;
  trashCountSubs: Subscription;
  canHitGmailApiSubs: Subscription;
  canHitGmailApi: any = false;
  navCountObj: { inboxCount: any; sentCount: any; starredCount: any; draftCount: any; trashCount: any; unreadCount: any; };

  constructor(
    private emailService: EmailServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private eventService: EventService,
    private authService: AuthService,
    private emailUtilService: EmailUtilService,
    private subInjectService: SubscriptionInject,
    private emailDataStorageService: EmailDataStorageService,
    private titleService: Title,
    public roleService: RoleService
  ) {
  }

  paginatorLength;
  paginatorSubscription;
  gmailInboxListSubscription;
  gmailThreads: [];
  nextPageToken = null;
  messageDetailArray: GmailInboxResponseI[];
  messageListArray = [];
  dataSource = null;
  selectedThreadsArray: ExtractedGmailDataI[] = [];
  listSubscription = null;
  trashAction = false;
  showDraftView = false;
  currentPage = 1;
  toShowMaxThreadsLength;
  gmailThreadsSubs: Subscription;

  displayedColumns: string[] = [
    'select',
    'star',
    'emailers',
    'subjectMessage',
    'date',
  ];

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
    location = this.router.url.split('/')[
      this.router.url.split('/').length - 1
    ];

    console.log('this is router url:', this.router.url);
    if (this.router.url.split('/').includes('admin')) {
      if (this.router.url === '/') {
        location = 'inbox';
      }
      this.isCustomerEmail = false;
    } else if (this.router.url.split('/').includes('customer')) {
      this.isCustomerEmail = true;
    }

    location === 'trash'
      ? (this.trashAction = true)
      : (this.trashAction = false);
    location === 'draft'
      ? (this.showDraftView = true)
      : (this.showDraftView = false);
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
    console.log('this is some listing ::element;::::', element);
    if (
      element.labelIdsfromMessages[0].includes('DRAFT') &&
      this.location === 'draft'
    ) {
      this.showDraftView = true;
    } else {
      this.showDraftView = false;
    }
    this.showDraftView
      ? this.openDraftView(element, gmailThread)
      : this.gotoEmailView(element);
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
      userInfo.email = localStorage.getItem('associatedGoogleEmailId');
      this.authService.setUserInfo(userInfo);
    }

    this.paginatorSubscription = this.emailService.getProfile().subscribe(
      (response) => {
        if (!response) {
          this.eventService.openSnackBar('You must connect your gmail account', 'Dismiss');
          if (localStorage.getItem('successStoringToken')) {
            localStorage.removeItem('successStoringToken');
          }
          this.isLoading = false;
          this.router.navigate(['google-connect'], { relativeTo: this.activatedRoute, });
        } else {
          this.getRightSideNavListCount(location);
        }
      },
      (err) => {
        this.eventService.openSnackBar('You must connect your gmail account', 'Dismiss');
        if (localStorage.getItem('successStoringToken')) {
          localStorage.removeItem('successStoringToken');
        }
        this.router.navigate(['google-connect'], {
          relativeTo: this.activatedRoute,
        });
      }
    );
  }

  getRightSideNavListCount(location) {
    // this.isLoading = true;

    this.emailService.getRightSideNavList()
      .subscribe((responseData) => {
        this.navList = responseData;
        if (this.navList.length !== 0) {
          const obj = {
            inboxCount: null,
            sentCount: null,
            starredCount: null,
            draftCount: null,
            trashCount: null,
            unreadCount: null
          };
          this.navList.forEach((element) => {
            switch (element.labelId) {
              case 'INBOX':
                this.importantCount = element.threadsTotal;
                obj.inboxCount = this.importantCount;
                break;
              case 'SENT':
                this.sentCount = element.threadsTotal;
                obj.sentCount = this.sentCount;
                break;
              case 'DRAFT':
                this.draftCount = element.threadsTotal;
                obj.draftCount = this.draftCount;
                break;
              case 'TRASH':
                this.trashCount = element.threadsTotal;
                obj.trashCount = this.trashCount;
                break;
              case 'STARRED':
                this.starredCount = element.threadsTotal;
                obj.starredCount = this.starredCount;
                break;
            }
          });
          if (this.emailDataStorageService.navCountObj === null) {
            this.emailDataStorageService.storeNavCount(obj);
            this.navCountObj = obj;
          } else if (this.emailDataStorageService.navCountObj !== null) {
            if (obj.inboxCount !== this.emailDataStorageService.navCountObj.inboxCount ||
              obj.draftCount !== this.emailDataStorageService.navCountObj.draftCount ||
              obj.sentCount !== this.emailDataStorageService.navCountObj.sentCount ||
              obj.starredCount !== this.emailDataStorageService.navCountObj.starredCount ||
              obj.trashCount !== this.emailDataStorageService.navCountObj.trashCount ||
              (
                this.emailDataStorageService[`${this.location}EmailList`] &&
                this.emailDataStorageService[`${this.location}EmailList`].length === 0)
            ) {
              this.emailDataStorageService.setCanHitGmailApi(true);
              this.emailDataStorageService.storeNavCount(obj);
            } else {
              this.emailDataStorageService.setCanHitGmailApi(false);
            }
          }
        }
        this.fetchGmailData(location);
      });


    this.gmailThreadsSubs = this.emailDataStorageService.getGmailThreadsThroughObs()
      .subscribe(res => {
        if (res) {
          this.gmailThreads = res;
        }
      });

    // fetch gmail data

    this.inboxCountSubs = this.emailDataStorageService.getNavCountThroughObs()
      .subscribe(res => {
        if (res) {
          this.importantCount = res.inboxCount;
          this.sentCount = res.sentCount;
          this.trashCount = res.trashCount;
          this.starredCount = res.starredCount;

          switch (this.location) {
            case 'inbox':
              if (this.unreadCount) {
                this.titleService.setTitle(`MyPlanner - Inbox (${this.unreadCount})`);
              } else {
                this.titleService.setTitle(`MyPlanner - Inbox`);
              }
              break;
            case 'sent':
              this.titleService.setTitle(`MyPlanner - Sent`);
              break;
            case 'draft':
              this.titleService.setTitle(`MyPlanner - Draft`);
              break;
            case 'trash':
              this.titleService.setTitle(`MyPlanner - Trash`);
              break;
            case 'starred':
              this.titleService.setTitle(`MyPlanner - Starred`);
              break;

            default:
              this.titleService.setTitle(`MyPlanner`);
          }
        }
      });

    if (!this.isCustomerEmail) {
      this.totalListSize = this.paginatorLength;
      if (this.paginatorLength <= 50) {
        this.maxListRes = this.paginatorLength;
        this.showNextPaginationBtn = false;
        this.showPrevPaginationBtn = false;
      } else if (this.paginatorLength > 50) {
        this.maxListRes = this.maxListRes + 50;
      }

      const valueOfNextPagination = this.maxListRes + 50;
      if (valueOfNextPagination >= this.paginatorLength) {
        this.showNextPaginationBtn = false;
      } else if (valueOfNextPagination > this.paginatorLength) {
        this.showNextPaginationBtn = false;
      } else if (this.maxListRes < this.paginatorLength) {
        this.showNextPaginationBtn = true;
      }
    }
  }

  fetchGmailData(location) {
    if (this.emailDataStorageService.canHitGmailApi()) {
      this.isLoading = true;
      this.getGmailList(location.toUpperCase(), '');
      this.emailDataStorageService.setCanHitGmailApi(false);
    } else {
      this.dataSource = new MatTableDataSource(this.emailDataStorageService[`${this.location}EmailList`]);
      if (this.location === 'inbox') {
        let unreadCount = 0;
        this.emailDataStorageService.inboxEmailList.forEach(element => {
          if (!element.isRead) {
            unreadCount += 1;
          }
        });
        if (unreadCount > 0) {
          this.titleService.setTitle(`MyPlanner - Inbox (${unreadCount})`);
          this.emailDataStorageService.storeUnReadCount(unreadCount);
          this.navCountObj = { ...this.emailDataStorageService.navCountObj };
          this.navCountObj.unreadCount = unreadCount;
          this.emailDataStorageService.storeNavCount(this.navCountObj);
        } else {
          this.titleService.setTitle(`MyPlanner - Inbox`);
        }
      }
      this.isLoading = false;
    }
  }

  // threads section
  deleteThreadsForeverFromTrash() {
    const ids: string[] = [];
    if (this.selectedThreadsArray.length !== 0) {
      this.selectedThreadsArray.forEach((selectedThread) => {
        const {
          idsOfThread: { id },
        } = selectedThread;
        ids.push(id);
      });

      const dialogData = {
        header: 'DELETE',
        body: 'Are you sure you want to delete the selected mails?',
        body2: 'This cannot be undone.',
        btnNo: 'DELETE',
        btnYes: 'CANCEL',
        positiveMethod: () => {
          this.emailService.deleteThreadsFromTrashForever(ids).subscribe(
            (response) => {
              this.selection.clear();
              dialogRef.close();
              this.initPoint();
            },
            (error) => console.error(error)
          );
        },
        negativeMethod: () => {
          dialogRef.close();
        },
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: dialogData,
        autoFocus: false,
      });

      dialogRef.afterClosed().subscribe((result) => {
      });
    } else {
      const dialogData = {
        header: 'Warning',
        body: 'No Mails selected. Cannot delete',
        body2: 'Please Select atleast one mail before Deleting!',
        // btnYes: '',
        btnNo: 'CANCEL',
        positiveMethod: () => {
          dialogRef.close();
        },
        negativeMethod: () => {
        },
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: dialogData,
        autoFocus: false,
      });

      dialogRef.afterClosed().subscribe((result) => {
      });
    }
  }

  openDraftView(dataObj, gmailThread) {
    const threadIdsArray = [];
    this.messageListArray.forEach((item) => {
      threadIdsArray.push(item.idsOfThread.id);
    });

    const fragmentData = {
      flag: 'composeEmail',
      data: { dataToSend: dataObj, choice: 'draft' },
      id: 1,
      state: 'open35',
      componentName: ComposeEmailComponent,
    };
    const rightSideDataSub = this.subInjectService
      .changeNewRightSliderState(fragmentData)
      .subscribe((sideBarData) => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.initPoint();
          }
          rightSideDataSub.unsubscribe();
        }
      });

    this.emailService.sendNextData({ dataObj, threadIdsArray, gmailThread });
    this.emailService.openComposeEmail(
      { dataObj, threadIdsArray, gmailThread },
      ComposeEmailComponent,
      'draft'
    );
    this.showDraftView = false;
  }

  // move single thread to trash
  moveThreadToTrash(element) {
    const {
      idsOfThread: { id },
    } = element;
    const ids: string[] = [];
    ids.push(id);
    this.threadsToTrashService(ids);
  }

  // move threads from trash
  moveThreadsFromTrash() {
    const ids: string[] = [];
    this.selectedThreadsArray.forEach((selectedThread) => {
      const {
        idsOfThread: { id },
      } = selectedThread;
      ids.push(id);
    });
    const untrashSubscription = this.emailService
      .moveThreadsFromTrashToList(ids)
      .subscribe(
        (response) => {
          untrashSubscription.unsubscribe();
          this.ngOnInit();
        },
        (error) => console.error(error)
      );
  }

  threadsToTrashService(ids) {
    this.isLoading = true;
    const threadsToTrashSubscription = this.emailService
      .moveThreadsToTrashFromList(ids)
      .subscribe((response) => {
        this.isLoading = false;
        if (response) {
          this.eventService.openSnackBar(
            'Deleted Successfully',
            'DISMISS'
          );
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
      data = 'INBOX';
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
        queryParams = `{ in:draft } { (from to): ${receiverEmail} }`;
      } else if (this.location === 'trash') {
        queryParams = `{ in:trash } { (from to): ${receiverEmail} }`;
      } else if (this.location === 'inbox') {
        queryParams = `[ in:inbox -category:{social promotions updates forums} ]`;
      } else if (this.location === 'starred') {
        queryParams = `[ in:starred -category:{social promotions updates forums} ]`;
      } else {
        queryParams = `{ (from to): ${receiverEmail} }`;
      }

      data = {
        labelIds: data,
        pageToken:
          page == 'next' ? (this.nextPageToken ? this.nextPageToken : '') : '',
        maxResults: 50,
        q: queryParams,
      };
    } else {
      let queryParams;
      data = {
        labelIds: data,
        pageToken:
          page == 'next' ? (this.nextPageToken ? this.nextPageToken : '') : '',
        maxResults: 50,
      };
      if (this.location === 'inbox') {
        queryParams = `[ in:inbox -category:{social promotions} ]`;
        data.q = queryParams;
      }
    }
    // console.log("this is query parameters: ", encodeURIComponent(queryParams));
    console.log('this is some data that im sending', data);
    this.listSubscription = this.emailService.getMailInboxList(data).subscribe(
      (responseData) => {
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
          const tempArray1 = [];


          const { gmailThreads, nextPageToken } = responseData;

          this.nextPageToken = nextPageToken;
          this.gmailThreads = gmailThreads;
          this.emailDataStorageService.storeGmailThreads(gmailThreads);
          let isUnReadCount = 0;
          console.log('this is response data::::', responseData);
          gmailThreads.forEach((thread: GmailInboxResponseI, index: number) => {

            let parsedData: any, // object containing array of decoded parts and headers
              idsOfThread: any, // Object of historyId and Id of thread
              idsOfMessages: string[], // ids of messages
              dateIdsSnippetsOfMessages: any, // array of Objects having ids, date snippets of messages
              labelIdsfromMessages,
              extractSubjectFromHeaders,
              extractAttachmentFiles = null,
              attachmentFiles,
              attachmentArrayObjects = [],
              messageCountInAThread: number,
              messageDates: number[] = [],
              isStarred = false;

            parsedData = EmailUtilService.decodeGmailThreadExtractMessage(
              thread
            );
            attachmentArrayObjects = EmailUtilService.getAttachmentObjectFromGmailThread(
              thread
            );
            idsOfThread = EmailUtilService.getIdsOfGmailThreads(thread);

            idsOfMessages = EmailUtilService.getIdsOfGmailMessages(thread);
            dateIdsSnippetsOfMessages = EmailUtilService.getIdAndDateAndSnippetOfGmailThreadMessages(
              thread
            );
            labelIdsfromMessages = EmailUtilService.getGmailLabelIdsFromMessages(
              thread
            );

            if (labelIdsfromMessages.length > 0) {
              labelIdsfromMessages.forEach((element) => {
                if (element.includes('STARRED')) {
                  isStarred = true;
                }
              });
            }
            extractSubjectFromHeaders = EmailUtilService.getSubjectAndFromOfGmailHeaders(
              thread
            );
            messageCountInAThread = Math.ceil(
              parsedData.decodedPart.length / 2
            );

            dateIdsSnippetsOfMessages.forEach((element, index) => {
              const { internalDate } = element;
              messageDates.push(internalDate);
            });

            extractAttachmentFiles = EmailUtilService.getAttachmentFileData(
              thread
            );

            if (extractAttachmentFiles !== null) {
              attachmentFiles = extractAttachmentFiles;
            } else {
              attachmentFiles = '';
            }
            let isRead;
            if (
              labelIdsfromMessages.some((labelItem) =>
                labelItem.some((item) => item === 'UNREAD')
              )
            ) {
              isRead = false;
              isUnReadCount += 1;
            } else {
              isRead = true;
            }
            const Obj1 = {
              position: index + 1,
              idsOfThread,
              idsOfMessages,
              starred: isStarred,
              parsedData,
              attachmentFiles,
              messageHeaders: extractSubjectFromHeaders.headerFromArray,
              messageDates,
              messageCount: messageCountInAThread,
              labelIdsfromMessages,
              emailers: `${typeof extractSubjectFromHeaders.headerFromArray[0] ===
                'string'
                ? extractSubjectFromHeaders.headerFromArray[0]
                  .split('<')[0]
                  .trim()
                : ''
                }`,
              subjectMessage: {
                subject: extractSubjectFromHeaders.headerSubjectArray[0],
                message: dateIdsSnippetsOfMessages[0].snippet,
              },
              date: `${dateIdsSnippetsOfMessages[0].internalDate}`,
              attachmentArrayObjects,
              isRead,
              hasAttachment:
                attachmentArrayObjects.length !== 0
                  ? attachmentArrayObjects[0].filename !== ''
                    ? true
                    : false
                  : false,
            };

            tempArray1.push(Obj1);
          });
          if (this.location === 'inbox') {
            this.emailDataStorageService.storeUnReadCount(isUnReadCount);
            this.unreadCount = isUnReadCount;
            this.navCountObj = { ...this.emailDataStorageService.navCountObj };
            this.navCountObj.unreadCount = this.unreadCount;
            this.emailDataStorageService.storeNavCount(this.navCountObj);
            if (this.unreadCount && this.unreadCount > 0) {
              this.titleService.setTitle(`MyPlanner - Inbox (${this.unreadCount})`);
            }
          }

          this.messageListArray = tempArray1;

          this.isLoading = false;
          if (!this.isCustomerEmail) {
            if (this.maxListRes < this.paginatorLength) {
              this.showNextPaginationBtn = true;
            }
            if (this.currentList > 50) {
              this.showPrevPaginationBtn = true;
            }
          }
          this.dataSource = new MatTableDataSource<MessageListArray>(
            this.messageListArray
          );
          switch (this.location) {
            case 'inbox':
              this.emailDataStorageService.storeInboxEmailDataList(this.messageListArray);
              break;

            case 'sent':
              this.emailDataStorageService.storeSentEmailDataList(this.messageListArray);
              break;

            case 'draft':
              this.emailDataStorageService.storeDraftEmailDataList(this.messageListArray);
              break;

            case 'starred':
              this.emailDataStorageService.storeStarredEmailDataList(this.messageListArray);
              break;

            case 'trash':
              this.emailDataStorageService.storeTrashEmailDataList(this.messageListArray);
              break;
          }
          this.dataSource.paginator = this.paginator;
        } else {
          this.isLoading = false;
        }

      },
      (error) => console.error(error)
    );
  }

  getUnreadCountValue(index) {
    return index + 1 <= parseInt(this.unreadCount) ? true : false;
  }

  nextPagesList() {
    const aheadPaginatorVal = this.maxListRes + 50;
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

  changeStarTick(row) {
    if (this.dataSource.data) {
      const starValue = this.dataSource.data.find((item) => item.position == row.position).starred;
      this.dataSource.data.find((item) => item.position == row.position).starred = !starValue;
      const data = {
        // {
        //   "userId": {},
        //   "emailId": {},
        //   "ids": {} // threadId
        // }
        // {
        //   "addLabelIds": [],
        //   "removeLabelIds": []
        // }
      };
      // this.emailService.modifyThreadIds(data)
      //   .subscribe(res => {
      //     if (res) {
      //       console.log("modified ", res);
      //     }
      //   }, err => console.error(err));
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
      this.dataSource.data.forEach((row) => {
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1
      }`; //
  }

  // routing to view page`
  gotoEmailView(dataObj: any): void {
    dataObj.isRead = true;
    this.emailService.sendNextData(dataObj);
    this.router.navigate(['view'], { relativeTo: this.activatedRoute });
    this.emailDataStorageService.storeUnReadCount(this.unreadCount -= 1);
  }

  // ui select highlight
  highlightSelectedRow(row: ExtractedGmailDataI): void {
    if (this.selectedThreadsArray.includes(row)) {
      const index = this.selectedThreadsArray.indexOf(row);
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
    const ids = [];
    selectedArray.forEach((item) => {
      const {
        idsOfThread: { id },
      } = item;
      ids.push(id);
    });

    if (ids.length === 0) {
      this.eventService.openSnackBar(
        'Please select email or emails to delete!',
        'Dismiss'
      );
    } else {
      this.threadsToTrashService(ids);
    }
  }
}
