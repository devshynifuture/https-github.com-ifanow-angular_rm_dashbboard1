import { CashflowAddComponent } from './../cashflow-add/cashflow-add.component';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-cashflow-upper-surplus',
  templateUrl: './cashflow-upper-surplus.component.html',
  styleUrls: ['./cashflow-upper-surplus.component.scss']
})
export class CashflowUpperSurplusComponent implements OnInit {

  constructor(public dialog: MatDialog) { }
  @Input() data;
  editMode: boolean = false;

  year: string = '';
  shouldShowIcon: boolean = false;
  cashFlowCategory: string = '';
  displayedColumns: string[] = ['description', 'month1', 'month2', 'month3', 'month4', 'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12', 'total', 'remove'];
  dataSource = ELEMENT_DATA3;

  ngOnInit() {
    this.cashFlowCategory = this.data.tableInUse;
    this.year = this.data.financialYear;
  }

  isGroup(index, item): boolean {
    return item.groupName;
  }

  addOneInYear(value: string) {
    return String(parseInt(value) + 1);
  }

  addCashFlow(data) {
    const dialogRef = this.dialog.open(CashflowAddComponent, {
      width: '750px',
      data: { ...data, tableData: this.data }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  showIcons() {
    console.log("this is loaded");
    this.shouldShowIcon = !this.shouldShowIcon;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
}

export const ELEMENT_DATA3 = [
  { groupName: 'NET SURPLUS & ROLLING BALANCE' },
  { description: 'Ad hoc', month1: '25', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { description: 'Recurring', month1: '25', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { description: 'Cumulative/Rolling', month1: '25', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { groupName: 'MONTHLY ALLOCATIONS' },
  { description: 'Amount allocated', month1: '0', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { description: '# allocations', month1: '25', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { groupName: 'LUMPSUM ALLOCATIONS' },
  { description: 'Amount allocated', month1: '25', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
  { description: '# allocations', month1: '25', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },
]
