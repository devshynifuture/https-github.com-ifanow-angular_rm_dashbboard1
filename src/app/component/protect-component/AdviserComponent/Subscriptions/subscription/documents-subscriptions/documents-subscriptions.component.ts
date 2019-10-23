import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../subscription-inject.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionService} from '../../subscription.service';
import {AuthService} from "../../../../../../auth-service/authService";


export interface PeriodicElement {
  name: string;
  docname: string;
  plan: string;
  servicename: string;
  cdate: string;
  sdate: string;
  clientsign: string;
  status: string;
  documentText: string;
}

@Component({
  selector: 'app-documents-subscriptions',
  templateUrl: './documents-subscriptions.component.html',
  styleUrls: ['./documents-subscriptions.component.scss']
})
export class DocumentsSubscriptionsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'docname', 'plan', 'servicename', 'cdate', 'sdate', 'clientsign', 'status', 'icons'];

  dataSource: any;
  advisorId;

  constructor(public subInjectService: SubscriptionInject, public dialog: MatDialog, public eventService: EventService,
              public subscription: SubscriptionService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getdocumentSubData();
  }

  // dataSource = ELEMENT_DATA;
  Open(value, state, data) {
    this.eventService.sidebarData(value);
    this.subInjectService.rightSideData(state);
    this.subInjectService.addSingleProfile(data);
  }

//   Open(value)
//  {
//    this.subInjectService.rightSideData(value);
//  }


  getdocumentSubData() {
    const obj = {
      advisorId: this.advisorId,
      // advisorId: 12345, // pass here advisor id for Invoice advisor
      clientId: 0,
      flag: 3
    };

    this.subscription.getDocumentData(obj).subscribe(
      data => this.getdocumentResponseData(data)
    );
  }

  getdocumentResponseData(data) {
    console.log(data);
    data.forEach(singleData => {
      singleData.documentText = singleData.docText;
    });
    this.dataSource = data;
  }

  deleteModal(value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }
}
