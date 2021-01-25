import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';

@Component({
  selector: 'app-domain-setting-popup',
  templateUrl: './domain-setting-popup.component.html',
  styleUrls: ['./domain-setting-popup.component.scss']
})
export class DomainSettingPopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DomainSettingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    window.scrollTo({
      behavior: 'auto',
      top: 0
    })
  }

  cancel() {
    this.dialogRef.close();
  }

}
