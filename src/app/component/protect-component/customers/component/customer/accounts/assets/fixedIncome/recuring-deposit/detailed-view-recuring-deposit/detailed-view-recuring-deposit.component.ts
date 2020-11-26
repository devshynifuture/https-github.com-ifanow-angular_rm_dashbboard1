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
    this.fileUpload.getAssetsDoc(this.inputData).then((data) => {
      this.getMapDoc(data);
    });

  }
  docType: string;
  getMapDoc(docs) {
    docs.forEach(d => {
      if (d.documentId == this.inputData.id) {

        this.docType = d.fileOgName.split('.').pop();
        this.doc = d;
        console.log(this.doc, "this.doc 123", this.docType);
      }
    });
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
