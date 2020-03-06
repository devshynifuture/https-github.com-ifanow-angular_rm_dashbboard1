import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.scss']
})
export class AddGoalComponent implements OnInit {

  @Input() data: any = {};
  @Input() popupHeaderText: string = 'KEY INFO';

  // TODO:- replace tempDisplayData with data
  tempDisplayData = {
    data: [
      {
        "id": "1",
        "asset_owner": "Rahul Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 50,
        "asset_owner_id": "1",
        "current_value": 43780,
        "maturity_value": 8815785,
        "maturity_year": 2033,
        "allocation_status": "partially allocated"
      },
      {
        "id": "2",
        "asset_owner": "Rahul Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 0,
        "asset_owner_id": "1",
        "current_value": 43780,
        "maturity_value": 8815785,
        "maturity_year": 2033,
        "allocation_status": "unallocated"
      },
      {
        "id": "3",
        "asset_owner": "Rahul Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 0,
        "asset_owner_id": "1",
        "current_value": 43780,
        "maturity_value": 8815785,
        "maturity_year": 2033,
        "allocation_status": "unallocated"
      },
      {
        "id": "4",
        "asset_owner": "Shilpa Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 50,
        "asset_owner_id": "2",
        "current_value": 43780,
        "maturity_value": 8815785,
        "maturity_year": 2033,
        "allocation_status": "partially allocated"
      },
      {
        "id": "5",
        "asset_owner": "Shilpa Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 0,
        "asset_owner_id": "2",
        "current_value": 43780,
        "maturity_value": 8815785,
        "maturity_year": 2033,
        "allocation_status": "unallocated"
      },
      {
        "id": "6",
        "asset_owner": "Shilpa Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 100,
        "asset_owner_id": "2",
        "current_value": 43780,
        "maturity_value": 8815785,
        "maturity_year": 2033,
        "allocation_status": "allocated"
      },
      {
        "id": "7",
        "asset_owner": "Shilpa Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 0,
        "asset_owner_id": "2",
        "current_value": 43780,
        "maturity_value": 8815785,
        "maturity_year": 2033,
        "allocation_status": "unallocated"
      },
      {
        "id": "8",
        "asset_owner": "Ganesh Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 50,
        "asset_owner_id": "3",
        "current_value": 43780,
        "maturity_value": 8815785,
        "maturity_year": 2033,
        "allocation_status": "partially allocated"
      },
      {
        "id": "9",
        "asset_owner": "Ganesh Jain",
        "name": "Fixed Deposit - ICICI Bank FD 802321938",
        "allocated_percentage": 0,
        "asset_owner_id": "3",
        "current_value": 43780,
        "maturity_value": 8815785,
        "maturity_year": 2033,
        "allocation_status": "unallocated"
      }
    ]
  }

  familyList:any[] = [];
  displayedAssets:any[] = [];
  currentAllocationFilter:string = 'all';
  currentFamilyFilter:any;
  currentSort:string = '';
  allocationBtnList = [
    {
      name: 'All Assets',
      filter: 'all'
    },
    {
      name: 'Unallocated',
      filter: 'unallocated'
    },
    {
      name: 'Partially allocated',
      filter: 'partially allocated'
    },
    {
      name: 'Fully allocated',
      filter: 'allocated'
    },
    {
      name: 'Un-deployed',
      filter: 'deployed'
    },
  ]


  
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    this.createFamilyList();
    this.data = this.tempDisplayData;
    this.displayedAssets = this.data.data;
    // this.displayData = this.data;
  }

  createFamilyList(){
    this.familyList = this.data.data.map((obj) => {
      return {name: obj.asset_owner, asset_owner_id: obj.asset_owner_id, selected: false};
    }).filter((member, index, arr) => {
      return arr.findIndex(m => m.asset_owner_id === member.asset_owner_id) === index;
    });
    this.familyList.unshift({name: 'All family', asset_owner_id: -1});
  }

  filterByFamily(member) {
    this.familyList.forEach((m) => {
      m.selected = false;
      if(m.asset_owner_id == member.asset_owner_id) {
        m.selected = true;
      }
    })
    this.displayedAssets = this.data.data.filter((obj) => {
      return obj.asset_owner_id === member.asset_owner_id
    });
  }

  filterByAllocation(filterType) {
    this.currentAllocationFilter = filterType;
    if(filterType == 'all') {
      this.displayedAssets = this.data.data;
    } else {
      this.displayedAssets = this.data.data.filter((obj)=> {
        return obj.allocation_status === filterType
      })
    }
    this.sortList(this.currentSort);
  }

  filterAssets(){
    
  }

  sortList(sortType) {
    switch (sortType) {
      case 'v-H2L': // value high to low
        this.displayedAssets = this.displayedAssets.sort((a,b)=>{
          return b.current_value - a.current_value;
        });
        break;

      case 'v-L2H': // value low to high
        this.displayedAssets = this.displayedAssets.sort((a,b)=>{
          return a.current_value - b.current_value;
        });
        break;

      case 'asset': // asset type
        this.displayedAssets = this.displayedAssets.sort((a,b) => {
          return b.asset_id - a.asset_id;
        });
        break;
      
      case 'm-N2F': // maturity near to far
        this.displayedAssets = this.displayedAssets.sort((a,b)=> {
          return a.maturity_year - b.maturity_year;
        });
        break;

      case 'm-F2N': // maturity far to near
        this.displayedAssets = this.displayedAssets.sort((a,b) => {
          return b.maturity_year - a.maturity_year;
        });
        break;
    }
  }

  getAssetClass(allocated_percentage) {
    if(allocated_percentage == 100) {
      return 'btn-danger';
    } else if(allocated_percentage > 0) {
      return 'btn-success';
    } else {
      return 'btn-primary';
    }
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
