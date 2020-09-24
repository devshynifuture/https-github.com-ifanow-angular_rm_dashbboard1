import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-add-life-insurance',
  templateUrl: './add-life-insurance.component.html',
  styleUrls: ['./add-life-insurance.component.scss']
})
export class AddLifeInsuranceComponent implements OnInit {
  displayedColumns: string[] = ['client', 'cat', 'des', 'checkbox'];
  dataSource: any = new MatTableDataSource();

  counter: number;
  isLoading = true;
  clientId: any;
  selectvalue;
  advisorId: any;
  data: Array<any> = [{}, {}, {}];
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };
  familyMemberSend: any;
  addplan = false;
  isLoadingLifeInsurance = true;

  constructor(
    private planService: PlanService,
    private eventService: EventService,
    private subInjectService: SubscriptionInject,
  ) {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
    this.getfamilyMemberInsurance()
    this.familyMemberSend = []
  }
  close(state,flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close',data:flag });
  }
  addInsurance(event, element) {
    console.log(element)
    console.log(event)
    element.selected = event.checked
    if (event.checked == true) {
      this.addplan = false;
      const obj={
        advisorId:this.advisorId,
        clientId:this.clientId,
        insuranceType:1,
        owners:[{
          'ownerId':element.familyMemberId
        }]
      }
      this.familyMemberSend.push(obj);
    } else {
      this.familyMemberSend.pop();
    }
    console.log('shgshgjhkf', this.familyMemberSend)
  }
  getfamilyMemberInsurance() {
    console.log('shgshgjhkf')
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.loader(1);
    this.isLoadingLifeInsurance = true;
    this.planService.getFamilyDetailsInsurance(obj).subscribe(
      data => this.getFamilyDetailsInsuranceRes(data),
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        this.isLoadingLifeInsurance = false;
        this.loader(-1);
      }
    );
  }
  getFamilyDetailsInsuranceRes(data) {
    this.loader(-1);
    this.isLoadingLifeInsurance = false;
    console.log('getFamilyDetailsInsuranceRes', data)
    this.dataSource = data
  }
  loader(increamenter) {
    this.counter += increamenter;
    if (this.counter == 0) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }
  saveInsurance() {
    let obj = this.familyMemberSend
    if(this.familyMemberSend.length > 0){
      this.loader(1);
      this.planService.addInsurance(obj).subscribe(
        data => this.addInsuranceRes(data),
        err => {
          this.eventService.openSnackBar(err, 'Dismiss');
          this.loader(-1);
        }
      );
    }else{
      this.addplan= true;
    }
  }
  addInsuranceRes(data) {
    this.close(false,true);
    console.log(data)
  }
}
export interface PeriodicElement {
  client: string;
  cat: string;
  des: string;
  value: string;
  advice: string;
  status: string;
  date: string;
  icons: string;
  selected: false
}

const ELEMENT_DATA: PeriodicElement[] = [
  { client: 'Rahul Jain', cat: 'Mutual Funds', selected: false, des: 'HDFC Equity fund - Regular plan - Growth option | 098098883', value: 'Rahul Jain', advice: 'STP 5,000/month to HDFC Dynamic bond fund regular plan monthly dividend', status: 'ACCEPTED', date: '05/09/2019', icons: '' },
];
