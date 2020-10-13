import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HelthInsurancePolicyComponent } from '../add-insurance-planning/helth-insurance-policy/helth-insurance-policy.component';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { ShowHealthPlanningComponent } from '../show-health-planning/show-health-planning.component';
import { AddInsuranceUpperComponent } from '../add-insurance-upper/add-insurance-upper.component';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from '../../plan.service';
import { AddHealthInsuranceAssetComponent } from '../../../accounts/insurance/add-health-insurance-asset/add-health-insurance-asset.component';
import { AddPersonalAccidentInAssetComponent } from '../../../accounts/insurance/add-personal-accident-in-asset/add-personal-accident-in-asset.component';
import { AddCriticalIllnessInAssetComponent } from '../../../accounts/insurance/add-critical-illness-in-asset/add-critical-illness-in-asset.component';
import { AddMotorInsuranceInAssetComponent } from '../../../accounts/insurance/add-motor-insurance-in-asset/add-motor-insurance-in-asset.component';
import { AddTravelInsuranceInAssetComponent } from '../../../accounts/insurance/add-travel-insurance-in-asset/add-travel-insurance-in-asset.component';
import { AddHomeInsuranceInAssetComponent } from '../../../accounts/insurance/add-home-insurance-in-asset/add-home-insurance-in-asset.component';
import { AddFireAndPerilsInsuranceInAssetComponent } from '../../../accounts/insurance/add-fire-and-perils-insurance-in-asset/add-fire-and-perils-insurance-in-asset.component';
import { AddInsuranceComponent } from '../../../../common-component/add-insurance/add-insurance.component';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { forkJoin } from 'rxjs';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-add-health-insurance',
  templateUrl: './add-health-insurance.component.html',
  styleUrls: ['./add-health-insurance.component.scss']
})

export class AddHealthInsuranceComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,

  };
  barButtonOptions2: MatProgressButtonOptions = {
    active: false,
    text: 'Procced',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,

  };
  inputData: any;
  showInsurance: { value: string; header: string; heading: string; subHeading: string, logo: string, smallHeading: string };
  isChecked: any;
  showError: boolean;
  advisorId: any;
  clientId: any;
  insuranceType: number;
  needAnalysis = [];
  ownerIds = [];
  showNewPolicy = false;
  isLoading = false;
  dislayList: any;
  newPolicyData: any;
  familyMemberList:any;

  @Input()
  set data(data) {
    this.inputData = data;
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId()
    this.getGlobalDataInsurance();
    if(this.inputData.flag == 'suggestExistingPolicy'){
      this.getAddMore();
    }
  }

  get data() {
    return this.inputData;
  }
  dataSource2: any;
  displayedColumns2: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'sum', 'mname', 'advice'];
  // dataSource2 = ELEMENT_DATA2;
  showExisting = false;
  selectPolicy=''
  insuranceData = [{
    value: '1',
    header: 'Add Health Insurance',
    smallHeading: 'health insurance',
    insuranceType: 5,
    logo: '/assets/images/svg/helth-insurance.svg',
    heading: 'Health insurance',
    subHeading: 'Select how you’d like to proceed with planning for health insurance policies.'
  }, {
    value: '2',
    logo: '/assets/images/svg/Criticalillness.svg',
    header: 'Add Critical Illness',
    smallHeading: 'critical illness',
    insuranceType: 6,
    heading: 'Critical illness',
    subHeading: 'Select how you’d like to proceed with planning for critical insurance policies.'
  }, {
    value: '3',
    logo: '/assets/images/svg/Cancercare.svg',
    header: 'Add Cancer Care',
    smallHeading: 'cancer care',
    insuranceType: 11,
    heading: 'Cancer care',
    subHeading: 'Select how you’d like to proceed with planning for cancer insurance policies.'
  }, {
    value: '4',
    logo: '/assets/images/svg/Personalaccident.svg',
    header: 'Add Personal Accident',
    heading: 'Personal accident',
    smallHeading: 'personal accident',
    insuranceType: 7,
    subHeading: 'Select how you’d like to proceed with planning for personal insurance policies.'
  }, {
    value: '5',
    logo: '/assets/images/svg/Householders.svg',
    header: 'Add Householders',
    smallHeading: 'householders',
    insuranceType: 9,
    heading: 'Householders',
    subHeading: 'Select how you’d like to proceed with planning for householders insurance policies.'
  }, {
    value: '6',
    logo: '/assets/images/svg/Fireinsurance.svg',
    header: 'Add Fire Insurance',
    smallHeading: 'fire insurance',
    insuranceType: 10,
    heading: 'Fire insurance',
    subHeading: 'Select how you’d like to proceed with planning for fire insurance policies.'
  },
  {
    value: '7',
    logo: '/assets/images/svg/Fireinsurance.svg',
    header: 'Add Travel Insurance',
    smallHeading: 'travel insurance',
    insuranceType: 8,
    heading: 'Travel insurance',
    subHeading: 'Select how you’d like to proceed with planning for travel insurance policies.'
  },{
    value: '8',
    logo: '/assets/images/svg/Fireinsurance.svg',
    header: 'Add Motor Insurance',
    smallHeading: 'motor insurance',
    insuranceType: 4,
    heading: 'Motor insurance',
    subHeading: 'Select how you’d like to proceed with planning for motor insurance policies.'
  }]

  constructor(private peopleService:PeopleService,public planService: PlanService, public dialog: MatDialog, private subInjectService: SubscriptionInject, private custumService: CustomerService, private utils: UtilService, private eventService: EventService) { }
  openDialog(value, data): void {
    const dialogRef = this.dialog.open(HelthInsurancePolicyComponent, {
      width: '780px',
      height: '600px',
      data: { value, data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  ngOnInit() {
    console.log('get policy =', this.inputData)
    this.insuranceData.forEach(element => {
      if (element.value == this.inputData.value) {
        this.showInsurance = element
        this.insuranceType = element.insuranceType
      }
      console.log('selected insurance', this.showInsurance)
      if (this.inputData.showExisting != undefined) {
        this.showExisting = this.inputData.showExisting;
      }
    });

  }
  getAddMore(){
    this.isLoading = true;
    let obj = {
      id: this.inputData.id,
      insuranceType: this.inputData.insuranceType
    }
    const obj2 = {
      clientId: this.clientId
    };
    const getCurrentPolicy = this.planService.getCurrentPolicyAddMore(obj);
    const familyMemberList = this.peopleService.getClientFamilyMemberListAsset(obj2)
    // this.planService.getCurrentPolicyAddMore(obj).subscribe(
    //   data => {
    //     if (data) {
    //       data = this.getHolderNameAndSumAssured(data);
    //       this.dataSource2 = data;
    //       this.isLoading = false;
    //       console.log(data);
    //     }else{
    //       this.dataSource2=[];
    //       this.isLoading = false;
    //     }
    //   },
    //   err => {
    //     this.eventService.openSnackBar(err, 'Dismiss');
    //     this.isLoading = false;
    //     this.dataSource2=[];
    //   }
    // );
    forkJoin(getCurrentPolicy, familyMemberList).subscribe(result => {
      this.familyMemberList = result[1];
      if(result[0]){
        let data = this.getHolderNameAndSumAssured(result[0]);
        this.dataSource2 = data;
        this.isLoading = false;
        console.log('data cvcccccccccccccccccccccccccccccccccccccccc',this.familyMemberList);
      }else{
        this.dataSource2=[];
        this.isLoading = false;
      }

    }, err => {
      this.eventService.openSnackBar(err, 'Dismiss');
      this.isLoading = false;
      this.dataSource2=[];
    })
  }
  getReviewExistingPolicy() {
    this.isLoading = true;
    let obj = {
      clientId: this.clientId,
      insuranceType: this.insuranceType
    }
    const obj2 = {
      clientId: this.clientId
    };
    const getCurrentPolicy = this.planService.getGeneralInsuranceReview(obj);
    const familyMemberList = this.peopleService.getClientFamilyMemberListAsset(obj2)
    // this.planService.getGeneralInsuranceReview(obj).subscribe(
    //   data => {
    //     if (data) {
    //       data = this.getHolderNameAndSumAssured(data);
    //       this.dataSource2 = data;
    //       this.isLoading = false;
    //       console.log(data);
    //     }else{
    //       this.dataSource2=[];
    //       this.isLoading = false;
    //     }
    //   },
    //   err => {
    //     this.eventService.openSnackBar(err, 'Dismiss');
    //     this.isLoading = false;
    //     this.dataSource2=[];
    //   }
    // );
    forkJoin(getCurrentPolicy, familyMemberList).subscribe(result => {
      this.familyMemberList = result[1];
      if(result[0]){
       let data = this.getHolderNameAndSumAssured(result[0]);
        this.dataSource2 = data;
        this.isLoading = false;
        console.log('data cvcccccccccccccccccccccccccccccccccccccccc',this.familyMemberList);
      }else{
        this.dataSource2=[];
        this.isLoading = false;
      }

    }, err => {
      this.eventService.openSnackBar(err, 'Dismiss');
      this.isLoading = false;
      this.dataSource2=[];
    })
  }
  getHolderNameAndSumAssured(data){
    data.forEach(singleInsuranceData => {
      if (singleInsuranceData.insurance && singleInsuranceData.insurance.insuredMembers.length > 0) {
        singleInsuranceData.displayHolderName = singleInsuranceData.insurance.insuredMembers[0].name;
        singleInsuranceData.displayHolderSumInsured = singleInsuranceData.insurance.insuredMembers[0].sumInsured;
        if (singleInsuranceData.insurance.insuredMembers.length > 1) {
          for (let i = 1; i < singleInsuranceData.insurance.insuredMembers.length; i++) {
            if (singleInsuranceData.insurance.insuredMembers[i].name) {
              const firstName = (singleInsuranceData.insurance.insuredMembers[i].name as string).split(' ')[0];
              singleInsuranceData.displayHolderName += ', ' + firstName;
              if(singleInsuranceData.insurance.insuredMembers[i].sumInsured){
                singleInsuranceData.insurance.insuredMembers[i].sumInsured = singleInsuranceData.insurance.insuredMembers[i].sumInsured.toString();
                const firstSumInsured = (singleInsuranceData.insurance.insuredMembers[i].sumInsured as string).split(' ')[0];
                singleInsuranceData.displayHolderSumInsured += ', ₹' + firstSumInsured;
              }else{
                singleInsuranceData.displayHolderSumInsured = 0;
              }
            }
          }
        }
      } else {
        singleInsuranceData.displayHolderName = this.getPolicyHolderName(singleInsuranceData.insurance);
        singleInsuranceData.displayHolderSumInsured = singleInsuranceData.insurance.sumInsuredIdv;
      }
    });
    return data;
  }
  getPolicyHolderName(data){
   let finalData =  this.familyMemberList.filter(item => item.familyMemberId === data.policyHolderId);
   return finalData[0].name
  }
  getOutput(value){
    this.showNewPolicy = false;
  }
  openExistingPolicy() {
    this.selectPolicy = ""
    console.log(this.selectPolicy)
    this.showExisting = true
    this.getReviewExistingPolicy();
  }
  addPolicy(event, element) {
    element.selected = event.checked;
    this.isChecked = event.checked
    if (this.isChecked) {
      this.needAnalysis.push(element.insurance.id)
      if(element.insurance.insuredMembers.length > 0){
        element.insurance.insuredMembers.forEach(ele => {
          this.ownerIds.push({
            'ownerId': !ele.familyMemberId ? this.clientId : ele.familyMemberId
          })
        });
      }else{
        this.ownerIds.push({
          'ownerId': element.insurance.policyHolderId
        })
      }

      this.ownerIds = [...new Map(this.ownerIds.map(item => [item.ownerId, item])).values()];
      this.showError = false;
    }
  }
  getGlobalDataInsurance() {
    const obj = {};
    this.custumService.getInsuranceGlobalData(obj).subscribe(
      data => {
        console.log(data),
          this.dislayList = data;
      }
    );
  }

  openNewPolicy(){
    this.newPolicyData = {
      data:null,
      insuranceTypeId: 2,
      insuranceSubTypeId: this.insuranceType,
      displayList: this.dislayList,
      showInsurance: this.showInsurance,
      inputData :this.inputData
    };
    this.showNewPolicy = true;
  //   const inputData = {
  //     data:null,
  //     insuranceTypeId: 2,
  //     insuranceSubTypeId: this.insuranceType,
  //     displayList: this.dislayList,
  //     showInsurance: this.showInsurance
  //   };
  //   const fragmentData = {
  //     flag: 'addInsurance',
  //     data: inputData,
  //     componentName: null,
  //     state: 'open'
  //   };
  //   switch (this.insuranceType) {
  //     case 5:
  //       fragmentData.componentName = AddHealthInsuranceAssetComponent;
  //       break;
  //     case 7:
  //       fragmentData.componentName = AddPersonalAccidentInAssetComponent;
  //       break;
  //     case 6:
  //       fragmentData.componentName = AddCriticalIllnessInAssetComponent;
  //       break;
  //     case 4:
  //       fragmentData.componentName = AddMotorInsuranceInAssetComponent;
  //       break;
  //     case 8:
  //       fragmentData.componentName = AddTravelInsuranceInAssetComponent;
  //       break;
  //     case 9:
  //       fragmentData.componentName = AddHomeInsuranceInAssetComponent;
  //       break;
  //     case 10:
  //       fragmentData.componentName = AddFireAndPerilsInsuranceInAssetComponent;
  //       break;
  //     default:
  //       fragmentData.componentName = AddInsuranceComponent;
  //       break;

  //   }
  //   const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
  //     sideBarData => {
  //       if (UtilService.isDialogClose(sideBarData)) {
  //         this.showExisting == false
  //         rightSideDataSub.unsubscribe();

  //       }
  //     }
  //   );
  // }
  }
  
  close(flag) {
    if(this.showNewPolicy){
      this.showNewPolicy = false;
    }else if (!this.showExisting) {
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag});
    } else if(this.inputData.flag == 'suggestExistingPolicy'){
      this.subInjectService.changeNewRightSliderState({ state: 'close',refreshRequired: flag});
    }else{
      this.showExisting = false;
    }
  }
  showHealthInsurance(input) {
    if (this.isChecked) {
      this.barButtonOptions2.active = true;
      let obj = {
        "planningList":
          JSON.stringify({
            "advisorId": this.advisorId,
            "clientId": this.clientId,
            "insuranceType": this.insuranceType,
            "owners": this.ownerIds
          }),
        "needAnalysis": JSON.stringify(this.needAnalysis)
      }

      this.planService.addGeneralInsurance(obj).subscribe(
        data => {
          if (data) {
            this.barButtonOptions2.active = false;
            this.subInjectService.changeNewRightSliderState({ state: 'close' });
            const fragmentData = {
              flag: 'app-customer',
              id: 1,
              data: input,
              direction: 'top',
              componentName: ShowHealthPlanningComponent,
              state: 'open'
            };
            fragmentData.data.id=data;
            const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
              upperSliderData => {
                if (UtilService.isDialogClose(upperSliderData)) {
                  // this.getClientSubscriptionList();
                  subscription.unsubscribe();
                }
              }
            );
          }
        },
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
        }
      );

    } else {
      // this.showError = true;
      this.eventService.openSnackBar('Please select at least one policy', 'OK');

    }
  }
  saveExistingPolicy(input){
    if (this.isChecked){
      this.barButtonOptions.active = true;
      const obj={
        "id":this.inputData.id,
        "insuranceIds": JSON.stringify(this.needAnalysis)
        }
        this.planService.updateCurrentPolicyGeneralInsurance(obj).subscribe(
          data => {
              this.barButtonOptions.active = false;
              this.subInjectService.changeNewRightSliderState({ state: 'close' ,refreshRequired: true});
          },
          err => {
            this.eventService.openSnackBar(err, 'Dismiss');
          }
        );
    }else{
      // this.showError = true;
      this.eventService.openSnackBar('Please select at least one policy', 'OK');

    }

  }
}


export interface PeriodicElement {

  position: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Rahul Jain' },
  { position: 'Shilpa Jain' },
  { position: 'Shreya Jain' },
  { position: 'Manu Jain' },

];
export interface PeriodicElement1 {

  position: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: 'Rahul Jain' },
  { position: 'Shilpa Jain' },
  { position: 'Shreya Jain' },
  { position: 'Manu Jain' },

];

export interface PeriodicElement2 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  sum: string;
  mname: string;
  advice: any;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    position: 'Apollo Munich Optima Restore', name: 'Individual', weight: '27,290',
    symbol: '38 Days', sum: '5,00,000', mname: 'Rahul Jain', advice: true
  },
  {
    position: 'Apollo Munich Optima Restore', name: 'Individual', weight: '27,290',
    symbol: '38 Days', sum: '5,00,000', mname: 'Rahul Jain', advice: true
  },
  {
    position: 'Apollo Munich Optima Restore', name: 'Individual', weight: '27,290',
    symbol: '38 Days', sum: '5,00,000', mname: 'Rahul Jain', advice: false
  },

];