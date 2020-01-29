import { UpperTableBox, Group } from './../../cashflow.interface';
import { EventService } from './../../../../../../../../../Data-service/event.service';
import { ValidatorType } from './../../../../../../../../../services/util.service';
import { CashflowAddComponent } from './../cashflow-add/cashflow-add.component';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-cashflow-upper-surplus',
  templateUrl: './cashflow-upper-surplus.component.html',
  styleUrls: ['./cashflow-upper-surplus.component.scss']
})
export class CashflowUpperSurplusComponent implements OnInit {
  onlyNumbers: string;

  constructor(public dialog: MatDialog, private eventService: EventService) { }
  @Input() data;
  editMode: boolean = false;

  year: string = '';
  shouldShowIcon: boolean = false;
  cashFlowCategory: string = '';
  displayedColumns: string[] = ['description', 'month1', 'month2', 'month3', 'month4', 'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12', 'total', 'remove'];
  dataSource = ELEMENT_DATA3;


  alterTable(table: (UpperTableBox | Group)[], field: string, value: string, index: number): (UpperTableBox | Group)[] {
    table[index][field] = value;
    this.updateTotal(table[index]);
    return table;
  }

  updateTotal(object: (UpperTableBox | Group)) {
    let sum = 0;
    for (let i = 1; i <= 12; i++) {
      sum = sum + parseInt(object[`month${i}`]);
    }
    object['total'] = String(sum);
  }


  changeTableTdValue(value: string, field: string, index: number) {
    if (field === 'description' && this.editMode) {
      this.alterTable(ELEMENT_DATA3, field, value, index);
    } else if (ValidatorType.NUMBER_ONLY.test(value) && this.editMode) {
      console.log("im here:::::::::::::")
      this.alterTable(ELEMENT_DATA3, field, value, index);
    } else {
      this.onlyNumbers = '';
      this.eventService.openSnackBar("This Input only takes Numbers", "DISMISS");
    }
  }

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

export const ELEMENT_DATA3: (UpperTableBox | Group)[] = [
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
