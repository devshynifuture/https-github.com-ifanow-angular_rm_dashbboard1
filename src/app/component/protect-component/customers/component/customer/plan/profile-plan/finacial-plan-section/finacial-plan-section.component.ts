import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { delay } from 'rxjs/operators';
import { IncomeComponent } from '../income/income.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ExpensesComponent } from '../../../accounts/expenses/expenses.component';
import { InsuranceComponent } from '../../../accounts/insurance/insurance.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MutualFundSummaryComponent } from '../../../accounts/assets/mutual-fund/mutual-fund/mutual-fund-summary/mutual-fund-summary.component';
import { MutualFundComponent } from '../../../accounts/assets/mutual-fund/mutual-fund/mutual-fund.component';
import { MutualFundOverviewComponent } from '../../../accounts/assets/mutual-fund/mutual-fund/mutual-fund-overview/mutual-fund-overview.component';
import { MutualFundUnrealizedTranComponent } from '../../../accounts/assets/mutual-fund/mutual-fund/mutual-fund-unrealized-tran/mutual-fund-unrealized-tran.component';
import { LiabilitiesComponent } from '../../../accounts/liabilities/liabilities.component';
import { OtherPayablesComponent } from '../../../accounts/liabilities/other-payables/other-payables.component';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { PlanService } from '../../plan.service';
import { GoalsPlanComponent } from '../../goals-plan/goals-plan.component';
import { CommoditiesComponent } from '../../../accounts/assets/commodities/commodities/commodities.component';
import { RealEstateComponent } from '../../../accounts/assets/realEstate/real-estate/real-estate.component';
import { AssetStocksComponent } from '../../../accounts/assets/asset-stocks/asset-stocks.component';
import { CashAndBankComponent } from '../../../accounts/assets/cash&bank/cash-and-bank/cash-and-bank.component';
import { FixedIncomeComponent } from '../../../accounts/assets/fixedIncome/fixed-income/fixed-income.component';
import { RetirementAccountComponent } from '../../../accounts/assets/retirementAccounts/retirement-account/retirement-account.component';
import { PoMisSchemeComponent } from '../../../accounts/assets/smallSavingScheme/po-mis-scheme/po-mis-scheme.component';
import { PoTdSchemeComponent } from '../../../accounts/assets/smallSavingScheme/po-td-scheme/po-td-scheme.component';
import { PoRdSchemeComponent } from '../../../accounts/assets/smallSavingScheme/po-rd-scheme/po-rd-scheme.component';
import { PoSavingsComponent } from '../../../accounts/assets/smallSavingScheme/po-savings/po-savings.component';
import { ScssSchemeComponent } from '../../../accounts/assets/smallSavingScheme/scss-scheme/scss-scheme.component';
import { KvpSchemeComponent } from '../../../accounts/assets/smallSavingScheme/kvp-scheme/kvp-scheme.component';
import { SsySchemeComponent } from '../../../accounts/assets/smallSavingScheme/ssy-scheme/ssy-scheme.component';
import { NscSchemeComponent } from '../../../accounts/assets/smallSavingScheme/nsc-scheme/nsc-scheme.component';
import { PPFSchemeComponent } from '../../../accounts/assets/smallSavingScheme/ppf-scheme/ppf-scheme.component';
import { LifeInsuranceComponent } from '../../insurance-plan/mainInsuranceScreen/life-insurance/life-insurance.component';
import { HttpClient } from '@angular/common/http';
import { MutualFundsCapitalComponent } from '../../../accounts/assets/mutual-fund/mutual-fund/mutual-funds-capital/mutual-funds-capital.component';
import { MfCapitalDetailedComponent } from '../../../accounts/assets/mutual-fund/mutual-fund/mf-capital-detailed/mf-capital-detailed.component';
import { apiConfig } from 'src/app/config/main-config';
import { CustomerService } from '../../../customer.service';
import { SummaryPlanServiceService } from '../../summary-plan/summary-plan-service.service';
import { DatePipe } from '@angular/common';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { EventService } from 'src/app/Data-service/event.service';
import { PreviewFinPlanComponent } from '../preview-fin-plan/preview-fin-plan.component';
import { ChangeDetectorRef } from '@angular/core';
import { SaveFinPlanSectionComponent } from '../save-fin-plan-section/save-fin-plan-section.component';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { CrmNotesComponent } from 'src/app/component/protect-component/AdviserComponent/Activities/crm-notes/crm-notes.component';
import { OverviewRiskProfileComponent } from '../../../customer-overview/overview-profile/overview-risk-profile/overview-risk-profile.component';
import { RoleService } from 'src/app/auth-service/role.service';
import { OthersAssetsComponent } from '../../../accounts/assets/others-assets/others-assets.component';

// import { InsuranceComponent } from '../../../accounts/insurance/insurance.component';

@Component({
  selector: 'app-finacial-plan-section',
  templateUrl: './finacial-plan-section.component.html',
  styleUrls: ['./finacial-plan-section.component.scss'],
  entryComponents: [
    IncomeComponent,
    ExpensesComponent,
    InsuranceComponent,
    MutualFundSummaryComponent,
    MutualFundOverviewComponent,
    MutualFundUnrealizedTranComponent,
    MutualFundComponent,
    LiabilitiesComponent,
    OtherPayablesComponent,
    GoalsPlanComponent,
    CommoditiesComponent,
    RealEstateComponent,
    AssetStocksComponent,
    CashAndBankComponent,
    FixedIncomeComponent,
    RetirementAccountComponent,
    PoMisSchemeComponent,
    PoTdSchemeComponent,
    PoRdSchemeComponent,
    PoSavingsComponent,
    ScssSchemeComponent,
    KvpSchemeComponent,
    SsySchemeComponent,
    NscSchemeComponent,
    PPFSchemeComponent,
    OthersAssetsComponent,
    LifeInsuranceComponent,
    MutualFundsCapitalComponent,
    MfCapitalDetailedComponent,
    CrmNotesComponent,
    OverviewRiskProfileComponent
  ]
})
export class FinacialPlanSectionComponent implements OnInit {
  loadedSection: any;
  fragmentData = { isSpinner: false };
  @ViewChild('pdfContainer', {
    read: ViewContainerRef,
    static: true
  }) container;
  moduleAdded: any;
  selected = 0;
  isLoading = false;
  panelOpenState = false;
  dataSource: any;
  goalList: any;
  goalSummaryCountObj: any;
  advisorId: any;
  clientId: any;
  insuranceList: any;
  insurancePlanningList: any;
  count: any = 0;
  id: any;
  generatePDF: any;
  isSpinner: boolean = true;
  sectionName: any;
  clientData: any;
  mfCount: any;
  displayedColumns: string[] = ['name', 'clientName', 'mfoverview', 'date', 'download', 'preview', 'icons'];
  clientDetails: any;
  hideTable: boolean = false;
  STOCK;
  quotes: any;
  fincialPlan: any;
  miscellaneous: any;
  element: any;
  getOrgData: any;
  userInfo: any;
  panelOpenState1: boolean = false;
  customCollapsedHeight: string = '40px';
  customExpandedHeight: string = '40px';
  moduleAddedLoader: {}[];
  downloadPdf: boolean = false;
  emailBody: string;
  liabilitiesList: any;
  commonList: any[];
  portfolioInsurance: any;
  selectedObj: any;
  expenseCount: any;
  bugetCount: any;
  incomeCount: any;
  clientDob: string;
  familyList: any[];
  svg: any;
  dataSourceHistory: any;
  storeResult: any;
  searchQuery: any;
  listOfNotes: any;
  constructor(private http: HttpClient, private util: UtilService,
    private cusService: CustomerService,
    private resolver: ComponentFactoryResolver,
    private eventService: EventService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe,
    private summaryPlanService: SummaryPlanServiceService,
    private planService: PlanService,
    private peopleService: PeopleService,
    private subInjectService: SubscriptionInject,
    public roleService: RoleService) {
    this.advisorId = AuthService.getAdvisorId(),
      this.clientId = AuthService.getClientId()
    this.clientData = AuthService.getClientData();
    this.getOrgData = AuthService.getOrgDetails();
    this.userInfo = AuthService.getUserInfo();

  }


  ngOnInit() {
    this.commonList = []
    this.count = 0;
    this.moduleAdded = [];
    this.clientDetails = [{}, {}, {}];
    this.getListFamilyMem();
    this.getGoalSummaryValues();
    this.getInsuranceList();
    this.getAssetCountGlobalData()
    this.getCountPortfolioInsurance()
    this.getIncome()
    //this.getExpense()
    this.getBuget()
    this.getTemplateSection()
    this.getPlanSection()
    this.getLibilities()
    this.riskHistory();
    this.getNotes();
    this.isLoading = true
    this.emailBody = '<html><body><img src="https://res.cloudinary.com/futurewise/image/upload/v1491912047/fp-templates-uploads/index.jpg" width="965px" height="1280px"><div style="position: absolute;top: 18px;left: 16px;font-size: 20;padding-left:15px;"> <b>Date: ' + this.datePipe.transform(new Date(), 'dd-MM-yyyy') + '</b></div><div style="position: absolute;top: 18px;right: 18px;padding-right:15px;"> <img _ngcontent-hwm-c87="" width="140px" src=' + this.getOrgData.logoUrl + ' class="ng-star-inserted"></div><div style="position: absolute;top: 200px;right: 18px;font-size: 20; padding-right:15px;"> <b>Prepared by: ' + this.userInfo.name + '</b></div><div style="position: absolute;top: 280px;right: 18px;font-size: 20;padding-right:15px"> <b>' + this.clientData.name + '`s Plan</b></div></body></html>'
    //this.pdfFromImage()
    console.log('clientData', this.clientData)
    console.log('clientData', this.getOrgData)
  }
  viewRiskResult(value: any, sectionName: any, obj: any, displayName: any, flag: any, array) {
    this.viewResult(value, sectionName, obj, displayName, flag, array)
  }
  getNotes() {
    this.isLoading = true
    let obj = {
      advisorId: AuthService.getAdvisorId(),
      searchQuery: (this.searchQuery) ? this.searchQuery : '',
      limit: -1,
      offset: 0
    }
    this.peopleService.getNotes(obj)
      .subscribe(res => {
        if (res && res.length > 0) {
          console.log(res);
          this.isLoading = false
          this.listOfNotes = res
          this.listOfNotes.forEach(element => {
            element.showContent = element.content.replace(/(<([^>]+)>)/ig, '');
            element.isSelected = false;
            element.isSelectedCheckbox = false;
            element.activeOnSelect = false
            element.checked = false
          });
          console.log(this.listOfNotes);
        } else {
          this.isLoading = false
          this.listOfNotes = []
        }


      }, err => {
        console.error(err);
        this.isLoading = false
        this.listOfNotes = []
      })
  }
  riskHistory() {
    this.isLoading = true
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
    };
    this.planService.getRiskHistory(obj).subscribe(
      data => this.getRiskHistoryRes(data), error => {
      });
  }
  getRiskHistoryRes(data) {
    this.isLoading = false
    console.log('getRiskHistoryRes', data);
    this.dataSourceHistory = data.clientRiskProfileList;
    this.dataSourceHistory.forEach(element => {
      element.isSelected = false;
      element.isSelectedCheckbox = false;
    });
  }
  viewResult(value, sectionName, obj, displayName, flag, array) {
    const data = {
      clientRiskProfileId: obj.id
    }
    this.planService.getResultRisk(data).subscribe(
      data => this.getResultRiskRes(data, value, sectionName, obj, displayName, flag, array), error => {
      });
  }
  getResultRiskRes(data, value, sectionName, obj, displayName, flag, array) {
    this.isLoading = false
    this.storeResult = data;
    this.checkAndLoadPdf(value, sectionName, obj, displayName, flag, data)
  }
  getListFamilyMem() {
    this.isLoading = true;
    const obj = {
      clientId: this.clientId
    };
    this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
      data => {
        if (data) {
          let array = [];
          data.forEach(element => {
            if (element.familyMemberId == 0) {
              this.clientDob = this.datePipe.transform(new Date(element.dateOfBirth), 'yyyy-MM-dd');
            } else {
              const obj = {
                'dob': this.datePipe.transform(new Date(element.dateOfBirth), 'yyyy-MM-dd'),
                'id': element.familyMemberId
              }
              array.push(obj);
            }

          });
          this.familyList = array.map(function (obj, ind) {
            let val = obj.id;
            obj[val] = obj['dob']
            delete obj['dob'];
            delete obj['id'];
            return obj;
          });
          this.getExpense()

        }
      },
    );

    // this.isLoading = true;

  }
  getIncome() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.cusService.getIncome(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          console.log('incomeCount', data)
          this.incomeCount = data
        }
      },
      error => this.eventService.showErrorMessage(error)
    );
  }
  getBuget() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.cusService.getBudget(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          console.log('bugetCount', data)
          this.bugetCount = data
        }
      },
      error => this.eventService.showErrorMessage(error)
    );
  }
  getExpense() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      clientDob: this.clientDob,
      fmDobList: JSON.stringify(this.familyList)
    };
    this.cusService.getExpense(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          console.log('expenseCount', data)
          this.expenseCount = data
        }
      },
      error => this.eventService.showErrorMessage(error)
    );
  }
  // checkAndLoadPdf(value, sectionName) {
  //   if (value) {
  //     this.loadedSection = sectionName
  //   }
  // }
  downloadPrevoius(element) {
    let obj = {
      clientId: AuthService.getClientId(),
      s3Objects: element.modules
    }
    this.planService.mergeCall(obj).subscribe(
      data => this.mergeCallRes(data)
    );
  }

  getPreview(element, value) {
    if (value == 'table') {
      let obj = {
        id: (element.financialPlanPdfLogId == undefined) ? element.id : element.financialPlanPdfLogId
      }
      this.planService.getPreview(obj).subscribe(
        data => this.getPreviewRes(data, value)
      );
    } else {
      const dialogRef = this.dialog.open(PreviewFinPlanComponent, {
        width: '600px',
        height: '798px',
        data: { bank: element, selectedElement: '' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == undefined) {
          return
        }
        console.log('The dialog was closed');
        this.element = result;
        console.log('result -==', this.element)
      });
    }

  }

  getPreviewRes(data, element) {
    console.log('preview', data)
    const dialogRef = this.dialog.open(PreviewFinPlanComponent, {
      width: '600px',
      height: '620px',
      data: { bank: element, selectedElement: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return
      }
      console.log('The dialog was closed');
      this.element = result;
      console.log('result -==', this.element)
    });
  }

  addNew() {
    this.hideTable = true
  }

  deletePlanSection(value, data) {
    let obj = {
      id: data.id
    }
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.planService.deletePlanSection(obj).subscribe(
          data => {
            this.eventService.openSnackBar('Income deleted successfully', 'Dismiss');
            // this.deleteId(incomeData.id);
            // this.getIncomeList();
            dialogRef.close();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
        console.log('2222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {
      this.getPlanSection()
    });
  }
  close() {
    this.hideTable = false
    this.moduleAdded = []
  }
  uploadImageSetText(element) {
    var content = element.content.replace(/<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g, "");
    var clientNameReg1 = "<clientname>";
    element.content = element.content.replace(new RegExp(clientNameReg1, 'g'), this.clientData.name)
    var clientNameReg2 = "<clientname>";
    element.content = element.content.replace(new RegExp(clientNameReg2, 'g'), this.clientData.name)
    var advisorNameReg1 = "<advisorname>";
    element.content = element.content.replace(new RegExp(advisorNameReg1, 'g'), this.userInfo.name)
    var advisorNameReg2 = "<advisorname>";
    element.content = element.content.replace(new RegExp(advisorNameReg2, 'g'), this.userInfo.name)
    var emailIdReg = "<advisoremailId>";
    element.content = element.content.replace(new RegExp(emailIdReg, 'g'), this.getOrgData.email)
    var mobileNoReg = "<advisormobileno>";
    element.content = element.content.replace(new RegExp(mobileNoReg, 'g'), this.userInfo.mobileList[0].mobileNo)
    var currentDateReg = "<currentdate>";
    element.content = element.content.replace(new RegExp(currentDateReg, 'g'), this.datePipe.transform(new Date(), 'dd-MMM-yyyy'))
    element.content = element.content.replace("[advisorname]", '<b>' + AuthService.getUserInfo().name + '</b>')
    element.content = element.content.replace("[advisoremailId]", '<b>' + this.userInfo.mobileList[0].mobileNo + '</b>')
    element.content = element.content.replace("[advisormobileno]", '<b>' + this.getOrgData.email + '</b>')
    element.content = element.content.replace("[currentdate]", '<b>' + this.datePipe.transform(new Date(), 'dd-MMM-yyyy') + '</b>')
    element.content = element.content.replace("[clientname]", '<b>' + this.clientData.name + '</b>')
    const obj = {
      clientId: this.clientId,
      name: element.name + '.html',
      htmlInput: String(element.content)
    };
    this.sectionName = element.name
    this.planService.getFinPlanFileUploadUrl(obj).subscribe(
      data => this.uploadFileRes(data, element.name, false, '')
    );
  }
  pdfFromImage(element, list, i) {
    if (list.name == "Miscellaneous") {
      this.uploadImageSetText(element)
    } else {
      if (element.add == true) {
        this.moduleAdded.splice(i, 1);
        element.add = false
        this.cd.detectChanges()
      } else {
        if (element.name == 'Index') {
          var el = document.getElementById("yabanner");
          el.innerHTML = this.emailBody;
          this.uploadFile(el, list.name, element.name, false, element)
        } else {
          var el = document.getElementById("yabanner");
          el.innerHTML = "<img src=\"" + element.imageUrl + "\"" + "\" width=\"965px\" height=\"1280px\">";
          this.uploadFile(el, list.name, element.name, false, element)
        }
      }
    }
  }

  getAssetCountGlobalData() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.cusService.getAssetCountGlobalData(obj).subscribe(
      data => this.getAssetCountGLobalDataRes(data)
    );
  }

  getAssetCountGLobalDataRes(data) {
    console.log('Mf Count', data)
    this.mfCount = data
  }

  getTemplateSection() {

    this.planService.getTemplates('').subscribe(
      data => this.getTemplatesRes(data),
      err => {
        console.error(err);
      }
    );
  }

  getTemplatesRes(data) {
    console.log('template listd', data)
    this.quotes = data[1];
    this.quotes.templates.forEach(element => {
      element.add = false
    });
    this.fincialPlan = data[0];
    this.fincialPlan.templates.forEach(element => {
      element.add = false;
    });
    this.miscellaneous = data[2]
    this.miscellaneous.templates.forEach(element => {
      element.add = false;
    });
  }

  getPlanSection() {
    this.isLoading = true
    let obj = {
      advisorId: AuthService.getAdvisorId(),
      clientId: AuthService.getClientId()
    }
    this.planService.getPlanSection(obj).subscribe(
      data => this.getPlanSectionRes(data),
      err => {
        console.error(err);
      }
    );
  }

  getPlanSectionRes(data) {
    if (data) {
      this.isLoading = false
      console.log('get plan section data', data)
      this.clientDetails = data
      if (this.clientDetails.length == 0) {
        this.hideTable = false
      }
    } else {
      this.isLoading = false
      this.clientDetails = []
      this.hideTable = true
    }

  }

  generatePdf(data, sectionName, displayName) {
    this.fragmentData.isSpinner = true;
    // let para = document.getElementById('template');
    // this.util.htmlToPdf(para.innerHTML, 'Test',this.fragmentData);
    this.util.htmlToPdf('', data.innerHTML, sectionName, 'true', this.fragmentData, 'showPieChart', '', false);

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.moduleAdded, event.previousIndex, event.currentIndex);
    console.log(this.moduleAdded);
  }

  removeModule(module, i) {
    module.checked = false
    module.isSelected = false
    if (module.array && module.array.add) {
      module.array.add = false
    } else if (module.array && module.array.checked) {
      module.array.checked = false
    } else if (module.array && module.array.isSelectedCheckbox) {
      module.array.isSelectedCheckbox = false;
    }
    this.moduleAdded.splice(i, 1);
    if (this.moduleAdded.length == 0) {
      this.hideTable = true
    }
  }

  download() {
    let moduleAdded = this.moduleAdded
    moduleAdded.forEach(element => {
      delete element.array
    });
    this.downloadPdf = true
    let obj = {
      clientId: AuthService.getClientId(),
      s3Objects: this.moduleAdded
    }
    this.planService.mergeCall(obj).subscribe(
      data => this.mergeCallRes(data)
    );

  }

  mergeCallRes(data) {
    this.id = data
    this.generatePDF = 0
    this.isSpinner = false
    setTimeout(() => {
      this.getPDFCall(data)
    }, 5000);
  }

  formatFileSize(bytes, decimalPoint) {
    if (bytes == 0) return '0 Bytes';
    var k = 1000,
      dm = decimalPoint || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  getPDFCall(data) {
    this.isSpinner = false
    let obj = {
      id: data.id
    }
    // this.summaryPlanService.setFinPlanId(data.id);
    return this.http
      .post(
        apiConfig.MAIN_URL + 'plan/financial-plan/pdf/get',
        obj,
        { responseType: 'blob' }
      )
      .subscribe((data) => {
        if (data.type == "application/pdf") {
          this.generatePDF = 1
          this.isSpinner = true
          const file = new Blob([data], { type: 'application/pdf' });
          var date = new Date();
          const namePdf = this.clientData.name + '\'s ' + this.sectionName + ' as on ' + date;
          const a = document.createElement('a');
          a.href = window.URL.createObjectURL(file);
          a.download = namePdf + '.pdf';
          a.click();
        } else {
          this.generatePDF = 0
          setTimeout(() => {
            this.getPDFCall(this.id)
          }, 5000);
        }

      });
  }
  getCountPortfolioInsurance() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.cusService.getInsuranceCount(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          console.log('insurance', data)
          this.portfolioInsurance = data
        }


      },
      error => this.eventService.showErrorMessage(error)
    );
  }

  checkAndLoadPdf(value: any, sectionName: any, obj: any, displayName: any, flag: any, array) {
    console.log('value', value)
    if (value == true) {
      this.moduleAddedLoader = [{}, {}, {}]
      this.isLoading = false
    } else {
      this.moduleAdded = this.moduleAdded.filter(function (value) {
        return value.name != displayName;
      });
      this.isLoading = false
      return
    }
    let factory;
    this.isLoading = true
    if (value) {
      this.fragmentData.isSpinner = true;
      switch (sectionName) {
        case 'income':
          factory = this.resolver.resolveComponentFactory(IncomeComponent);
          break;
        case 'Expense This month':
        case 'Expense Last month':
        case 'Expense This quarter':
        case 'Expense Last quarter':
        case 'Expense This calender year':
        case 'Expense Last calender year':
        case 'Expense This financial year':
        case 'Expense Last financial year':
        case 'Budget This month':
        case 'Budget Last month':
        case 'Budget This quarter':
        case 'Budget Last quarter':
        case 'Budget This calender year':
        case 'Budget Last calender year':
        case 'Budget This financial year':
        case 'Budget Last financial year':
          factory = this.resolver.resolveComponentFactory(ExpensesComponent);
          break;
        case 'All life insurances':
        case 'Term insurance':
        case 'Traditional insurance':
        case 'Ulip insurance':
        case 'All General insurance':
        case 'Health insurance':
        case 'Personal accident':
        case 'Critical illness':
        case 'Motor insurance':
        case 'Travel insurance':
        case 'Home insurance':
        case 'Fire & special perils':
          factory = this.resolver.resolveComponentFactory(InsuranceComponent);
          break;
        case 'Mutual fund summary':
          factory = this.resolver.resolveComponentFactory(MutualFundSummaryComponent);
          break;
        case 'Mutual fund unrealised transaction':
          factory = this.resolver.resolveComponentFactory(MutualFundUnrealizedTranComponent);
          break;
        case 'Mutual fund all transaction':
          factory = this.resolver.resolveComponentFactory(MutualFundUnrealizedTranComponent);
          break;
        case 'Mutual fund overview':
          factory = this.resolver.resolveComponentFactory(MutualFundOverviewComponent);
          break;
        case 'All Liabltities':
        case 'Home':
        case 'Vehicle':
        case 'Education':
        case 'Personal':
        case 'Credit card':
        case 'Mortgage':
          factory = this.resolver.resolveComponentFactory(LiabilitiesComponent);
          break;
        case 'Others':
          factory = this.resolver.resolveComponentFactory(OtherPayablesComponent);
        case 'Goal':
          factory = this.resolver.resolveComponentFactory(GoalsPlanComponent);
          break;
        case 'RiskProfile':
          factory = this.resolver.resolveComponentFactory(OverviewRiskProfileComponent);
          break;
        case 'Gold':
        case 'OthersComm':
          factory = this.resolver.resolveComponentFactory(CommoditiesComponent);
          break;
        case 'Real estate':
          factory = this.resolver.resolveComponentFactory(RealEstateComponent);
          break;
        case 'Stocks':
          factory = this.resolver.resolveComponentFactory(AssetStocksComponent);
          break;
        case 'Bank accounts':
        case 'Cash in hand':
          factory = this.resolver.resolveComponentFactory(CashAndBankComponent);
          break;
        case 'Fixed deposit':
        case 'Recurring deposits':
        case 'Bonds':
          factory = this.resolver.resolveComponentFactory(FixedIncomeComponent);
          break;
        case 'EPF':
        case 'NPS':
        case 'Gratuity':
          factory = this.resolver.resolveComponentFactory(RetirementAccountComponent);
          break;
        case 'Notes':
          factory = this.resolver.resolveComponentFactory(CrmNotesComponent);
          break;
        case 'PPF':
          factory = this.resolver.resolveComponentFactory(PPFSchemeComponent);
          break;
        case 'NSC':
          factory = this.resolver.resolveComponentFactory(NscSchemeComponent);
          break;
        case 'SSY':
          factory = this.resolver.resolveComponentFactory(SsySchemeComponent);
          break;
        case 'KVP':
          factory = this.resolver.resolveComponentFactory(KvpSchemeComponent);
          break;
        case 'SCSS':
          factory = this.resolver.resolveComponentFactory(ScssSchemeComponent);
          break;
        case 'PoSaving':
          factory = this.resolver.resolveComponentFactory(PoSavingsComponent);
          break;
        case 'PO RD':
          factory = this.resolver.resolveComponentFactory(PoRdSchemeComponent);
          break;
        case 'PO TD':
          factory = this.resolver.resolveComponentFactory(PoTdSchemeComponent);
          break;
        case 'PO MIS':
          factory = this.resolver.resolveComponentFactory(PoMisSchemeComponent);
          break;
        case 'PO MIS':
          factory = this.resolver.resolveComponentFactory(PoMisSchemeComponent);
          break;
        case 'other':
          factory = this.resolver.resolveComponentFactory(OthersAssetsComponent);
          break;
        case 'Life insurance':
          factory = this.resolver.resolveComponentFactory(LifeInsuranceComponent);
          break;
        case 'Capital Gain Summary':
          factory = this.resolver.resolveComponentFactory(MutualFundsCapitalComponent);
          break;
        case 'MF Capital Gain Detailed':
          factory = this.resolver.resolveComponentFactory(MfCapitalDetailedComponent);
          break;
      }
      const pdfContentRef = this.container.createComponent(factory);
      const pdfContent = pdfContentRef.instance;
      if (sectionName == "Mutual fund overview") {
        var svg = pdfContent.loadsvg
          //.pipe(delay(1))
          .subscribe(data => {
            this.svg = data
            console.log('svg', this.svg)
            svg.unsubscribe();
          });
      } else if (sectionName == "RiskProfile") {
        var svg = pdfContent.loadsvg
          //.pipe(delay(1))
          .subscribe(data => {
            this.svg = data
            console.log('svg', this.svg)
            svg.unsubscribe();
          });
      }
      this.isLoading = true;
      if (array.isSelectedCheckbox) {
        array.isSelectedCheckbox = value;
      } else {
        array.checked = value;
      }
      if (sectionName == 'Goal') {
        pdfContent.finPlanObj = { hideForFinPlan: true, obj };
      } else if (sectionName == 'Life insurance') {
        obj.dataLoaded = true;
        pdfContent.finPlanObj = { hideForFinPlan: true, data: obj, allInsuranceList: this.insurancePlanningList };
      } else if (sectionName == 'RiskProfile') {
        pdfContent.finPlanObj = { hideForFinPlan: true, data: array };
      } else if (sectionName == 'Notes') {
        pdfContent.finPlanObj = { hideForFinPlan: true, data: obj };
      } else {
        pdfContent.finPlanObj = { hideForFinPlan: true, sectionName };
      }
      const sub = pdfContent.loaded
        .pipe(delay(1))
        .subscribe(data => {
          //console.log(data.innerHTML);
          this.fragmentData.isSpinner = false;
          //this.generatePdf(data, sectionName, displayName);
          if (sectionName == "RiskProfile") {
            this.uploadFile(data, sectionName, displayName, flag, obj);
            console.log(pdfContent.loaded);
          } else {
            this.uploadFile(data, sectionName, displayName, flag, array);
            console.log(pdfContent.loaded);
          }

          sub.unsubscribe();
        });
    }


  }

  uploadFile(innerHtmlData, sectionName, displayName, flag, array) {
    const obj = {
      clientId: this.clientId,
      name: sectionName + '.html',
      htmlInput: String(innerHtmlData.innerHTML),
      svg: this.svg,
      key: 'showPieChart',
    };
    this.sectionName = sectionName
    this.planService.getFinPlanFileUploadUrl(obj).subscribe(
      data => this.uploadFileRes(data, displayName, flag, array)
    );
  }

  uploadFileRes(data, displayName, flag, array) {
    this.isLoading = false
    this.moduleAdded.push({
      name: displayName, s3ObjectKey: data.s3ObjectKey, id: this.count++, bucketName: data.bucketName,
      landscape: flag, isSelected: true, array: array

    });
    console.log('moduleAdded', this.moduleAdded);
  }

  getGoalSummaryValues() {
    let data = {
      advisorId: this.advisorId,
      clientId: this.clientId,
    }
    //this.isLoadingGoals = true;
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.planService.getGoalSummaryPlanData(data)
      .subscribe(res => {
        if (res) {
          console.log(res);
          this.goalSummaryCountObj = res;
          this.goalList = res.goalList;
          let arr = [];
          this.goalList.forEach(item => {
            if (!!item.singleOrMulti && item.singleOrMulti === 1) {
              let goalValueObj = item.singleGoalModel,
                lumpsumDeptKey = Object.keys(goalValueObj.lumpSumAmountDebt)[0],
                lumpsumEquityKey = Object.keys(goalValueObj.lumpSumAmountEquity)[0],
                lumpsum = Math.round(goalValueObj.lumpSumAmountDebt[lumpsumDeptKey] + goalValueObj.lumpSumAmountEquity[lumpsumEquityKey]),
                sipDebtKey = Object.keys(goalValueObj.sipAmountDebt)[0],
                sipEquityKey = Object.keys(goalValueObj.sipAmountEquity)[0],
                month = Math.round(goalValueObj.sipAmountDebt[sipDebtKey] + goalValueObj.sipAmountEquity[sipEquityKey]),
                year = (new Date(goalValueObj.goalStartDate).getFullYear()).toString();
              if (goalValueObj.goalType == 1) {
                year = (goalValueObj.differentGoalYears) ? (new Date(goalValueObj.differentGoalYears[0]).getFullYear()) + ' - ' + (new Date(goalValueObj.goalEndDate).getFullYear()) : '-';
              }
              let goalFV = goalValueObj.goalFV
              if (goalValueObj.retirementTableValue) {
                goalValueObj.retirementTableValue.forEach(element => {
                  element.goalYear = new Date(element.goalStartDate).getFullYear()
                });
              }

              arr.push({
                details: !!goalValueObj.goalName ? goalValueObj.goalName : '',
                goalName: !!goalValueObj.goalName ? goalValueObj.goalName : '',
                value: !!goalValueObj.goalFV ? Math.round(goalValueObj.goalFV) : '',
                futureValue: goalValueObj.goalFV,
                month,
                lumpsum,
                percentCompleted: Math.round(!!goalValueObj.goalAchievedPercentage ? goalValueObj.goalAchievedPercentage : 0),
                imageUrl: !!goalValueObj.imageUrl ? goalValueObj.imageUrl : '',
                year: year,
                goalFV: UtilService.getNumberToWord(!!goalValueObj.goalFV ? goalValueObj.goalFV : 0),
                achievedValue: UtilService.getNumberToWord(!!goalValueObj.achievedValue ? goalValueObj.achievedValue : 0),
                equity_monthly: this.getSumOfJsonMap(goalValueObj.sipAmountEquity) || 0,
                debt_monthly: this.getSumOfJsonMap(goalValueObj.sipAmountDebt) || 0,
                lump_equity: this.getSumOfJsonMap(goalValueObj.lumpSumAmountEquity) || 0,
                lump_debt: this.getSumOfJsonMap(goalValueObj.lumpSumAmountDebt) || 0,
                goalAssetAllocation: item.goalAssetAllocation,
                retirementTableValue: goalValueObj.retirementTableValue
              });
            } else if (!!item.singleOrMulti && item.singleOrMulti === 2) {
              let goalValueObj = item.multiYearGoalPlan,
                lumpsumDebt = 0,
                lumpsumEquity = 0,
                lumpsum = 0,
                sipDebtSum = 0,
                sipEquitySum = 0,
                month = 0;
              for (const key in goalValueObj.lumpSumAmountDebt) {
                if (Object.prototype.hasOwnProperty.call(goalValueObj.lumpSumAmountDebt, key)) {
                  const element = goalValueObj.lumpSumAmountDebt[key];
                  lumpsumDebt += element;
                }
              }
              for (const key in goalValueObj.lumpSumAmountDebt) {
                if (Object.prototype.hasOwnProperty.call(goalValueObj.lumpSumAmountEquity, key)) {
                  const element = goalValueObj.lumpSumAmountEquity[key];
                  lumpsumEquity += element;
                }
              }
              lumpsum = Math.round(lumpsumDebt + lumpsumEquity);

              for (const key in goalValueObj.sipAmountDebt) {
                if (Object.prototype.hasOwnProperty.call(goalValueObj.sipAmountDebt, key)) {
                  const element = goalValueObj.sipAmountDebt[key];
                  sipDebtSum += element;
                }
              }

              for (const key in goalValueObj.sipAmountEquity) {
                if (Object.prototype.hasOwnProperty.call(goalValueObj.sipAmountEquity, key)) {
                  const element = goalValueObj.sipAmountEquity[key];
                  sipEquitySum += element;
                }
              }

              month = Math.round(sipEquitySum + sipDebtSum);
              let year;
              year = (new Date(goalValueObj.goalStartDate).getFullYear()).toString();
              if (goalValueObj.goalType == 1) {
                year = (goalValueObj.differentGoalYears) ? (new Date(goalValueObj.differentGoalYears[0]).getFullYear()) + ' - ' + (new Date(goalValueObj.goalEndDate).getFullYear()) : '-';
              }
              if (goalValueObj.retirementTableValue) {
                goalValueObj.retirementTableValue.forEach(element => {
                  element.goalYear = new Date(element.goalStartDate).getFullYear()
                });
              }
              arr.push({
                details: goalValueObj.name,
                goalName: goalValueObj.name,
                month,
                lumpsum,
                percentCompleted: Math.round(!!goalValueObj.goalAchievedPercentage ? goalValueObj.goalAchievedPercentage : 0),
                imageUrl: !!goalValueObj.imageUrl ? goalValueObj.imageUrl : '',
                value: !!goalValueObj.futureValue ? Math.round(goalValueObj.futureValue) : '',
                year: year,
                goalFV: UtilService.getNumberToWord(!!goalValueObj.futureValue ? goalValueObj.futureValue : 0),
                achievedValue: UtilService.getNumberToWord(!!goalValueObj.achievedValue ? goalValueObj.achievedValue : 0),
                equity_monthly: this.getSumOfJsonMap(goalValueObj.sipAmountEquity) || 0,
                debt_monthly: this.getSumOfJsonMap(goalValueObj.sipAmountDebt) || 0,
                lump_equity: this.getSumOfJsonMap(goalValueObj.lumpSumAmountEquity) || 0,
                lump_debt: this.getSumOfJsonMap(goalValueObj.lumpSumAmountDebt) || 0,
                goalAssetAllocation: item.goalAssetAllocation,
                retirementTableValue: goalValueObj.retirementTableValue
              });
            }
          });
          this.dataSource.data = arr;
          this.dataSource.data.forEach(element => {
            element.isSelected = false;
            element.isSelectedCheckbox = false;
          });
          //this.isLoadingGoals = false;
          // this.dataSource.paginator = this.paginator;
        }
      }, err => {
        //this.goalSummaryCountObj = ''
        //   this.isLoadingGoals = false;
        console.error(err);
        // this.eventService.openSnackBar("Something went wrong", "DISMISS")
      })


  }

  getInsuranceList() {
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.planService.getInsurancePlaningList(obj).subscribe(
      data => this.getInsurancePlaningListRes(data),
      err => {
        console.error(err);
      }
    );
  }
  getLibilities() {
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.planService.getLibilitise(obj).subscribe(
      data => this.getLibilitiseRes(data),
      err => {
        console.error(err);
      }
    );
  }
  getLibilitiseRes(data) {
    console.log(data)
    this.liabilitiesList = data

  }
  savePlanSection() {
    var date = new Date()
    let obj = {
      advisorId: AuthService.getAdvisorId(),
      clientId: AuthService.getClientId(),
      ClientName: this.clientData.name,
      OwnerName: AuthService.getUserInfo().name,
      reportName: this.clientData.name + '`s Plan',
      ReportDate: this.datePipe.transform(new Date(), 'dd-MMM-yyyy'),
      modules: this.moduleAdded,
      financialPlanPdfLogId: this.id.id
    }
    console.log('preview', obj)
    const dialogRef = this.dialog.open(SaveFinPlanSectionComponent, {
      width: '500px',
      height: '200px',
      data: { bank: '', selectedElement: obj }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return
      }
      console.log('The dialog was closed');
      this.element = result;
      obj.reportName = this.element
      this.planService.savePlanSection(obj).subscribe(
        data => this.savePlanSectionRes(data),
        err => {
          console.error(err);
        }
      );
      console.log('result -==', this.element)
    });

  }

  savePlanSectionRes(data) {
    this.moduleAdded = []
    this.getPlanSection()
    this.hideTable = false
    this.downloadPdf = false
  }

  getInsurancePlaningListRes(data) {
    if (data) {
      data.forEach(singleInsuranceData => {
        if (singleInsuranceData.owners.length > 0) {
          singleInsuranceData.displayHolderName = singleInsuranceData.owners[0].holderName;
          if (singleInsuranceData.owners.length > 1) {
            for (let i = 1; i < singleInsuranceData.owners.length; i++) {
              if (singleInsuranceData.owners[i].holderName) {
                const firstName = (singleInsuranceData.owners[i].holderName as string).split(' ')[0];
                singleInsuranceData.displayHolderName += ', ' + firstName;
              }
            }
          }
        } else {
          singleInsuranceData.displayHolderName = '';
        }
      });
      this.dataSource = data
      this.dataSource.forEach(element => {
        if (element.insuranceType == 1) {
          element.header = 'Add Life insurance'
          element.heading = 'Life insurance'
          element.logo = '/assets/images/svg/LIsmall.svg'
        } else if (element.insuranceType == 5) {
          element.value = '1';
          element.header = 'Add Health insurance'
          element.heading = 'Health insurance'
          element.logo = '/assets/images/svg/HIsmall.svg'
        } else if (element.insuranceType == 6) {
          element.value = '2';
          element.header = 'Add Critical insurance'
          element.heading = 'Critical illness'
          element.logo = '/assets/images/svg/CIsmall.svg'
        } else if (element.insuranceType == 10) {
          element.value = '6';
          element.header = 'Add Fire insurance'
          element.heading = 'Fire insurance'
          element.logo = '/assets/images/svg/FIsmall.svg'
        } else if (element.insuranceType == 9) {
          element.value = '5';
          element.header = 'Add Home insurance'
          element.heading = 'Home insurance'
          element.logo = '/assets/images/svg/Hsmall.svg'
        } else if (element.insuranceType == 7) {
          element.value = '4';
          element.header = 'Add Personal accident'
          element.heading = 'Personal accident'
          element.logo = '/assets/images/svg/PAsmall.svg'
        } else if (element.insuranceType == 8) {
          element.value = '7';
          element.header = 'Add Travel insurance'
          element.heading = 'Travel insurance'
          element.logo = '/assets/images/svg/TravelSmall.svg'
        } else if (element.insuranceType == 4) {
          element.value = '8';
          element.header = 'Add Motor insurance'
          element.heading = 'Motor insurance'
          element.logo = '/assets/images/svg/MotorSmall.svg'
        }
      });
      console.log(this.dataSource)
      this.insuranceList = this.dataSource
      this.dataSource.forEach(element => element.isSelectedCheckbox = false);
      this.insurancePlanningList = this.dataSource;
    }
  }

  getSumOfJsonMap(json: Object = {}) {
    let sum = 0;
    for (let k in json) {
      if (json.hasOwnProperty(k)) {
        sum += json[k];
      }
    }
    return sum;
  }

}

export interface PeriodicElement {
  details: string;
  value: string;
  month: string;
  lumpsum: string;
  imageUrl: string,
  year: string,
  goalFV: string,
  achievedValue: string,
  equity_monthly: string,
  debt_monthly: string,
  lump_equity: string,
  lump_debt: string,
  goalAssetAllocation: string,
  retirementTableValue: string,
  percentCompleted: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    details: '', value: '', month: '', lumpsum: '', imageUrl: '', year: '',
    goalFV: '', achievedValue: '', equity_monthly: '', debt_monthly: '', lump_equity: '', lump_debt: '',
    goalAssetAllocation: '', retirementTableValue: '', percentCompleted: ''
  }
];
