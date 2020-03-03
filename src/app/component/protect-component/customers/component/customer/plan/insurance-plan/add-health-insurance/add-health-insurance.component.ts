import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HelthInsurancePolicyComponent } from '../add-insurance-planning/helth-insurance-policy/helth-insurance-policy.component';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { ShowHealthPlanningComponent } from '../show-health-planning/show-health-planning.component';
import { AddInsuranceUpperComponent } from '../add-insurance-upper/add-insurance-upper.component';

@Component({
  selector: 'app-add-health-insurance',
  templateUrl: './add-health-insurance.component.html',
  styleUrls: ['./add-health-insurance.component.scss']
})

export class AddHealthInsuranceComponent implements OnInit {
  inputData: any;
  showInsurance: { value: string; header: string; heading: string; subHeading: string; };

  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }

  displayedColumns2: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'sum', 'mname', 'advice'];
  dataSource2 = ELEMENT_DATA2;
  showExisting = false;

  insuranceData = [{
    value:'1',
    header: 'ADD HEALTH INSURANCE',
    logo:'/assets/images/svg/helth-insurance.svg',
    heading: 'Health insurance',
    subHeading: 'Select how you’d like to proceed with planning for health insurance policies.'
  }, {
    value:'2',
     logo:'/assets/images/svg/Criticalillness.svg',
    header: 'ADD CRITICAL ILLNESS',
    heading: 'Critical illness',
    subHeading: 'Select how you’d like to proceed with planning for critical insurance policies.'
  },{
    value:'3',
     logo:'/assets/images/svg/Cancercare.svg',
    header: 'ADD CANCER CARE',
    heading: 'Cancer care',
    subHeading: 'Select how you’d like to proceed with planning for cancer insurance policies.'
  },{
    value:'4',
     logo:'/assets/images/svg/Personalaccident.svg',
    header: 'ADD PERSONAL ACCIDENT',
    heading: 'Personal accident',
    subHeading: 'Select how you’d like to proceed with planning for personal insurance policies.'
  },{
    value:'5',
     logo:'/assets/images/svg/Householders.svg',
    header: 'ADD HOUSEHOLDERS',
    heading: 'Householders',
    subHeading: 'Select how you’d like to proceed with planning for householders insurance policies.'
  },{
    value:'6',
     logo:'/assets/images/svg/Fireinsurance.svg',
    header: 'ADD FIRE INSURANCE',
    heading: 'Fire insurance',
    subHeading: 'Select how you’d like to proceed with planning for fire insurance policies.'
  },]

  constructor(public dialog: MatDialog, private subInjectService: SubscriptionInject, private custumService: CustomerService, private utils: UtilService, private eventService: EventService) { }
  openDialog(data): void {
    const dialogRef = this.dialog.open(HelthInsurancePolicyComponent, {
      width: '780px',
      height: '600px',
      data: { data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  ngOnInit() {
    console.log('get policy =',this.inputData)
    this.insuranceData.forEach(element => {
      if(element.value == this.inputData.value){
        this.showInsurance = element
      }
      console.log('selected insurance',this.showInsurance)
      if(this.inputData.showExisting != undefined){
        this.showExisting = this.inputData.showExisting;
      }
    });
  }
  openExistingPolicy() {
    this.showExisting = true
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  showHealthInsurance(data) {
    this.close();
    const fragmentData = {
      flag: 'app-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: ShowHealthPlanningComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
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
  advice: string;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    position: 'Apollo Munich Optima Restore', name: 'Individual', weight: '27,290',
    symbol: '38 Days', sum: '5,00,000', mname: 'Rahul Jain', advice: 'Port to another policy'
  },

];