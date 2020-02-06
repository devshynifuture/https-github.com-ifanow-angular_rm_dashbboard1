import { EventService } from 'src/app/Data-service/event.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cashflow-upper-slider',
  templateUrl: './cashflow-upper-slider.component.html',
  styleUrls: ['./cashflow-upper-slider.component.scss']
})
export class CashflowUpperSliderComponent implements OnInit {

  displayedColumns: string[] = ['description', 'month1', 'month2', 'month3', 'month4', 'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12', 'total', 'remove'];


  constructor(
    private eventService: EventService,
    public dialog: MatDialog
  ) { }

  data;
  isInsuranceTable: boolean = false;
  isSurplusTable: boolean = false;
  editMode: boolean = false;
  isLiabilitiesTable: boolean = false;
  year: string = '';
  cashFlowCategory: string = '';

  ngOnInit() {
    console.log(this.data);
    this.cashFlowCategory = this.data.tableInUse;

    (this.cashFlowCategory === 'insurance') ? this.isInsuranceTable = true : this.isInsuranceTable = false;

    if (this.cashFlowCategory === 'surplus') {
      this.isSurplusTable = true;
      this.year = this.data.financialYear;
    } else {
      this.isSurplusTable = false;
      this.year = this.data.year;
    }
  }

  shouldShowAdd(): boolean {
    return (this.cashFlowCategory === 'insurance' || this.cashFlowCategory === 'assets') ? false : true;
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

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
}



