import { Component, OnInit } from '@angular/core';
import { BackOfficeService } from '../backOffice/back-office.service';

@Component({
  selector: 'app-gayatri',
  templateUrl: './gayatri.component.html',
  styleUrls: ['./gayatri.component.scss']
})
export class GayatriComponent implements OnInit {
  team;
  constructor(private back:BackOfficeService) { }

  ngOnInit() {
    this.callApi();
  }
  callApi()
  {
    this.back.normalApi(this.team).subscribe(
    data =>this.onSubmit(data)
    )
  }
  onSubmit(data)
  {
    console.log("zxdjkfbhasdf",data)
  }

}
