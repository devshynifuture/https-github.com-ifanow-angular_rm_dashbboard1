import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  rt: string;
  uploadDate: Date;
  status: string;
  download: string;
  uploadedBy:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Amit Mehta', rt: '9322574914', uploadDate: new Date(), uploadedBy:'',status: '', download: '' },
  { name: 'Amitesh Anand', rt: '9322574914', uploadDate: new Date(), uploadedBy:'', status: '', download: '' },
  { name: 'Hemal Karia', rt: '9322574914', uploadDate: new Date(), uploadedBy:'', status: '', download: '' },
  { name: 'Kiran Kumar', rt: '9322574914', uploadDate: new Date(), uploadedBy:'', status: '', download: '' },
];

@Component({
  selector: 'app-backoffice-file-upload-sip-stp',
  templateUrl: './backoffice-file-upload-sip-stp.component.html',
  styleUrls: ['./backoffice-file-upload-sip-stp.component.scss']
})
export class BackofficeFileUploadSipStpComponent implements OnInit {
  displayedColumns: string[] = ['name', 'rt', 'uploadDate','uploadedBy', 'status', 'download'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
