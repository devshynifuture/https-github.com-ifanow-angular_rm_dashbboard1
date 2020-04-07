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
  reverse=true;
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

  constructor(public aum: AumComponent, private backoffice: BackOfficeService, private dataService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getAmcWiseData();
  }
  sortBy(amc,propertyName){
    this.propertyName = propertyName;
    this.reverse = (propertyName !== null && this.propertyName === propertyName) ? !this.reverse : false;
    if (this.reverse === false){
      amc=amc.sort((a, b) => a[propertyName] > b[propertyName] ? 1 : -1);
    }else{
      amc=amc.reverse();
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

  exportToExcelSheet(choice) {
    switch (choice) {
      case 'amc-wise':
        this.amcWiseExcelReport();
        break;
      case 'scheme-wise':
        this.schemeWiseExcelReport();
        break;
      case 'applicant-wise':
        this.applicantWiseExcelReport();
        break;
    }
  }

  applicantWiseExcelReport() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[2], this.arrayOfHeaders[2], this.arrayOfExcelData[2], [], 'Applicant wise report');
  }

  schemeWiseExcelReport() {
    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[1], this.arrayOfHeaders[1], this.arrayOfExcelData[1], [], 'Scheme wise report');
  }

  amcWiseExcelReport() {
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'AMC wise MIS report', 'amc-wise-aum-mis');
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
        this.arrayOfExcelData[clientIndex].schemeList = [];
        this.arrayOfExcelData[clientIndex].applicantList = [];
        break;
      case 'applicant':
        this.arrayOfExcelData[clientIndex].applicantList = [];
        break;
    }
  }

  appendingOfValuesInExcel(iterable, index, choice) {
    switch (choice) {
      case 'schemes':
        // investor
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].schemeList.push({
            index: index1 + 1,
            name: element.schemeName,
            totalAum: element.totalAum,
            weightInPerc: element.weightInPercentage
          });
        });
        break;
      case 'applicant':
        // schemes
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].applicantList.push({
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
    let data = {};
    this.amcList.forEach((element, index1) => {
      data = {
        index: index1 + 1,
        name: element.name,
        totalAum: element.totalAum,
        weightInPerc: element.weightInPercentage,
        schemeList: [],
        applicantList: []
      }
      this.arrayOfExcelData.push(data);
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
      this.appendingOfValuesInExcel(this.amcList[this.selectedAmc].schemes, amcIndex, 'schemes');
    } else {
      this.removeValuesFromExcel('schemes', amcIndex);
    }
  }
  showApplicant(schemeData, amcIndex) {
    schemeData.showScheme = !schemeData.showScheme
    schemeData.applicantList = []
    if (schemeData.showScheme == false) {
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
            schemeData.applicantList = data
            console.log(amcIndex, data);
            this.appendingOfValuesInExcel(data, amcIndex, 'applicant');
          }
        }
      )
    } else {
      this.removeValuesFromExcel('applicant', amcIndex);
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
    this.dataService.openSnackBar(err, 'Dismiss')
  }
}
