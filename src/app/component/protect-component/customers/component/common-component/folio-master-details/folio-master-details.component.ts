import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../customer/customer.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-folio-master-details',
  templateUrl: './folio-master-details.component.html',
  styleUrls: ['./folio-master-details.component.scss']
})
export class FolioMasterDetailsComponent implements OnInit {
  inputData: any;
  folioDetails = [];
  isLoading: boolean;
  isNomineeLoading = false;
  nomineeArray = [];
  bankDetails: any;
  obj: any;
  msgForFranklin: string;

  constructor(private subInjectService: SubscriptionInject, private custumService: CustomerService, private eventService: EventService) {
  }

  @Input()
  set data(data) {
    this.isLoading = true;
    this.inputData = data;
    this.getFolioMasterDetails(this.inputData);
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.getBankDetails()
  }

  getFolioMasterDetails(data) {
    const obj = {
      mfId: this.inputData.id
    };
    this.custumService.getMfFolioMaster(obj).subscribe(
      data => this.getFolioMasterResponse(data), (error) => {
        this.isLoading = false;
        this.folioDetails = [];
      }
    );
  }
  getBankDetails() {
    this.bankDetails = []
    if (this.inputData.rtMasterId == 3) {
      this.msgForFranklin = 'We havent been able to identify the bank account associated with this scheme because franklin doesnt provide scheme code in folio files hence, we are showing all the accounts related to this folio'
      this.obj = {
        folioNumber: this.inputData.folioNumber,
      };
    } else {
      this.obj = {
        folioNumber: this.inputData.folioNumber,
        schemeCode: this.inputData.schemeCode
      };
    }
    this.custumService.getBankDetails(this.obj)
      .subscribe(res => {
        if (res) {
          console.log("bank details", res)
          this.bankDetails = res;
        } else {
          this.bankDetails = [];
        }
      }, err => {
        console.error(err);
      })
  }
  onTabChanged(event) {
    if (event.index == 2) {
      if (this.nomineeArray.length == 0) {
        this.getNomineeDetailsFolioSchemeWise();
      }
    }
    console.log(this.inputData);
  }

  getNomineeDetailsFolioSchemeWise() {
    this.isLoading = true
    if (this.inputData.rtMasterId == 3) {
      this.obj = {
        folioNumber: this.inputData.folioNumber,
      };
    } else {
      this.obj = {
        folioNumber: this.inputData.folioNumber,
        schemeCode: this.inputData.schemeCode
      };
    }
    this.isNomineeLoading = true;
    this.custumService.getFolioSchemeWiseNomineeDetails(this.obj)
      .subscribe((res: any) => {
        this.isNomineeLoading = false;
        if (res) {
          const decodedRes = res;
          this.isLoading = false
          console.log('nominee daata', decodedRes);
          this.nomineeArray = [...decodedRes];
        } else {
          this.nomineeArray = [];
        }
      }, err => {
        this.nomineeArray = [];
        this.isNomineeLoading = true;
        console.error(err);
        this.eventService.showErrorMessage(err);
      });
  }

  getFolioMasterResponse(data) {
    this.isLoading = false;
    console.log(data);
    // this.folioDetails=data.folioMasterList;
    if (data) {
      this.folioDetails = data;
    } else {
      this.folioDetails = [];
    }
  }

  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

}
