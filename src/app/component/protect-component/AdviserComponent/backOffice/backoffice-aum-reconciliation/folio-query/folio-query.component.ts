import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-folio-query',
  templateUrl: './folio-query.component.html',
  styleUrls: ['./folio-query.component.scss']
})
export class FolioQueryComponent implements OnInit {

  constructor() { }
  displayedColumns: string[] = ['folioNumber', 'schemeName', 'investorName', 'arnRiaCode', 'reconStatus', 'transactions', 'folioDetails'];
  isSearchDone: boolean = false;
  isLoading: boolean = false;
  dataSource = new MatTableDataSource<folioQueryI>(ELEMENT_DATA);

  optionList = [];

  ngOnInit() {
    this.dataSource.data = undefined;
  }

  search() {
    // toggling view
    this.isSearchDone = !this.isSearchDone;

    // search query logic
  }

}

interface folioQueryI {
  folioNumber: string;
  schemeName: string;
  investorName: string;
  arnRiaCode: string;
  reconStatus: string;
  transactions: string;
  folioDetails: string;
}

const ELEMENT_DATA: folioQueryI[] = [
  { folioNumber: '', schemeName: '', investorName: '', arnRiaCode: '', reconStatus: '', transactions: '', folioDetails: '' },
  { folioNumber: '', schemeName: '', investorName: '', arnRiaCode: '', reconStatus: '', transactions: '', folioDetails: '' },
  { folioNumber: '', schemeName: '', investorName: '', arnRiaCode: '', reconStatus: '', transactions: '', folioDetails: '' },

]
