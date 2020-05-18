import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AumComponent } from '../aum.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { ExcelMisService } from '../excel-mis.service';

@Component({
  selector: 'app-amc-wise',
  templateUrl: './amc-wise.component.html',
  styleUrls: ['./amc-wise.component.scss']
})
export class AmcWiseComponent implements OnInit {
  teamMemberId = 2929;
  advisorId: any;
  //showLoader = true;
  selectedCategory: any;
  amcList: any;
  totalCurrentValue = 0;
  totalWeight = 0;
  isLoading = false;
  propertyName: any;
  propertyName2: any;
  propertyName3: any;
  reverse=true;
  reverse2=true;
  reverse3=true;
  @Output() changedValue = new EventEmitter();

  arrayOfExcelData: any[] = [];
  arrayOfHeaders: any[][] = [
    [
      'Sr. No.',
      'AMC Name',
      'Current Value',
      '% Weight'
    ],
    [
      'Sr. No.',
      'Scheme Name',
      'Current Value',
      '% Weight'
    ],
    [
      'Applicant Name',
      'Balance Unit',
      'Folio',
      'Current Amount',
      '% Weight'
    ]
  ];
  arrayOfHeaderStyles: any[][] = [
    [
      { width: 10, key: 'Sr. No.' },
      { width: 40, key: 'AMC Name' },
      { width: 20, key: 'Current Value' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 10, key: 'Sr. No.' },
      { width: 40, key: 'Scheme Name' },
      { width: 20, key: 'Current Value' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 50, key: 'Applicant Name' },
      { width: 40, key: 'Balance Unit' },
      { width: 20, key: 'Folio' },
      { width: 30, key: 'Current Amount' },
      { width: 10, key: '% Weight' }
    ]
  ];
  selectedAmc: any;
  applicantIndex: any;
  schemeIndex: any;
  copyOfSchemeList: any;
  copyOfExcelData: any;
  isLoadingCategory: boolean;
  isLoadingApplicant: boolean;
  applicationList: any[];

  constructor(public aum: AumComponent, private backoffice: BackOfficeService, private dataService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getAmcWiseData();
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
  sortByScheme(applicant,propertyName){
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
  sortByApplicant(applicant,propertyName){
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
  aumReport() {
    this.changedValue.emit(true);
  }
  getAmcWiseData() {
    this.isLoading = true;
    this.amcList = [{}, {}, {}]
    const obj = {
      advisorId: this.advisorId,
      arnRiaDetailsId: -1,
      parentId: -1
    }
    this.backoffice.amcWiseGet(obj).subscribe(
      data => this.getReponseAmcWiseGet(data),
      err => this.getFilerrorResponse(err)
    )
  }

  exportToExcelSheet(choice, index, amcIndex) {
    switch (choice) {
      case 'amc-wise':
        this.amcWiseExcelReport();
        break;
      case 'scheme-wise':
        this.schemeWiseExcelReport(index);
        break;
      case 'applicant-wise':
        this.applicantWiseExcelReport(index, amcIndex);
        break;
    }

    console.log(this.arrayOfExcelData);
  }

  applicantWiseExcelReport(index, amcIndex) {
    let applicantList = this.arrayOfExcelData[amcIndex].schemeList[index].applicantList;
    let newArray = [];
    applicantList.forEach(element => {
      newArray.push({
        field1: element.name,
        field2: element.balanceUnit,
        field3: element.folioNumber,
        field4: element.totalAum,
        field5: element.weightInPerc
      })
    });

    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[2], this.arrayOfHeaders[2], newArray, [], 'category-wise-aum-mis');
  }

  schemeWiseExcelReport(index) {
    let copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));

    copyOfExcelData.forEach((element, index1) => {
      if (index1 === index) {
        return;
      } else {
        element.schemeList = [];
      }
    });
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, copyOfExcelData, 'category-wise-aum-mis', 'category-wise-aum-mis', {
      amcList: true,
      schemeList: false,
      applicantList: false
    });
  }

  amcWiseExcelReport() {
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'category-wise-aum-mis', 'category-wise-aum-mis', {
      amcList: false,
      schemeList: false,
      applicantList: false
    });
  }

  // initializeExcelSheet() {
  //   let dataValue = [];
  //   this.arrayOfExcelData[0] = [];
  //   this.arrayOfExcelData[1] = [];
  //   // this.arrayOfExcelData[2] = [];
  //   // this.arrayOfExcelData[3] = [];
  //   this.amcList.forEach((element, index1) => {
  //     dataValue = [
  //       index1 + 1,
  //       element.name,
  //       element.totalAum,
  //       element.weightInPercentage
  //     ];
  //     this.arrayOfExcelData[0].push(Object.assign(dataValue));
  //     if (element.hasOwnProperty('schemes') && element.schemes.length !== 0) {
  //       // console.log("this is something i need 2");
  //       element.schemes.forEach((element, index2) => {
  //         dataValue = [
  //           index2 + 1,
  //           element.schemeName,
  //           element.totalAum,
  //           element.weightInPercentage
  //         ];
  //         this.arrayOfExcelData[1].push(Object.assign(dataValue));

  //         if (element.hasOwnProperty('clientList') && element.clientList) {
  //           if (element.clientList.length !== 0) {
  //             element.clientList.forEach((element, index3) => {
  //               dataValue = [
  //                 index3 + 1,
  //                 element.clientName,
  //                 element.balanceUnit,
  //                 element.folio,
  //                 element.totalAum,
  //                 element.weightInPercentage
  //               ];
  //               this.arrayOfExcelData[2].push(Object.assign(dataValue));

  //               // if (element.hasOwnProperty('clientList') && element.clientList.length !== 0) {
  //               //   element.clientList.forEach((element, index4) => {
  //               //     dataValue = [
  //               //       index4 + 1,
  //               //       element.clientName,
  //               //       element.balanceUnit,
  //               //       element.folio,
  //               //       element.currentAmount,
  //               //       element.weightInPercentage
  //               //     ];
  //               //     this.arrayOfExcelData[3].push(Object.assign(dataValue));
  //               //   });
  //               // }
  //             });
  //           }
  //         }
  //       });
  //     }
  //   });
  // }

  removeValuesFromExcel(whichList, clientIndex) {
    console.log(clientIndex, this.arrayOfExcelData);

    switch (whichList) {
      case 'schemes':
        this.arrayOfExcelData[this.selectedAmc].schemeList = [];
        break;
      case 'applicant':
        this.arrayOfExcelData[this.selectedAmc].schemeList[clientIndex].applicantList = [];
        break;
    }
  }

  appendingOfValuesInExcel(iterable, index, choice) {
    switch (choice) {
      case 'schemes':
        // scheme
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].schemeList.push({
            index: index1 + 1,
            name: element.schemeName,
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage,
            applicantList: []
          });
        });
        break;
      case 'applicant':
        // applicant
        iterable.forEach((element, index1) => {
          console.log(index, iterable, this.arrayOfExcelData);
          this.arrayOfExcelData[this.selectedAmc].schemeList[index].applicantList.push({
            name: element.investorName,
            balanceUnit: element.balanceUnit,
            folioNumber: element.folioNumber,
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage
          });
        });
        break;
    }
    console.log(this.arrayOfExcelData);
  }

  excelInitAmcList() {
    this.amcList.forEach((element, index1) => {
      this.arrayOfExcelData.push({
        index: index1 + 1,
        name: element.name,
        totalAum: element.totalAum,
        weightInPerc: element.weightInPercentage,
        schemeList: [],
      });
    });

  }

  getReponseAmcWiseGet(data) {
    this.isLoading = false;
    if (data) {
      console.log("this we need", data)
      this.amcList = data;
      this.excelInitAmcList();
      this.amcList.forEach(o => {
        o.showAmc = true;
        this.totalCurrentValue += o.totalAum;
        this.totalWeight += o.weightInPercentage;
      });
    }else{
      this.amcList = []
    }
    //this.showLoader = false;
  }
  showScheme(amcData, amcIndex) {
    this.selectedAmc = amcIndex;
    amcData.showAmc = !amcData.showAmc
    amcData.schemes.forEach(o => {
      o.showScheme = true;
    });

    if (amcData.showAmc == false) {
      if(amcData.name =="LIC Mutual Fund Asset Management Limited"){
        amcData.schemes = [];
      }
      // this.isLoadingCategory = true
      // amcData.schemes = [];
      // amcData.scheme =[{},{},{}]
      this.appendingOfValuesInExcel(this.amcList[this.selectedAmc].schemes, amcIndex, 'schemes');
    } else {
      this.removeValuesFromExcel('schemes', amcIndex);
    }
  }
  showApplicant(schemeData, index, amcIndex) {
    this.schemeIndex = index;
    schemeData.showScheme = !schemeData.showScheme
    if (schemeData.showScheme == false) {
      this.isLoadingApplicant = true
      this.applicationList = []
      schemeData.applicantList = []
      schemeData.applicantList = [{}, {}, {}];
      const obj = {
        advisorId: this.advisorId,
        arnRiaDetailsId: -1,
        parentId: -1,
        schemeMasterId: schemeData.id,
        totalAum: schemeData.totalAum
      }
      this.backoffice.amcWiseApplicantGet(obj).subscribe(
        data => {
          if (data) {
            this.isLoadingApplicant = false
            schemeData.applicantList = data
            this.applicationList = data
            console.log(amcIndex, data);
            this.appendingOfValuesInExcel(data, index, 'applicant');
          }else{
            this.applicationList = []
            schemeData.applicantList = []
            this.isLoadingApplicant = false
          }
        },
        err => {
          this.applicationList = []
          schemeData.applicantList = []
          this.isLoadingApplicant = false
        }
      )
    } else {
      this.removeValuesFromExcel('applicant', index);
    }
  }
  getApplicantName() {
    const obj = {
      advisorId: this.advisorId,
      arnRiaDetailId: -1,
      schemeMasterId: 1345,
      totalAum: 2000
    }
    this.backoffice.amcWiseApplicantGet(obj).subscribe(
      data => {
        console.log(data);
      }
    )
  }
  getFilerrorResponse(err) {
    this.isLoading = false;
    this.amcList = [];
    this.dataService.openSnackBar(err, 'Dismiss')
  }
}
