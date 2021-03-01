import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AddPlaninsuranceComponent } from '../../add-planinsurance/add-planinsurance.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AddSuggestPolicyComponent } from '../../add-suggest-policy/add-suggest-policy.component';
import { AddRecommendationsInsuComponent } from '../../add-recommendations-insu/add-recommendations-insu.component';
import { PlanService } from '../../../plan.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatAccordion } from '@angular/material';
import { forkJoin, of } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ShowHealthPlanningComponent } from '../../show-health-planning/show-health-planning.component';
import { InsurancePlanningServiceService } from '../../insurance-planning-service.service';
import { SuggestHealthInsuranceComponent } from '../../suggest-health-insurance/suggest-health-insurance.component';
import { PersonalInsuranceComponent } from '../personal-insurance/personal-insurance.component';
import { CriticalInsuranceComponent } from '../critical-insurance/critical-insurance.component';
import { MotorInsuranceComponent } from '../motor-insurance/motor-insurance.component';
import { TravelInsuranceComponent } from '../travel-insurance/travel-insurance.component';
import { HouseholdersInsuranceComponent } from '../householders-insurance/householders-insurance.component';
import { FireInsuranceComponent } from '../fire-insurance/fire-insurance.component';
import { ActiityService } from '../../../../customer-activity/actiity.service';
import { SuggestAndGiveAdviceComponent } from '../../suggest-and-give-advice/suggest-and-give-advice.component';
import { HelthInsurancePolicyComponent } from '../../add-insurance-planning/helth-insurance-policy/helth-insurance-policy.component';
import { DetailedViewInsurancePlanningComponent } from '../../detailed-view-insurance-planning/detailed-view-insurance-planning.component';
import { SummaryPlanComponent } from '../../../summary-plan/summary-plan.component';
import { SummaryPlanServiceService } from '../../../summary-plan/summary-plan-service.service';
import { catchError } from 'rxjs/operators';
import { RoleService } from 'src/app/auth-service/role.service';
import { OtherInsuranceInsurancePlanningComponent } from '../other-insurance-insurance-planning/other-insurance-insurance-planning.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-life-insurance',
  templateUrl: './life-insurance.component.html',
  styleUrls: ['./life-insurance.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LifeInsuranceComponent implements OnInit {
  blockExpansion = true;
  panelOpenState = false;
  isClick = false;
  displayedColumnsNeedAnalysis: string[] = ['details', 'outstanding', 'consider', 'edit'];
  displayedColumns = ['pname', 'sum2', 'premium2', 'status', 'empty'];
  dataSource = ELEMENT_DATA;
  displayedColumns1 = ['name', 'sum', 'premium', 'advice', 'icons'];
  displayedColumns3 = ['name', 'sum', 'premium', 'status', 'icons'];
  // displayedColumns3 = ['name', 'weight', 'symbol', 'position'];
  // dataSouce3=ELEMENT_DATA4;
  allInsurance = [{ name: 'Term', id: 1 }, { name: 'Traditional', id: 2 }, { name: 'ULIP', id: 3 }, {
    name: 'Health',
    id: 5
  }, { name: 'Personal accident', id: 7 }, { name: 'Critical illness', id: 6 }, {
    name: 'Motor',
    id: 4
  }, { name: 'Travel', id: 8 }, { name: 'Home', id: 9 }, { name: 'Fire & special perils', id: 10 }];
  dataSouce3 = [{}, {}, {}]
  dataSource1 = [{}, {}, {}];
  expandedElement: PeriodicElement | null;
  expandedElement2: PeriodicElement2 | null;
  displayedColumns2 = ['name', 'annual', 'amt', 'icons'];
  dataSource2 = ELEMENT_DATA2;
  inputData: any;
  plannerObj = {
    existingAsset: 0, liabilities: 0, lifeInsurancePremiums: 0, livingExpense: 0, dependantNeeds: 0, goalsMeet: 0, GrossLifeinsurance: 0, incomeSource: 0,
    existingLifeInsurance: 0, additionalLifeIns: 0
  }
  checkedBox = "https://res.cloudinary.com/futurewise/image/upload/v1611903063/logos/Checkbox_srkq9v.png"
  uncheckBox = "https://res.cloudinary.com/futurewise/image/upload/v1611903072/logos/Uncheckbox_y4a6yk.png"
  adviceHeaderList = [{ id: '1', value: 'Continue' }, { id: '2', value: 'Discontinue' }, { id: '3', value: 'Port policy' }, { id: '4', value: 'Increase sum assured' }, { id: '5', value: 'Decrease sum assured' }, { id: '6', value: 'Add members' }, { id: '7', value: 'Remove members' }]
  setLogo = [{
    heading: 'Life insurance',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125641/svg_assets/LIbig.svg',
    bigLogo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125641/svg_assets/LIbig.svg',

  }, {
    value: '1',
    header: 'Add Health Insurance',
    smallHeading: 'health insurance',
    insuranceType: 5,
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125976/svg_assets/helth-insurance.svg',
    bigLogo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125643/svg_assets/Hbig.svg',
    heading: 'Health insurance',
    subHeading: 'Select how you’d like to proceed with planning for health insurance policies.'
  }, {
    value: '2',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125976/svg_assets/Criticalillness.svg',
    bigLogo: '/assets/images/svg/CIbig.svg',
    header: 'Add Critical Illness',
    smallHeading: 'critical illness',
    insuranceType: 6,
    heading: 'Critical illness',
    subHeading: 'Select how you’d like to proceed with planning for critical insurance policies.'
  }, {
    value: '3',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125976/svg_assets/Cancercare.svg',
    bigLogo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125643/svg_assets/CCbig.svg',
    header: 'Add Cancer Care',
    smallHeading: 'cancer care',
    insuranceType: 11,
    heading: 'Cancer care',
    subHeading: 'Select how you’d like to proceed with planning for cancer insurance policies.'
  }, {
    value: '4',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125976/svg_assets/Personalaccident.svg',
    bigLogo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125643/svg_assets/PAbig.svg',
    header: 'Add Personal Accident',
    heading: 'Personal accident',
    smallHeading: 'personal accident',
    insuranceType: 7,
    subHeading: 'Select how you’d like to proceed with planning for personal insurance policies.'
  }, {
    value: '5',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125976/svg_assets/Householders.svg',
    bigLogo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125643/svg_assets/Hbig.svg',
    header: 'Add Householders',
    smallHeading: 'householders',
    insuranceType: 9,
    heading: 'Householders',
    subHeading: 'Select how you’d like to proceed with planning for householders insurance policies.'
  }, {
    value: '6',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125976/svg_assets/Fireinsurance.svg',
    bigLogo: 'https://res.cloudinary.com/futurewise/image/upload/v1606125641/svg_assets/Fibig.svg',
    header: 'Add Fire Insurance',
    smallHeading: 'fire insurance',
    insuranceType: 10,
    heading: 'Fire insurance',
    subHeading: 'Select how you’d like to proceed with planning for fire insurance policies.'
  },
  {
    value: '7',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1611740386/svg_assets/Travel.svg',
    bigLogo: 'https://res.cloudinary.com/futurewise/image/upload/v1611740386/svg_assets/TravelBig.svg',
    header: 'Add Travel Insurance',
    smallHeading: 'travel insurance',
    insuranceType: 8,
    heading: 'Travel insurance',
    subHeading: 'Select how you’d like to proceed with planning for travel insurance policies.'
  }, {
    value: '8',
    logo: 'https://res.cloudinary.com/futurewise/image/upload/v1611740386/svg_assets/Motor.svg',
    bigLogo: 'https://res.cloudinary.com/futurewise/image/upload/v1611740386/svg_assets/MotorBig.svg',
    header: 'Add Motor Insurance',
    smallHeading: 'motor insurance',
    insuranceType: 4,
    heading: 'Motor insurance',
    subHeading: 'Select how you’d like to proceed with planning for motor insurance policies.'
  }, {
    value: '9',
    logo: '/assets/images/svg/Fireinsurance.svg',
    header: 'Add Other Insurance',
    smallHeading: 'other insurance',
    insuranceType: 11,
    heading: 'Other insurance',
    subHeading: 'Select how you’d like to proceed with planning for other insurance policies.'
  }]

  logo: any;
  getData: any;
  advisorId: any;
  clientId: any;
  counter: any;
  isLoading: boolean;
  insuranceDetails: any;
  isLoadingPlan = false;
  @ViewChild('firstAccordion', { static: false }) firstAccordion: MatAccordion;
  @Output() outputChange = new EventEmitter<any>();
  @Output() stopLoaderWhenReponse = new EventEmitter<any>();
  @Output() loaded = new EventEmitter();
  @Input() finPlanObj: any;//finacial plan pdf input
  @ViewChild('insuranceTemp', { static: false }) insuranceTemp: ElementRef;
  inputReceive: any;
  needAnalysisData: any;
  dataSourceLiability: any;
  dataSourceLifeInsurance: any;
  dataSourceGoals: any;
  dataSourceIncome: any;
  dataSourceAsset: any;
  needAnalysisLoaded: any;
  clicked = false;
  pushArray = [];
  storedData: any;
  isRefreshRequired = false;
  loadedData: any;
  needAnalysisSavedData: any;
  displayList: any;
  allInsuranceData: any;
  isRefresh: any;
  recommendOrNot = false;
  userInfo: any;
  clientData: any;
  getAdvisorDetail: any;
  details: any;
  getOrgData: any;
  fragmentData: any;
  libilities: boolean = false
  dependant: boolean = false
  goalsToBeMate: boolean = false
  continuous: boolean = false
  existingAsset: boolean = false
  noOpened: boolean = false
  adviceNameObj: { adviceName: any; };
  adviceName: any;
  object: any;
  dislayList: any;
  type: any;
  clickedRecommend = false;
  recommendationsId: any;
  notes: any;
  changesInNeedManual: boolean;


  constructor(private subInjectService: SubscriptionInject,
    private custumService: CustomerService,
    private utils: UtilService,
    private eventService: EventService,
    private planService: PlanService,
    private dialog: MatDialog,
    private ipService: InsurancePlanningServiceService,
    private UtilService: UtilService,
    private ref: ChangeDetectorRef,
    private activityService: ActiityService,
    private summaryPlanService: SummaryPlanServiceService,
    public roleService: RoleService,
    private sanitizer: DomSanitizer
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.userInfo = AuthService.getUserInfo();
    this.clientData = AuthService.getClientData();
    this.getAdvisorDetail = AuthService.getAdvisorDetails();
    this.details = AuthService.getProfileDetails();
    this.getOrgData = AuthService.getOrgDetails();
  }

  @Input()
  set data(data) {
    this.inputData = data;
    // if(this.inputData && this.inputData.hasOwnProperty('insuranceType') && this.inputData.insuranceType == 1){
    //   this.displayedColumns3 = ['name', 'sum', 'premium', 'status','icons'];
    // }else{
    //   this.displayedColumns3 = ['name', 'sum', 'premium','status'];
    // }
    console.log('this life insurance', data)
    this.ipService.getIpData()
      .subscribe(res => {
        this.storedData = '';
        this.storedData = res;
      })
    this.ipService.getAllInsuranceData()
      .subscribe(res => {
        this.allInsuranceData = res;
      })
    this.getGlobalDataInsurance();

    this.setDetails(data)

  }

  get data() {
    return this.inputData;
  }
  @Input()
  set isLoaders(data) {
    if (data.isLoading == true) {
      this.dataSource1 = [{}, {}, {}];
      this.dataSouce3 = [{}, {}, {}];
      this.insuranceDetails = '';
      this.loader(1);
      this.getGlobalDataInsurance()
      this.isLoadingPlan = true;
    }
    console.log(data)
  }

  get isLoaders() {
    return this.inputReceive;
  }
  ngOnInit() {
    this.fragmentData = { isSpinner: false };
    console.log(this.finPlanObj)
    if (this.finPlanObj) {
      this.allInsuranceData = this.finPlanObj.allInsuranceList
      this.inputData = this.finPlanObj.data
      this.setDetails(this.finPlanObj.data)
      this.getGlobalDataInsurance();

    }
    this.dataSourceLiability = []
    this.dataSourceAsset = []
    this.dataSourceGoals = []
    this.dataSourceIncome = []
    this.recommendOrNot = false;
    this.panelOpenState = false;
    console.log('inputData', this.inputData)
  }
  getGlobalDataInsurance() {
    const obj = {};
    this.custumService.getInsuranceGlobalData(obj).subscribe(
      data => {
        console.log(data),
          this.displayList = data;
      }
    );
  }
  changeClick() {
    this.isClick = !this.isClick
  }
  suggestPolicyGi(data, value) {
    data.recommendOrNot = data ? (data.isRecommend == 1 ? false : (this.recommendOrNot ? true : false)) : (this.recommendOrNot ? true : false);
    data.data = value;
    data.insuranceTypeId = 2;
    data.insuranceSubTypeId = data.insuranceType;
    data.displayList = this.displayList;
    data.showInsurance = this.inputData;
    data.inputData = this.inputData;
    data.flag = 'ExistingSuggestNew';
    const fragmentData = {
      flag: 'suggestExistingPolicy',
      data: data,
      componentName: null,
      id: 1,
      state: 'open',
    };
    switch (data.insuranceType) {
      case 5:
        fragmentData.componentName = SuggestHealthInsuranceComponent;
        break;
      case 7:
        fragmentData.componentName = PersonalInsuranceComponent;
        break;
      case 6:
        fragmentData.componentName = CriticalInsuranceComponent;
        break;
      case 4:
        fragmentData.componentName = MotorInsuranceComponent;
        break;
      case 8:
        fragmentData.componentName = TravelInsuranceComponent;
        break;
      case 9:
        fragmentData.componentName = HouseholdersInsuranceComponent;
        break;
      case 10:
        fragmentData.componentName = FireInsuranceComponent;
        break;
      case 11:
        fragmentData.componentName = OtherInsuranceInsurancePlanningComponent;
        break;
      default:
        fragmentData.componentName = SuggestHealthInsuranceComponent;
        break;

    }
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.refreshRequired) {
            // this.addGeneralInsurance(sideBarData.data.id);
            this.suggestPoliciesGetCall(value.id ? value.id : null)
            // this.getDetailsInsurance()
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  setDetails(data) {
    this.type = this.summaryPlanService.getTypeIds(this.inputData);
    if (data) {
      this.getData = data
      this.setLogo.forEach(element => {
        if (element.heading == data.heading) {
          this.logo = element.bigLogo
          this.needAnalysisData = element
          this.needAnalysisData.id = data.id
          // Object.assign( this.needAnalysisData.id, {id: data.id});
          //Object.assign( this.needAnalysisData, {id: data.id});
        }
      });
      if (data.dataLoaded) {
        if (this.callApiData(data)) {
          this.getDetailsInsurance()
        } else {
          this.getForkJoinResponse(this.loadedData)
          this.loadedData = '';
        }
      }
    }
  }
  callApiData(data) {
    // if(this.isRefreshRequired){
    //   return true
    // }else{
    if (this.storedData) {
      this.storedData.forEach(element => {
        if (element.id == this.inputData.id) {
          this.loadedData = element
        }
      });
    }
    let refreshData = this.isRefreshRequired;
    this.isRefreshRequired = false;
    return this.loadedData && refreshData ? true : this.loadedData ? false : true
    // }

  }
  formatNumber(data, noOfPlaces: number = 0) {
    if (data) {
      data = parseFloat(data)
      if (isNaN(data)) {
        return data;
      } else {
        // console.log(' original ', data);
        const formattedValue = parseFloat((data).toFixed(noOfPlaces)).toLocaleString('en-IN', { 'minimumFractionDigits': noOfPlaces, 'maximumFractionDigits': noOfPlaces });
        // console.log(' original / roundedValue ', data, ' / ', formattedValue);
        return formattedValue;
      }
    } else {
      return '0';
    }
    return data;
  }
  deleteModal(value, data) {
    let deletedId = data.id
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        if (this.inputData.insuranceType == 1) {
          this.planService.deleteSuggestPolicy(data.id).subscribe(
            data => {
              // this.isRefresh = true;
              this.eventService.openSnackBar('Insurance is deleted', 'Dismiss');
              this.deleteWithoutHitingApi(deletedId);
              dialogRef.close();
              // this.isRefreshRequired = true;
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else {
          this.planService.deleteSuggestNew(data.id).subscribe(
            data => {
              // this.isRefresh = true;
              this.eventService.openSnackBar('Insurance is deleted', 'Dismiss');
              this.deleteWithoutHitingApi(deletedId);
              // this.getDetailsInsurance()
              dialogRef.close();
              this.isRefreshRequired = true;
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
  openDetailedView(data) {
    if (data && data.adviceDetails) {
      if (data.adviceDetails.gen_insurance_advice_id) {
        let id = data ? (data.adviceDetails ? (data.adviceDetails.gen_insurance_advice_id) : this.adviceName) : this.adviceName;
        this.adviceName = (id == 1) ? 'Continue' : (id == 2) ? 'Discontinue' : (id == 3) ? 'Port policy' : (id == 4) ? 'Increase sum assured' : (id == 5) ? 'Decrease sum assured' : (id == 6) ? 'Add members' : (id == 7) ? 'Remove members' : 'Proposed policy'
        data.adviceDetails.adviceGivenDate = data.adviceDetails.created_date
        data.adviceDetails.applicableDate = data.adviceDetails.applicable_date
        data.adviceDetails.adviceDescription = data.adviceDetails.advice_description
        data.adviceDetails.advice_allotment = data.adviceDetails.advice_allotment
      } else {
        let id = data ? (data.adviceDetails ? (data.adviceDetails.insurance_advice_id) : this.adviceName) : this.adviceName;
        this.adviceName = (id == 1) ? 'Continue' : (id == 2) ? 'Surrender' : (id == 3) ? 'Stop paying premium' : (id == 4) ? 'Take loan' : (id == 5) ? 'Partial withdrawl' : ''
        data.adviceDetails.adviceGivenDate = data.adviceDetails.created_date
        data.adviceDetails.applicableDate = data.adviceDetails.applicable_date
        data.adviceDetails.adviceDescription = data.adviceDetails.advice_description
        data.adviceDetails.advice_allotment = data.adviceDetails.advice_allotment
      }
    }
    const sendData = {
      flag: 'detailedView',
      data: {},
      insuranceTypeId: this.type.insuranceTypeId,
      insuranceSubTypeId: this.type.insuranceSubTypeId,
      state: 'open',
      componentName: DetailedViewInsurancePlanningComponent
    };
    sendData.data = {
      data: data,
      displayList: this.displayList,
      allInsurance: this.allInsurance,
      insuranceTypeId: this.type.insuranceTypeId,
      insuranceSubTypeId: this.type.insuranceSubTypeId,
      showInsurance: this.inputData,
      adviceName: this.adviceName

    };

    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(sendData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
  openDialog(data, value): void {
    value = { smallHeading: 'life insurance', inputData: this.inputData }
    data.data = this.inputData;
    const dialogRef = this.dialog.open(HelthInsurancePolicyComponent, {
      width: '780px',
      // height: '600px',
      data: { data, value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isRefreshedRequired) {
        this.isRefresh = result.refreshRequired;
        this.getRecommendationCall(data.insurance ? data.insurance.id : null);
      }
      console.log('The dialog was closed', result);
    });
  }
  getRecommendationCall(id) {
    let obj2 = {
      clientId: this.clientId,
      familyMemberId: [],
      advisorId: this.advisorId,
    }
    if (this.inputData.owners) {
      this.inputData.owners.forEach(element => {
        obj2.familyMemberId.push(element.ownerId);
      });
    } else {
      obj2.familyMemberId.push(0);
    }

    if (this.inputData.insuranceType == 1) {
      this.planService.getInsuranceAdvice(obj2).subscribe(
        data => {
          console.log(data),
            this.checkAndPushRecommendationData(data, id);
        }
      );
    } else {
      this.planService.getGeneralInsuranceAdvice(this.inputData.id).subscribe(
        data => {
          console.log(data),
            this.checkAndPushRecommendationData(data, id);
        }
      );
    }
  }
  innerHtmlText(text) {
    let htmlText;
    if (text) {
      htmlText = this.sanitizer.bypassSecurityTrustHtml(text);
    }
    return htmlText;
  }
  checkAndPushRecommendationData(array, id) {
    let singleData = this.storedData.filter(d => d.id == this.inputData.id);
    let suggestPolicy = singleData[0][2];
    if (this.inputData.insuranceType == 1) {
      suggestPolicy = [];
      if (array) {
        suggestPolicy.push(array);
        suggestPolicy = suggestPolicy.flat();
        suggestPolicy = this.ipService.pushId(suggestPolicy)
        suggestPolicy = [...new Map(suggestPolicy.map(item => [item.id, item])).values()];
      }
      singleData[0][2] = suggestPolicy
    } else {
      suggestPolicy = [];
      if (array) {
        suggestPolicy.push(array);
        suggestPolicy = suggestPolicy.flat();
        suggestPolicy = this.ipService.pushId(suggestPolicy)
        suggestPolicy = [...new Map(suggestPolicy.map(item => [item.id, item])).values()];
      }
      singleData[0][2] = suggestPolicy
      this.ipService.setIpData(this.storedData);
      this.ipService.setNeedAnlysisData('');
    }
    this.ipService.setIpData(this.storedData);
    this.getForkJoinResponse(singleData[0])
  }
  openAddEditAdvice(value, data, flag) {
    this.adviceNameObj = { adviceName: this.adviceName };
    let component;
    this.object = { data: data, displayList: this.displayList, showInsurance: '', insuranceSubTypeId: 1, insuranceTypeId: 2 }
    switch (this.inputData.insuranceType) {
      case 5:
        this.object.insuranceSubTypeId = 5;
        this.object.showInsurance = 'Health';
        this.object.adviceToCategoryId = 34;
        component = SuggestHealthInsuranceComponent;
        break;
      case 7:
        this.object.insuranceSubTypeId = 7;
        this.object.showInsurance = 'Personal accident';
        this.object.adviceToCategoryId = 35;
        component = PersonalInsuranceComponent;
        break;
      case 6:
        this.object.insuranceSubTypeId = 6;
        this.object.showInsurance = 'Critical illness';
        this.object.adviceToCategoryId = 36;
        component = CriticalInsuranceComponent;
        break;
      case 4:
        this.object.insuranceSubTypeId = 4;
        this.object.showInsurance = 'Motor';
        this.object.adviceToCategoryId = 37;
        component = MotorInsuranceComponent;
        break;
      case 8:
        this.object.insuranceSubTypeId = 8;
        this.object.showInsurance = 'Travel';
        this.object.adviceToCategoryId = 38;
        component = TravelInsuranceComponent;
        break;
      case 9:
        this.object.insuranceSubTypeId = 9;
        this.object.showInsurance = 'Home';
        this.object.adviceToCategoryId = 39;
        component = HouseholdersInsuranceComponent;
        break;
      case 10:
        this.object.insuranceSubTypeId = 10;
        this.object.adviceToCategoryId = 40;
        this.object.showInsurance = 'Fire & special perils';
        component = FireInsuranceComponent;

        break;
      case 11:
        this.object.insuranceSubTypeId = 11;
        this.object.adviceToCategoryId = 40;
        this.object.showInsurance = 'other insurance';
        component = OtherInsuranceInsurancePlanningComponent;

        break;
    }
    data ? data['adviceHeaderList'] = this.adviceHeaderList : null;
    const fragmentData = {
      flag: flag,
      adviceHeaderList: flag != 'suggestNew' ? this.adviceHeaderList : '',
      adviceNameObj: this.adviceNameObj,
      data,
      id: 1,
      state: 'open',
      componentName: SuggestAndGiveAdviceComponent,
      childComponent: component,
      childData: { data: data ? data : null, adviceNameObj: this.adviceNameObj, inputData: this.inputData, displayList: this.displayList, insuranceSubTypeId: this.object.insuranceSubTypeId, insuranceTypeId: 2, adviceToCategoryId: this.object.adviceToCategoryId, flag: 'Advice General Insurance' },
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.suggestPoliciesGetCall(data.insurance ? data.insurance.id : null)
            // this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  deleteModalRecommendations(value, data) {
    let deletedAdviceId = data ? (data.adviceDetails ? data.adviceDetails.id : null) : null
    if (data) {
      data.inputData = this.inputData
    } else {
      data = { inputData: this.inputData };
    }
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.activityService.deleteAdvice(deletedAdviceId).subscribe(
          data => {
            // this.isRefresh = true;
            this.eventService.openSnackBar('Insurance is deleted', 'Dismiss');
            this.getRecommendationCall(data ? (data.insurance ? data.insurance.id : null) : null);
            // this.getForkJoinResponse(singleData[0])
            // this.deleteWithoutHitingApi(deletedAdviceId);
            dialogRef.close();
            // this.isRefreshRequired = true;
          },
          error => {
            this.getRecommendationCall(null)
            this.eventService.showErrorMessage(error)
          }
        );
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
  generatePdf() {
    //Reference the Table.
    // this.dataSourceLiability.forEach(ele => {
    //   var grid = document.getElementById("tableLife");

    //   //Reference the CheckBoxes in Table.
    //   var checkBoxes = grid.getElementsByTagName("INPUT");

    //   for (var i = 0; i < checkBoxes.length; i++) {
    //     checkBoxes[i]['checked'] = ele.selected;
    //     let para = document.getElementById('liabilities');
    //     para['checked'] = true
    //   }
    // });


    //Display selected Row data in Alert Box.
    this.fragmentData = {}
    this.fragmentData.isSpinner = true;
    let para = document.getElementById('insuranceTemplate');
    //const header = this.summaryTemplateHeader.nativeElement.innerHTML
    this.UtilService.htmlToPdf('', para.innerHTML, 'Insurance plan', false, this.fragmentData, '', '', false, null);
  }
  deleteWithoutHitingApi(deletedId) {
    let singleData = this.storedData.filter(d => d.id == this.inputData.id);
    let suggestPolicy = singleData[0][1];
    if (this.inputData.insuranceType == 1) {
      suggestPolicy.forEach(element => {
        element.id = element.insurance.id
      });
      suggestPolicy = suggestPolicy.filter(d => d.id != deletedId);
      if (suggestPolicy.length == 0) {
        this.recommendOrNot = false;
      }
      singleData[0][1] = suggestPolicy
    } else {
      let suggested = suggestPolicy.suggested.length > 0 ? suggestPolicy.suggested : []
      suggested.forEach(element => {
        element.id = element.insurance ? element.insurance.id : element.insuranceDetails.id
      });
      suggested = suggested.filter(d => d.id != deletedId);
      singleData[0][1].suggested = suggested;
      this.ipService.setNeedAnlysisData('');
    }
    this.ipService.setIpData(this.storedData);
    this.getForkJoinResponse(singleData[0])
  }
  deleteInsurance() {
    const obj = {
      id: this.inputData.id,
      clientId: this.clientId,
      familyMemberId: [],
      insuranceTypeId: this.inputData.heading == 'Life insurance' ? 1 : 2,
      insuranceSubTypeId: this.inputData.insuranceType
    }
    this.inputData.owners.forEach(element => {
      obj.familyMemberId.push(element.ownerId ? element.ownerId : this.clientId);
    });
    const dialogData = {
      header: 'DELETE INSURANCE',
      body: 'Are you sure you want to delete this insurance?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',

      positiveMethod: () => {
        this.planService.deleteInsurancePlanning(obj).subscribe((data) => {
          this.eventService.openSnackBar("Insurance has been deleted successfully", "Dismiss");
          // this.deleteId(this.inputData.id);
          this.allInsuranceData = this.allInsuranceData.filter(d => d.id != obj.id);
          this.ipService.setAllInsuranceData(this.allInsuranceData);
          this.storedData = this.storedData.filter(d => d.id != obj.id);
          this.ipService.setIpData(this.storedData);
          // this.isRefreshRequired = true;
          // this.outputChange.emit({id : '',isRefreshRequired:true});

          this.outputChange.emit({ loadResponse: true });
          // this.getDetailsInsurance()
          dialogRef.close()
        }, (err) => { this.eventService.openSnackBar(err, "Dismiss") })
      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
    });
  }
  chekToCallApi() {
    return this.storedData ? false : true
  }
  // deleteId(id){
  //   this.inputData = this.storedData.filter(d=>d.id != id);
  //   this.inputData = [...new Map(this.inputData.map(item => [item.id, item])).values()];
  //   this.ipService.setIpData(this.inputData);
  // }
  getDetailsInsurance() {
    if (!this.isRefresh) {
      this.dataSource1 = [{}, {}, {}];
      this.dataSouce3 = [{}, {}, {}];
      this.loader(1);
      this.isLoadingPlan = true;
      this.insuranceDetails = '';
    }
    let obj = {
      // clientId: this.clientId,
      // familyMemberId: [],
      id: this.inputData.id,
    }
    let obj2 = {
      clientId: this.clientId,
      familyMemberId: [],
      advisorId: this.advisorId,
    }
    let obj3 = {
      id: [this.inputData.id],
      insuranceType: this.inputData.insuranceType
    }
    if (this.inputData.owners) {
      this.inputData.owners.forEach(element => {
        // obj.familyMemberId.push(element.ownerId);
        obj2.familyMemberId.push(element.ownerId);
      });
    } else {
      obj2.familyMemberId.push(0);
    }


    // this.planService.getDetailsInsurance(obj).subscribe(
    //   data => this.getDetailsInsuranceRes(data),
    //   err => {
    //     this.eventService.openSnackBar(err, 'Dismiss');
    //     this.loader(-1);
    //     this.isLoadingPlan = false;
    //   }
    // );
    const detailofInsurance = this.planService.getDetailsInsurance(obj);
    // const suggestPolicyGetGi = this.planService.getGeneralInsuranceSuggestPolicy(this.inputData.id);
    const suggestPolicyGetGi = this.planService.getGeneralInsuranceNeedAnalysis(obj3);
    const suggestPolicyGet = this.planService.getSuggestPolicy(obj2);
    const recommndationGetGi = this.planService.getGeneralInsuranceAdvice(this.inputData.id).pipe(
      catchError(error => of(null))
    );
    const recommndationGet = this.planService.getInsuranceAdvice(obj2).pipe(
      catchError(error => of(null))
    );
    // const recommndationGetGi = this.planService.getGeneralInsuranceAdvice(this.inputData.id);
    // const recommndationGet = this.planService.getInsuranceAdvice(obj2);
    const needAnalysis = this.planService.getNeedBasedDetailsLifeInsurance(this.inputData.id);
    const sendPolicy = this.inputData.insuranceType != 1 ? suggestPolicyGetGi : suggestPolicyGet;
    const sendRecommendation = this.inputData.insuranceType != 1 ? recommndationGetGi : recommndationGet;
    forkJoin(detailofInsurance, sendPolicy, sendRecommendation, needAnalysis).subscribe(result => {
      result['id'] = this.inputData.id;
      this.plannerObj = this.setAll(this.plannerObj, 0);
      this.pushArray.push(result);
      this.pushArray = [...new Map(this.pushArray.map(item => [item.id, item])).values()];
      this.ipService.setIpData(this.pushArray);
      this.getForkJoinResponse(result);
    }, err => {
      this.eventService.openSnackBar(err, 'Dismiss');
      this.stopLoaderWhenReponse.emit(true);
      this.insuranceDetails = '';
      this.dataSource1 = [];
      this.dataSouce3 = [];
      this.loader(-1);
      this.isLoadingPlan = false;
    })
  }
  setAll(obj, val) {
    Object.keys(obj).forEach(function (index) {
      obj[index] = val
    });
    return obj;
  }
  getForkJoinResponse(result) {
    this.recommendOrNot = false;
    this.needAnalysisSavedData = result[3] ? result[3] : null;
    this.panelOpenState = false;
    let suggestedData = result[1];
    this.isLoadingPlan = false;
    if (suggestedData) {
      if (this.inputData.insuranceType != 1) {
        let current = suggestedData.current.length > 0 ? suggestedData.current[0] : [];
        let suggested = suggestedData.suggested.length > 0 ? suggestedData.suggested : []
        let mergeArray = [...suggested];
        mergeArray.forEach(element => {
          element.insurance = element.insuranceDetails
          element.expanded = false;
        });
        this.dataSouce3 = this.getFilterDataNeedAnalysis(mergeArray);
      } else {
        suggestedData.forEach(element => {
          element.expanded = false;
          element.displayHolderSumInsured = element.insurance.sumAssured ? element.insurance.sumAssured : element.insurance.sumInsuredIdv
        });
        this.dataSouce3 = suggestedData;
      }
      let countSuggest = 0
      if (this.dataSouce3.length > 0) {
        let suggestionId;
        this.dataSouce3.forEach(ele => {
          // if (ele['insurance'].suggestion) {
          if (ele['insurance'] ? ele['insurance'].isRecommend == 1 : ele['insuranceDetails'].isRecommend == 1) {
            suggestionId = ele['insurance'].id;
            countSuggest++
            this.recommendOrNot = true;
          }
        });
        (countSuggest >= 1) ? this.recommendOrNot = true : this.recommendOrNot = false;
        let deletedArray = this.dataSouce3.filter(d => d['insurance'].id == suggestionId);
        let RemovedArray = this.dataSouce3.filter(d => d['insurance'].id != suggestionId);
        RemovedArray.unshift(deletedArray);
        RemovedArray = RemovedArray.flat();
        this.dataSouce3 = RemovedArray;
      }
    } else {
      this.dataSouce3 = [];
    }
    this.insuranceDetails = result[0];
    this.getNeedAnalysisData(result[3]);
    this.getDetailsInsuranceRes(result[0])
    if (result[2]) {
      result[2] = result[2].filter(d => d.insurance.realOrFictitious == 1 || d.insurance.realOrFictitious == 0);
      result[2].forEach(element => {
        element.expanded = false;
      });
      this.dataSource1 = this.getFilterSumAssured(result[2]);
    } else {
      this.dataSource1 = [];
    }
    this.stopLoaderWhenReponse.emit(true);
    this.isLoadingPlan = false;
    if (this.inputData.insuranceType == 1) {
      this.firstAccordion ? this.firstAccordion.closeAll() : '';
    }
    if (this.finPlanObj) {
      this.ref.detectChanges();
      this.loaded.emit(this.insuranceTemp.nativeElement);
    }
  }
  getFilterSumAssured(data) {
    if (this.inputData.insuranceType != 1) {
      if (data)
        data.forEach(element => {
          this.getSumAssuredInAll(element.insurance);
          if (element.parentAsset) {
            this.getSumAssuredInAll(element.parentAsset);
          }
          if (element.childAsset) {
            this.getSumAssuredInAll(element.childAsset);
          }
        });
    }
    return data;
  }
  getSumAssuredInAll(element) {
    element.sumAssured = 0;
    element.sumInsuredIdv = 0;
    if (element && element.hasOwnProperty('insuredMembers') && element.insuredMembers.length > 0) {
      element.insuredMembers.forEach(ele => {
        element.sumAssured += ele.sumInsured;
      });
    } else if (element && element.hasOwnProperty('policyFeatures') && element.policyFeatures.length > 0) {
      element.policyFeatures.forEach(ele => {
        element.sumInsuredIdv += ele.featureSumInsured;
      });
    } else {
      element.sumInsuredIdv = element.sumInsuredIdv;
    }

    if (!element.sumInsuredIdv && element && element.hasOwnProperty('addOns') && element.addOns.length > 0) {
      element.addOns.forEach(ele => {
        element.sumInsuredIdv += ele.addOnSumInsured;
      });
    }
    return element;
  }
  getSumAssuredByArray(storeVal, data) {
    if (data) {
      data.forEach(ele => {
        storeVal.sumInsuredIdv += ele.sumInsured;
      });
    } else {
      data = []
    }
    return data
  }
  getFilterDataNeedAnalysis(array) {
    if (array) {
      this.getSumAssured(array);
      array.forEach(singleInsuranceData => {
        singleInsuranceData.insuranceDetails = singleInsuranceData.insurance ? singleInsuranceData.insurance : singleInsuranceData.insuranceDetails;
        if (singleInsuranceData.insuranceDetails && singleInsuranceData.insuranceDetails.insuredMembers.length > 0) {
          singleInsuranceData.displayHolderName = singleInsuranceData.insuranceDetails.insuredMembers[0].name;
          singleInsuranceData.displayHolderSumInsured = this.formatNumber(singleInsuranceData.insuranceDetails.insuredMembers[0].sumInsured ? singleInsuranceData.insuranceDetails.insuredMembers[0].sumInsured : singleInsuranceData.insuranceDetails.sumInsuredIdv);
          if (singleInsuranceData.insuranceDetails.insuredMembers.length > 1) {
            for (let i = 1; i < singleInsuranceData.insuranceDetails.insuredMembers.length; i++) {
              if (singleInsuranceData.insuranceDetails.insuredMembers[i].name) {
                const firstName = (singleInsuranceData.insuranceDetails.insuredMembers[i].name as string).split(' ')[0];
                singleInsuranceData.displayHolderName += ', ' + firstName;
                if (singleInsuranceData.insuranceDetails.insuredMembers[i].sumInsured) {
                  singleInsuranceData.insuranceDetails.insuredMembers[i].sumInsured = this.formatNumber(singleInsuranceData.insuranceDetails.insuredMembers[i].sumInsured, 0);
                  const firstSumInsured = (singleInsuranceData.insuranceDetails.insuredMembers[i].sumInsured as string).split(' ')[0];
                  singleInsuranceData.displayHolderSumInsured += ', ₹' + firstSumInsured;
                } else {
                  singleInsuranceData.displayHolderSumInsured = singleInsuranceData.insuranceDetails.sumInsuredIdv ? singleInsuranceData.insuranceDetails.sumInsuredIdv : 0;
                }
              }
            }
          }
        } else {
          singleInsuranceData.displayHolderSumInsured = singleInsuranceData.insuranceDetails.sumInsuredIdv;;
        }
      });
    } else {
      array = []
    }

    return array;
  }
  getSumAssured(data) {
    data.forEach(element => {
      element.insuranceDetails = element.insurance ? element.insurance : element.insuranceDetails;
      element.sumAssured = 0;
      element.insuranceDetails.sumInsuredIdv = 0;
      if (element.insuranceDetails && element.insuranceDetails.hasOwnProperty('insuredMembers') && element.insuranceDetails.insuredMembers.length > 0) {
        element.insuranceDetails.insuredMembers.forEach(ele => {
          ele.sumAssured += ele.sumInsured;
        });
      } else if (element.insuranceDetails && element.insuranceDetails.hasOwnProperty('policyFeatures') && element.insuranceDetails.policyFeatures.length > 0) {
        element.insuranceDetails.policyFeatures.forEach(ele => {
          element.insuranceDetails.sumInsuredIdv += ele.featureSumInsured;
        });
      } else {
        element.insuranceDetails.sumInsuredIdv = element.insuranceDetails.sumInsuredIdv;
      }

      if (!element.insuranceDetails.sumInsuredIdv && element.insuranceDetails && element.insuranceDetails.hasOwnProperty('addOns') && element.insuranceDetails.addOns.length > 0) {
        element.insuranceDetails.addOns.forEach(ele => {
          element.insuranceDetails.sumInsuredIdv += ele.addOnSumInsured;
        });
      }
    });

  }
  recommend(data) {
    const obj = {
      id: this.inputData.id,
      insuranceId: data.insurance.id
    }
    if (this.inputData.insuranceType == 1) {
      this.planService.updateRecommendationsLI(obj).subscribe(
        data => {
          this.getDetailsInsurance()
          console.log(data)
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
        }
      );
    } else {
      this.planService.updateRecommendationsGI(obj).subscribe(
        data => {
          this.getDetailsInsurance()
          console.log(data)
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
        }
      );
    }




  }
  getDetailsInsuranceRes(data) {
    console.log('getDetailsInsuranceRes res', data)
    if (data) {
      this.insuranceDetails = data
      this.notes = this.insuranceDetails.needAnalysis.plannerNotes ? this.innerHtmlText(this.insuranceDetails.needAnalysis.plannerNotes) : null;
      // if (!this.insuranceDetails.graph) {
      //   if (this.plannerObj.additionalLifeIns) {
      //     if (this.insuranceDetails && this.insuranceDetails.needAnalysis.needTypeId == 1) {
      //       this.insuranceDetails.graph = Math.round(100 - (this.plannerObj.additionalLifeIns / this.insuranceDetails.actual));
      //     } else {
      //       this.insuranceDetails.graph = Math.round((this.insuranceDetails.actual / this.insuranceDetails.advice) * 100);
      //     }
      //   } else {
      //     this.insuranceDetails.graph = 0;
      //   }
      // }
      if (this.insuranceDetails && this.insuranceDetails.needAnalysis.needTypeId == 1) {
        this.insuranceDetails.graph = Math.round(100 - ((this.plannerObj.additionalLifeIns / this.insuranceDetails.actualAmount) * 100));
      }
      if (this.insuranceDetails && this.insuranceDetails.needAnalysis.needTypeId == 2) {

        this.insuranceDetails.graph = Math.round(100 - ((this.insuranceDetails.adviceAmount / this.insuranceDetails.actualAmount) * 100));
        //this.insuranceDetails.graph = Math.round((this.insuranceDetails.actualAmount / this.insuranceDetails.adviceAmount) * 100);
      }
    }

  }
  getNeedAnalysisData(data) {
    if (data) {
      this.needAnalysisLoaded = data;
      this.dataSourceLiability = this.getFilterData(data[1], 'liabilities', 'name', 'total_loan_outstanding');
      this.plannerObj.lifeInsurancePremiums = data[2.1] ? data[2.1][0].amount : 0;
      this.dataSourceLifeInsurance = this.getFilterData(data[2.2], 'dependantNeeds', 'name', 'amount');
      this.plannerObj.livingExpense = 0;
      this.dataSourceLifeInsurance.forEach(element => {
        if (element.selected) {
          this.plannerObj.livingExpense += (element.amount * element.percent) / 100;
        }
      });
      this.dataSourceGoals = this.getFilterData(data[3], 'goalsMeet', 'goalName', 'goalFV')
      this.plannerObj.GrossLifeinsurance = data[4] ? data[4][0].total_amount : 0;
      this.dataSourceIncome = this.getFilterData(data[5], 'incomeSource', 'name', 'amount')
      this.plannerObj.existingLifeInsurance = data[6] ? data[6][0].total_amount : 0;
      this.dataSourceAsset = this.getFilterData(data[7], 'existingAsset', 'ownerName', 'currentValue')
      this.plannerObj.additionalLifeIns = data[8] ? data[8][0].total_amount : 0;

    } else {
      this.plannerObj = this.setAll(this.plannerObj, 0);
      this.needAnalysisLoaded = '';
    }
    this.setAdviceAmountToAllIns();
  }
  setAdviceAmountToAllIns() {
    let singleData = this.allInsuranceData.filter(d => d.id == this.inputData.id);
    singleData[0].adviceAmount = this.insuranceDetails ? (this.insuranceDetails.advice ? this.insuranceDetails.advice : this.plannerObj.additionalLifeIns) : this.plannerObj.additionalLifeIns ? this.plannerObj.additionalLifeIns : 0;
    if (singleData[0].insuranceDetails && singleData[0].insuranceDetails.needAnalysis) {
      singleData[0].insuranceDetails.advice = singleData[0].adviceAmount
      // singleData[0].insuranceDetails.actual = this.plannerObj.GrossLifeinsurance ? this.plannerObj.GrossLifeinsurance : singleData[0].insuranceDetails.actual;
      // this.insuranceDetails.actual = singleData[0].insuranceDetails.actual;
      singleData[0].insuranceDetails.needAnalysis.adviceAmount = singleData[0].adviceAmount
    }
    if (this.insuranceDetails && this.insuranceDetails.needAnalysis.needTypeId == 1) {
      this.insuranceDetails.actualAmount = this.plannerObj.GrossLifeinsurance ? this.plannerObj.GrossLifeinsurance : singleData[0].insuranceDetails ? singleData[0].insuranceDetails.actual : this.insuranceDetails.actual;
      this.insuranceDetails.adviceAmount = this.plannerObj.additionalLifeIns ? this.plannerObj.additionalLifeIns : singleData[0].insuranceDetails ? singleData[0].insuranceDetails.advice : this.insuranceDetails.advice;
    } else if (this.insuranceDetails && this.insuranceDetails.needAnalysis.needTypeId == 2) {
      let actualAmount = this.insuranceDetails.actual ? this.insuranceDetails.actual : 0;
      let adviceAmount = this.insuranceDetails.advice ? this.insuranceDetails.advice : 0;
      this.insuranceDetails.adviceAmount = adviceAmount - actualAmount;
      this.insuranceDetails.actualAmount = adviceAmount;
    } else {
      this.insuranceDetails.adviceAmount = this.insuranceDetails.advice;
      this.insuranceDetails.actualAmount = this.insuranceDetails.actual;
    }
    this.ipService.setAllInsuranceData(this.allInsuranceData);

  }
  getFilterData(data, totalAmount, name, amount) {
    if (data) {
      data.forEach(element => {
        element[name] = element.name;
        element[amount] = element.amount;
        element.percent = element.percentage;
        element.selected = element.is_selected ? true : false;
        // document.getElementById(totalAmount) ? document.getElementById(totalAmount)['checked'] = element.is_selected ? true : false : '';
      });
      data = data.filter(item => item[amount] > 0)
      this.plannerObj[totalAmount] = data[0].total_amount
    } else {
      data = [];
    }

    return data;
  }
  isExpansionDisabled(): string {
    if (this.blockExpansion) {
      return 'disabled-pointer';
    }
    return '';
  }
  changeValue(array, ele) {
    this.clicked = true;
    // ele.expanded = true;
    array.filter(element => {
      element.insurance.suggestion = element.insurance.suggestion ? element.insurance.suggestion.replace(/(<([^>]+)>|&nbsp;)/ig, '') : null;
      if (element.insurance.id == ele.insurance.id && ele.expanded == true) {
        element.expanded = false;
      } else if (element.insurance.id != ele.insurance.id) {
        element.expanded = false;
      } else {
        element.expanded = this.isClick ? false : true;

      }
    });
  }
  changeValue2(array, ele) {
    // ele.expanded = true;
    if (ele.advice != 'Continue' && ele.advice != 'Discontinue' && ele.advice != null) {
      this.clickedRecommend = true;
      array.filter(element => {
        if (element.insurance.id == ele.insurance.id && ele.expanded == true) {
          element.expanded = false;
        } else if (element.insurance.id != ele.insurance.id) {
          element.expanded = false;
        } else {
          element.expanded = this.isClick ? false : true;

        }
      });
    } else {
      this.clickedRecommend = false;
    }
  }
  loader(increamenter) {
    this.counter += increamenter;
    if (this.counter == 0) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }
  getDataInv(data) {
    data.expanded = !data.expanded;
    console.log(data);
  }
  needAnalysis(data) {
    if (this.inputData.insuranceType == 1) {
      this.inputData.insuranceDetails = this.insuranceDetails;
      this.inputData.needAnalysisSaved = this.needAnalysisSavedData ? this.needAnalysisSavedData : null;
      const fragmentData = {
        flag: 'opencurrentpolicies',
        data: this.inputData,
        componentName: AddPlaninsuranceComponent,
        id: 1,
        state: 'open',
      };
      const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
        sideBarData => {
          console.log('this is sidebardata in subs subs : ', sideBarData);
          if (UtilService.isDialogClose(sideBarData)) {
            if (sideBarData.data) {
              this.isRefresh = true;
              this.getDetailsInsurance();
              // this.isRefreshRequired = sideBarData.data;
              // this.outputChange.emit({ id: this.inputData.id, isRefreshRequired: sideBarData.data });
            }
            console.log('this is sidebardata in subs subs 2: ', sideBarData);
            rightSideDataSub.unsubscribe();
          }
        }
      );
    } else {
      const fragmentData = {
        flag: 'app-customer',
        id: 1,
        data: this.inputData ? this.inputData : this.needAnalysisData,
        direction: 'top',
        componentName: ShowHealthPlanningComponent,
        state: 'open'
      };
      const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
        upperSliderData => {
          if (UtilService.isDialogClose(upperSliderData)) {
            // this.getClientSubscriptionList();
            this.storeCurrentAndSuggested();
            // this.isRefreshRequired = upperSliderData['data'].isRefreshRequired;
            // this.outputChange.emit({id : this.inputData.id,isRefreshRequired:upperSliderData['data'].isRefreshRequired});
            subscription.unsubscribe();
          }
        }
      );
    }



  }
  storeCurrentAndSuggested() {
    let singleData = this.storedData.filter(d => d.id == this.inputData.id);
    // let suggestPolicy = singleData[0][1];
    // if (this.inputData.insuranceType == 1) {
    //   suggestPolicy.forEach(element => {
    //     element.id = element.insurance.id
    //   });
    //   suggestPolicy = suggestPolicy.filter(d => d.id != deletedId);
    //   singleData[0][1] = suggestPolicy
    // } else {
    //   let suggested = suggestPolicy.suggested.length > 0 ? suggestPolicy.suggested : []
    //   suggested.forEach(element => {
    //     element.id = element.insurance ? element.insurance.id : element.insuranceDetails.id
    //   });
    //   suggested = suggested.filter(d => d.id != deletedId);
    //   singleData[0][1].suggested = suggested;
    // }
    // this.ipService.setIpData(this.storedData);
    this.getForkJoinResponse(singleData[0])
  }
  suggestPolicy(data) {
    this.inputData.recommendOrNot = data ? (data.insurance.isRecommend == 1 ? false : (this.recommendOrNot ? true : false)) : (this.recommendOrNot ? true : false);
    if (data) {
      data.inputData = this.inputData
    } else {
      data = { inputData: this.inputData };
    }
    const fragmentData = {
      flag: 'opencurrentpolicies',
      data: data,
      componentName: AddSuggestPolicyComponent,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.isRefresh = sideBarData.refreshRequired;
            // this.isRefreshRequired = true;
            this.suggestPoliciesGetCall(data.insurance ? data.insurance.id : null)
            // this.getDetailsInsurance();
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  suggestPoliciesGetCall(id) {
    let obj2 = {
      clientId: this.clientId,
      familyMemberId: [],
      advisorId: this.advisorId,
    }
    let obj3 = {
      id: [this.inputData.id],
      insuranceType: this.inputData.insuranceType
    }
    if (this.inputData.owners) {
      this.inputData.owners.forEach(element => {
        obj2.familyMemberId.push(element.ownerId);
      });
    } else {
      obj2.familyMemberId.push(0);
    }
    if (this.inputData.insuranceType == 1) {
      this.planService.getSuggestPolicy(obj2).subscribe(
        data => {
          console.log(data),
            this.checkAndPushSuggestedData(data, id);
        }
      );
    } else {
      this.planService.getGeneralInsuranceNeedAnalysis(obj3).subscribe(
        data => {
          console.log(data),
            this.checkAndPushSuggestedData(data, id);
        }
      );
    }
  }
  checkAndPushSuggestedData(array, id) {
    let singleData = this.storedData.filter(d => d.id == this.inputData.id);
    let suggestPolicy = singleData[0][1];
    if (this.inputData.insuranceType == 1) {
      suggestPolicy = this.ipService.pushId(suggestPolicy)
      suggestPolicy = suggestPolicy.filter(d => d.id != id);
      suggestPolicy.push(array);
      suggestPolicy = suggestPolicy.flat();
      suggestPolicy = this.ipService.pushId(suggestPolicy)
      suggestPolicy = [...new Map(suggestPolicy.map(item => [item.id, item])).values()];
      singleData[0][1] = suggestPolicy
    } else {
      let suggested = suggestPolicy.suggested.length > 0 ? suggestPolicy.suggested : []
      suggested = this.ipService.pushId(suggested)
      suggested = suggested.filter(d => d.id != id);
      suggested.push(array.suggested);
      suggested = suggested.flat();
      suggested = this.ipService.pushId(suggested)
      suggested = [...new Map(suggested.map(item => [item.id, item])).values()];
      singleData[0][1].suggested = suggested;
    }
    this.ipService.setIpData(this.storedData);
    this.getForkJoinResponse(singleData[0])
  }
  recommendationsPolicy(data) {
    if (data) {
      data.inputData = this.inputData
    } else {
      data = { inputData: this.inputData };
    }
    const fragmentData = {
      flag: 'opencurrentpolicies',
      data: this.inputData,
      componentName: AddRecommendationsInsuComponent,
      id: 1,
      state: 'open',
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.refreshRequired) {
            this.getRecommendationCall(data.insurance ? data.insurance.id : null);
            console.log('this is sidebardata in subs subs 2: ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }




}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

export interface PeriodicElement2 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: "HDFC Ergo My Health Suraksha", name: '7,00,000', weight: "19,201", symbol: 'Waiting for approval' },
];
export interface PeriodicElement1 {
  name: string;
  sum: string;
  premium: string;
  advice: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: "LIC Jeevan Saral", sum: '20,00,000', premium: "27,000", advice: 'Stop paying premiums' },
];
const ELEMENT_DATA2: PeriodicElement1[] = [
  { name: "LIC Jeevan Saral", sum: '20,00,000', premium: "27,000", advice: 'Stop paying premiums' },
];
export interface PeriodicElement2 {

  name: string;
  annual: string;
  amt: string;

}

export interface PeriodicElement4 {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

const ELEMENT_DATA4: PeriodicElement4[] = [
  {
    position: 1,
    name: 'Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 2,
    name: 'Helium',
    weight: 4.0026,
    symbol: 'He',
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`
  }, {
    position: 3,
    name: 'Lithium',
    weight: 6.941,
    symbol: 'Li',
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`
  }, {
    position: 4,
    name: 'Beryllium',
    weight: 9.0122,
    symbol: 'Be',
    description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`
  }, {
    position: 5,
    name: 'Boron',
    weight: 10.811,
    symbol: 'B',
    description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`
  }, {
    position: 6,
    name: 'Carbon',
    weight: 12.0107,
    symbol: 'C',
    description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`
  }, {
    position: 7,
    name: 'Nitrogen',
    weight: 14.0067,
    symbol: 'N',
    description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`
  }, {
    position: 8,
    name: 'Oxygen',
    weight: 15.9994,
    symbol: 'O',
    description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`
  }, {
    position: 9,
    name: 'Fluorine',
    weight: 18.9984,
    symbol: 'F',
    description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`
  }, {
    position: 10,
    name: 'Neon',
    weight: 20.1797,
    symbol: 'Ne',
    description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`
  },
];