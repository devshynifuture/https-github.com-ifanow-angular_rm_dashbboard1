import { Component, OnInit, Input } from '@angular/core';
import { UpperTableBox, Group } from './../../cashflow.interface';

@Component({
  selector: 'app-cashflow-upper-asset',
  templateUrl: './cashflow-upper-asset.component.html',
  styleUrls: ['./cashflow-upper-asset.component.scss']
})
export class CashflowUpperAssetComponent implements OnInit {

  constructor() { }
  dataSource = ELEMENT_DATA2;

  displayedColumns: string[] = ['description', 'month1', 'month2', 'month3', 'month4', 'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12'];

  @Input() data;

  year;

  cashflowCategory;

  isGroup(index, item): boolean {
    return item.groupName;
  }

  addOneInYear(value: string) {
    return String(parseInt(value) + 1);
  }

  ngOnInit() {
    this.year = this.data.year;
    this.cashflowCategory = this.data.tableInUse;
    console.log("ASSETS:::::::::", this.data);
  }

}

const ELEMENT_DATA2: (UpperTableBox | Group)[] = [
  { groupName: 'Goal Based' },
  { description: '2020', month1: '25', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },

  { groupName: 'Non Goal Based' },
  { description: '2020', month1: '25', month2: '21', month3: '2,10,000', month4: '121', month5: '121', month6: '121', month7: '12', month8: '12', month9: '12', month10: '445', month11: '12', month12: '12', total: '121', remove: '' },

]
