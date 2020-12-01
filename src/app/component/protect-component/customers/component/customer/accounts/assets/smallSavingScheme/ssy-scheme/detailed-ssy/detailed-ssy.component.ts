import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { FileUploadServiceService } from '../../../file-upload-service.service';

@Component({
  selector: 'app-detailed-ssy',
  templateUrl: './detailed-ssy.component.html',
  styleUrls: ['./detailed-ssy.component.scss']
})
export class DetailedSsyComponent implements OnInit {
  nominee: any;
  isLoading = false;
  bankList: any = [];
  doc: any;
  isLoadingUpload: boolean = false;
  noDoc: boolean = false;
  constructor(private subInjectService: SubscriptionInject, private fileUpload: FileUploadServiceService, private enumService: EnumServiceService) {
  }

  data;

  clientFamilybankList: any = [];
  ngOnInit() {
    this.bankList = this.enumService.getBank();
    this.clientFamilybankList = this.enumService.getclientFamilybankList();
    console.log(this.bankList, 'this.bankList', this.clientFamilybankList);
    console.log('DetailedSsysComponent ngOnInit data : ', this.data);
    this.nominee = this.data.nominees;

    this.isLoadingUpload = true
    this.fileUpload.getAssetsDoc(this.data).then((data) => {
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
      if (d.documentId == this.data.id) {
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
