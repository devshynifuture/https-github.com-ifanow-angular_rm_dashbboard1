import { GmailInboxResponseI } from './../../email.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material';
import { MatTableDataSource, MatTable } from '@angular/material/table';

import { SubscriptionInject } from './../../../../Subscriptions/subscription-inject.service';

import { EmailServiceService } from './../../../email-service.service';
import { EmailInterfaceI } from '../../email.interface';
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

export interface MessageListArray {
  position: number,
  emailers: string,
  subjectMessage: string,
  date: string
}

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
    private activatedRoute: ActivatedRoute) { }

  paginatorLength;
  paginatorSubscription;
  gmailInboxListSubscription;
  gmailThreads: [];
  nextPageToken;
  messageDetailArray: GmailInboxResponseI[];
  messageListArray;
  dataSource;

  ngOnInit() {
    this.getPaginatorLengthRes();
    this.getGmailListInboxRes();
    this.dataSource.paginator = this.paginator;
  }

  getPaginatorLengthRes() {
    this.paginatorSubscription = this.emailService.getPaginatorLength().subscribe(response => {
      console.log('paginator response=>>>>', response);
      this.paginatorLength = response.threadsTotal;
    });
  }

  getGmailListInboxRes() {
    this.gmailInboxListSubscription = this.emailService.getMailInboxList('INBOX')
      .subscribe(responseData => {
        let tempArray = [];
        let tempArray1 = [];
        // console.log('this is gmails inbox data ->');
        const parsedResponseData = JSON.parse(EmailUtilService.parseBase64AndDecodeGoogleUrlEncoding(responseData));
        console.log(parsedResponseData);
        const { gmailThreads, nextPageToken } = parsedResponseData;
        this.nextPageToken = nextPageToken;
        this.gmailThreads = gmailThreads;
        gmailThreads.forEach((thread: GmailInboxResponseI, index: number) => {

          let parsedData: any; // object containing array of decoded parts and headers
          // let idsOfThread: any; // Object of historyId and Id of thread
          let dateIdsSnippetsOfMessages: any; // array of Objects having ids, date snippets of messages
          // let labelIdsfromMessages;
          let extractSubjectFromHeaders;

          parsedData = EmailUtilService.decodeGmailThreadExtractMessage(thread);
          // idsOfThread = EmailUtilService.getIdsOfGmailThreads(thread);
          dateIdsSnippetsOfMessages = EmailUtilService.getIdAndDateAndSnippetOfGmailThreadMessages(thread);
          // labelIdsfromMessages = EmailUtilService.getGmailLabelIdsFromMessages(thread);
          extractSubjectFromHeaders = EmailUtilService.getSubjectAndFromOfGmailHeaders(thread);
          // const Obj = {
          //   parsedData,
          //   idsOfThread,
          //   dateIdsSnippetsOfMessages,
          //   labelIdsfromMessages
          // }
          // console.log("this is ->>> ");
          // console.log(dateIdsSnippetsOfMessages);

          const Obj1 = {
            position: index + 1,
            emailers: `${extractSubjectFromHeaders['headerFromArray'][0].split('<')[0].trim()}`,
            subjectMessage: `${extractSubjectFromHeaders['headerSubjectArray'][0]} - ${dateIdsSnippetsOfMessages[0]['snippet']}`,
            date: `${dateIdsSnippetsOfMessages[0]['internalDate']}`
          }

          // tempArray.push(Obj);
          tempArray1.push(Obj1);
          // console.log('headers subbect and from');
          // console.log(extractSubjectFromHeaders);
        });

        this.messageListArray = tempArray1;
        // this.messageDetailArray = tempArray;
        // console.log('this is decoded object data ->>>>');
        // console.log(this.messageDetailArray);
        this.dataSource = new MatTableDataSource<MessageListArray>(this.messageListArray);
      }, error => console.error(error));
  }

  ngOnDestroy() {
    this.paginatorSubscription.unsubscribe();
    this.gmailInboxListSubscription.unsubscribe();
  }

  displayedColumns: string[] = ['select', 'emailers', 'subjectMessage', 'date'];

  selection = new SelectionModel<MessageListArray>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: MessageListArray): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`; //
  }

  gotoEmailView(dataObj: Object) {
    this.emailService.sendNextData(dataObj);
    this.router.navigate(['view'], { relativeTo: this.activatedRoute });
  }

  doRefresh() {
    this.emailService.refreshList('inbox');
  }
}
