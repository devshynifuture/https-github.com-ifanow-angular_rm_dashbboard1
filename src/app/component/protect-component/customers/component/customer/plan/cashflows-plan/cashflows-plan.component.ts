import {Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {SeriesBarOptions, SeriesSplineOptions} from 'highcharts';

@Component({
  selector: 'app-cashflows-plan',
  templateUrl: './cashflows-plan.component.html',
  styleUrls: ['./cashflows-plan.component.scss']
})
export class CashflowsPlanComponent implements OnInit {

  displayedColumns: string[] = ['year', 'age', 'age2', 'salary', 'salary2', 'total', 'view'];
  dataSource = ELEMENT_DATA;

  constructor() {
  }

  ngOnInit() {
    this.cashFlow('surplus');
  }

  cashFlow(id) {
    const chart1 = new Highcharts.Chart('surplus', {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Bar chart with negative values'
      },
      xAxis: {
        categories: []
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          // pointWidth: 10
        }
      },
      series: [{
        name: 'Income',
        data: [-1, -2, -2, -7, -2, -1, -1, -2, -3, -4, -5, -5, -6, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, 2, 3],
        color: '#5DC644',
        // type: 'bar'

      } as SeriesBarOptions, {
        name: 'Expenses',
        data: [1, 2, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        color: '#FFC100',
        // type: 'bar'

      } as SeriesBarOptions, {
        name: 'Liabilities',
        data: [1, 2, 3, 4, 2, -1, -1, -1, -1, -1, -1, -1, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, -1, -2, -3, -3, -4, -5],
        color: '#FF6823',
        // type: 'bar'

      } as SeriesBarOptions, {
        name: 'Insurance',
        data: [1, 2, 3, 3, 2, 1, 2, 3, 4, 5, 5, 6, 6, 0, 0, 0, -1, -2, -3, -4, -5, -6, -7],
        color: '#7B50FF',
        // type: 'bar'

      } as SeriesBarOptions, {
        name: 'Assets',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 0, 7, 2],
        color: '#BCC6CA',
        // type: 'bar'

      } as SeriesBarOptions, {
        type: 'spline',
        name: 'Surplus',
        marker: {
          enabled: false
        },
        color: '#000000',
        dashStyle: 'ShortDot',
        data: [1, 1, 1, 1., 1., 2, 1, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1],
      } as SeriesSplineOptions]
    });
  }
}


export interface PeriodicElement {
  year: string;
  age: string;
  age2: string;
  salary: string;
  salary2: string;
  total: string;
  view: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {year: '2020', age: '25', age2: '21', salary: '1,20,000', salary2: '90,000', total: '2,10,000', view: 'view'},
  {year: '2020', age: '25', age2: '21', salary: '1,20,000', salary2: '90,000', total: '2,10,000', view: 'view'},
  {year: '2020', age: '25', age2: '21', salary: '1,20,000', salary2: '90,000', total: '2,10,000', view: 'view'},
  {year: '2020', age: '25', age2: '21', salary: '1,20,000', salary2: '90,000', total: '2,10,000', view: 'view'},
  {year: '2020', age: '25', age2: '21', salary: '1,20,000', salary2: '90,000', total: '2,10,000', view: 'view'},
  {year: '2020', age: '25', age2: '21', salary: '1,20,000', salary2: '90,000', total: '2,10,000', view: 'view'},
  {year: '2020', age: '25', age2: '21', salary: '1,20,000', salary2: '90,000', total: '2,10,000', view: 'view'},

];
