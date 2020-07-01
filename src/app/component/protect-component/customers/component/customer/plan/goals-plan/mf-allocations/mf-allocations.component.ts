import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PlanService } from '../../plan.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AuthService } from 'src/app/auth-service/authService';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { UtilService, LoaderFunction } from 'src/app/services/util.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-mf-allocations',
  templateUrl: './mf-allocations.component.html',
  styleUrls: ['./mf-allocations.component.scss'],
  providers: [LoaderFunction]
})
export class MfAllocationsComponent implements OnInit {
  displayedColumns = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
  displayedColumns1 = ['scheme', 'value', 'goal', 'allocation','icons'];
  dataSource1 = new MatTableDataSource([]);

  @Input() data = {};
  advisorId;
  clientId;
  mfList:any[] = [];
  familyList:any[] = [];
  
  schemeFilterValue = 'all';
  folioFilterValue = 'all';
  assetFilterValue = 'all';
  selectedFamFilter = 'all';

  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private datePipe: DatePipe,
    private planService: PlanService,
    private peopleService: PeopleService,
    private utilService: UtilService,
    public loaderFn: LoaderFunction,
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }

  ngOnInit() {
    this.loaderFn.setFunctionToExeOnZero(this.filterAssets);
    this.getFamilyMembersList();
    this.loadMFData();
  }

  getFamilyMembersList() {
    const obj = {
      clientId: this.clientId,
    };
    this.loaderFn.increaseCounter();
    this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
      data => {
        if (data && data.length > 0) {
          this.familyList = data;
        } else {
          this.familyList = [];
        }
        this.familyList = this.familyList.map(fam => {
          return {
            ...fam,
            relationshipId: fam.familyMemberType
          }
        })
        this.familyList = this.familyList.sort((a, b) => {
          return a.relationshipId - b.relationshipId;
        });
        this.familyList = this.utilService.calculateAgeFromCurrentDate(this.familyList);
        this.loaderFn.decreaseCounter();
      },
      err => {
        this.familyList = [];
        this.eventService.openSnackBar(err, "Dismiss")
        this.loaderFn.decreaseCounter();
        console.error(err);
      }
    );
  }

  loadMFData(){
    this.loaderFn.increaseCounter();
    this.planService.getMFList({advisorId: 5422, clientId: 101056}).subscribe(res => {
      this.mfList = res;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
      this.loaderFn.decreaseCounter();
    })
  }

  createMFTable(){
    let tableSource = [];
    if(this.familyList.length > 0 && this.mfList.length > 0) {
      this.familyList = this.familyList.filter(fam => this.mfList.map(mf => mf.mfFamId).includes(fam.id));
      this.familyList.forEach(fam => {
        tableSource.push({isFamily: true, ...fam});
        tableSource.push(this.mfList.filter(mf => mf.famId == fam.id).map(mf => {return {isFamily: false, ...mf}}));
      })

      tableSource.flat();
    }
    
    this.dataSource1.data = tableSource;
  }

  
  filterAssets(){
    console.log('I got executed');
    if(this.schemeFilterValue == 'all') {
      
    } else {
      
    }
  }

  filterByFamily(){

  }

  close() {
    // this.addMoreFlag = false;
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
  
}

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'Lumpsum', name: '4,55,814', weight: '1,20,529'},
  {position: 'Monthly', name: '35,907', weight: '12,835'},
  
];

export interface PeriodicElement1 {
  scheme: string;
  value: string;
  goal: string;
  allocation:string
  
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {scheme: 'DSP Tax Saver Fund - Regular Plan Growth | Large cap', value: '4,000', goal: 'Rahul’s retirement',allocation:'80%'},
  {scheme: 'DSP Tax Saver Fund - Regular Plan Growth | Large cap | [SIP]', value: '4,000', goal: 'Aryan’s higher education',allocation:'80%'},
  {scheme: 'Aditya birla sun life low duration fund | Low Duration', value: '4,000', goal: 'Aryan’s higher education',allocation:'80%'},
  {scheme: 'Mirae Equity Fund - Regular Plan - Growth | Diversified', value: '4,000', goal: '-',allocation:'80%'},
  {scheme: 'HDFC Balanced Advantage fund Aggressive - Growth	| Multi cap', value: '4,000', goal: 'Shreya’s marriage',allocation:'80%'},
  {scheme: 'Mirae Equity Fund - Regular Plan - Growth | Diversified', value: '4,000', goal: '-',allocation:'80%'},
  {scheme: 'HDFC Equity Fund - Regular Plan - Growth | ELSS | [SIP]', value: '4,000', goal: '-',allocation:'80%'},
  
];

const e = {
  totalAllocation: 80,
  goalsAllocated: [{
    goalName: 'abc',
    allocation: 20,
    allocationId: 123
  }, {
    goalName: 'def',
    allocation: 60,
    allocationId: 234
  }]
}