import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-manage-kyc',
  templateUrl: './manage-kyc.component.html',
  styleUrls: ['./manage-kyc.component.scss']
})
export class ManageKycComponent implements OnInit {
  isLoading: boolean;

  constructor() { }
  displayedColumns: string[] = ['memberName', 'pan', 'mobile', 'email', 'kycStatus', 'action'];
  dataSource = new MatTableDataSource([{}, {}, {}]);
  ngOnInit() {
  }

  getKYCClientDetailsCall() {
    this.isLoading = true;
  }

  close(flag) {

  }

}
