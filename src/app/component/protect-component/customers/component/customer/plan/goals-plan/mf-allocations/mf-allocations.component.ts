import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { DatePipe } from '@angular/common';
import { PlanService } from '../../plan.service';
import { AuthService } from 'src/app/auth-service/authService';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { LoaderFunction, UtilService, ValidatorType } from 'src/app/services/util.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { AddGoalService } from '../add-goal/add-goal.service';
import { Subscriber } from 'rxjs';
import { ReallocateAssetComponent } from '../reallocate-asset/reallocate-asset.component';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { RoleService } from 'src/app/auth-service/role.service';

@Component({
  selector: 'app-mf-allocations',
  templateUrl: './mf-allocations.component.html',
  styleUrls: ['./mf-allocations.component.scss'],
  providers: [LoaderFunction]
})
export class MfAllocationsComponent implements OnInit, OnDestroy {
  displayedColumns = ['position', 'name', 'weight'];
  dataSource = [];
  displayedColumns1 = ['scheme', 'value', 'goal', 'icons'];
  dataSource1 = new MatTableDataSource([]);

  @Input() data: any = {};
  advisorId;
  clientId;
  mfList: any[] = [];
  familyList: any[] = [];

  schemeFilterValue = 'all';
  folioFilterValue = 'non-zero';
  assetFilterValue = 'all';
  selectedFamFilter = 'all';
  advisor_client_id: any = {
    advisorId: '',
    clientId: ''
  }
  subscriber = new Subscriber();

  isFamilyObj = (index, item) => item.isFamily;
  selectedAllocation: any;
  // refreshObservable = new Subject();
  // refreshAssetList = new Subject();
  validatorType = ValidatorType;
  showEditMf: boolean = false;
  absSIP: number;
  absLumsum: any;
  disableAllocate: boolean = false;
  equity_monthly: any;
  debt_monthly: any;
  lump_equity: any;
  lump_debt: any;
  selectedGoal: any;
  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private datePipe: DatePipe,
    private planService: PlanService,
    private peopleService: PeopleService,
    private utilService: UtilService,
    public loaderFn: LoaderFunction,
    private allocationService: AddGoalService,
    private allocateOtherAssetService: AddGoalService,
    private dialog: MatDialog,
    public roleService: RoleService
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.advisor_client_id.advisorId = AuthService.getAdvisorId();
    this.advisor_client_id.clientId = AuthService.getClientId();
  }


  ngOnInit() {
    this.loaderFn.setFunctionToExeOnZero(this, this.filterAssets);
    this.initializeRequiredTable();
    this.getFamilyMembersList();
    this.loadMFData();
    this.subscriber.add(
      this.allocationService.refreshObservable.subscribe(() => {
        this.loadMFData();
      })
    );
  }

  initializeRequiredTable() {
    let required = this.data.dashboardData;
    let tableSource = [];
    // logic for saving status
    tableSource.push({
      name: 'Lumpsum',
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
  reallocateAsset(allocation, allo) {
    this.data.goalAssetAllocation.forEach(element => {
      allocation.goalAssetMapping.forEach(element1 => {
        if (element.id == element1.id) {
          this.selectedAllocation = element
          this.showEditMf = true
        }
      });
    });
    const dialogData = {
      goalData: this.data,
      allocationData: this.selectedAllocation,
      allocation: allocation,
      allocated: allo,
    }
    this.dialog.open(ReallocateAssetComponent, {
      width: '600px',

      data: dialogData,
      autoFocus: false,
    });
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
  loadMFData() {
    this.loaderFn.increaseCounter();
    this.planService.getMFList({ advisorId: this.advisorId, clientId: this.clientId }).subscribe(res => {
      this.mfList = res.mfData;
      res.goalList.forEach(element => {
        if (element.goalId == this.data.remainingData.id) {
          this.selectedGoal = element
        }
      });
      this.equity_monthly = this.getSumOfJsonMap(this.selectedGoal.sipAmountEquity) || 0;
      this.debt_monthly = this.getSumOfJsonMap(this.selectedGoal.sipAmountDebt) || 0;
      this.lump_equity = this.getSumOfJsonMap(this.selectedGoal.lumpSumAmountEquity) || 0;
      this.lump_debt = this.getSumOfJsonMap(this.selectedGoal.lumpSumAmountDebt) || 0;
      if (this.equity_monthly == 0 && this.lump_equity != 0) {
        this.equity_monthly = 'N/A'
      }
      if (this.debt_monthly == 0 && this.lump_debt != 0) {
        this.debt_monthly = 'N/A'
      }
      this.mfList = this.mfList.map(mf => {
        let absAllocation = 0;
        let absSIP = 0;
        let absLumsum = 0;
        if (mf.goalAssetMapping.length > 0) {
          mf.goalAssetMapping.forEach(element => {
            element.lumpsumPercent = (element.lumpsumPercent).toFixed(2)
            element.sipPercent = (element.sipPercent).toFixed(2)
            absAllocation += element.percentAllocated;
            absSIP += element.sipPercent;
            absLumsum += element.lumpsumPercent
            element.remainSIP = 0
            element.remainLumsum = 0
          });
          this.data.goalAssetAllocation.forEach(element => {
            mf.goalAssetMapping.forEach(element1 => {
              if (element.id == element1.id) {
                element1.disable = false
              } else if (element.remainLumsum == 0 || element.remainSIP) {
                element1.disable = false
              } else {
                element1.disable = true
              }
            });
          });
        }
        absSIP = 100 - absSIP
        absLumsum = 100 - absLumsum


        return { absAllocation, ...mf, absSIP, ...mf, absLumsum, ...mf };
      })

      this.loaderFn.decreaseCounter();
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
      this.loaderFn.decreaseCounter();
    })

  }

  filterAssets() {
    let tableSource = [];
    let family = [];
    if (this.selectedFamFilter == "'all'") {
      this.selectedFamFilter = 'all'
    }
    if (this.selectedFamFilter == 'all') {
      family = this.familyList;
    } else {
      family = this.familyList.filter(fam => fam.id == this.selectedFamFilter);
    }

    let mfList = [];
    mfList = this.filterByFolio(this.mfList);
    mfList = this.filterByScheme(mfList);
    mfList = this.filterByAssetType(mfList);

    if (family.length > 0 && mfList.length > 0) {
      family.forEach(fam => {
        tableSource.push({ isFamily: true, ...fam });
        tableSource.push(mfList.filter(mf => mf.familyMemberId == fam.familyMemberId).map(mf => { return { isFamily: false, ...mf } }));
      })
      tableSource = tableSource.flat();
    }

    this.dataSource1.data = tableSource;
    console.log('this.dataSource1.data', this.dataSource1.data)
  }

  filterByFolio(mfList: Array<any>) {
    switch (this.folioFilterValue) {
      case 'all':
        return mfList;
      case 'zero':
        return mfList.filter(mf => mf.balanceUnit == 0);
      case 'non-zero':
        return mfList.filter(mf => mf.balanceUnit > 0);
    }
  }

  filterByScheme(mfList: Array<any>) {
    switch (this.schemeFilterValue) {
      case 'all':
        return mfList;
      case 'unallocated':
        return mfList.filter(mf => mf.absAllocation == 0);
      case 'allocated':
        return mfList.filter(mf => mf.absAllocation > 0);
    }
  }

  filterByAssetType(mfList: Array<any>) {
    switch (this.assetFilterValue) {
      case 'all':
        return mfList;
      case 'equity':
        return mfList.filter(mf => mf.categoryName == 'EQUITY');
      case 'debt':
        // TODO:- check if this filter works properly
        return mfList.filter(mf => mf.categoryName == 'DEBT');
    }
  }

  allocateAssetToGoal(data) {

    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      goalId: this.data.remainingData.id,
      mfId: data.id,
      sipPercent: data.sipPercent,
      lumpsumPercent: 100 - data.goalAssetMapping[0].allocatedToOtherGoal,
    }
    this.disableAllocate = true
    if (this.data.remainingData.freezed == true) {
      this.Unfreezed()
    } else {
      this.allocationService.allocateMFToGoal(data, { advisorId: this.advisorId, clientId: this.clientId }, this.data);
      this.disableAllocate = false
    }
  }
  Unfreezed() {
    const dialogData = {
      header: 'UNFREEZE GOAL',
      body: 'You have frozen the calculations for additional savings required. Allocating an asset will unfreeze the calculations. Are you sure you want to unfreeze?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'UNFREEZE',
      positiveMethod: () => {
        let obj = {
          lumpSumAmountDebt: this.data.remainingData.lumpSumAmountDebt,
          lumpSumAmountEquity: this.data.remainingData.lumpSumAmountEquity,
          id: this.data.remainingData.id,
          goalType: this.data.goalType,
          freezed: false,
        }
        this.planService.freezCalculation(obj).subscribe(res => {
          //this.allocateOtherAssetService.refreshAssetList.next();
          this.loadMFData();
          this.eventService.openSnackBar("Goal unfreeze successfully");
          dialogRef.close();
        }, err => {
          this.eventService.openSnackBar(err);
        })
      }
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
    });
  }
  restrictFrom100(event, ele, mf, flag) {
    let add = 0
    if (event.target.value == "") {
      event.target.value = 0
    }
    mf.forEach(element => {
      if (flag == 'sip') {
        add += element.sipPercent
        if ((100 - add) >= parseInt(event.target.value)) {
          return parseInt(event.target.value);
        } else if ((100 - add) == 0) {
          let temp = 100 - add
          console.log('temp', temp)
          return event.target.value = temp
        } else {
          return event.target.value = 100 - add;
        }

      } else if (flag == 'lumpsum') {
        add += element.lumpsumPercent
        if ((100 - add) >= parseInt(event.target.value)) {
          return parseInt(event.target.value);
        } else if ((100 - add) == 0) {
          return event.target.value = 0
        } else {
          return event.target.value = 100 - add;
        }
      }
    });
  }

  removeAllocation(allocation, allocatedGoal) {
    if (!allocatedGoal.dashboardData) {
      allocatedGoal.dashboardData = {}
      allocatedGoal.dashboardData = this.data.dashboardData;

    }
    const dialogData = {
      header: 'UNALLOCATE MF',
      body: 'Are you sure you want to remove allocation?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'UNALLOCATE',
      positiveMethod: () => {
        let obj = {
          ...this.advisor_client_id,
          id: allocatedGoal.id,
          assetId: allocatedGoal.assetId,
          assetType: allocatedGoal.assetType,
          goalId: this.data.remainingData.id,
          goalType: allocatedGoal.goalType,
          percentAllocated: 0
        }
        this.allocationService.allocateOtherAssetToGoalRm(obj, 'mf');
        dialogRef.close()
      }
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
    });
  }


  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshObservable: flag });
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }
}
