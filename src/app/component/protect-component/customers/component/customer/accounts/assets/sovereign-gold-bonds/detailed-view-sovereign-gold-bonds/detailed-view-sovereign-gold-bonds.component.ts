import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../../../../customer.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { FileUploadServiceService } from '../../file-upload-service.service';

@Component({
  selector: 'app-detailed-view-sovereign-gold-bonds',
  templateUrl: './detailed-view-sovereign-gold-bonds.component.html',
  styleUrls: ['./detailed-view-sovereign-gold-bonds.component.scss']
})
export class DetailedViewSovereignGoldBondsComponent implements OnInit {
  npsData: any;
  schemeList: any = [];
  isLoading = false;

  dataSource: any = new MatTableDataSource();
  @ViewChild('epfListTable', { static: false }) holdingsTableSort: MatSort;
  displayedColumns = ['name', 'nav', 'units', 'amount', 'value'];
  name: any;
  bankList: any = [];
  clientFamilybankList: any = [];

  doc: any;
  isLoadingUpload: boolean = false;
  noDoc: boolean = false;

  constructor(private custumService: CustomerService, private enumService: EnumServiceService, private subInjectService: SubscriptionInject, private fileUpload: FileUploadServiceService) {
  }

  ngOnInit() {
    this.bankList = this.enumService.getBank();
    this.clientFamilybankList = this.enumService.getclientFamilybankList();
    console.log(this.bankList, "bank", this.clientFamilybankList);

    this.getGlobalList();
    this.isLoadingUpload = true;
    this.fileUpload.getAssetsDoc(this.npsData).then((data) => {
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


  getGlobalList() {
    this.custumService.getSchemeChoice().subscribe(
      data => this.getGlobalRes(data)
    );
  }

  getGlobalRes(data) {

    console.log('getGlobalRes', data);
    this.schemeList = data.npsSchemeList;
  }

  docType: string;
  getMapDoc(docs) {
    docs.forEach((d, i) => {
      if (d.documentId == this.npsData.id) {
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
