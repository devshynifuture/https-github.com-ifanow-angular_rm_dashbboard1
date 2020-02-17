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

@Component({
  selector: 'app-investments-plan',
  templateUrl: './deployments-plan.component.html',
  styleUrls: ['./deployments-plan.component.scss']
})
export class DeploymentsPlanComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'position', 'name', 'weight', 'height', 'symbol', 'debt', 'status', 'icons'];
  dataSource;
  clientId: any;
  advisorId: any;
  constructor(private eventService: EventService, private subInjectService: SubscriptionInject, private cusService: CustomerService, public dialog: MatDialog, private planService: PlanService) { }
  isLoading = false;
  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.advisorId = AuthService.getAdvisorId();
    this.getDeploymentData();
  }
  getDeploymentData() {
    this.isLoading = true;
    this.dataSource = [{}, {}, {}];
    const obj =
    {
      clientId: this.clientId,
      advisorId: this.advisorId,
      familyMemberId: 9
    }
    this.cusService.getAdviceDeploymentsData(obj).subscribe(
      data => {
        console.log(data);
        this.isLoading = false;
        this.dataSource = data[0];
      },
      err => this.eventService.openSnackBar("something went wrong", "dismiss")
    )

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
    });

  }
  deleteDeployment(deleteData) {
    const dialogData = {
      data: deleteData,
      header: 'DELETE DEPLOYMENT',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deletePPF(deleteData.id).subscribe(
          data => {
            this.eventService.openSnackBar("Deployment is deleted", "dismiss")
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
    let component;
    component = (flagValue == 'open') ? component = DeploymentDetailsComponent : component = SetupLumpsumDeploymentComponent;
    const fragmentData = {
      id: 1,
      data,
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

