import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AumComponent } from '../aum.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { ExcelMisService } from '../excel-mis.service';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';

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
  reverse = true;
  reverse2 = true;
  reverse3 = true;
  @Output() changedValue = new EventEmitter();
  @Input() data;

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
  parentId: any;
  clientId: any;
  amcWiseTotal = [];
  schemeWiseTotal = [];
  applicantWiseTotal = [];
  viewMode;
  arnRiaValue;
  arnRiaList = [];

  constructor(public aum: AumComponent, private backoffice: BackOfficeService, private dataService: EventService, private mfService: MfServiceService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.parentId = AuthService.getParentId() ? AuthService.getParentId() : this.advisorId;
    if (this.data.hasOwnProperty('arnRiaValue') && this.data.hasOwnProperty('viewMode')) {
      this.arnRiaValue = this.data.arnRiaValue;
      this.viewMode = this.data.viewMode;
    } else {
      this.viewMode = "All";
      this.arnRiaValue = -1;
    }
    this.getArnRiaList();
    this.getAmcWiseData();
  }

  getArnRiaList() {
    this.backoffice.getArnRiaList(this.advisorId).subscribe(
      data => {
        if (data) {
          // this.advisorId = 0;
          this.arnRiaList = data;
          const obj = {
            number: 'All',
            id: -1
          }
          this.arnRiaList.unshift(obj);
        } else {
          // this.dataService.openSnackBar("No Arn Ria List Found", "Dismiss")
        }
      }
    )
  }

  changeValueOfArnRia(item) {
    if (item.name !== 'All') {
      this.arnRiaValue = item.id
      this.viewMode = item.number;
    } else {
      this.arnRiaValue = -1;
    }
    this.getAmcWiseData();
  }

  sortBy(applicant, propertyName) {
    this.propertyName = propertyName;
    this.reverse = (propertyName !== null && this.propertyName === propertyName) ? !this.reverse : false;
    if (this.reverse === false) {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? 1 : (a[propertyName] === b[propertyName] ? 0 : -1)
      );
    } else {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? -1 : (a[propertyName] === b[propertyName] ? 0 : 1)
      );
    }
  }
  sortByScheme(applicant, propertyName) {
    this.propertyName2 = propertyName;
    this.reverse2 = (propertyName !== null && this.propertyName2 === propertyName) ? !this.reverse2 : false;
    if (this.reverse2 === false) {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? 1 : (a[propertyName] === b[propertyName] ? 0 : -1)
      );
    } else {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? -1 : (a[propertyName] === b[propertyName] ? 0 : 1)
      );
    }
  }
  sortByApplicant(applicant, propertyName) {
    this.propertyName3 = propertyName;
    this.reverse3 = (propertyName !== null && this.propertyName3 === propertyName) ? !this.reverse3 : false;
    if (this.reverse3 === false) {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? 1 : (a[propertyName] === b[propertyName] ? 0 : -1)
      );
    } else {
      applicant = applicant.sort((a, b) =>
        a[propertyName] > b[propertyName] ? -1 : (a[propertyName] === b[propertyName] ? 0 : 1)
      );
    }
  }
  aumReport() {
    this.changedValue.emit({
      value: true,
      arnRiaValue: this.arnRiaValue,
      viewMode: this.viewMode
    });
  }
  getAmcWiseData() {
    this.arrayOfExcelData = [];
    this.totalCurrentValue = 0;
    this.totalWeight = 0;
    this.isLoading = true;
    this.amcList = [{}, {}, {}]
    const obj = {
      advisorId: (this.parentId) ? 0 : (this.data.arnRiaDetailId != -1) ? 0 : [this.data.adminAdvisorIds],
      arnRiaDetailsId: this.arnRiaValue,
      parentId: (this.data) ? this.data.parentId : -1
    }
    this.backoffice.amcWiseGet(obj).subscribe(
      data => this.getReponseAmcWiseGet(data),
      err => this.getFilerrorResponse(err)
    )
  }
  exportToExcelSheet(choice, amcIndex, schemeIndex) {
    switch (choice) {
      case 'amc-wise':
        this.amcWiseExcelReport();
        break;
      case 'scheme-wise':
        this.schemeWiseExcelReport(amcIndex);
        break;
      case 'applicant-wise':
        this.applicantWiseExcelReport(schemeIndex, amcIndex);
        break;
    }

  }

  applicantWiseExcelReport(schemeIndex, amcIndex) {
    let applicantList = this.arrayOfExcelData[amcIndex].schemeList[schemeIndex].applicantList;
    let newArray = [];
    applicantList.forEach(element => {
      newArray.push({
        field1: element.name,
        field2: this.mfService.mutualFundRoundAndFormat(element.balanceUnit, 2),
        field3: element.folioNumber,
        field4: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
        field5: element.weightInPerc
      })
    });

    ExcelMisService.exportExcel(this.arrayOfHeaderStyles[2], this.arrayOfHeaders[2], newArray, [], 'Mis Report - AMC wise AUM', this.applicantWiseTotal);
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

    let arrayOfExcelHeaders = this.arrayOfHeaders.slice();
    let arrayOfExcelStyles = this.arrayOfHeaderStyles.slice();
    arrayOfExcelHeaders.shift();
    arrayOfExcelStyles.shift();

    ExcelMisService.exportExcel3(arrayOfExcelHeaders, arrayOfExcelStyles, copyOfExcelData[index].schemeList, 'MIS Report - AMC wise AUM', 'amc-wise-aum-mis', {
      amcList: true,
      schemeList: false,
      applicantList: false
    }, this.schemeWiseTotal);
  }

  amcWiseExcelReport() {
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'MIS Report - AMC wise AUM', 'amc-wise-aum-mis', {
      amcList: false,
      schemeList: false,
      applicantList: false
    }, this.amcWiseTotal);
  }

  removeValuesFromExcel(whichList, clientIndex) {
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
    let sumAumTotal = 0;
    let sumWeightInPercTotal = 0;
    switch (choice) {
      case 'schemes':
        // scheme
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].schemeList.push({
            index: index1 + 1,
            name: element.schemeName,
            totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
            weightInPerc: element.weightInPercentage,
            applicantList: []
          });
          sumAumTotal += element.totalAum;
          sumWeightInPercTotal += element.weightInPercentage;
        });
        this.schemeWiseTotal = ['Total', '', sumAumTotal, sumWeightInPercTotal];
        break;
      case 'applicant':
        // applicant
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedAmc].schemeList[index].applicantList.push({
            name: element.investorName,
            balanceUnit: this.mfService.mutualFundRoundAndFormat(element.balanceUnit, 2),
            folioNumber: element.folioNumber,
            totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
            weightInPerc: element.weightInPercentage
          });
          sumAumTotal += element.totalAum;
          sumWeightInPercTotal += element.weightInPercentage;
        });
        this.applicantWiseTotal = ['Total', '', '', sumAumTotal, sumWeightInPercTotal];
        break;
    }
  }

  excelInitAmcList() {
    let sumAumTotal = 0;
    let sumWeightInPercTotal = 0;
    this.amcList.forEach((element, index1) => {
      this.arrayOfExcelData.push({
        index: index1 + 1,
        name: element.name,
        totalAum: this.mfService.mutualFundRoundAndFormat(element.totalAum, 0),
        weightInPerc: element.weightInPercentage,
        schemeList: [],
      });
      sumAumTotal += element.totalAum;
      sumWeightInPercTotal += element.weightInPercentage;
    });
    this.amcWiseTotal = ['Total', '', sumAumTotal, sumWeightInPercTotal];

  }

  getReponseAmcWiseGet(data) {
    this.isLoading = false;
    if (data) {
      this.amcList = data;
      this.excelInitAmcList();
      this.amcList.forEach(o => {
        o.showAmc = true;
        this.totalCurrentValue += o.totalAum;
        this.totalWeight += o.weightInPercentage;
      });
    } else {
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
      if (amcData.name == "LIC Mutual Fund Asset Management Limited") {
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
        advisorId: (this.parentId) ? 0 : (this.data.arnRiaDetailId != -1) ? 0 : [this.data.adminAdvisorIds],
        arnRiaDetailsId: this.arnRiaValue,
        parentId: (this.data) ? this.data.parentId : -1,
        schemeMasterId: schemeData.id,
        totalAum: schemeData.totalAum
      }
      this.backoffice.amcWiseApplicantGet(obj).subscribe(
        data => {
          if (data) {
            this.isLoadingApplicant = false
            schemeData.applicantList = data
            this.applicationList = data
            this.appendingOfValuesInExcel(data, index, 'applicant');
          } else {
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
      schemeMasterId: 1345,
      totalAum: 2000,
      advisorId: (this.parentId) ? 0 : (this.data.arnRiaDetailId != -1) ? 0 : [this.data.adminAdvisorIds],
      arnRiaDetailsId: this.arnRiaValue,
      parentId: (this.data) ? this.data.parentId : -1,
    }
    this.backoffice.amcWiseApplicantGet(obj)
      .subscribe(
        data => {
        }
      )
  }
  getFilerrorResponse(err) {
    this.isLoading = false;
    this.amcList = [];
    this.dataService.openSnackBar(err, 'Dismiss')
  }
}
