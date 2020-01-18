import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CashflowAddComponent } from './cashflow-add/cashflow-add.component';
import { UpperTableBox, Group } from "./../cashflow.interface";

@Component({
  selector: 'app-cashflow-upper-slider',
  templateUrl: './cashflow-upper-slider.component.html',
  styleUrls: ['./cashflow-upper-slider.component.scss']
})
export class CashflowUpperSliderComponent implements OnInit {

  displayedColumns: string[] = ['description', 'month1', 'month2', 'month3', 'month4', 'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12', 'total', 'remove'];


  constructor(private subInjectService: SubscriptionInject,
    private eventService: EventService,
    public dialog: MatDialog) { }

  data;

  shouldShowAdd(): boolean {
    return (this.cashFlowCategory === 'insurance' || this.cashFlowCategory === 'assets') ? false : true;
  }

  isInsuranceTable: boolean = false;
  isSurplusTable: boolean = false;
  editMode: boolean = false;
  isLiabilitiesTable: boolean = false;
  year: string = '';
  cashFlowCategory: string = '';

  ngOnInit() {
    console.log(this.data);
    this.cashFlowCategory = this.data.tableInUse;

    (this.data.tableInUse === 'insurance') ? this.isInsuranceTable = true : this.isInsuranceTable = false;


    if (this.data.tableInUse === 'surplus') {
      this.isSurplusTable = true;
      this.year = this.data.financialYear;
    } else {
      this.isSurplusTable = false;
      this.year = this.data.year;
    }
  }

  isGroup(index, item): boolean {
    return item.groupName;
  }

  addOneInYear(value: string) {
    return String(parseInt(value) + 1);
  }

  close() {
    this.eventService.changeUpperSliderState({ state: 'close' });
  }

  addExpense(data) {
    const dialogRef = this.dialog.open(CashflowAddComponent, {
      width: '750px',
      data: { ...data, tableData: this.data }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
}



