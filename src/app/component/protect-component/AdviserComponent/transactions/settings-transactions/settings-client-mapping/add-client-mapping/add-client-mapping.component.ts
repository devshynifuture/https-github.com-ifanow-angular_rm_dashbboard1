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
  displayedColumns: string[] = ['checkbox', 'no', 'name', 'weight', 'symbol', 'hname'];
  singleFolioData: any;
  folioForm: any;
  advisorId: any;
  clientId: any;
  nomineesListFM: any;
  familyMemberId: any;
  familyMemberData: any;
  ownerName: any;
  clientCodeData: any;
  selectedIIN: any;

  constructor(private eventService: EventService, private subInjectService: SubscriptionInject, private fb: FormBuilder, private onlineTransact: OnlineTransactionService) {
  }

  set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.singleFolioData = data;
    console.log(this.singleFolioData);
    this.folioForm = this.fb.group({
      ownerName: [, [Validators.required]]
    });
  }

  ngOnInit() {
  }

  lisNominee(value) {
    console.log(value);
    if (value == null) {
      this.folioForm.get('ownerName').setErrors({ 'setValue': 'family member does not exist' });
      this.folioForm.get('ownerName').markAsTouched();
    }
    this.nomineesListFM = Object.assign([], value);
  }

  checkInputData(value) {
    if (value.data == null) {
      this.familyMemberData = undefined;
      this.clientCodeData = undefined;
    }
  }

  selectedIINUCC(value) {
    console.log(value);
    this.selectedIIN = value;
  }

  ownerDetails(value, type) {
    this.familyMemberId = value.id;
    this.familyMemberData = value;
    console.log(value);
    if (type == 'folio') {
      const obj = {
        clientId: value.clientId,
        advisorId: value.advisorId,
        familyMemberId: value.familyMemberId,
        tpUserCredentialId: this.singleFolioData.selectedBroker.id

      };
      // let obj = {
      //   "advisorId": 414,
      //   "familyMemberId": 112166,
      //   "clientId": 53637
      // }
      this.onlineTransact.getClientCodes(obj).subscribe(
        data => {
          console.log(data);
          this.clientCodeData = data;
        },
        err => this.eventService.openSnackBar(err, 'dismiss')
      );
    }
  }

  mapUnmapClient() {
    const obj = {
      clientCode: this.singleFolioData.clientCode,
      familyMemberId: this.familyMemberData.familyMemberId,
      clientId: this.familyMemberData.clientId,
      taxStatus: this.singleFolioData.taxStatus,
      holdingType: this.singleFolioData.holdingType,
      aggregatorType: this.singleFolioData.aggregatorType,
      advisorId: this.advisorId,
      tpUserCredentialId: this.singleFolioData.selectedBroker.id

    };
    this.onlineTransact.mapUnmappedClient(obj).subscribe(
      data => {
        console.log(data);
        this.close();
      },
      err => this.eventService.openSnackBar(err, 'dismiss')
    );
  }

  mapUnmapFolio() {
    const obj = {
      clientId: this.familyMemberData.clientId,
      familyMemberId: this.selectedIIN.familyMemberId,
      clientCode: this.selectedIIN.clientCode,
      folioNumber: this.singleFolioData.folioNumber,
      tpUserCredentialId: this.singleFolioData.selectedBroker.id
    };
    this.onlineTransact.mapUnmappedFolios(obj).subscribe(
      data => {
        console.log(data);
        this.close();
      },
      err => this.eventService.openSnackBar(err, 'dismiss')
    );
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
