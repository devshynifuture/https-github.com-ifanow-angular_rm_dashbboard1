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
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  data: any;
  schemeList: any = [];
  isLoading = false;

  dataSource: any = new MatTableDataSource();
  @ViewChild('epfListTable', { static: false }) holdingsTableSort: MatSort;
  // displayedColumns = ['name', 'nav', 'units', 'amount', 'value'];
  name: any;
  bankList: any = [];
  clientFamilybankList: any = [];

  doc: any;
  isLoadingUpload: boolean = false;
  noDoc: boolean = false;
  dematList: any;

  constructor(private custumService: CustomerService, private enumService: EnumServiceService, private subInjectService: SubscriptionInject, private fileUpload: FileUploadServiceService) {
  }

  ngOnInit() {
    this.bankList = this.enumService.getBank();
    this.clientFamilybankList = this.enumService.getclientFamilybankList();
    console.log(this.bankList, "bank", this.clientFamilybankList);
    this.dataSource = this.data.sovereignGoldTransactionList;
    this.getGlobalList();
    this.bankAccountList();
    this.getDematList(this.data);
    this.isLoadingUpload = true;
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

  bankAccountList() {
    const array = [];
    const obj = {
      userId: this.data.ownerList[0].familyMemberId == this.data.clientId ? this.data.clientId : 0,
      userType: (this.data.ownerList[0].familyMemberId == this.data.clientId) ? 2 : 3
    };
    array.push(obj);
    this.custumService.getBankList(array).subscribe(
      (data) => {
        if (data) {
          this.bankList = data;
          this.bankList.forEach(element => {
            if (element.id == this.data.linkedBankAccount) {
              this.data.bankName = element.bankName;
            }
          });
        }
        this.enumService.addBank(this.bankList);
      },
      (err) => {
        this.bankList = [];
      }
    );


    // this.bankList = value;

  }
  getDematList(data) {
    const obj = {
      userId: this.data.ownerList[0].familyMemberId == this.data.clientId ? this.data.clientId : 0,
      userType: (this.data.ownerList[0].familyMemberId == this.data.clientId) ? 2 : 3
    };
    this.custumService.getDematList(obj).subscribe(
      data => {
        if (data) {
          this.dematList = data;
          this.dematList.forEach(element => {
            if (element.dematId == this.data.linkedDematAccount) {
              this.data.dematBankName = element.brokerName + '-' + element.dematClientId;
              ;
            }
          });
        }
        this.enumService.addBank(this.bankList);
      }, err => {
        this.bankList = [];

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
