import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { SetupLumpsumDeploymentComponent } from './add-investment-plan/setup-lumpsum-deployment/setup-lumpsum-deployment.component';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { MatDialog } from '@angular/material';
import { ManageDeploymentComponent } from './manage-deployment/manage-deployment.component';
import { ManageExclusionsComponent } from './manage-exclusions/manage-exclusions.component';
import { EventService } from 'src/app/Data-service/event.service';
import { DeploymentDetailsComponent } from './deployment-details/deployment-details.component';
import { PlanService } from '../plan.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { element } from 'protractor';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-investments-plan',
  templateUrl: './deployments-plan.component.html',
  styleUrls: ['./deployments-plan.component.scss']
})
export class DeploymentsPlanComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'name', 'weight', 'height', 'symbol', 'debt', 'status', 'icons'];
  displayedColumns1: string[] = ['position1', 'name1', 'weight1', 'symbol1'];
  dataSource;
  dataSourceT;
  selectedTab = " Goal based";
  clientId: any;
  advisorId: any;
  selectedDeployments: any = [];
  type: number;
  viewMode: string;
  familyMemberList: any;
  selected = 0;
  constructor(private peopleService:PeopleService,private eventService: EventService, private subInjectService: SubscriptionInject, private cusService: CustomerService, public dialog: MatDialog, private planService: PlanService) { }
  isLoading = false;
  ngOnInit() {
    this.viewMode = "tab1";
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
    const obj =
    {
      clientId: this.clientId,
      advisorId: this.advisorId,
      familyMemberId: this.selected
    }
    this.cusService.getAdviceDeploymentsData(obj).subscribe(
      data => {
        console.log(data);
        this.isLoading = false;
        this.dataSource = (this.type == 1) ? data.GoalBaseDeploymentList : data.nonGoalBasedDeploymentList;
      },
      err => {
        this.eventService.openSnackBar("something went wrong", "Dismiss")
        this.dataSource=[];
      }
     
    )

  }
  changTab(data){
    this.selected = data.id
    this.getDeploymentData();
  }
  selectSingleDeployment(flag, value) {
    console.log(flag, value);
    (flag.checked) ? this.selectedDeployments.push({ id: value.id }) : this.selectedDeployments = this.selectedDeployments.filter(element => element.id != value.id);
    console.log(this.selectedDeployments)
  }
  openPopup(flagVlaue, singleDeployment) {
    let componentName;
    let dialogRef
    if (flagVlaue == "deployment") {
      componentName = ManageDeploymentComponent
      dialogRef = this.dialog.open(componentName, {
        width: '600px',
        height: '300px',
        data: singleDeployment
      });

    }
    else {
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
            this.eventService.openSnackBar("Deployment is deleted", "Dismiss");
            this.getDeploymentData();
            dialogRef.close();
          },
          error => this.eventService.showErrorMessage(error)
        )
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
      component = DeploymentDetailsComponent
      deploymentData = { data }
    }
    else {
      component = SetupLumpsumDeploymentComponent;
      deploymentData =
      {
        data: [],
        deploymentIdList: this.selectedDeployments
      }
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

