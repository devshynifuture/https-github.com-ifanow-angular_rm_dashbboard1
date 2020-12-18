import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { RoleService } from 'src/app/auth-service/role.service';

@Component({
  selector: 'app-mutual-funds',
  templateUrl: './mutual-funds.component.html',
  styleUrls: ['./mutual-funds.component.scss']
})
export class MutualFundsComponent implements OnInit {
  selected: number;

  constructor(private route: ActivatedRoute,
    private enumDataService: EnumDataService,
    public roleService: RoleService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params.Tab) {
        this.selected = (params.Tab) ? params.Tab : 0;
      }
    });

  }


}
