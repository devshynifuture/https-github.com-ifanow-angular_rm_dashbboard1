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
  singleFolioData: any;
  folioForm: any;
  advisorId: any;
  clientId: any;
  nomineesListFM: any;
  familyMemberId: any;
  familyMemberData: any;
  ownerName: any;
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
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value);
  }
  checkInputData(value) {
    (value.data == null) ? this.familyMemberData = undefined : console.log("data is Present")
  }
  ownerDetails(value) {
    this.familyMemberId = value.id;
    this.familyMemberData = value;
  }
  mapUnmapClient() {
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