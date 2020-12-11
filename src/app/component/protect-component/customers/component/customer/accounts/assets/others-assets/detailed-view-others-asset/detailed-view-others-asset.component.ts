import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FileUploadServiceService } from '../../file-upload-service.service';

@Component({
  selector: 'app-detailed-view-others-asset',
  templateUrl: './detailed-view-others-asset.component.html',
  styleUrls: ['./detailed-view-others-asset.component.scss']
})
export class DetailedViewOthersAssetComponent implements OnInit {
  displayedColumns: string[] = ['name', 'position'];
  _data: any;
  ownerName: any;
  realEstate: any;
  nominee: any;
  owners: any;

  doc: any;
  isLoadingUpload: boolean = false;
  noDoc: boolean = false;
  constructor(private subInjectService: SubscriptionInject, private fileUpload: FileUploadServiceService) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    console.log('AddLiabilitiesComponent Input data : ', this._data);
    this.realEstate = this._data
    this.nominee = this._data.nominees;
    // this.owners = this._data.realEstateOwners.filter(element => element.ownerName != this.realEstate.ownerName);
    this.isLoadingUpload = true;
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

  get data() {
    return this._data;
  }
  ngOnInit() {
    console.log('AddLiabilitiesComponent ngOnInit : ', this._data);
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
