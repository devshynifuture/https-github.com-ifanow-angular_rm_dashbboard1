import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SubscriptionInject } from '../../AdviserComponent/Subscriptions/subscription-inject.service';
import { SupportService } from '../support.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { IfasDetailsComponent } from '../my-ifas/ifas-details/ifas-details.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReplaceUserComponent } from '../../common-component/replace-user/replace-user.component';
import { AdminDetailsComponent } from '../ifa-onboarding/admin-details/admin-details.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-support-management',
  templateUrl: './support-management.component.html',
  styleUrls: ['./support-management.component.scss']
})
export class SupportManagementComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private subInjectService: SubscriptionInject,
    private supportService: SupportService,
    private eventService: EventService,
    public utilsService: UtilService,
    private fb:FormBuilder,
    private dialog: MatDialog,
  ) { }

  dataSource = new MatTableDataSource([{}, {}, {}]);
  displayedColumns = ['adminName', 'email', 'mobile', 'plan', 'nextBilling', 'menu']
  rmList:any[] = [];
  addRmFG:FormGroup;
  validatorType = ValidatorType;
  listenToObservable = true;
  isLoading = false;
  subscription = new Subscription();

  ngOnInit() {
    this.utilsService.loader(0);
    this.dataSource.sort = this.sort;
    this.getUnmappedAdvisors();
    this.getRMList();
    this.createRMFG();
    this.subscription.add(
      this.utilsService.isLoadingObservable.subscribe(v => {
        if(this.listenToObservable)
          this.isLoading = v
      })
    );
  }

  createRMFG(){
    this.addRmFG = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(40)]]
    });
  }

  addRMMember(){
    if(this.addRmFG.invalid) {
      this.addRmFG.markAllAsTouched();
    } else {
      let jsonObj = this.addRmFG.value;
      jsonObj.mobileNo = parseInt(jsonObj.mobileNo);
      this.supportService.addRm(jsonObj).subscribe(
        res => {
          this.getRMList();
          this.eventService.openSnackBar("RM added successfully", "Dismiss");
        },
        err => {
          this.eventService.openSnackBar(err, "Dismiss")
        }
      )
    }
  }

  getUnmappedAdvisors() {
    this.utilsService.loader(1);
    this.supportService.getUnmappedAdvisors().subscribe(
      data => {
        this.dataSource.data = data || [];
        this.utilsService.loader(-1);
      },
      err => {
        this.utilsService.loader(-1);
        this.eventService.openSnackBar(err, "Dismiss")
      }
    )
  }

  getRMList(){
    this.utilsService.loader(1);
    this.supportService.getRMList().subscribe(
      res => {
        this.rmList = res;
        this.utilsService.loader(-1);
      },
      err => {
        this.utilsService.loader(-1);
        this.eventService.openSnackBar(err, "Dismiss");
      }
    )
  }

  openAdminDetails(data) {
    data.adminAdvisorId = data.advisorId;
    this.listenToObservable = false;
    const fragmentData = {
      flag: null,
      data,
      id: 1,
      state: 'open',
      componentName: AdminDetailsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          this.listenToObservable = true;
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  mapToRM(user) {
    const dialogData = {
      header: 'MAP RM',
      body: 'Select RM you want to map to',
      // body2: 'This cannot be undone.',
      userList: this.rmList,
      selectKey: 'id',
      optionKey: 'name',
      btnNo: 'CANCEL',
      btnYes: 'MAP',
    };
    const dialog = this.dialog.open(ReplaceUserComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.utilsService.loader(1);
        const mapObj = {
          advisorId: user.advisorId,
          rmId: result,
        };
        console.log(mapObj);
        this.supportService.mapAdvisors(mapObj).subscribe(res => {
          this.eventService.openSnackBar('Advisor mapped to RM successfully', "Dismiss");
          this.getRMList();
          this.getUnmappedAdvisors();
          this.utilsService.loader(-1);
        }, err => {
          this.utilsService.loader(-1);
          this.eventService.openSnackBar(err, "Dismiss");
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}