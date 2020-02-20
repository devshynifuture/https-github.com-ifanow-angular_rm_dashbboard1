import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-client-mapping',
  templateUrl: './add-client-mapping.component.html',
  styleUrls: ['./add-client-mapping.component.scss']
})
export class AddClientMappingComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'hname'];
  dataSource = ELEMENT_DATA;
  singleFolioData: any;
  folioForm: any;
  advisorId: any;
  clientId: any;
  nomineesListFM: any;
  familyMemberId: any;
  familyMemberData: any;
  constructor(private eventService: EventService, private subInjectService: SubscriptionInject, private fb: FormBuilder, private onlineTransact: OnlineTransactionService) { }
  set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.singleFolioData = data;
    console.log(this.singleFolioData)
    this.folioForm = this.fb.group({
      ownerName: [, [Validators.required]]
    })
  }
  ngOnInit() {
  }
  getFamilyList(value) {
    (value == '') ? this.familyMemberData = undefined : '';
    let obj = {
      advisorId: this.advisorId,
      name: value
    }
    if (value.length > 2) {
      this.onlineTransact.getFamilyMemberList(obj).subscribe(
        data => this.getFamilyMemberListRes(data)
      );
    }
  }
  getFamilyMemberListRes(data) {
    console.log('getFamilyMemberListRes', data)
    this.nomineesListFM = data.familyMembers
  }
  ownerDetails(value) {
    this.familyMemberId = value.id;
    this.familyMemberData = value;
  }
  mapUnmapFolios() {
    let obj = {
      clientCode: this.singleFolioData.clientCode,
      familyMemberId: this.familyMemberData.familyMemberId,
      clientId: this.familyMemberData.clientId,
      taxStatus: this.singleFolioData.taxStatus,
      holdingType: this.singleFolioData.holdingType,
      holdingDesc: ''
    }
    this.onlineTransact.mapUnmappedFolios(obj).subscribe(
      data => {
        console.log(data);
        this.close();
      },
      err => this.eventService.openSnackBar(err, "dismiss")
    )
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  hname: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'NSE', name: 'ARN-83865', weight: '5011102595', symbol: 'Joint', hname: 'Vishal A Shah' },
  { position: 'BSE', name: 'ARN-83865', weight: '5011102595', symbol: 'Joint', hname: 'Vishal A Shah' },
];