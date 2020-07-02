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
  dataSource = [];
  displayedColumns1 = ['scheme', 'value', 'goal','icons'];
  dataSource1 = new MatTableDataSource([]);

  @Input() data:any = {};
  advisorId;
  clientId;
  mfList:any[] = [];
  familyList:any[] = [];
  
  schemeFilterValue = 'all';
  folioFilterValue = 'all';
  assetFilterValue = 'all';
  selectedFamFilter = 'all';

  isFamilyObj = (index, item) => item.isFamily;

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
    this.loaderFn.setFunctionToExeOnZero(this, this.filterAssets);
    this.initializeRequiredTable();
    this.getFamilyMembersList();
    this.loadMFData();
  }

  initializeRequiredTable(){
    let required = this.data.dashboardData;
    let tableSource = [];
    // logic for saving status
    tableSource.push({
      name: 'LumpSum',
      equity: required.lump_equity,
      debt: required.lump_debt
    })

    tableSource.push({
      name: 'Monthly',
      equity: required.equity_monthly,
      debt: required.debt_monthly
    })

    this.dataSource = tableSource;
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
    this.planService.getMFList({advisorId: this.advisorId, clientId: this.clientId}).subscribe(res => {
      this.mfList = res;
      this.mfList = this.mfList.map(mf => {
        let absAllocation = 0;
        if(mf.goalAssetMapping.length > 0) {
          mf.goalAssetMapping.forEach(element => {
            absAllocation += element.percentAllocated;
          });
        }
        return {absAllocation, ...mf};
      })
      this.loaderFn.decreaseCounter();
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
      this.loaderFn.decreaseCounter();
    })
  }
  
  filterAssets(){
    let tableSource = [];
    let family = [];

    if(this.selectedFamFilter == 'all') {
      family = this.familyList;
    } else {
      family = this.familyList.filter(fam => fam.id == this.selectedFamFilter);
    }

    let mfList = [];
    mfList = this.filterByFolio(this.mfList);
    mfList = this.filterByScheme(mfList);
    mfList = this.filterByAssetType(mfList);

    if(family.length > 0 && mfList.length > 0) {
      family.forEach(fam => {
        tableSource.push({isFamily: true, ...fam});
        tableSource.push(mfList.filter(mf => mf.familyMemberId == fam.familyMemberId).map(mf => {return {isFamily: false, ...mf}}));
      })
      tableSource = tableSource.flat();
    }

    this.dataSource1.data = tableSource;
  }

  filterByFolio(mfList:Array<any>){
    switch(this.folioFilterValue) {
      case 'all':
        return mfList;
      case 'zero':
        return mfList.filter(mf => mf.balanceUnit == 0);
      case 'non-zero':
        return mfList.filter(mf => mf.balanceUnit > 0);
    }
  }

  filterByScheme(mfList:Array<any>){
    switch(this.schemeFilterValue) {
      case 'all':
        return mfList;
      case 'unallocated':
        return mfList.filter(mf => mf.absAllocation == 0);
      case 'allocated':
        return mfList.filter(mf => mf.absAllocation > 0);
    }
  }

  filterByAssetType(mfList:Array<any>){
    switch(this.assetFilterValue) {
      case 'all':
        return mfList;
      case 'equity':
        return mfList.filter(mf => mf.categoryName == 'EQUITY');
      case 'debt':
        // TODO:- check if this filter works properly
        return mfList.filter(mf => mf.categoryName == 'DEBT');
    }
  }

  allocateAssetToGoal(data){
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      goalId: this.data.remainingData.id,
      mfId: data.id
    }
    // this.planService.allocateMFtoGoal(data).subscribe(res => {
    //   this.eventService.openSnackBar("Asset allocated", "Dismiss");
    // }, err => {
    //   this.eventService.openSnackBar(err, "Dismiss");
    // })
  }


  removeFromAllocation(data, goal){
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      goalId: goal.id,
      mfId: data.id
    }
    // this.planService.allocateMFtoGoal(data).subscribe(res => {
    //   this.eventService.openSnackBar("Asset allocated", "Dismiss");
    // }, err => {
    //   this.eventService.openSnackBar(err, "Dismiss");
    // })
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}