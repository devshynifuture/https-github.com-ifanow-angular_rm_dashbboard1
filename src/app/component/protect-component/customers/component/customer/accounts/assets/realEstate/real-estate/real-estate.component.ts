import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from '../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { AddRealEstateComponent } from '../add-real-estate/add-real-estate.component';
import { DetailedViewRealEstateComponent } from '../detailed-view-real-estate/detailed-view-real-estate.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';

@Component({
  selector: 'app-real-estate',
  templateUrl: './real-estate.component.html',
  styleUrls: ['./real-estate.component.scss']
})
export class RealEstateComponent implements OnInit {

  isLoading = false;
  advisorId: any;
  data: Array<any> = [{}, {}, {}];
  datasource3 = new MatTableDataSource(this.data);
  clientId: any;
  ownerName: any;
  sumOfMarketValue: any;
  sumOfpurchasedValue: any;
  footer = [];
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  displayedColumns3 = ['no', 'owner', 'type', 'value', 'pvalue', 'desc', 'status', 'icons'];
  excelData: any[];
  noData: string;

  constructor( public subInjectService: SubscriptionInject,
    public custmService: CustomerService, public cusService: CustomerService, private excel:ExcelGenService,  private pdfGen:PdfGenService,
    public eventService: EventService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();

    this.getRealEstate();

  }

  Excel(tableTitle){
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows,tableTitle)
  }

  pdf(tableTitle){
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.pdfGen.generatePdf(rows, tableTitle);
  }

  // async ExportTOExcel(value) {

  //   this.excelData = [];
  //   let data = [];
  //   let headerData = [{ width: 20, key: 'Owner' },
  //   { width: 20, key: 'Type' },
  //   { width: 10, key: 'Rate' },
  //   { width: 20, key: 'Market Value' },
  //   { width: 15, key: 'Purchase Value' },
  //   { width: 15, key: 'Description' },
  //   { width: 10, key: 'Status' },];
  //   let header = ['Owner', 'Type', 'Rate', 'Market Value',
  //     'Purchase Value', 'Description', 'Status'];
  //   this.datasource3.filteredData.forEach(element => {
  //     data = [element.ownerName, ((element.typeId == 1) ? 'Residential' : (element.typeId == 2) ? 'Secondary' : (element.typeId == 3) ? 'Commercial' : 'Land'), (element.rate),
  //     this.formatNumber.first.formatAndRoundOffNumber(element.marketValue), (element.purchaseValue), element.description, element.status];
  //     this.excelData.push(Object.assign(data));
  //   });
  //   let footerData = ['Total', '',
  //     this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMarketValue), '',
  //     this.formatNumber.first.formatAndRoundOffNumber(this.sumOfpurchasedValue), '', ''];
  //   this.footer.push(Object.assign(footerData));
  //   ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  // }
  // // datasource3 = ELEMENT_DATA3;

  getRealEstate() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.datasource3.data = [{}, {}, {}];
    this.custmService.getRealEstate(obj).subscribe(
      data => this.getRealEstateRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.datasource3.data = [];
        this.isLoading = false;
      });
  }

  getRealEstateRes(data) {
    this.isLoading = false;
    if (data == undefined) {
      this.noData = 'No Real estate found';
      this.datasource3.data = [];
      this.hideFilter = true;
    }
    else if (data.assetList.length > 0) {
      console.log('getRealEstateRes', data);
      // data.realEstateList.forEach(element => {
      //   if (element.ownerList.length != 0) {
      //     const array = element.ownerList;
      //     const ownerName = array.filter(element => element.owner != false)
      //     if (ownerName.length != 0) {
      //       this.ownerName = ownerName[0].ownerName;
      //       element.ownerName = this.ownerName;
      //     }
      //   }
      // });
      this.dataList = data.assetList;
      this.datasource3.data = data.assetList;
      this.datasource3.sort = this.sort;
      this.sumOfMarketValue = data.sumOfMarketValue;
      this.sumOfpurchasedValue = data.sumOfPurchaseValue;
    } else {
      this.noData = 'No schemes found';
      this.datasource3.data = [];
    }
  }

  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deleteRealEstate(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("Deleted successfully!", "Dismiss");
            dialogRef.close();
            this.getRealEstate();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  open(value, data) {
    let popupHeaderText = !!data ? 'Edit Real estate' : 'Add Real estate';
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AddRealEstateComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getRealEstate();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  activeFilter:any = 'All';
  dataList:any;
  hideFilter:boolean = false;
  filterData(key: string, value: any) {
    
    let dataFiltered = [];
    this.activeFilter = value;
    if(value == "All" || value == "LIVE"){ //status is hardcoded not coming from backend
      dataFiltered = this.dataList;
    }
    else{
      dataFiltered = this.dataList.filter(function (item) {
        return item[key] === value;
      });
      if(dataFiltered.length <= 0){
        this.hideFilter = false;
      }
    }
    
    this.datasource3.data = dataFiltered;
    // this.dataSource = new MatTableDataSource(data);
    this.datasource3.sort = this.sort;
  }
  detailedViewRealEstate(data) {
    const fragmentData = {
      flag: 'DetailedViewRealEstateComponent',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedViewRealEstateComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isRefreshRequired(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);

        }
        rightSideDataSub.unsubscribe();
      }
    );
  }
}

export interface PeriodicElement3 {
  no: string;
  owner: string;
  type: string;
  value: string;
  pvalue: string;
  desc: string;
  status: string;
}

const ELEMENT_DATA3: PeriodicElement3[] = [
  {
    no: '1.',
    owner: 'Rahul Jain',
    type: 'Type',
    value: '60,000',
    pvalue: '60,000',
    desc: 'ICICI FD',
    status: ''
  },
  {
    no: '1.',
    owner: 'Rahul Jain',
    type: 'Type',
    value: '60,000',
    pvalue: '60,000',
    desc: 'ICICI FD',
    status: ''
  },
  { no: ' ', owner: 'Total', type: '', value: '1,28,925', pvalue: '1,28,925', desc: '', status: '' },
];
