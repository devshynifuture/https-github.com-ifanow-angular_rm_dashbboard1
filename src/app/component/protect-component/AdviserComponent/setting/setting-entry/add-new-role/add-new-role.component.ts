import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../settings.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-add-new-role',
  templateUrl: './add-new-role.component.html',
  styleUrls: ['./add-new-role.component.scss']
})
export class AddNewRoleComponent implements OnInit {
  displayedColumns: string[] = ['position', 'weight', 'symbol', 'edit', 'del', 'adv'];
  dataSource:MatTableDataSource<any>;
  displayedColumns1: string[] = ['position', 'adv'];
  dataSource1 = ELEMENT_DATA1;
  @Input() data: any = {};
  is_add:boolean = true;

  rolesFG: FormGroup;

  dummyAdminRole: any = {
    id: 1,
    type: 1,
    accounts: [
      {
        model: 'mutual funds',
        permissions: [
          {
            name: 'view',
            is_allowed: true,
            is_advanced: false
          },
          {
            name: 'add',
            is_allowed: true,
            is_advanced: false
          },
          {
            name: 'edit',
            is_allowed: true,
            is_advanced: false
          },
          {
            name: 'delete',
            is_allowed: false,
            is_advanced: false
          },
          {
            name: 'invest',
            is_allowed: false,
            is_advanced: true
          },
          {
            name: 'Redeem',
            is_allowed: false,
            is_advanced: true
          },
          {
            name: 'Download SOA',
            is_allowed: true,
            is_advanced: true
          },
        ]
      },
      {
        model: 'stocks',
        permissions: [
          {
            name: 'view',
            is_allowed: true,
            is_advanced: false
          },
          {
            name: 'add',
            is_allowed: true,
            is_advanced: false
          },
          {
            name: 'edit',
            is_allowed: true,
            is_advanced: false
          },
          {
            name: 'delete',
            is_allowed: true,
            is_advanced: false
          },
          {
            name: 'invest',
            is_allowed: true,
            is_advanced: true
          },
          {
            name: 'Redeem',
            is_allowed: true,
            is_advanced: true
          },
          {
            name: 'Download SOA',
            is_allowed: true,
            is_advanced: true
          },
        ]
      }
    ]
  }

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private eventService: EventService,
  ) { }

  ngOnInit() {
    this.is_add = this.data.type ? true : false;
    this.createFormGroup();
    this.constructAdminDataSource();
  }

  createFormGroup() {
    this.rolesFG = this.fb.group({
      type: [this.data.type],
      name: [this.data.name, [Validators.required, Validators.maxLength(30)]],
      description: [this.data.description, [Validators.maxLength(60)]]
    });
  }

  segregateNormalAndAdvancedPermissionsForModule(data: any[]) {
    let permissions_json = {
      view: data.find((permission) => permission.name == 'view'),
      add: data.find((permission) => permission.name == 'add'),
      edit: data.find((permission) => permission.name == 'edit'),
      delete: data.find((permission) => permission.name == 'delete'),
    }
    let advanced_permissions = data.filter((permission) => permission.is_advanced);
    return {permissions: permissions_json, advanced_permissions: advanced_permissions};
  }

  constructAdminDataSource() {
    let adminDatasource = this.dummyAdminRole.accounts;
    for(let i = 0; i < adminDatasource.length; i++) {
      let segregated_permissions = this.segregateNormalAndAdvancedPermissionsForModule(adminDatasource[i].permissions);
      delete adminDatasource[i].permissions;
      adminDatasource[i] = {
        ...adminDatasource[i],
        ...segregated_permissions
      };
    }
    console.log('sagar', adminDatasource);
    this.dataSource = new MatTableDataSource(adminDatasource);
  }

  save() {
    console.log('closing sagar', this.dataSource.data);
    this.eventService.changeUpperSliderState({state: 'close', refreshRequired: true});
  }

  close(){
    this.eventService.changeUpperSliderState({state: 'close', refreshRequired: false});
  }

}
export interface PeriodicElement {
  position: string;
  adv: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Mutual funds', adv: 'Manage ' },
  { position: 'Stocks', adv: 'Manage ' },
];
export interface PeriodicElement1 {
  position: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: 'Mutual funds' },
  { position: 'Stocks' },
];