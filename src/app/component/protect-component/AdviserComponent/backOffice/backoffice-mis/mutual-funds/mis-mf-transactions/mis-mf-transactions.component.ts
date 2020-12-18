import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-mis-mf-transactions',
  templateUrl: './mis-mf-transactions.component.html',
  styleUrls: ['./mis-mf-transactions.component.scss']
})
export class MisMfTransactionsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'mfoverview', 'scheme', 'folio', 'tType', 'tdate'];
  data: Array<any> = [{}, {}, {}];
  mfTransaction = new MatTableDataSource(this.data);
  isLoading: boolean;
  constructor() { }

  ngOnInit() {

    this.isLoading = false
    this.mfTransaction.data = [{}, {}, {}];
  }

}
