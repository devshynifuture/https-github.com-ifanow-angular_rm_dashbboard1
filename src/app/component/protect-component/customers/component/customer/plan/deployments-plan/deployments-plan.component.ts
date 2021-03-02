import {Component, OnInit} from '@angular/core';
import {UtilService} from 'src/app/services/util.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {SetupLumpsumDeploymentComponent} from './add-investment-plan/setup-lumpsum-deployment/setup-lumpsum-deployment.component';
import {AuthService} from 'src/app/auth-service/authService';
import {CustomerService} from '../../customer.service';
import {MatDialog} from '@angular/material';
import {ManageDeploymentComponent} from './manage-deployment/manage-deployment.component';
import {ManageExclusionsComponent} from './manage-exclusions/manage-exclusions.component';
import {EventService} from 'src/app/Data-service/event.service';
import {DeploymentDetailsComponent} from './deployment-details/deployment-details.component';
import {PlanService} from '../plan.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {PeopleService} from 'src/app/component/protect-component/PeopleComponent/people.service';
import {RoleService} from 'src/app/auth-service/role.service';
import {forkJoin, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-investments-plan',
  templateUrl: './deployments-plan.component.html',
  styleUrls: ['./deployments-plan.component.scss']
})
export class DeploymentsPlanComponent implements OnInit {
  // displayedColumns: string[] = ['checkbox', 'assetDescription', 'name', 'weight', 'height', 'symbol', 'debt', 'status', 'icons'];
  displayedColumns: string[] = ['checkbox', 'assetDescription', 'name', 'weight', 'height', 'symbol', 'debt', 'status'];
  displayedColumns1: string[] = ['position1', 'name1', 'weight1', 'symbol1'];
  dataSource;
  dataSourceT;
  selectedTab = ' Goal based';
  clientId: any;
  advisorId: any;
  selectedDeployments: any = [];
  type: number;
  viewMode: string;
  familyMemberList: any;
  selected = 0;
  deploymentCapabilityList: any = {};

  constructor(private peopleService: PeopleService, private eventService: EventService, private subInjectService: SubscriptionInject,
              private cusService: CustomerService, public dialog: MatDialog, private planService: PlanService,
              public roleService: RoleService) {
  }

  isLoading = false;

  ngOnInit() {
    this.deploymentCapabilityList = this.roleService.activityPermission.subModule.deployments.capabilityList;
    this.viewMode = 'tab1';
    this.type = 1;
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    this.getFamilyMemberList();
  }

  getFamilyMemberList() {
    this.isLoading = true;
    this.dataSource = [{}, {}, {}];
    const obj = {
      clientId: this.clientId
    };
    this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
      data => {
        console.log(data);
        this.familyMemberList = data;
        this.getDeploymentData();
      }
    );
  }

  getDeploymentData() {
    this.isLoading = true;
    this.dataSource = [{}, {}, {}];
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
      familyMemberId: this.selected
    };
    const obj2 = {
      clientId: this.clientId,
      advisorId: this.advisorId,
    };
    const deployment = this.cusService.getAdviceDeploymentsData(obj).pipe(
      catchError(error => of(null))
    );
    const otherAssets = this.planService.getAssetsForAllocation(obj2).pipe(
      catchError(error => of(null))
    );
    forkJoin(deployment, otherAssets).subscribe(result => {
      this.isLoading = false;
      if (result[0] && result[1]) {
        this.getAssetType(result);
        this.dataSource = (this.type == 1) ? result[0].GoalBaseDeploymentList : result[0].nonGoalBasedDeploymentList;
      } else {
        this.dataSource = [];
      }

    }, err => {
      this.eventService.showErrorMessage(err);
      this.dataSource = [];
    });

  }

  getAssetType(data) {
    if (data[0] && data[1]) {
      const mergeArray = [...data[0].GoalBaseDeploymentList, ...data[0].nonGoalBasedDeploymentList];
      mergeArray.forEach(element => {
        data[1].forEach(ele => {
          if (element.assetId == ele.assetId) {
            element.assetName = ele.assetName;
          }
        });
      });
    }
  }

  changTab(data) {
    this.selected = data.id;
    this.getDeploymentData();
  }

  selectSingleDeployment(flag, value) {
    console.log(flag, value);
    (flag.checked) ? this.selectedDeployments.push({id: value.id}) : this.selectedDeployments = this.selectedDeployments.filter(element => element.id != value.id);
    console.log(this.selectedDeployments);
  }

  openPopup(flagVlaue, singleDeployment) {
    let componentName;
    let dialogRef;
    if (flagVlaue == 'deployment') {
      componentName = ManageDeploymentComponent;
      dialogRef = this.dialog.open(componentName, {
        width: '600px',
        height: '300px',
        data: singleDeployment
      });

    } else {
      componentName = ManageExclusionsComponent;
      dialogRef = this.dialog.open(componentName, {
        width: '600px',
        height: '300px',
        data: singleDeployment
      });

    }

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result.isRefreshRequired) {
        this.getDeploymentData();
      }
    });

  }

  deleteDeployment(deleteData, flag) {
    const dialogData = {
      data: flag,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.planService.deleteDeployment(deleteData.id).subscribe(
          data => {
            this.eventService.openSnackBar('Deployment is deleted', 'Dismiss');
            this.getDeploymentData();
            dialogRef.close();
          },
          error => this.eventService.showErrorMessage(error)
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

  openDep(flagValue, data) {
    let component, deploymentData;
    if (flagValue == 'open') {
      component = DeploymentDetailsComponent;
      deploymentData = {data};
    } else {
      component = SetupLumpsumDeploymentComponent;
      deploymentData = {
        data: [],
        deploymentIdList: this.selectedDeployments
      };
      this.dataSource.forEach(singleElement => {
        if (singleElement.selected) {
          deploymentData.data.push(singleElement);
        }
      });
    }
    const fragmentData = {
      id: 1,
      data: deploymentData,
      state: flagValue,
      componentName: component
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }


}

