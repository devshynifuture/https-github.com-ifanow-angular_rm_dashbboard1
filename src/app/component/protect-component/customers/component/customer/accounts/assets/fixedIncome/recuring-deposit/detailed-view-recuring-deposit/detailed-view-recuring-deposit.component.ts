import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { CustomerService } from '../../../../../customer.service';
import { FileUploadServiceService } from '../../../file-upload-service.service';

@Component({
  selector: 'app-detailed-view-recuring-deposit',
  templateUrl: './detailed-view-recuring-deposit.component.html',
  styleUrls: ['./detailed-view-recuring-deposit.component.scss']
})
export class DetailedViewRecuringDepositComponent implements OnInit {
  inputData: any;
  recuringDeposit: any;
  bankList: any = [];
  doc: any;
  isLoadingUpload: boolean = false;
  noDoc: boolean = false;
  constructor(public utils: UtilService, private subInjectService: SubscriptionInject, private enumService: EnumServiceService, private fileUpload: FileUploadServiceService) { }
  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }

  clientFamilybankList: any = [];
  ngOnInit() {
    this.bankList = this.enumService.getBank();
    this.clientFamilybankList = this.enumService.getclientFamilybankList();
    console.log(this.bankList, 'this.bankList', this.clientFamilybankList);
    this.recuringDeposit = this.inputData;
    this.isLoadingUpload = true;
    this.fileUpload.getAssetsDoc(this.inputData).then((data) => {
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
      if (d.documentId == this.inputData.id) {
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
