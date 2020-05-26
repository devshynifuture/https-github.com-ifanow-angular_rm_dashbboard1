import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { AddInsuranceComponent } from '../../../common-component/add-insurance/add-insurance.component';
import { DetailedViewComponent } from "../../../common-component/detailed-view/detailed-view.component";
import { AddHealthInsuranceAssetComponent } from './add-health-insurance-asset/add-health-insurance-asset.component';
import { AddPersonalAccidentInAssetComponent } from './add-personal-accident-in-asset/add-personal-accident-in-asset.component';
import { AddCriticalIllnessInAssetComponent } from './add-critical-illness-in-asset/add-critical-illness-in-asset.component';
import { AddMotorInsuranceInAssetComponent } from './add-motor-insurance-in-asset/add-motor-insurance-in-asset.component';
import { AddTravelInsuranceInAssetComponent } from './add-travel-insurance-in-asset/add-travel-insurance-in-asset.component';
import { AddHomeInsuranceInAssetComponent } from './add-home-insurance-in-asset/add-home-insurance-in-asset.component';
import { AddFireAndPerilsInsuranceInAssetComponent } from './add-fire-and-perils-insurance-in-asset/add-fire-and-perils-insurance-in-asset.component';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { DetailedViewLifeInsuranceComponent } from '../assets/smallSavingScheme/common-component/detailed-view-life-insurance/detailed-view-life-insurance.component';
import { DetailedViewGeneralInsuranceComponent } from '../assets/smallSavingScheme/common-component/detailed-view-general-insurance/detailed-view-general-insurance.component';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { FileUploadServiceService } from '../assets/file-upload-service.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})

export class InsuranceComponent implements OnInit {
  personalProfileData: any;
  isLoadingUpload: boolean;
  [x: string]: any;
  displayedColumns = ['no', 'life', 'name', 'number', 'sum', 'cvalue', 'premium', 'term', 'pterm', 'desc', 'status', 'icons'];
  displayedColumns1 = ['no', 'owner', 'cvalue', 'amt', 'mvalue', 'rate', 'mdate', 'type', 'ppf', 'desc', 'status', 'icons'];
  displayedColumns2 = ['no', 'life', 'insurerName', 'sumInsured', 'premiumAmount', 'policyExpiryDate', 'Duration', 'planName', 'policyNumber', 'status', 'icons'];

  showTabs = true;
  dataSource1;
  isLoading = false;
  advisorId: any;
  insuranceSubTypeId: any;
  clientId: any;
  noData: string;
  lifeInsuranceFlag: boolean;
  generalInsuranceFlag: boolean;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  data2: Array<any> = [{}, {}, {}];
  fragmentData = { isSpinner: false };
  dataSourceGeneralInsurance = new MatTableDataSource(this.data);
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  lifeInsuranceList = [{ name: 'Term', id: 1, count: '' }, { name: 'Traditional', id: 2, count: '' }, { name: 'ULIP', id: 3, count: '' }];
  generalLifeInsuranceList = [{ name: 'Health', id: 5, count: '' }, { name: 'Personal accident', id: 7, count: '' }, { name: 'Critical illness', id: 6, count: '' }, {
    name: 'Motor',
    id: 4, count: ''
  }, { name: 'Travel', id: 8, count: '' }, { name: 'Home', id: 9, count: '' }, { name: 'Fire & special perils', id: 10, count: '' }]
  allInsurance = [{ name: 'Term', id: 1 }, { name: 'Traditional', id: 2 }, { name: 'ULIP', id: 3 }, { name: 'Health', id: 5 }, { name: 'Personal accident', id: 7 }, { name: 'Critical illness', id: 6 }, {
    name: 'Motor',
    id: 4
  }, { name: 'Travel', id: 8 }, { name: 'Home', id: 9 }, { name: 'Fire & special perils', id: 10 }]
  viewMode;
  dislayList: any;
  sumAssured = 0;
  totalSumAssured = 0;
  totalPremiunAmount = 0;
  totalCurrentValue = 0;
  totalPremiunAmountLifeIns = 0;
  totalSumAssuredLifeIns = 0;
  showInsurance: any;
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('tableEl2', { static: false }) tableEl2;
  @ViewChild('lifeInsurance', { static: false }) lifeInsurance: ElementRef;
  @ViewChild('generalInsurance', { static: false }) generalInsurance: ElementRef;
  lifeInsuranceCount: any;
  generalInsuranceCount: any;
  showType = 'Plan type';
  showPolicyHolder = 'Name of policy holder';
  generalInsuranceDataFilter: any;
  lifeInsuranceFilter: any;
  showAdd = true;
  profileData: any;
  fileUploadData;
  file;
  clientData;
  myFiles;
  
  constructor(private eventService: EventService, public dialog: MatDialog,
    private fileUpload: FileUploadServiceService,
    private subInjectService: SubscriptionInject, private cusService: CustomerService, private utils: UtilService, private excelGen: ExcelGenService, private pdfGen: PdfGenService) {
    this.clientData = AuthService.getClientData()

  }

  insuranceTypeId;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.personalProfileData = AuthService.getProfileDetails();
    this.insuranceTypeId = 1;
    this.insuranceSubTypeId = 0;
    this.getCount();
    this.getGlobalDataInsurance();
    this.getInsuranceData(1);
    this.lifeInsuranceFlag = true;
    this.generalInsuranceFlag = false;
  }

  fetchData(value, fileName, element) {
    this.isLoadingUpload = true
    let obj = {
      advisorId: this.advisorId,
      clientId: element.clientId,
      familyMemberId: element.familyMemberId,
      asset: value
    }
    this.myFiles = [];
    for (let i = 0; i < fileName.target.files.length; i++) {
      this.myFiles.push(fileName.target.files[i]);
    }
    this.fileUploadData = this.fileUpload.fetchFileUploadData(obj, this.myFiles);
    if (this.fileUploadData) {
      this.file = fileName
      this.fileUpload.uploadFile(fileName)
    }
    setTimeout(() => {
      this.isLoadingUpload = false
    }, 7000);
  }
  getCount() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.cusService.getInsuranceCount(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          this.lifeInsuranceCount = data.LifeInsurance
          this.generalInsuranceCount = data.GeneralInsurance
          this.lifeInsuranceList[0].count = data.Term;
          this.lifeInsuranceList[1].count = data.Traditional;
          this.lifeInsuranceList[2].count = data.ULIP;
          this.generalLifeInsuranceList[0].count = data.HealthInsurance;
          this.generalLifeInsuranceList[1].count = data.PersonalAccident;
          this.generalLifeInsuranceList[2].count = data.CriticalIllness;
          this.generalLifeInsuranceList[3].count = data.MotorInsurance;
          this.generalLifeInsuranceList[4].count = data.TravelInsurance;
          this.generalLifeInsuranceList[5].count = data.HomeInsurance;
          this.generalLifeInsuranceList[6].count = data.FireAndSpecialPerilsInsurance;
        }


      },
      error => this.eventService.showErrorMessage(error)
    );
  }

  getInsuranceSubTypeData(advisorId, clientId, insuranceId, insuranceSubTypeId) {
    this.allInsurance.forEach(element => {
      if (element.id == insuranceSubTypeId) {
        this.showInsurance = element.name;
      } else if (insuranceId == 2 && insuranceSubTypeId == 0) {
        this.showInsurance = 'General';
      } else if (insuranceId == 1 && insuranceSubTypeId == 0) {
        this.showInsurance = 'Life';
      }
    });
    this.isLoading = true;
    const obj = {
      advisorId: advisorId,
      clientId: clientId,
      insuranceSubTypeId: insuranceSubTypeId,
      insuranceTypeId: insuranceId
    };
    if (insuranceId == 1) {
      this.dataSource = new MatTableDataSource([{}, {}, {}]);
      this.cusService.getLifeInsuranceData(obj).subscribe(
        data => {
          this.getInsuranceDataResponse(data)
        },
        error => {
          this.isLoading = false;
          this.eventService.showErrorMessage(error);
          this.dataSource.data = [];
        }
      );
    } else {
      delete obj.insuranceTypeId;
      this.dataSourceGeneralInsurance = new MatTableDataSource([{}, {}, {}]);
      this.cusService.getGeneralInsuranceData(obj).subscribe(
        data => {
          this.getGeneralInsuranceDataRes(data);
        },
        error => {
          this.isLoading = false;
          this.eventService.showErrorMessage(error);;
          this.dataSourceGeneralInsurance.data = [];
        }
      );
    }

  }
  filterInsurance(key: string, value: any) {
    let dataFiltered;

    if (this.insuranceTypeId == 1) {
      dataFiltered = this.lifeInsuranceFilter.filter(function (item) {
        return item[key] === value;
      });
      if (dataFiltered.length > 0) {
        this.dataSource.data = dataFiltered;
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.totalCurrentValue = 0;
        this.totalPremiunAmountLifeIns = 0;
        this.totalSumAssuredLifeIns = 0;
        this.dataSource.data.forEach(element => {
          this.totalCurrentValue += (element.vestedBonus != 0) ? element.vestedBonus : element.currentValue,
            this.totalPremiunAmountLifeIns += (element.premiumAmount) ? element.premiumAmount : 0
          this.totalSumAssuredLifeIns += (element.sumAssured) ? element.sumAssured : 0
        });
      } else {
        this.eventService.openSnackBar("No data found", "Dismiss")
      }
    } else {
      dataFiltered = this.generalInsuranceDataFilter.filter(function (item) {
        return item[key] === value;
      });
      if (dataFiltered.length > 0) {
        this.dataSourceGeneralInsurance.data = dataFiltered;
        this.dataSourceGeneralInsurance = new MatTableDataSource(this.dataSourceGeneralInsurance.data);
        this.dataSourceGeneralInsurance.sort = this.sort;
        this.totalSumAssured = 0;
        this.totalPremiunAmount = 0;
        this.dataSourceGeneralInsurance.data.forEach(element => {
          if (this.dislayList) {
            this.dislayList.policyTypes.forEach(ele => {
              if (element.policyTypeId) {
                if (ele.id == element.policyTypeId) {
                  element.policyType = ele.policy_type
                  this.showType = 'plan Type'
                }
              } else {
                this.showType = 'PlanName'
              }

            });
            (element.insuredMembers.length == 0) ? this.showPolicyHolder = 'Name of policy holder' : this.showPolicyHolder = 'Name of insured members';
          }
          // this.sumAssured = 0;
          // element.insuredMembers.forEach(ele => {
          //   this.sumAssured += ele.sumInsured
          // });
          // element.sumAssured = this.sumAssured
          this.sumAssured = 0;
          if (element.insuredMembers.length > 0) {
            element.insuredMembers.forEach(ele => {
              this.sumAssured += ele.sumInsured
            });
            element.sumAssured = this.sumAssured
          } else if (element.policyFeatures.length > 0) {
            element.policyFeatures.forEach(ele => {
              this.sumAssured += ele.featureSumInsured
            });
            element.sumAssured = this.sumAssured
          } else {
            element.sumAssured = element.sumInsuredIdv
          }

        });
        this.dataSourceGeneralInsurance.data.forEach(element => {
          this.totalSumAssured += element.sumAssured,
            this.totalPremiunAmount += element.premiumAmount

        });
        this.isLoading = false;

      } else {
        this.eventService.openSnackBar("No data found", "Dismiss")
      }
    }



  }
  getInsuranceDataResponse(data) {
    this.isLoading = false
    if (data) {
      this.dataSource.data = data.insuranceList;
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.lifeInsuranceFilter = this.dataSource.data;
      this.getCount();
      this.getStatusId(this.dataSource.data);
      this.totalCurrentValue = 0;
      this.totalPremiunAmountLifeIns = 0;
      this.totalSumAssuredLifeIns = 0;
      this.dataSource.data.forEach(element => {
        this.totalCurrentValue +=  (element.vestedBonus != 0) ? element.vestedBonus : element.currentValue,
          this.totalPremiunAmountLifeIns += (element.premiumAmount) ? element.premiumAmount : 0
        this.totalSumAssuredLifeIns += (element.sumAssured) ? element.sumAssured : 0
      });
    } else {
      this.getCount();


      this.dataSource.data = [];
    }
  }

  getInsuranceData(typeId) {
    this.lifeInsuranceFlag = true;
    this.generalInsuranceFlag = false;
    this.showInsurance = 'Life';
    this.isLoading = true;
    this.dataSource = new MatTableDataSource([{}, {}, {}]);
    this.dataSourceGeneralInsurance = new MatTableDataSource([{}, {}, {}]);
    this.insuranceTypeId = 1;
    this.insuranceSubTypeId = 0;
    if (this.insuranceSubTypeId == 0 && this.insuranceTypeId == 2) {
      this.showAdd = false;
    } else {
      this.showAdd = true;
    }
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      insuranceTypeId: typeId
    };
    // this.dataSource.data = [{}, {}, {}];
    this.cusService.getInsuranceData(obj).subscribe(
      data => {
        this.getInsuranceDataRes(data);
      },
      error => {
        this.dataSource.data = [];
      }
      // , (error) => {
      //   this.eventService.openSnackBar('Something went wrong!', 'Dismiss');
      //   this.dataSource.data = [];
      //   this.isLoading = false;
      // }
    );
  }
  getStatusId(data) {
    data.forEach(obj => {
      if (obj.policyExpiryDate < new Date()) {
        obj.statusId = (this.insuranceTypeId == 1) ? 'MATURED' : 'EXPIRED';
      } else {
        obj.statusId = 'LIVE';
      }
    });
  }
  getInsuranceDataRes(data) {
    if (data) {
      this.dataSource.data = data.insuranceList;
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.lifeInsuranceFilter = this.dataSource.data;
      this.getCount();
      this.getStatusId(this.dataSource.data);
      this.totalCurrentValue = 0;
      this.totalPremiunAmountLifeIns = 0;
      this.totalSumAssuredLifeIns = 0;
      this.dataSource.data.forEach(element => {
        this.totalCurrentValue +=  (element.vestedBonus != 0) ? element.vestedBonus : element.currentValue,
          this.totalPremiunAmountLifeIns += (element.premiumAmount) ? element.premiumAmount : 0
        this.totalSumAssuredLifeIns += (element.sumAssured) ? element.sumAssured : 0
      });
      this.isLoading = false;
    } else {
      this.isLoading = false;
      this.getCount();
      this.dataSource.data = [];
    }
  }
  getGeneralInsuranceDataRes(data) {

    if (data) {
      this.dataSourceGeneralInsurance.data = data.generalInsuranceList;
      this.dataSourceGeneralInsurance = new MatTableDataSource(this.dataSourceGeneralInsurance.data);
      this.dataSourceGeneralInsurance.sort = this.sort;
      this.generalInsuranceDataFilter = this.dataSourceGeneralInsurance.data;
      this.getStatusId(this.dataSourceGeneralInsurance.data);
      this.getCount();
      this.totalSumAssured = 0;
      this.totalPremiunAmount = 0;
      this.dataSourceGeneralInsurance.data.forEach(element => {
        if (this.dislayList) {
          this.dislayList.policyTypes.forEach(ele => {
            if (element.policyTypeId) {
              if (ele.id == element.policyTypeId) {
                element.policyType = ele.policy_type
                this.showType = 'Plan type'
              }
            } else {
              this.showType = 'PlanName'
            }

          });
          (element.insuredMembers.length == 0) ? this.showPolicyHolder = 'Name of policy holder' : this.showPolicyHolder = 'Name of insured members';
        }
        // this.sumAssured = 0;
        // if (element.insuredMembers.length > 0) {
        //   element.insuredMembers.forEach(ele => {
        //     this.sumAssured += ele.sumInsured
        //   });
        //   element.sumAssured = this.sumAssured
        // } else 
        this.sumAssured=0;
        if (element.policyFeatures.length > 0) {
          element.policyFeatures.forEach(ele => {
            this.sumAssured += ele.featureSumInsured
          });
          element.sumAssured = this.sumAssured
          if(element.sumAssured == 0) {
            element.sumAssured = element.sumInsuredIdv
          }
        } else {
          element.sumAssured = element.sumInsuredIdv
        }

      });
      this.dataSourceGeneralInsurance.data.forEach(element => {
        this.totalSumAssured += element.sumAssured,
          this.totalPremiunAmount += element.premiumAmount

      });
      this.isLoading = false;
    } else {
      this.isLoading = false;
      this.getCount();
      this.dataSourceGeneralInsurance.data = [];

    }
  }
  getGlobalDataInsurance() {
    const obj = {};
    this.cusService.getInsuranceGlobalData(obj).subscribe(
      data => {
        console.log(data),
          this.dislayList = data;
      }
    );
  }

  Excel(tableTitle) {
    tableTitle = this.showInsurance + '_' + 'Insurance';
    this.fragmentData.isSpinner = true;
    if (this.insuranceTypeId == 1) {
      let rows = this.tableEl._elementRef.nativeElement.rows;
      const data = this.excelGen.generateExcel(rows, tableTitle);
      if (data) {
        this.fragmentData.isSpinner = false;
      }
    } else {
      let rows = this.tableEl2._elementRef.nativeElement.rows;
      const data = this.excelGen.generateExcel(rows, tableTitle);
      if (data) {
        this.fragmentData.isSpinner = false;
      }
    }

  }
  // generatePdf() {
  //   this.fragmentData.isSpinner = true;
  //   if (this.insuranceTypeId == 1) {
  //     let para = document.getElementById('template');
  //     this.utils.htmlToPdf(para.innerHTML, 'Test', this.fragmentData);
  //   } else {
  //     let para = document.getElementById('template2');
  //     this.utils.htmlToPdf(para.innerHTML, 'Test', this.fragmentData);
  //   }

  // }
  generatePdf(tableTitle) {
    // let rows = this.tableEl._elementRef.nativeElement.rows;
    // this.pdfGen.generatePdf(rows, tableTitle);
    tableTitle = this.showInsurance + '_' + 'Insurance';
    // this.fragmentData.isSpinner = true;
    if (this.insuranceTypeId == 1) {
      let rows = this.tableEl._elementRef.nativeElement.rows;
      const data = this.pdfGen.generatePdf(rows, tableTitle);
      // if (data) {
      //   this.fragmentData.isSpinner = false;
      // }
    } else {
      let rows = this.tableEl2._elementRef.nativeElement.rows;
      const data = this.pdfGen.generatePdf(rows, tableTitle);
      // if (data) {
      //   this.fragmentData.isSpinner = false;
      // }
    }
  }
  getInsuranceTypeData(typeId, typeSubId) {
    this.lifeInsuranceFlag = false;
    this.generalInsuranceFlag = false;
    if (typeId == 2 && typeSubId == 0) {
      this.generalInsuranceFlag = true;
    } else {
      this.generalInsuranceFlag = false;
    }
    this.insuranceTypeId = typeId;
    this.insuranceSubTypeId = typeSubId;
    if (this.insuranceSubTypeId == 0 && this.insuranceTypeId == 2) {
      this.showAdd = false;
    } else {
      this.showAdd = true;
    }
    this.getInsuranceSubTypeData(this.advisorId, this.clientId, typeId, typeSubId);
  }

  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        let subTypeId = (data) ? data.insuranceSubTypeId : this.insuranceSubTypeId
        this.insuranceSubTypeId = 0;
        if (this.insuranceTypeId == 1) {
          (this.showInsurance == 'Life') ? this.insuranceSubTypeId = 0 : this.insuranceSubTypeId = subTypeId;
          this.cusService.deleteInsurance(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Insurance is deleted', 'Dismiss');
              dialogRef.close();
              // this.getInsuranceData(this.insuranceTypeId)\
              if (this.insuranceTypeId == 1 && this.insuranceSubTypeId == 0) {
                this.getInsuranceData(this.insuranceTypeId)
              } else {
                this.getInsuranceSubTypeData(this.advisorId, this.clientId, this.insuranceTypeId, this.insuranceSubTypeId)
              }

            },
            error => this.eventService.showErrorMessage(error)
          );
        } else {
          (this.showInsurance == 'General') ? this.insuranceSubTypeId = 0 : this.insuranceSubTypeId = subTypeId;
          this.cusService.deleteGeneralInsurance(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Insurance is deleted', 'Dismiss');
              dialogRef.close();
              this.getInsuranceSubTypeData(this.advisorId, this.clientId, this.insuranceTypeId, this.insuranceSubTypeId);
            },
            error => this.eventService.showErrorMessage(error)
          );
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

  toggle(value) {
    if (value === 'lifeInsurance') {
      this.lifeInsuranceFlag = true;
      this.generalInsuranceFlag = false;
      this.insuranceSubTypeId = 0;
      // this.generalLifeInsuranceList = [];
      this.lifeInsuranceList = [];
      [{ name: 'Term', id: 1, count: '' }, { name: 'Traditional', id: 2, count: '' }, { name: 'ULIP', id: 3, count: '' }].map((i) => {
        this.lifeInsuranceList.push(i);
      });
    } else {
      // this.lifeInsuranceList = [];
      this.lifeInsuranceFlag = false;
      this.generalInsuranceFlag = true;
      this.generalLifeInsuranceList = [];
      [{ name: 'Health', id: 5, count: '' }, { name: 'Personal accident', id: 7, count: '' }, { name: 'Critical illness', id: 6, count: '' }, {
        name: 'Motor',
        id: 4, count: ''
      }, { name: 'Travel', id: 8, count: '' }, { name: 'Home', id: 9, count: '' }, { name: 'Fire & special perils', id: 10, count: '' }].map((i) => {
        this.generalLifeInsuranceList.push(i);
      });
    }
  }

  editInsurance(data) {
    console.log(data);
  }

  open(data) {
    const sendData = {
      flag: 'detailedView',
      data: {},
      insuranceTypeId: this.insuranceTypeId,
      insuranceSubTypeId: this.insuranceSubTypeId,
      state: 'open',
      componentName: null
    }
    sendData.data = {
      data: data,
      displayList: this.dislayList,
      allInsurance: this.allInsurance,
      insuranceTypeId: this.insuranceTypeId,
      insuranceSubTypeId: this.insuranceSubTypeId,
      showInsurance: this.showInsurance,

    }
    if (this.insuranceTypeId == 1) {
      sendData.componentName = DetailedViewLifeInsuranceComponent
    } else {
      sendData.componentName = DetailedViewGeneralInsuranceComponent
    }
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(sendData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

  openAddInsurance(data) {

    this.insuranceSubTypeId = (data) ? data.insuranceSubTypeId : this.insuranceSubTypeId;
    const inputData = {
      data,
      insuranceTypeId: this.insuranceTypeId,
      insuranceSubTypeId: this.insuranceSubTypeId,
      displayList: this.dislayList,
      showInsurance: this.showInsurance
    };
    const fragmentData = {
      flag: 'addInsurance',
      data: inputData,
      componentName: null,
      state: 'open'
    };
    switch (this.insuranceSubTypeId) {
      case 1:
        fragmentData.componentName = AddInsuranceComponent;
        inputData.showInsurance = 'TERM ';
        break;
      case 2:
        inputData.showInsurance = 'TRADITIONAL ';
        fragmentData.componentName = AddInsuranceComponent;
        break;
      case 3:
        inputData.showInsurance = 'ULIP ';
        fragmentData.componentName = AddInsuranceComponent;
        break;
      case 5:
        fragmentData.componentName = AddHealthInsuranceAssetComponent;
        break;
      case 7:
        fragmentData.componentName = AddPersonalAccidentInAssetComponent;
        break;
      case 6:
        fragmentData.componentName = AddCriticalIllnessInAssetComponent;
        break;
      case 4:
        fragmentData.componentName = AddMotorInsuranceInAssetComponent;
        break;
      case 8:
        fragmentData.componentName = AddTravelInsuranceInAssetComponent;
        break;
      case 9:
        fragmentData.componentName = AddHomeInsuranceInAssetComponent;
        break;
      case 10:
        fragmentData.componentName = AddFireAndPerilsInsuranceInAssetComponent;
        break;
      default:
        fragmentData.componentName = AddInsuranceComponent;
        break;

    }
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        let subTypeId = (sideBarData.data) ? sideBarData.data.insuranceSubTypeId : this.insuranceSubTypeId
        if (this.showInsurance == 'General' || this.showInsurance == 'Life') {
          this.insuranceSubTypeId = 0
        }
        if (UtilService.isDialogClose(sideBarData)) {

          if (sideBarData.data) {
            // this.lifeInsuranceFlag = true
            if (this.insuranceTypeId == 1) {
              // this.insuranceSubTypeId = 0;
              this.getCount();
              // this.getInsuranceData(this.insuranceTypeId )
              (this.showInsurance == 'Life') ? this.insuranceSubTypeId = 0 : this.insuranceSubTypeId = subTypeId;
              if (this.insuranceTypeId == 1 && this.insuranceSubTypeId == 0) {
                this.getInsuranceData(this.insuranceTypeId)
              } else {
                this.getInsuranceSubTypeData(this.advisorId, this.clientId, this.insuranceTypeId, this.insuranceSubTypeId)
              }
              console.log('this is sidebardata in subs subs 2: ', sideBarData);
            } else {
              (this.showInsurance == 'General') ? this.insuranceSubTypeId = 0 : this.insuranceSubTypeId = subTypeId;
              this.getCount();
              this.getInsuranceSubTypeData(this.advisorId, this.clientId, this.insuranceTypeId, this.insuranceSubTypeId)
            }
          }
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

}


export interface PeriodicElement {
  no: string;
  life: string;
  name: string;
  number: string;
  sum: string;
  cvalue: string;
  premium: string;
  term: string;
  pterm: string;
  desc: string;
  status: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    no: '1', life: 'Rahul Jain', name: 'Cumulative', number: '358656327863', sum: '94,925', cvalue: '60,000',
    premium: '1,00,000', term: '45', pterm: '45', desc: 'ICICI FD', status: 'MATURED'
  },
  {
    no: '2', life: 'Shilpa Jain', name: 'Cumulative', number: '358656327863', sum: '94,925', cvalue: '60,000',
    premium: '1,00,000', term: '45', pterm: '45', desc: 'ICICI FD', status: 'MATURED'
  },
  {
    no: '', life: '', name: '', number: '', sum: '94,925', cvalue: '60,000',
    premium: '1,00,000', term: '', pterm: '', desc: '', status: ''
  },
];

export interface PeriodicElement1 {
  no: string;
  owner: string;
  cvalue: string;
  amt: string;
  mvalue: string;
  rate: string;
  mdate: string;
  type: string;
  ppf: string;
  desc: string;
  status: string;

}
