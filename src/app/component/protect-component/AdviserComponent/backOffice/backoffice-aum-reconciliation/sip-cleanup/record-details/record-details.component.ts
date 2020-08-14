import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-record-details",
  templateUrl: "./record-details.component.html",
  styleUrls: ["./record-details.component.scss"],
})
export class RecordDetailsComponent implements OnInit {
  constructor() {}

  data;

  ngOnInit() {
    console.log(this.data);
  }
}
