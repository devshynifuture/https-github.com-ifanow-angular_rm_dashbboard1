import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { FileUploadServiceService } from '../../../file-upload-service.service';

@Component({
  selector: 'app-detailed-view-bonds',
  templateUrl: './detailed-view-bonds.component.html',
  styleUrls: ['./detailed-view-bonds.component.scss']
})
export class DetailedViewBondsComponent implements OnInit {
  inputData: any;
  bonds: any;
  bankList: any = [];
  constructor(public utils: UtilService, private subInjectService: SubscriptionInject, private enumService: EnumServiceService, private fileUpload: FileUploadServiceService) { }
  @Input()
  set data(data) {
    this.inputData = data;
  }
  get data() {
    return this.inputData;
  }
  doc: any;
  matured: boolean = false;
  clientFamilybankList: any = [];
  ngOnInit() {
    this.bankList = this.enumService.getBank();
    this.clientFamilybankList = this.enumService.getclientFamilybankList();
    console.log(this.bankList, 'this.bankList', this.clientFamilybankList);
    this.bonds = this.inputData;
    if (new Date(this.inputData.maturityDate).getTime() < new Date().getTime()) {
      this.matured = true;
    }
    else {
      this.matured = false;
    }
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
