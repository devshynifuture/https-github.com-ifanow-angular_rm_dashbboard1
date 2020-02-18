import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatDialog } from '@angular/material';
import { SelectAssetClassComponent } from '../select-asset-class/select-asset-class.component';
import { PlanService } from '../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-deployment-details',
  templateUrl: './deployment-details.component.html',
  styleUrls: ['./deployment-details.component.scss']
})
export class DeploymentDetailsComponent implements OnInit {
  deploymentData: any;
  isLoading: boolean;

  constructor(private eventService: EventService, private subInjectService: SubscriptionInject, public dialog: MatDialog, private planService: PlanService) { }
  displayedColumns: string[] = ['position', 'name', 'weight', 'icons'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'icons'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2: string[] = ['name', 'weight', 'height', 'test', 'icons'];
  dataSource2 = ELEMENT_DATA2;
  ngOnInit() {
  }
  set data(data) {
    this.getDeploymentData(data)
  }
  getDeploymentData(data) {
    this.deploymentData = [{}, {}, {}]
    this.isLoading = true;
    let obj =
    {
      deploymentId: data.id
    }
    this.planService.getDeploymentDetailsdata(obj).subscribe(
      data => {
        console.log(data);
        this.isLoading = false;
        this.deploymentData = data;
      },
      err => this.eventService.openSnackBar(err, 'dismiss')
    )

  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  openSelectAsset() {
    const dialogRef = this.dialog.open(SelectAssetClassComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  // symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Equity', name: '1,80,000', weight: '1,30,000' },
  { position: 'Equity mutual funds', name: '1,80,000', weight: '1,30,000' },
  { position: 'Equity', name: '1,80,000', weight: '1,30,000' },
];
export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  // symbol: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: '     Debt mutual funds', name: '50,000', weight: '0' },

];
export interface PeriodicElement2 {
  name: string;
  // position: string;
  weight: string;
  // symbol: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { name: 'Aditya birla sun life - Equity Savings Fund Regular Plan - Dividend reinvestment / 0980989898', weight: '50,000' },

];