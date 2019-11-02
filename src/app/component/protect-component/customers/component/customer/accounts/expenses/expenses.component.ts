import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {

  displayedColumns = ['no', 'expense', 'date', 'desc','mode','amt','icons'];
  dataSource = ELEMENT_DATA;

  constructor() { }
  viewMode
  ngOnInit() {
    this.viewMode="tab1"
  }


}
export interface PeriodicElement {
  no: string;
  expense: string;
  date:string;
  desc: string;
  mode: string;
  amt:string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {no: "1", expense: 'Hydrogen', date: "1.0079", desc: 'H',mode:"Cash",amt:"4,600"},
  {no: "2", expense: 'Hydrogen', date: "1.0079", desc: 'H',mode:"Cash",amt:"4,600"},
  {no: "3", expense: 'Hydrogen', date: "1.0079", desc: 'H',mode:"Cash",amt:"4,600"},
  {no: "4", expense: 'Hydrogen', date: "1.0079", desc: 'H',mode:"Cash",amt:"4,600"},
  {no: "5", expense: 'Hydrogen', date: "1.0079", desc: 'H',mode:"Cash",amt:"4,600"},
];