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
    const data = {
      folioNumber: this.inputData.folioNumber,
      schemeCode: this.inputData.schemeCode
    };
    this.custumService.getBankDetails(data)
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
    const data = {
      folioNumber: this.inputData.folioNumber,
      schemeCode: this.inputData.schemeCode
    };
    this.isNomineeLoading = true;
    this.custumService.getFolioSchemeWiseNomineeDetails(data)
      .subscribe((res: any) => {
        this.isNomineeLoading = false;
        if (res) {
          const decodedRes = JSON.parse(atob(res.payLoad));
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
