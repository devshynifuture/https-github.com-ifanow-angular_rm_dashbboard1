import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AumComponent } from '../aum.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ExcelMisService } from '../excel-mis.service';


@Component({
  selector: 'app-client-wise',
  templateUrl: './client-wise.component.html',
  styleUrls: ['./client-wise.component.scss']
})
export class ClientWiseComponent implements OnInit {
  advisorId: any;
  clientId: any;
  totalCurrentValue = 0;
  totalWeight = 0;
  isLoading=false;
  arrayOfExcelData: any[][] = [];
  arrayOfHeaders: any[][] = [
    [
      'Sr. No.',
      'Client Name',
      'Current Value',
      '% Weight'
    ],
    [
      'Sr. No.',
      'Investor Name',
      'Current Value',
      '% Weight'
    ],
    [
      'Sr. No.',
      'Scheme Name',
      'Current Name',
      '% Weight'
    ],
    [
      'Sr. No.',
      'Scheme Name',
      'Folio Number',
      'Current Value',
      'Balance Unit',
      '% Weight',
    ]
  ];
  arrayOfHeaderStyles: any[][] = [
    [
      { width: 10, key: 'Sr. No.' },
      { width: 50, key: 'Client Name' },
      { width: 30, key: 'Current Value' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 10, key: 'Sr. No.' },
      { width: 50, key: 'Investor Name' },
      { width: 30, key: 'Current Value' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 10, key: 'Sr. No.' },
      { width: 50, key: 'Scheme Name' },
      { width: 30, key: 'Current Name' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 10, key: 'Sr. No.' },
      { width: 30, key: 'Scheme Name' },
      { width: 30, key: 'Folio Number' },
      { width: 30, key: 'Current Value' },
      { width: 30, key: 'Balance Unit' },
      { width: 10, key: '% Weight' },
    ]
  ];
  investorList: any;
  scheme1List: any;
  scheme2List: any;
  @Output() changedValue = new EventEmitter();

  constructor(public aum: AumComponent, private backoffice: BackOfficeService) { }


  showLoader = true;
  clientList
  selectedClient;
  subList;
  selectedInvestor;
  teamMemberId = 2929;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId()
    this.getClientTotalAum();
  }
  getClientSchemeName() {
    let obj = {
      'clientId': this.clientId,
      'advisorId': this.advisorId,
      arnRiaDetailsId: 123
    }
    this.backoffice.getAumClientScheme(obj).subscribe(
      data => {
        console.log('dataofClientWiseAum', data);
      }
    )
  }
  getClientTotalAum() {
    this.isLoading=true;
    this.clientList=[{},{},{}];
    let obj = {
      advisorId: this.advisorId,
      arnRiaDetailsId: -1,
      parentId: -1
    }
    this.backoffice.getAumClientTotalAum(obj).subscribe(
      data => this.clientTotalAum(data),
      err => {
        this.isLoading = false;
      }
    )

  }
  getInvestorName(clientData) {
    clientData.show = !clientData.show
    clientData.investorList = []
    if (clientData.show == false) {
      const obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: -1,
        parentId: -1,
        clientId: clientData.id,
        totalAum: clientData.totalAum
      }
      this.backoffice.getAumFamilyMember(obj).subscribe(
        data => {
          if (data) {
            data[0].showInvestor = true
            clientData.investorList = data
            this.investorList = data;
            console.log(data);
          }
        }
      )
    }
  }

  initializeExcelData() {
    let dataValue = [];
    this.arrayOfExcelData[0] = [];
    this.arrayOfExcelData[1] = [];
    this.arrayOfExcelData[2] = [];
    this.arrayOfExcelData[3] = [];
    this.clientList.forEach((element, index1) => {
      dataValue = [
        index1 + 1,
        element.name,
        element.totalAum,
        element.weightInPercentage
      ];
      this.arrayOfExcelData[0].push(Object.assign(dataValue));
    });

    this.investorList.forEach((element, index2) => {
      dataValue = [
        index2 + 1,
        element.investorName,
        element.totalAum,
        element.weightInPercentage
      ]
      this.arrayOfExcelData[1].push(Object.assign(dataValue))
    });

    this.scheme1List.forEach((element, index3) => {
      dataValue = [
        index3 + 1,
        element.schemeName,
        element.totalAum,
        element.weightInPercentage
      ]
      this.arrayOfExcelData[2].push(Object.assign(dataValue))
    });

    this.scheme2List.forEach((element, index4) => {
      dataValue = [
        index4 + 1,
        element.schemeName,
        element.folioNumber,
        element.totalAum,
        element.balanceUnit,
        element.weightInPercentage
      ]
      this.arrayOfExcelData[3].push(Object.assign(dataValue))
    });
  }

  clientWiseExcelSheet() {
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'selected value', 'Client Wise');
  }

  investorWiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[1], this.arrayOfHeaders[1], this.arrayOfExcelData[1], [], 'Investor Wise');
  }

  scheme1WiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[2], this.arrayOfHeaders[2], this.arrayOfExcelData[2], [], 'Scheme Wise');
  }

  scheme2WiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[3], this.arrayOfHeaders[3], this.arrayOfExcelData[3], [], 'Scheme Folio Wise');
  }

  exportToExcelSheet(choice) {
    switch (choice) {
      case 'client-wise':
        this.clientWiseExcelSheet();
        break;
      case 'investor-wise':
        this.investorWiseExcelSheet();
        break;
      case 'scheme1-wise':
        this.scheme1WiseExcelSheet();
        break;
      case 'scheme2-wise':
        this.scheme2WiseExcelSheet();
        break;
    }
  }

  clientTotalAum(data) {
    this.isLoading=false;
    if (data) {
      this.clientList = data;
      console.log("client list ::::", data);
      this.clientList.forEach(o => {
        o.show = true;
        this.totalCurrentValue += o.totalAum;
        this.totalWeight += o.weightInPercentage;
      });
      this.showLoader = false;
    }
  }
  clientScheme(data, show, index) {
    this.subList = data;
    this.selectedClient = index;
    this.clientList[index].subList = this.subList;
    this.clientList[index].show = (show) ? show = false : show = true;
  }
  getSchemeName(investorData) {
    investorData.showInvestor = !investorData.showInvestor
    investorData.schemeList = []
    if (investorData.showInvestor == false) {
      const obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: -1,
        parentId: -1,
        familyMemberId: investorData.familyMemberId,
        totalAum: investorData.totalAum
      }
      this.backoffice.getAumFamilyMemberScheme(obj).subscribe(
        data => {
          if (data) {
            data[0].showScheme = true;
            data[0].familyMemberId = investorData.familyMemberId;
            investorData.schemeList = data;
            console.log(data);
            this.scheme1List = data;
          }
        }
      )
    }

  }
  getFolio(schemeData) {
    schemeData.showScheme = !schemeData.showScheme
    schemeData.folioList = []
    if (schemeData.showScheme == false) {
      const obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: -1,
        parentId: -1,
        familyMemberId: schemeData.familyMemberId,
        totalAum: schemeData.totalAum,
        schemeId: schemeData.mutualFundSchemeMasterId
      }
      this.backoffice.getAumFamilyMemberSchemeFolio(obj).subscribe(
        data => {
          if (data) {
            schemeData.folioList = data;
            this.scheme2List = data;
            this.initializeExcelData();
            console.log(data);
          }
        }
      )
    }

  }
  getSchemeName1(index, show) {
    this.clientList[this.selectedClient].subList[this.selectedInvestor].schemes[index].showScheme = (show) ? show = false : show = true;
  }
  aumReport() {
    this.changedValue.emit(true);
  }

}
