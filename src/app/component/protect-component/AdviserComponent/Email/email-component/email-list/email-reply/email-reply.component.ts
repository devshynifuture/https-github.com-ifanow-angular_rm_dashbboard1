import { MatBottomSheetRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-reply',
  templateUrl: './email-reply.component.html',
  styleUrls: ['./email-reply.component.scss']
})
export class EmailReplyComponent implements OnInit {

  constructor(private _bottomSheetRef: MatBottomSheetRef<EmailReplyComponent>) { }

  ngOnInit() {
  }

}
