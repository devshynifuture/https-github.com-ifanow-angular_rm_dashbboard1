import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../../excel.service';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-mutual-funds-capital',
  templateUrl: './mutual-funds-capital.component.html',
  styleUrls: ['./mutual-funds-capital.component.scss']
})
export class MutualFundsCapitalComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  displayedColumns: string[] = ['schemeName', 'folioNumber', 'investorName', 'stGain', 'stLoss', 'ltGain', 'indexedGain', 'liloss', 'indexedLoss'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = ['schemeName1', 'folioNumber', 'investorName', 'stGain', 'stLoss', 'ltGain', 'indexedGain', 'liloss', 'indexedLoss'];
  dataSource1 = ELEMENT_DATA1;

  displayedColumns2: string[] = ['schemeName2', 'folioNumber', 'dividendPayoutAmount', 'dividendReInvestmentAmount', 'totalReinvestmentAmount'];
  dataSource2 = ELEMENT_DATA2;
  excelData: any[];
  footer=[];
  stGain: number;
  indexedGain: number;
  parentId: any;
  advisorId: any;
  clientId: any;

  constructor(private custumService:CustomerService,private eventService:EventService) { }

  ngOnInit() {
    this.stGain=875.32;
    this.indexedGain=125.4,
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.parentId = AuthService.getUserInfo().parentId
    this.getCapitalgain();
  }
  getCapitalgain(){
    // this.isLoading = true;
    // this.changeInput.emit(true);
    const obj = {
      advisorIds:[2929],
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
    console.log(data);
  }
  /**used for excel */
  async ExportTOExcel(value) {
    this.excelData = []
    var data = []
    var headerData = [{ width: 20, key: 'Scheme name' },
    { width: 20, key: 'Folio number ' },
    { width: 20, key: 'Investor name ' },
    { width: 18, key: 'ST gain' },
    { width: 18, key: 'ST loss ' },
    { width: 18, key: 'LT gain' },
    { width: 25, key: 'Indexed gain' },
    { width: 18, key: ' LT loss' },
    { width: 10, key: ' Indexed loss' },]
    var header = ['Scheme name', 'Folio number','Investor name', 'ST gain',
      'ST loss', 'LT gain', 'Indexed gain', 'LT loss', 'Indexed loss'];
    this.dataSource.forEach(element => {
      data = [element.schemeName,element.folioNumber,element.investorName,element.stGain
        , element.stLoss,element.ltGain,element.indexedGain,
      element.liloss,element.indexedLoss]
      this.excelData.push(Object.assign(data))
    });
    var footerData = ['Total','','',this.stGain,'', '', this.indexedGain, '', '']
    this.footer.push(Object.assign(footerData))
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value)
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