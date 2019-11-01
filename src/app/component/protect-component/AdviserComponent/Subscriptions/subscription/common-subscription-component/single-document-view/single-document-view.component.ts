import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-single-document-view',
  templateUrl: './single-document-view.component.html',
  styleUrls: ['./single-document-view.component.scss']
})
export class SingleDocumentViewComponent implements OnInit {

  constructor() { }
  @Input() singleDocument;
  ngOnInit() {
  }

}
