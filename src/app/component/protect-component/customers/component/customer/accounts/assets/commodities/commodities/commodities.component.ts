import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { GoldComponent } from '../gold/gold.component';
import { OthersComponent } from '../others/others.component';
import { DetailedViewGoldComponent } from '../gold/detailed-view-gold/detailed-view-gold.component';
import { DetailedViewOthersComponent } from '../others/detailed-view-others/detailed-view-others.component';
import * as Excel from 'exceljs/dist/exceljs';
import { saveAs } from 'file-saver'
import { FormatNumberDirective } from 'src/app/format-number.directive';

@Component({
  selector: 'app-commodities',
  templateUrl: './commodities.component.html',
  styleUrls: ['./commodities.component.scss']
})
export class CommoditiesComponent implements OnInit {
  showRequring: string;
  isLoading: boolean = true;
  displayedColumns9 = ['no', 'owner', 'grams', 'car', 'price', 'mvalue', 'pvalue', 'desc', 'icons'];
  datasource9 = ELEMENT_DATA9;

  displayedColumns10 = ['no', 'owner', 'type', 'mvalue', 'pvalue', 'pur', 'rate', 'desc', 'icons'];
  datasource10 = ELEMENT_DATA10;
  advisorId: any;
  goldList: any;
  otherCommodityList: any;
  clientId: any;
  sumOfMarketValue: any;
  sumOfPurchaseValue: any;
  sumOfMarketValueOther: any;
  sumOfPurchaseValueOther: any;
  footer = [];

  @ViewChild('goldListTable', { static: false }) goldListTableSort: MatSort;
  @ViewChild('otherCommodityListTable', { static: false }) otherCommodityListTableSort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  excelData: any[];

  constructor(private subInjectService: SubscriptionInject, private custumService: CustomerService, private eventService: EventService, public utils: UtilService, public dialog: MatDialog) { }
  ngOnInit() {
    this.showRequring = '1'
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getGoldList()

  }
  async ExportTOExcel(value) {
    this.excelData = []
    var data = []
    if (value == 'Gold') {
      var headerData = [{ width: 20, key: 'Owner' },
      { width: 20, key: 'Tolas/grams' },
      { width: 25, key: 'Carats' },
      { width: 25, key: 'Carat gold price' },
      { width: 18, key: ' Market value' },
      { width: 18, key: 'Purchase value' },
      { width: 15, key: 'Description' },
      { width: 10, key: 'Status' },]
      var header = ['Owner', 'Tolas/grams', 'Carats', 'Carat gold price', 'Market value',
        'Purchase value', 'Description', 'Status'];
      this.goldList.filteredData.forEach(element => {
        data = [element.ownerName, (element.gramsOrTola), (element.carat), (element.caratGoldPrice),
        this.formatNumber.first.formatAndRoundOffNumber(element.marketValue),
        this.formatNumber.first.formatAndRoundOffNumber(element.approximatePurchaseValue),
        element.description, element.status]
        this.excelData.push(Object.assign(data))
      });
      var footerData = ['Total',
        this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMarketValueOther), '',
        this.formatNumber.first.formatAndRoundOffNumber(this.sumOfPurchaseValueOther), '', , '', '',]
      this.footer.push(Object.assign(footerData))
    } else {
      var headerData = [{ width: 20, key: 'Owner' },
      { width: 20, key: 'Type of commodity' },
      { width: 25, key: 'Coupon amount' },
      { width: 18, key: 'Market value' },
      { width: 18, key: 'Purchase value' },
      { width: 18, key: 'Date of purchase' },
      { width: 18, key: 'Growth rate' },
      { width: 15, key: 'Description' },
      { width: 10, key: 'Status' },]
      var header = ['Owner', 'Type of commodity', 'Coupon amount', 'Market value', 'Purchase value',
        'Date of purchase', 'Growth rate', 'Description', 'Status'];
      this.otherCommodityList.filteredData.forEach(element => {
        data = [element.ownerName, (element.commodityTypeId),
        this.formatNumber.first.formatAndRoundOffNumber(element.marketValue),
        (element.purchaseValue), new Date(element.dateOfPurchase),
        (element.growthRate), element.description, element.status]
        this.excelData.push(Object.assign(data))
      });
      var footerData = ['Total','','', this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMarketValue),
        this.formatNumber.first.formatAndRoundOffNumber(this.sumOfPurchaseValue), '', '', '', '']
      this.footer.push(Object.assign(footerData))

    }
    this.exportExcel(headerData, header, this.excelData, this.footer,value)
  }
  async exportExcel(headerData, header, data, footer,value) {
    const wb = new Excel.Workbook()
    const ws = wb.addWorksheet()
    //ws.mergeCells('A1', 'M1');
    const meta1 = ws.getCell('A1')
    const meta2 = ws.getCell('A2')
    const meta3 = ws.getCell('A3')
    meta1.font = { bold: true }
    meta2.font = { bold: true }
    meta3.font = { bold: true }
    ws.getCell('A1').value = 'Type of report - ' + value;
    ws.getCell('A2').value = 'Client name - Rahul Jain';
    ws.getCell('A3').value = 'Report as on - ' + new Date();
    const head = ws.getRow(5)
    head.font = { bold: true }
    head.fill = {
      type: 'pattern',
      pattern: 'darkVertical',
      fgColor: {
        argb: '#f5f7f7'
      }
    };
    ws.getRow(5).values = header;
    ws.columns.alignment = { horizontal: 'left' };
    ws.columns = headerData
    data.forEach(element => {
      ws.addRow(element)
    });
    footer.forEach(element => {
      const last = ws.addRow(element)
      last.font = { bold: true }
    });
    const buf = await wb.xlsx.writeBuffer()
    saveAs(new Blob([buf]), 'Rahul Jain-' + value + '-' + new Date() + '.xlsx')
  }
  getfixedIncomeData(value) {
    console.log('value++++++', value)
    this.showRequring = value
    if (value == '1') {
      this.getGoldList()
    } else {
      this.getOtherList()
    }
  }
  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        if (value == 'GOLD') {
          this.custumService.deleteGold(data.id).subscribe(
            data => {
              this.eventService.openSnackBar("Gold is deleted", "dismiss")
              dialogRef.close();
              this.getGoldList()
            },
            err => this.eventService.openSnackBar(err)
          )
        } else {
          this.custumService.deleteOther(data.id).subscribe(
            data => {
              this.eventService.openSnackBar("Others is deleted", "dismiss")
              dialogRef.close();
              this.getOtherList()
            },
            err => this.eventService.openSnackBar(err)
          )
        }
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
  getGoldList() {
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.custumService.getGold(obj).subscribe(
      data => this.getGoldRes(data)
    );
  }
  getGoldRes(data) {
    console.log('getGoldList @@@@', data);
    this.isLoading = false;
    this.goldList = new MatTableDataSource(data.goldList);
    this.goldList.sort = this.goldListTableSort;
    this.sumOfMarketValue = data.sumOfMarketValue
    this.sumOfPurchaseValue = data.sumOfPurchaseValue
  }
  getOtherList() {
    this.isLoading = true;
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.custumService.getOthers(obj).subscribe(
      data => this.getOthersRes(data)
    );
  }
  getOthersRes(data) {
    console.log('getOthersRes @@@@', data);
    this.isLoading = false;

    this.otherCommodityList = new MatTableDataSource(data.otherCommodityList);
    this.otherCommodityList.sort = this.otherCommodityListTableSort;
    this.sumOfMarketValueOther = data.sumOfMarketValue
    this.sumOfPurchaseValueOther = data.sumOfPurchaseValue
  }
  openCommodities(value, state, data) {
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: GoldComponent,

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (value == 'addedGold') {
          this.getGoldList()
        } else {
          this.getOtherList()
        }
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
  openOthers(value, state, data) {
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: OthersComponent,

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (value == 'addedGold') {
          this.getGoldList()
        } else {
          this.getOtherList()
        }
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
  detailedViewGold(flagValue, data) {
    const fragmentData = {
      flag: flagValue,
      id: 1,
      data: data,
      state: 'open35',
      componentName: DetailedViewGoldComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
  detailedViewOthers(flagValue, data) {
    const fragmentData = {
      flag: flagValue,
      id: 1,
      data: data,
      state: 'open35',
      componentName: DetailedViewOthersComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
export interface PeriodicElement9 {
  no: string;
  owner: string;
  grams: string;
  car: string;
  price: string;
  mvalue: string;
  pvalue: string;
  desc: string;
}

const ELEMENT_DATA9: PeriodicElement9[] = [
  {
    no: '1.', owner: 'Rahul Jain'
    , grams: "50 tolas", car: "24", price: "32,000(as on 20/08/2019)",
    mvalue: "60,000", pvalue: "60,000", desc: "ICICI FD", 
  },
  {
    no: '2.', owner: 'Rahul Jain'
    , grams: "25 tolas", car: "24", price: "32,000(as on 20/08/2019)",
    mvalue: "60,000", pvalue: "60,000", desc: "ICICI FD", 
  },
  {
    no: '', owner: 'Total'
    , grams: "", car: "", price: "",
    mvalue: "1,28,925", pvalue: "1,20,000", desc: "", 
  },

];
export interface PeriodicElement10 {
  no: string;
  owner: string;
  type: string;
  mvalue: string;
  pvalue: string;
  pur: string;
  rate: string;
  desc: string;
}

const ELEMENT_DATA10: PeriodicElement10[] = [

  {
    no: '1.', owner: 'Rahul Jain'
    , type: "Cumulative", mvalue: "60,000", pvalue: "1,00,000", pur: "18/09/2021", rate: "8.40%", desc: "ICICI FD",
  },

  {
    no: '2.', owner: 'Shilpa Jain'
    , type: "Cumulative", mvalue: "60,000", pvalue: "1,00,000", pur: "18/09/2021", rate: "8.40%", desc: "ICICI FD", 
  },
  {
    no: '', owner: 'Total'
    , type: "", mvalue: "1,20,000", pvalue: "1,50,000", pur: "", rate: "", desc: "",
  },

];
