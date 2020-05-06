import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../../excel.service';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ReconciliationService } from 'src/app/component/protect-component/AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { MfServiceService } from '../../mf-service.service';

@Component({
  selector: 'app-mutual-funds-capital',
  templateUrl: './mutual-funds-capital.component.html',
  styleUrls: ['./mutual-funds-capital.component.scss']
})
export class MutualFundsCapitalComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  displayedColumns: string[] = ['schemeName', 'folioNumber', 'investorName', 'stGain', 'stLoss', 'ltGain', 'indexedGain', 'liloss', 'indexedLoss'];
  // dataSource = ;
  dataSource=new MatTableDataSource([{},{},{}]);
  displayedColumns1: string[] = ['schemeName1', 'folioNumber', 'investorName', 'stGain', 'stLoss', 'ltGain', 'indexedGain', 'liloss', 'indexedLoss'];
  // dataSource1 = ELEMENT_DATA1;
  dataSource1=new MatTableDataSource([{},{},{}]);
  displayedColumns2: string[] = ['schemeName2', 'folioNumber', 'dividendPayoutAmount', 'dividendReInvestmentAmount', 'totalReinvestmentAmount'];
  // dataSource2 = ELEMENT_DATA2;
  dataSource2 =new MatTableDataSource([{},{},{}]);
  excelData: any[];
  footer=[];
  stGain: number;
  indexedGain: number;
  parentId: any;
  advisorId: any;
  clientId: any;
  adminAdvisorIds: any[] = [];
  categoryData : any[] =[];
  mfList: any[];
  mutualFundTransactions: any[];
  purchaseTransaction: any[];
  redemptiontransaction: any[];
  isLoading :Boolean;

  constructor(private custumService:CustomerService,private eventService:EventService,private reconService:ReconciliationService,private MfServiceService: MfServiceService) { }

  ngOnInit() {
    this.stGain=875.32;
    this.indexedGain=125.4,
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.parentId = AuthService.getUserInfo().parentId
    this.getAdvisorData();

  }
  getAdvisorData(){
    this.isLoading = true;
    this.reconService.getTeamMemberListValues({ advisorId: this.advisorId })
    .subscribe(data => {
      if (data && data.length !== 0) {
        data.forEach(element => {
          this.adminAdvisorIds.push(element.adminAdvisorId);
        });
        this.getCapitalgain();
      } else {
        this.adminAdvisorIds = [...this.advisorId];
      }
    });
  
  }
  getCapitalgain(){
    const obj = {
      advisorIds: [2929],
      clientId: 15545,
      parentId :0

    };
    this.custumService.capitalGainGet(obj).subscribe(
      data => this.getCapitalgainRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getCapitalgainRes(data){
    this.isLoading = false;
    console.log(data);
    this.categoryData =data;
    let catObj = this.MfServiceService.categoryFilter(this.categoryData,'category');
    let debtData = this.filterCategoryWise(catObj['DEBT']);
    let equityData =  this.filterCategoryWise(catObj['EQUITY']);
    this.dataSource = new MatTableDataSource(debtData);
    this.dataSource1 = new MatTableDataSource(equityData);
  }
  filterCategoryWise(data){
    this.mfList =this.MfServiceService.filter(data, 'mutualFund');
    this.mutualFundTransactions =this.MfServiceService.filter(this.mfList, 'mutualFundTransactions');
    this.purchaseTransaction=this.MfServiceService.filter(this.mfList, 'purchaseTransactions');
    this.redemptiontransaction =this.MfServiceService.filter(this.mfList, 'redemptionTransactions');
    return this.mfList;
  }

  ExportTOExcel(data) {
    console.log(data);
  }
} 

export interface PeriodicElement {
  schemeName: string;
  folioNumber: string;
  investorName: string;
  stGain: number;
  stLoss: number;
  ltGain: number;
  indexedGain: number;
  liloss: number;
  indexedLoss: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {schemeName: 'Agreements & invoices', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87},
  {schemeName: 'Agreements & invoices', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87},
  {schemeName: 'Agreements & invoices', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87},
  {schemeName: 'Agreements & invoices', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87},
  {schemeName: 'Total', folioNumber: '', investorName: '', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87},
];


export interface PeriodicElement1 {
  schemeName1: string;
  folioNumber: string;
  investorName: string;
  stGain: number;
  stLoss: number;
  ltGain: number;
  indexedGain: number;
  liloss: number;
  indexedLoss: number;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {schemeName1: 'DSP Tax Saver Fund - Regular Plan - Growth', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87},
  {schemeName1: 'DSP Tax Saver Fund - Regular Plan - Growth', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87},
  {schemeName1: 'DSP Tax Saver Fund - Regular Plan - Growth', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87},
  {schemeName1: 'DSP Tax Saver Fund - Regular Plan - Growth', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87},
  {schemeName1: 'DSP Tax Saver Fund - Regular Plan - Growth', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87},
  {schemeName1: 'Total', folioNumber: '', investorName: '', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87},
];
 


export interface PeriodicElement2 {
  schemeName2: string;
  folioNumber: string;
  dividendPayoutAmount: string;
  dividendReInvestmentAmount: string;
  totalReinvestmentAmount: string;   
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {schemeName2: 'DSP Tax Saver Fund - Regular Plan - Growth', folioNumber: '15093075', dividendPayoutAmount: '111,94,925.22', dividendReInvestmentAmount: '23,550', totalReinvestmentAmount: '23,550',},
  {schemeName2: 'Total', folioNumber: ' ', dividendPayoutAmount: '111,94,925.22', dividendReInvestmentAmount: '23,550', totalReinvestmentAmount: '23,550',},
  
];