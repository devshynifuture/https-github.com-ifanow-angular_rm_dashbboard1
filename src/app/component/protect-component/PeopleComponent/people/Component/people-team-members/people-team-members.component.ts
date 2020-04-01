import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidatorType} from 'src/app/services/util.service';
import {EnumServiceService} from 'src/app/services/enum-service.service';
import {PeopleService} from '../../../people.service';
import {AuthService} from "../../../../../../auth-service/authService";
import {EventService} from "../../../../../../Data-service/event.service";


@Component({
  selector: 'app-people-team-members',
  templateUrl: './people-team-members.component.html',
  styleUrls: ['./people-team-members.component.scss']
})
export class PeopleTeamMembersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'mobile', 'email', 'type', 'map', 'action'];
  dataSource = ELEMENT_DATA;
  validatorType = ValidatorType;
  roleList: any = [];
  teamList = [{
    name: 'Archit Gupta',
    email: 'abc@gmail.com',
    mobile: '9088888800',
    role: 1,
    lead: 4,
    euin: 1289777,
    roleTypeName: 'Admin',
    clients: 32,
    img: '/assets/images/svg/chotu-avtar.svg'
  },
    {
      name: 'Nita Shinde',
      email: 'abc@gmail.com',
      mobile: '9088888800',
      role: 2,
      lead: 4,
      euin: 1289777,
      roleTypeName: 'Para planner',
      clients: 12,
      img: '/assets/images/svg/nita-avtar.svg'
    },
    {
      name: 'Khushboo Sidapara',
      email: 'abc@gmail.com',
      mobile: '9088888800',
      role: 3,
      lead: 4,
      euin: 1289777,
      roleTypeName: 'Relationship manager',
      clients: 76,
      img: '/assets/images/svg/khushboo-avtar.svg'
    },
    {
      name: 'Archit Gupta',
      email: 'abc@gmail.com',
      mobile: '9088888800',
      role: 2,
      lead: 4,
      euin: 1289777,
      roleTypeName: 'Operations',
      clients: 78,
      img: '/assets/images/svg/chotu-avtar.svg'
    },
    {
      name: 'Sajith Thilakan',
      email: 'abc@gmail.com',
      mobile: '9088888800',
      role: 2,
      lead: 4,
      euin: 1289777,
      clients: 123,
      roleTypeName: 'Para planner',
      img: '/assets/images/svg/chotu-avtar.svg'
    }
  ];

  leadList = [
    {id: 1, name: 'Nitin Birde'},
    {id: 2, name: 'Rajesh Shah'},
    {id: 3, name: 'Devid Bekam'},
    {id: 4, name: 'Dinesh Bhogale'},
  ];
  advisorId;
  teamInviteForm: FormGroup;

  constructor(private fb: FormBuilder, private enumService: EnumServiceService,
              private peopleService: PeopleService, private eventService: EventService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();

    this.teamInviteForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      mobile: ['', [Validators.required]],
      role: ['', [Validators.required]],
      lead: ['', [Validators.required]],
      euin: [''],
      clients: [''],
      roleTypeName: [''],
      img: ['']
    });
    this.roleList = this.enumService.getRoles();
    this.getClientCountWiseData();
  }

  getClientCountWiseData() {
    // getTeamMemberWiseCount
    const obj = {
      advisorId: this.advisorId
    };
    this.peopleService.getTeamMemberWiseCount(obj).subscribe(
      data => {
        console.log(data);
        this.teamList = data;
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  viewEditMember(member) {
    this.teamInviteForm.setValue(member);
  }

  sendInvitation() {
    if (this.teamInviteForm.invalid) {
      for (const c in this.teamInviteForm.controls) {
        this.teamInviteForm.controls[c].markAsTouched();
      }
    } else {
      console.log(this.teamInviteForm.value, 'teamInviteForm');
    }
  }
}

export interface PeriodicElement {
  name: string;
  mobile: string;
  email: string;
  type: string;
  map: string;
  action: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Amit Mehta', mobile: '9322574914', email: 'amit.mehta@gmail.com', type: 'Client', map: '', action: ''},
  {name: 'Amitesh Anand', mobile: '9322574914', email: 'amit.mehta@gmail.com', type: 'Client', map: '', action: ''},
  {name: 'Hemal Karia', mobile: '9322574914', email: 'amit.mehta@gmail.com', type: 'Client', map: '', action: ''},
  {name: 'Kiran Kumar', mobile: '9322574914', email: 'amit.mehta@gmail.com', type: 'Client', map: '', action: ''},
];
