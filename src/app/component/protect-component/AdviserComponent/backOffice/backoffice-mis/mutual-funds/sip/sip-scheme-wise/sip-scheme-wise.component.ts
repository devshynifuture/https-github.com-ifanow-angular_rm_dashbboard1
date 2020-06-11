import { Component, OnInit, ViewChildren, EventEmitter, Output, Input } from '@angular/core';
import { SipComponent } from '../sip.component';
import { BackOfficeService } from '../../../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelMisSipService } from '../../aum/excel-mis-sip.service';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sip-scheme-wise',
  templateUrl: './sip-scheme-wise.component.html',
  styleUrls: ['./sip-scheme-wise.component.scss']
})
export class SipSchemeWiseComponent implements OnInit {
  showLoader = true;
  teamMemberId = 2929;
  advisorId: any;
  clientId: any;
  category: any;
  selectedCategory: any;
  InvestorList: any;
  applicantList: any;
  schemeFilter: any;
  isLoading = false;
  @ViewChildren(FormatNumberDirective) formatNumber;
  totalOfSipAmount = 0;
  totalOfSipCount = 0;
  totalWeight = 0;
  filteredArray: any[];
  propertyName: any;
  propertyName2: any;
  propertyName3: any;
  reverse = true;
  reverse2 = true;
  reverse3 = true;
  @Output() changedValue = new EventEmitter();
  @Input() data;


  arrayOfHeaders: any[][] = [
    [
      'Sr. No.',
      'AMC Name',
      'SIP Amount',
      'SIP Count',
      '% Weight'
    ],
    [
      'Sr. No.',
      'Investor Name',
      'SIP Amount',
      'SIP Count',
      '% Weight'
    ],
    [
      'Sr. No.',
      'Applicant Name',
      'Scheme Name',
      'Folio',
      'Registered Date',
      'From Date',
      'To Date',
      'Trigger Day',
      'Frequency',
      'Amount',
      '% Weight',
    ],
    [
      'Applicant Name',
      'Balance Unit',
      'Folio',
      'Current Amount',
      '% Weight'
    ]
  ];
  arrayOfHeaderStyles: { width: number; key: string; }[][] = [
    [
      { width: 10, key: 'Sr. No.' },
      { width: 50, key: 'AMC Name' },
      { width: 30, key: 'SIP Amount' },
      { width: 30, key: 'SIP Count' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 10, key: 'Sr. No.' },
      { width: 50, key: 'Investor Name' },
      { width: 30, key: 'SIP Amount' },
      { width: 30, key: 'SIP Count' },
      { width: 10, key: '% Weight' }
    ],
    [
      { width: 10, key: 'Sr. No.' },
      { width: 40, key: 'Applicant Name' },
      { width: 50, key: 'Scheme Name' },
      { width: 40, key: 'Folio Number' },
      { width: 40, key: 'Registered Date' },
      { width: 40, key: 'From Date' },
      { width: 40, key: 'To Date' },
      { width: 30, key: 'Trigger Day' },
      { width: 30, key: 'Frequency' },
      { width: 30, key: 'Amount' },
      { width: 10, key: '% Weight' },
    ],
    [
      { width: 50, key: 'Applicant Name' },
      { width: 30, key: 'Balance Unit' },
      { width: 30, key: 'Folio' },
      { width: 30, key: 'Current Amount' },
      { width: 10, key: '% Weight' },
    ]
  ];
  arrayOfExcelData: any[] = [];
  selectedSubCategory: any;
  selectedCategoryApp: any;
  isLoadingSubCategory: boolean;
  isLoadingCategory: boolean;
  applicantListArr: any[];
  subCatList: any[];
  caesedForm: any;
  parentId: any;

  constructor(private backoffice: BackOfficeService,private fb: FormBuilder, public sip: SipComponent,private mfService:MfServiceService) { }

  ngOnInit() {
    this.caesedForm = this.fb.group({
      ceaseddate: ['']
    });
    this.showLoader = false;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.parentId = AuthService.getParentId() ? AuthService.getParentId() : this.advisorId;
    this.getSchemeWiseGet();
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
  sortByInvestor(applicant, propertyName) {
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
    this.changedValue.emit(true);
    //  this.sip.sipComponent=true;
    this.filteredArray.forEach(element => {
      element.showCategory = true
    });
  }
  getSchemeWiseGet() {
    this.isLoading = true;
    this.filteredArray = [{}, {}, {}]
    const obj = {
      advisorId: (this.parentId) ? 0 : (this.data.arnRiaId!=-1) ? 0 :[this.data.adminAdvisorIds],
      arnRiaDetailsId: (this.data) ? this.data.arnRiaId : -1,
      parentId: (this.data) ? this.data.parentId : -1
    }
    this.backoffice.Sip_Schemewise_Get(obj).subscribe(
      data => this.getSchemeWiseRes(data),
      err => {
        this.isLoading = false;
        this.filteredArray = []
      }
    )
  }
  addCeasesdDate(sip, investor, date){
    var obj = {
      sipId: sip.id,
      mutualFundId: sip.mutualFundId,
      amount: sip.amount,
      ceaseDate: date,
    }
    this.backoffice.addCeasedDate(obj).subscribe(
      data => {
       console.log(data);
      //  investor.value.splice(investor.value.indexOf(sip), 1);
      //  this.eventService.openSnackBar('Cease date added successfully', 'Dismiss');
      },
      err => {
       
      }
    )

  }
  getSchemeWiseRes(data) {
    this.isLoading = false;
    if (data) {
      this.category = data;
      this.excelInitClientList()
      this.category.forEach(o => {
        o.showCategory = true;
        this.totalOfSipAmount += o.sipAmount;
        this.totalOfSipCount += o.sipCount;
        this.totalWeight += o.weightInPercentage;
        o.InvestorList = [];
      });
      this.filteredArray = [...this.category];
    } else {
      this.filteredArray = [];
    }

    this.showLoader = false;
  }
  filterArray() {
    // No users, empty list.
    if (!this.category.length) {
      this.filteredArray = [];
      return;
    }

    // no search text, all users.
    if (!this.schemeFilter) {
      this.filteredArray = [...this.category]; // keep your usersList immutable
      return;
    }

    const users = [...this.category]; // keep your usersList immutable
    const properties = Object.keys(users[0]); // get user properties

    // check all properties for each user and return user if matching to searchText
    this.filteredArray = users.filter((user) => {
      return properties.find((property) => {
        const valueString = user[property].toString().toLowerCase();
        return valueString.includes(this.schemeFilter.toLowerCase());
      })
        ? user
        : null;
    });

  }
  showSubTableList(index, category, schemeData) {
    this.selectedCategory = index
    schemeData.showCategory = !schemeData.showCategory
    if (schemeData.showCategory == false) {
      this.isLoadingCategory = true
      schemeData.subCatList = []
      this.subCatList = []
      schemeData.subCatList = [{}, {}, {}];
      const obj = {
        advisorId: (this.parentId) ? 0 : (this.data.arnRiaId!=-1) ? 0 :[this.data.adminAdvisorIds],
        arnRiaDetailsId: (this.data) ? this.data.arnRiaId : -1,
        parentId: (this.data) ? this.data.parentId : -1,
        schemeId: schemeData.mutualFundSchemeMasterId
      }
      this.backoffice.Scheme_Wise_Investor_Get(obj).subscribe(
        data => {
          this.isLoadingCategory = false
          if (data) {
            data.forEach(element => {
              element.showSubCategory = true;
              element.mutualFundSchemeMasterId = schemeData.mutualFundSchemeMasterId;
            });
            schemeData.subCatList = data
            this.subCatList = data
            if (schemeData.showCategory == false) {
              this.appendingOfValuesInExcel(data, index, 'investor');
            } else {
              this.removeValuesFromExcel('investor', index);
            }
          }else{
            this.subCatList = []
            schemeData.subCatList = []
            this.isLoadingCategory = false
          }
        },
        err => {
          this.subCatList = []
          schemeData.subCatList = []
          this.isLoadingCategory = false
        }
      )
    }

  }
  removeValuesFromExcel(whichList, index) {
    switch (whichList) {
      case 'investor':
        this.arrayOfExcelData[this.selectedCategory].subCatList[index].schemeList = [];
        break;
      case 'schemes':
        this.arrayOfExcelData[index].subCatList = [];
        break;
      case 'applicant':
        this.arrayOfExcelData[this.selectedCategory].subCatList[this.selectedSubCategory].schemeList[index].applicantList = [];
        break;
    }
  }
  appendingOfValuesInExcel(iterable, index, choice) {

    switch (choice) {
      case 'investor':
        // categories
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[index].subCatList.push({
            index: index1 + 1,
            name: element.investorName,
            sipAmount:this.mfService.mutualFundRoundAndFormat(element.sipAmount, 0),
            sipCount: element.sipCount,
            weightInPerc: element.weightInPercentage,
            applicantList: []
          });
        });
        break;
      case 'schemes':
        // sub categories
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedCategory].subCatList.push({
            index: index1 + 1,
            name: element.schemeName,
            sipAmount: this.mfService.mutualFundRoundAndFormat(element.sipAmount, 0),
            sipCount: element.sipCount,
            weightInPerc: element.weightInPercentage,
            schemeList: []
          });
        });
        break;
      case 'applicant':
        iterable.forEach((element, index1) => {
          this.arrayOfExcelData[this.selectedCategory].subCatList[index].applicantList.push({
            name: element.investorName,
            schemeName: element.schemeName,
            folio: element.folioNumber,
            registeredDate: new Date(element.registeredDate),
            fromDate: new Date(element.from_date),
            toDate: new Date(element.to_date),
            toTriggerDay: element.sipTriggerDay,
            frequency: element.frequency,
            amount: this.mfService.mutualFundRoundAndFormat(element.sipAmount, 0),
            weightInPerc: element.weightInPercentage,
            applicantList: []
          });
        });
        break;
    }
  }
  showSchemeName(index, subcashowSubcat, ApplicantData) {
    this.selectedCategoryApp = index
    ApplicantData.showSubCategory = !ApplicantData.showSubCategory
    if (ApplicantData.showSubCategory == false) {
      this.isLoadingSubCategory = true
      ApplicantData.applicantList = [];
      this.applicantListArr = []
      ApplicantData.applicantList = [{}, {}, {}];
      const obj = {
        advisorId: (this.parentId) ? 0 : (this.data.arnRiaId!=-1) ? 0 :[this.data.adminAdvisorIds],
      arnRiaDetailsId: (this.data) ? this.data.arnRiaId : -1,
      parentId: (this.data) ? this.data.parentId : -1,

        schemeId: ApplicantData.mutualFundSchemeMasterId,
        clientId: ApplicantData.clientId
      }
      this.backoffice.scheme_wise_Applicants_Get(obj).subscribe(
        data => {
          this.isLoadingSubCategory = false
          if (data) {
            data.forEach(o => {
              o.isEdit=false;
            });
            ApplicantData.applicantList = data;
            this.applicantListArr = data
            if (ApplicantData.showSubCategory == false) {
              this.appendingOfValuesInExcel(data, index, 'applicant');
            } else {
              this.removeValuesFromExcel('applicant', index);
            }
          }else{
            this.applicantListArr = []
            ApplicantData.applicantList = [];
            this.isLoadingSubCategory = false
          }
        },
        err => {
          this.applicantListArr = []
          ApplicantData.applicantList = [];
          this.isLoadingSubCategory = false
        }
      )
    }
  }
  excelInitClientList() {
    let data = {};
    this.category.forEach((element, index1) => {
      data = {
        index: index1 + 1,
        name: element.schemeName,
        sipAmount: this.mfService.mutualFundRoundAndFormat(element.sipAmount, 0),
        sipCount: element.sipCount,
        weightInPerc: element.weightInPercentage,
        subCatList: [],
      }
      this.arrayOfExcelData.push(data);
    })
  }
  exportToExcelSheet(choice, index, amcIndex) {
    switch (choice) {
      case 'scheme-wise':
        this.schemeWiseExcelReport(index);
        break;
      case 'investor-wise':
        this.investorWiseExcelSheet(index);
        break;
      case 'applicant-wise':
        this.applicantWiseExcelReport(index, amcIndex);
        break;
    }

  }

  schemeWiseExcelReport(index) {
    ExcelMisSipService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'category-wise-aum-mis', 'category-wise-aum-mis', {
      categoryList: false,
      subCatList: false,
      applicantList: false
    });
  }
  investorWiseExcelSheet(index) {
    let copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));
    copyOfExcelData.forEach((element, index1) => {
      if (index1 === index) {
        return;
      } else {
        element.subCatList = [];
      }
    });

    ExcelMisSipService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, copyOfExcelData, 'Category wise MIS Report', 'category-wise-aum-mis', {
      clientList: true,
      subCatList: false,
      applicantList: false
    });
  }
  applicantWiseExcelReport(index, amcIndex) {
    let copyOfExcelData = JSON.parse(JSON.stringify(this.arrayOfExcelData));
    copyOfExcelData.forEach((element, index1) => {
      if (index1 === index) {
        return;
      } else {
        element.applicantList = [];
      }
    });

    ExcelMisSipService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, copyOfExcelData, 'Category wise MIS Report', 'category-wise-aum-mis', {
      clientList: true,
      subCatList: true,
      applicantList: false
    });
  }
}
