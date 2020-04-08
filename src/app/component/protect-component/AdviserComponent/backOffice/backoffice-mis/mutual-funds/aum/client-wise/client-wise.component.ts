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
  isLoading = false;
  arrayOfExcelData: any[] = [];
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
  selectedInvestorIndex: any;

  constructor(public aum: AumComponent, private backoffice: BackOfficeService) { }


  showLoader = true;
  clientList
  selectedClient;
  subList;
  selectedInvestor;
  teamMemberId = 2929;
  propertyName: any;
  propertyName2: any;
  propertyName3: any;
  propertyName4: any;
  reverse=true;
  reverse2=true;
  reverse3=true;
  reverse4=true;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId()
    this.getClientTotalAum();
  }
  sortBy(applicant,propertyName){
    this.propertyName = propertyName;
    this.reverse = (propertyName !== null && this.propertyName === propertyName) ? !this.reverse : false;
    if (this.reverse === false){
      applicant=applicant.sort((a, b) =>
         a[propertyName] > b[propertyName] ? 1 : (a[propertyName] === b[propertyName] ? 0 : -1)
        );
    }else{
      applicant=applicant.sort((a, b) => 
        a[propertyName] > b[propertyName] ? -1 : (a[propertyName] === b[propertyName] ? 0 : 1)
      );
    }
  }
  sortByInvestor(applicant,propertyName){
    this.propertyName2 = propertyName;
    this.reverse2 = (propertyName !== null && this.propertyName2 === propertyName) ? !this.reverse2 : false;
    if (this.reverse2 === false){
      applicant=applicant.sort((a, b) =>
         a[propertyName] > b[propertyName] ? 1 : (a[propertyName] === b[propertyName] ? 0 : -1)
        );
    }else{
      applicant=applicant.sort((a, b) => 
        a[propertyName] > b[propertyName] ? -1 : (a[propertyName] === b[propertyName] ? 0 : 1)
      );
    }
  }
  sortByScheme(applicant,propertyName){
    this.propertyName3 = propertyName;
    this.reverse3 = (propertyName !== null && this.propertyName3 === propertyName) ? !this.reverse3 : false;
    if (this.reverse3 === false){
      applicant=applicant.sort((a, b) =>
         a[propertyName] > b[propertyName] ? 1 : (a[propertyName] === b[propertyName] ? 0 : -1)
        );
    }else{
      applicant=applicant.sort((a, b) => 
        a[propertyName] > b[propertyName] ? -1 : (a[propertyName] === b[propertyName] ? 0 : 1)
      );
    }
  }
  sortByFolio(applicant,propertyName){
    this.propertyName4 = propertyName;
    this.reverse4 = (propertyName !== null && this.propertyName4 === propertyName) ? !this.reverse4 : false;
    if (this.reverse4 === false){
      applicant=applicant.sort((a, b) =>
         a[propertyName] > b[propertyName] ? 1 : (a[propertyName] === b[propertyName] ? 0 : -1)
        );
    }else{
      applicant=applicant.sort((a, b) => 
        a[propertyName] > b[propertyName] ? -1 : (a[propertyName] === b[propertyName] ? 0 : 1)
      );
    }
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
    this.isLoading = true;
    this.clientList = [{}, {}, {}];
    let obj = {
      advisorId: this.advisorId,
      arnRiaDetailsId: -1,
      parentId: -1
    }
    this.backoffice.getAumClientTotalAum(obj).subscribe(
      data => this.clientTotalAum(data),
      err => {
        this.isLoading = false;
        this.clientList = [];
      }
    )

  }
  getInvestorName(clientData, clientIndex) {
    this.selectedClient = clientIndex;
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
            data.forEach(element => {
              element.showInvestor=true;
            });
            clientData.investorList = data
            this.investorList = data;
            console.log(data);

            this.appendingOfValuesInExcel(data, this.selectedClient, 'investor');
          }
        }
      )
    } else {
      this.removeValuesFromExcel('investor', clientIndex);
    }
  }

  removeValuesFromExcel(whichList, clientIndex) {
    console.log(clientIndex, this.arrayOfExcelData);

    switch (whichList) {
      case 'investor':
        this.arrayOfExcelData[clientIndex].investorList = [];
        this.arrayOfExcelData[clientIndex].schemeList = [];
        this.arrayOfExcelData[clientIndex].schemeFolioList = [];
        break;
      case 'schemes':
        this.arrayOfExcelData[clientIndex].schemeList = [];
        this.arrayOfExcelData[clientIndex].schemeFolioList = [];
        break;
      case 'scheme-folio':
        this.arrayOfExcelData[clientIndex].schemeFolioList = [];
        break;
    }
  }

  // initializeExcelData() {
  //   let dataValue = [];
  //   this.arrayOfExcelData[0] = [];
  //   this.arrayOfExcelData[1] = [];
  //   this.arrayOfExcelData[2] = [];
  //   this.arrayOfExcelData[3] = [];
  //   this.clientList.forEach((element, index1) => {
  //     dataValue = [
  //       index1 + 1,
  //       element.name,
  //       element.totalAum,
  //       element.weightInPercentage
  //     ];
  //     this.arrayOfExcelData[0].push(Object.assign(dataValue));
  //   });

  //   this.investorList.forEach((element, index2) => {
  //     dataValue = [
  //       index2 + 1,
  //       element.investorName,
  //       element.totalAum,
  //       element.weightInPercentage
  //     ]
  //     this.arrayOfExcelData[1].push(Object.assign(dataValue))
  //   });

  //   this.scheme1List.forEach((element, index3) => {
  //     dataValue = [
  //       index3 + 1,
  //       element.schemeName,
  //       element.totalAum,
  //       element.weightInPercentage
  //     ]
  //     this.arrayOfExcelData[2].push(Object.assign(dataValue))
  //   });

  //   this.scheme2List.forEach((element, index4) => {
  //     dataValue = [
  //       index4 + 1,
  //       element.schemeName,
  //       element.folioNumber,
  //       element.totalAum,
  //       element.balanceUnit,
  //       element.weightInPercentage
  //     ]
  //     this.arrayOfExcelData[3].push(Object.assign(dataValue))
  //   });
  // }

  clientWiseExcelSheet() {
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'Client wise MIS Report', 'client-wise-aum-mis');
  }

  investorWiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[1], this.arrayOfHeaders[1], this.arrayOfExcelData[this.selectedClient].investorList, [], 'Investor Wise');
  }

  scheme1WiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[2], this.arrayOfHeaders[2], this.arrayOfExcelData[this.selectedClient].schemeList, [], 'Scheme Wise');
  }

  scheme2WiseExcelSheet() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[3], this.arrayOfHeaders[3], this.arrayOfExcelData[this.selectedClient].schemeFolioList, [], 'Scheme Folio Wise');
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

  excelInitClientList() {
    let data = {};
    this.clientList.forEach((element, index1) => {
      data = {
        index: index1 + 1,
        name: element.name,
        totalAum: element.totalAum,
        weightInPerc: element.weightInPercentage,
        investorList: [],
        schemeList: [],
        schemeFolioList: []
      }
      this.arrayOfExcelData.push(data);
    });
  }

  appendingOfValuesInExcel(iterable, index, choice) {
    switch (choice) {
      case 'investor':
        // investor
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].investorList.push({
            index: index1 + 1,
            name: element.investorName,
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage
          });
        });
        break;
      case 'schemes':
        // schemes
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].schemeList.push({
            index: index1 + 1,
            name: element.schemeName,
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage
          });
        });
        break;
      case 'scheme-folio':
        // scheme folio
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].schemeFolioList.push({
            index: index1 + 1,
            name: element.schemeName,
            folioNumber: element.folioNumber,
            totalAum: element.totalAum,
            balanceUnit: element.balanceUnit,
            weightInPerc: element.weightInPercentage
          });
        });
        break;
    }
    console.log(this.arrayOfExcelData);
  }

  clientTotalAum(data) {
    this.isLoading = false;
    if (data) {
      this.clientList = data;
      console.log("client list ::::", data);
      this.excelInitClientList();
      this.clientList.forEach(o => {
        o.show = true;
        this.totalCurrentValue += o.totalAum;
        this.totalWeight += o.weightInPercentage;
      });
      this.showLoader = false;
    }else{
      this.clientList = [];
    }
  }
  clientScheme(data, show, index) {
    this.subList = data;
    this.selectedClient = index;
    this.clientList[index].subList = this.subList;
    this.clientList[index].show = (show) ? show = false : show = true;
  }
  getSchemeName(investorData, index, clientIndex) {
    investorData.showInvestor = !investorData.showInvestor
    investorData.schemeList = [];
    this.selectedInvestorIndex = index;
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
            data.forEach(element => {
              element.showScheme=true;
              element.familyMemberId=investorData.familyMemberId;
            });
            investorData.schemeList = data;
            console.log(data);
            this.appendingOfValuesInExcel(data, this.selectedClient, 'schemes');
          }
        }
      )
    } else {
      this.removeValuesFromExcel('schemes', clientIndex);
    }

  }
  getFolio(schemeData, clientIndex) {
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
            // this.initializeExcelData();
            console.log(data);
            this.appendingOfValuesInExcel(data, this.selectedClient, 'scheme-folio');

          }
        }
      )
    } else {
      this.removeValuesFromExcel('scheme-folio', clientIndex);
    }

  }
  getSchemeName1(index, show) {
    this.clientList[this.selectedClient].subList[this.selectedInvestor].schemes[index].showScheme = (show) ? show = false : show = true;
  }
  aumReport() {
    this.changedValue.emit(true);
  }

}
