import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilService} from 'src/app/services/util.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {AddIncomeComponent} from './add-income/add-income.component';
import {AuthService} from 'src/app/auth-service/authService';
import {PlanService} from '../../plan.service';
import {EventService} from 'src/app/Data-service/event.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns = ['no', 'owner', 'type', 'amt', 'income', 'till', 'rate', 'status', 'icons'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  advisorId: any;
  clientId: any;

  constructor(public dialog: MatDialog, private eventService: EventService, private subInjectService: SubscriptionInject, private planService: PlanService) {
  }

  viewMode;

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.viewMode = "tab1"
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getIncomeList();
  }

  getIncomeList() {
    const obj =
      {
        advisorId: this.advisorId,
        clientId: this.clientId
      }
    this.planService.getIncomeData(obj).subscribe(
      data => this.getIncomeListRes(data),
      err => this.eventService.openSnackBar(err)
    )

  }

  getIncomeListRes(data) {
    if (data) {
      this.dataSource = data;
    }
  }

  addIncome(flagValue, data) {
    const fragmentData = {
      flag: flagValue,
      data,
      state: 'open',
      componentName: AddIncomeComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getIncomeList();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  deleteModal(value, incomeData) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document GD?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.planService.deleteIncome(incomeData.id).subscribe(
          data => {
            this.getIncomeList();
            dialogRef.close();
          },
          err => this.eventService.openSnackBar(err, "dismiss")
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

  addIncomeDetail(flagValue) {
    const fragmentData = {
      flag: flagValue,
      id: 1,
      state: 'openHelp'
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

export interface PeriodicElement {
  no: string;
  owner: string;
  type: string;
  amt: string;
  income: string;
  till: string;
  rate: string;
  status: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    no: "1",
    owner: 'Rahul Jain',
    type: "Salaried",
    amt: '60,000',
    income: "18/09/2021",
    till: "Retirement",
    rate: "8.40%",
    status: "MATURED"
  },
  {
    no: "2",
    owner: 'Rahul Jain',
    type: "Salaried",
    amt: '60,000',
    income: "18/09/2021",
    till: "Retirement ",
    rate: "8.40%",
    status: "LIVE"
  },
  {no: "", owner: 'Total', type: "", amt: '1,60,000', income: "", till: "", rate: "", status: ""},
];
