import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MatDialog} from '@angular/material';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormGroup, FormControl} from '@angular/forms';
import {HowToUseDialogComponent} from '../how-to-use-dialog/how-to-use-dialog.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-modify-fee-dialog',
  templateUrl: './modify-fee-dialog.component.html',
  styleUrls: ['./modify-fee-dialog.component.scss'],
})
export class ModifyFeeDialogComponent implements OnInit {

  editorContent;

  constructor(public dialogRef: MatDialogRef<ModifyFeeDialogComponent>,
              public subInjectService: SubscriptionInject, public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public fragmentData: any) {
    console.log('ModifyFeeDialogComponent constructor: ', this.fragmentData);
    if (this.fragmentData == '') {
      this.editorContent = this.fragmentData;
    } else {
      this.editorContent = this.fragmentData.data.docText;
    }
  }

  mailForm = new FormGroup({
    mail_body: new FormControl(''),
  });

  ngOnInit() {
  }

  dialogClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.mailForm.value);
  }

  openDialog(data) {
    const Fragmentdata = {
      flag: data,
    };
    const dialogRef = this.dialog.open(HowToUseDialogComponent, {
      width: '30%',
      data: Fragmentdata,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }
}
