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
  @Output() changedValue = new EventEmitter();

  arrayOfExcelData: any[][] = [];
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

  constructor(public aum: AumComponent, private backoffice: BackOfficeService, private dataService: EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getAmcWiseData();
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
    ExcelMisService.exportExcel2(this.arrayOfHeaders, this.arrayOfHeaderStyles, this.arrayOfExcelData, 'selected Scheme', 'AMC Wise Report')
  }

  initializeExcelSheet() {
    let dataValue = [];
    this.arrayOfExcelData[0] = [];
    this.arrayOfExcelData[1] = [];
    // this.arrayOfExcelData[2] = [];
    // this.arrayOfExcelData[3] = [];
    this.amcList.forEach((element, index1) => {
      dataValue = [
        index1 + 1,
        element.name,
        element.totalAum,
        element.weightInPercentage
      ];
      this.arrayOfExcelData[0].push(Object.assign(dataValue));
      if (element.hasOwnProperty('schemes') && element.schemes.length !== 0) {
        // console.log("this is something i need 2");
        element.schemes.forEach((element, index2) => {
          dataValue = [
            index2 + 1,
            element.schemeName,
            element.totalAum,
            element.weightInPercentage
          ];
          this.arrayOfExcelData[1].push(Object.assign(dataValue));

          if (element.hasOwnProperty('clientList') && element.clientList) {
            if (element.clientList.length !== 0) {
              element.clientList.forEach((element, index3) => {
                dataValue = [
                  index3 + 1,
                  element.clientName,
                  element.balanceUnit,
                  element.folio,
                  element.totalAum,
                  element.weightInPercentage
                ];
                this.arrayOfExcelData[2].push(Object.assign(dataValue));

                // if (element.hasOwnProperty('clientList') && element.clientList.length !== 0) {
                //   element.clientList.forEach((element, index4) => {
                //     dataValue = [
                //       index4 + 1,
                //       element.clientName,
                //       element.balanceUnit,
                //       element.folio,
                //       element.currentAmount,
                //       element.weightInPercentage
                //     ];
                //     this.arrayOfExcelData[3].push(Object.assign(dataValue));
                //   });
                // }
              });
            }
          }
        });
      }
    });
  }

  getReponseAmcWiseGet(data) {
    this.isLoading = false;
    if (data) {
      console.log("this we need", data)
      this.amcList = data;
      this.initializeExcelSheet();
      this.amcList.forEach(o => {
        o.showAmc = true;
        this.totalCurrentValue += o.totalAum;
        this.totalWeight += o.weightInPercentage;
      });
    }
    //this.showLoader = false;
  }
  showScheme(amcData) {
    amcData.showAmc = !amcData.showAmc
    amcData.schemes.forEach(o => {
      o.showScheme = true;
    });
  }
  showApplicant(schemeData) {
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
            console.log(data)
          }
        }
      )
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
    //this.showLoader = false;
    this.dataService.openSnackBar(err, 'Dismiss')
  }
}
