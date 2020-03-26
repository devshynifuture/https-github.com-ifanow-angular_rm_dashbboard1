import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  rt: string;
  uploadDate: Date;
  range: string;
  status: string;
  download: string;
  added:Date;
  txnFile:string;
  uploadedBy:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Amit Mehta', rt: '9322574914', uploadDate: new Date(), added: new Date(), range: 'Client', txnFile:'', uploadedBy:'',status: '', download: '' },
  { name: 'Amitesh Anand', rt: '9322574914', uploadDate: new Date(), added: new Date(), range: 'Client', txnFile:'', uploadedBy:'', status: '', download: '' },
  { name: 'Hemal Karia', rt: '9322574914', uploadDate: new Date(), added: new Date(), range: 'Client', txnFile:'', uploadedBy:'', status: '', download: '' },
  { name: 'Kiran Kumar', rt: '9322574914', uploadDate: new Date(), added: new Date(), range: 'Client', txnFile:'', uploadedBy:'', status: '', download: '' },
];

@Component({
  selector: 'app-backoffice-file-upload-transactions',
  templateUrl: './backoffice-file-upload-transactions.component.html',
  styleUrls: ['./backoffice-file-upload-transactions.component.scss']
})

export class BackofficeFileUploadTransactionsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'rt', 'uploadDate', 'range', 'added', 'txnFile','uploadedBy', 'status', 'download'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {

  }

}
