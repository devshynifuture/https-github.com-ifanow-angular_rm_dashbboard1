import { GmailInboxResponseI, MessageListArray } from './../email.interface';
import { EmailUtilService } from 'src/app/services/email-util.service';
import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { EmailServiceService } from './../../email-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmailInterfaceI, ExtractedGmailDataI } from '../email.interface';


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
  selector: 'app-email-draft',
  templateUrl: './email-draft.component.html',
  styleUrls: ['./email-draft.component.scss']
})
export class EmailDraftComponent implements OnInit, OnDestroy {

  emailDraftSubscription;
  emailDraftList: object[] = [];
  dataSource;
  selectedThreadsArray: ExtractedGmailDataI[] = [];
  displayedColumns: string[] = ['select', 'labelId', 'subject', 'message', 'date'];
  selection = new SelectionModel<object>(true, []);
  messageListArray = [];
  paginator;


  constructor(private subInjectService: SubscriptionInject,
    private emailService: EmailServiceService,
    // private router: Router,
    // private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.getDraftList();
  }

  getDraftList() {
    this.emailDraftSubscription = this.emailService.getEmailDraftList()
      .subscribe(responseData => {
        let tempArray1 = [];
        let index = 0;

        // responseData.forEach((thread: GmailInboxResponseI, index: number) => {

        let parsedData: any; // object containing array of decoded parts and headers
        let idsOfThread: any; // Object of historyId and Id of thread
        let dateIdsSnippetsOfMessages: any; // array of Objects having ids, date snippets of messages
        let labelIdsfromMessages;
        let extractSubjectFromHeaders;

        parsedData = EmailUtilService.decodeGmailThreadExtractMessage(responseData);
        idsOfThread = EmailUtilService.getIdsOfGmailThreads(responseData);
        dateIdsSnippetsOfMessages = EmailUtilService.getIdAndDateAndSnippetOfGmailThreadMessages(responseData);
        labelIdsfromMessages = EmailUtilService.getGmailLabelIdsFromMessages(responseData);
        extractSubjectFromHeaders = EmailUtilService.getSubjectAndFromOfGmailHeaders(responseData);

        const Obj1 = {
          position: index + 1,
          idsOfThread,
          parsedData,
          labelIdsfromMessages,
          emailers: `${extractSubjectFromHeaders['headerFromArray'][0].split('<')[0].trim()}`,
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
        // });

        this.messageListArray = tempArray1;
        console.log("this is message list array ->>>>>>>");
        console.log(this.messageListArray);
        // this.messageDetailArray = tempArray;
        // console.log('this is decoded object data ->>>>');
        // console.log(this.messageDetailArray);
        this.dataSource = new MatTableDataSource<MessageListArray>(this.messageListArray);
        this.dataSource.paginator = this.paginator;
        // console.log(responseData);
      });
  }

  ngOnDestroy() {
    this.emailDraftSubscription.unsubscribe();
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
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  gotoEmailView(dataObj: object) {
    this.emailService.sendNextData(dataObj);
    this.emailService.openComposeEmail(dataObj);
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

}
