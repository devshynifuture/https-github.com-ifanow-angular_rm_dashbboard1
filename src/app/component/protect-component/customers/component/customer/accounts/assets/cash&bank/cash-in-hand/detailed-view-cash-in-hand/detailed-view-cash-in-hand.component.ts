import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FileUploadServiceService } from '../../../file-upload-service.service';

@Component({
  selector: 'app-detailed-view-cash-in-hand',
  templateUrl: './detailed-view-cash-in-hand.component.html',
  styleUrls: ['./detailed-view-cash-in-hand.component.scss']
})
export class DetailedViewCashInHandComponent implements OnInit {
  displayedColumns: string[] = ['name', 'position'];
  _data: any;
  ownerName: any;
  cashInHand: any;
  isLoading = false;
  doc: any;
  isLoadingUpload: boolean = false;
  noDoc: boolean = false;
  constructor(private subInjectService: SubscriptionInject, private fileUpload: FileUploadServiceService,) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    console.log('AddLiabilitiesComponent Input data : ', this._data);
    this.cashInHand = this._data;

  }

  get data() {
    return this._data;
  }

  ngOnInit() {
    console.log('AddLiabilitiesComponent ngOnInit : ', this._data);
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
