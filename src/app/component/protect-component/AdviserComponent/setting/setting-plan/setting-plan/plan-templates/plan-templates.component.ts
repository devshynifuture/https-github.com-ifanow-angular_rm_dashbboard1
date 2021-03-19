import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { SettingsService } from '../../../settings.service';
import { AddNewTemplateComponent } from './add-new-template/add-new-template.component';
import { AuthService } from 'src/app/auth-service/authService';
import { PreviewFinPlanComponent } from 'src/app/component/protect-component/customers/component/customer/plan/profile-plan/preview-fin-plan/preview-fin-plan.component';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-plan-templates',
  templateUrl: './plan-templates.component.html',
  styleUrls: ['./plan-templates.component.scss']
})
export class PlanTemplatesComponent implements OnInit {
  fincialPlanList: any;
  quotes: any;
  miscellaneous: any;
  element: any;
  isLoading: boolean = false;

  constructor(private subInjectService: SubscriptionInject,
    private settingsService: SettingsService,
    private eventService: EventService,
    private dialog: MatDialog,
    private SettingsService: SettingsService,
    protected subinject: SubscriptionInject) { }

  ngOnInit() {
    this.getTemplateList()
  }
  getTemplateList() {
    this.isLoading = true
    const obj = {
      advisorId: AuthService.getAdvisorId(),
    };
    this.SettingsService.getTemplateList(obj).subscribe(
      res => {
        this.getTemplateListResponse(res);
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
  setVisibility(flag, item) {
    let obj = {
      id: item.id,
      isVisible: flag
    }
    this.SettingsService.setVisibilityTemplate(obj).subscribe(
      res => {
        if (flag == true) {
          this.eventService.openSnackBar('Template is visible in Financial Plan', 'Dismiss');
        } else {
          this.eventService.openSnackBar('Template is not visible in Financial Plan', 'Dismiss');
        }
        this.getTemplateList()
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
  getPreview(element) {

    const dialogRef = this.dialog.open(PreviewFinPlanComponent, {
      width: '600px',
      // height: '798px',
      data: { bank: element, selectedElement: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return
      }
      console.log('The dialog was closed');
      this.element = result;
      console.log('result -==', this.element)
    });
  }

  deleteTemplate(item) {
    let obj = {
      id: item.id,
    }
    const dialogData = {
      data: 'TEMPLATE',
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.SettingsService.deleteTemplate(obj).subscribe(
          res => {
            dialogRef.close();
            this.eventService.openSnackBar('Template is deleted Successfully', 'Dismiss');
            this.getTemplateList()
          },
          err => {
            this.eventService.openSnackBar(err, 'Dismiss');
          }
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
  resetTemplate(item) {
    let obj = {
      id: item.id,
    }
    this.SettingsService.resetTemplate(obj).subscribe(
      res => {
        this.eventService.openSnackBar('Template is reset Successfully', 'Dismiss');
        this.getTemplateList()
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }
  getTemplateListResponse(data) {
    console.log('templatelist', data)
    this.fincialPlanList = data[0].templates
    this.quotes = data[1].templates
    this.miscellaneous = data[2].templates
    this.isLoading = false
  }
  openAddtemlates(data) {
    const fragmentData = {
      flag: 'value',
      data,
      id: 1,
      state: 'open',
      componentName: AddNewTemplateComponent,

    };
    const rightSideDataSub = this.subinject.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getTemplateList()
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
