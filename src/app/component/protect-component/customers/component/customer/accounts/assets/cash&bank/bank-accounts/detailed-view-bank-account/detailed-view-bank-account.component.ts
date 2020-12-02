import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { FileUploadServiceService } from '../../../file-upload-service.service';

@Component({
  selector: 'app-detailed-view-bank-account',
  templateUrl: './detailed-view-bank-account.component.html',
  styleUrls: ['./detailed-view-bank-account.component.scss']
})
export class DetailedViewBankAccountComponent implements OnInit {
  displayedColumns: string[] = ['name', 'position'];
  _data: any;
  ownerName: any;
  bankAccount: any;
  isLoading = false;
  bankList: any = [];
  doc: any;
  isLoadingUpload: boolean = false;
  noDoc: boolean = false;
  constructor(private subInjectService: SubscriptionInject, private fileUpload: FileUploadServiceService, private enumDataService: EnumDataService, private enumService: EnumServiceService) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    console.log('AddLiabilitiesComponent Input data : ', this._data);
    this.bankAccount = this._data;

  }

  get data() {
    return this._data;
  }

  accountTypes: any = [];
  ngOnInit() {
    this.bankList = this.enumService.getclientFamilybankList();
    console.log(this.bankList, 'AddLiabilitiesComponent ngOnInit : ', this._data);
    this.accountTypes = this.enumDataService.getBankAccountTypes();

    this.isLoadingUpload = true
    this.fileUpload.getAssetsDoc(this._data).then((data) => {
      if (data != 0) {
        this.getMapDoc(data);
      }
      else {
        this.isLoadingUpload = false;
        this.noDoc = true;
      }
    },
      err => {
        this.isLoadingUpload = false;
        this.noDoc = true;
      }
    );
  }

  docType: string;
  getMapDoc(docs) {
    docs.forEach((d, i) => {
      if (d.documentId == this._data.id) {
        this.isLoadingUpload = false;
        this.docType = d.fileOgName.split('.').pop();
        this.doc = d;
        console.log(this.doc, "this.doc 123", this.docType);
      }
      else {
        if (docs.length - 1 == i) {
          if (!this.doc) {
            this.noDoc = true;
          }
          this.isLoadingUpload = false;
        }
      }
    });
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}

export interface PeriodicElement {
  name: string;
  position: string;

}
