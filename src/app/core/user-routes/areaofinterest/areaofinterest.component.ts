import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AreaofinterestService } from 'src/app/shared/services/AreaOfIntrest/areaofinterest.service';
import { UserService } from 'src/app/shared/services/User/user.service';

@Component({
  selector: 'app-areaofinterest',
  templateUrl: './areaofinterest.component.html',
  styleUrls: ['./areaofinterest.component.css']
})
export class AreaofinterestComponent implements OnInit {

  areaOfInterests: any[] = [];
  constructor(private areaOfInterestService: AreaofinterestService, private router: Router) { }
  ngOnInit() {
    this.areaOfInterestService.getAreaOfInterest().subscribe((res:any) => {
      for (let index = 0; index < res.length; index++) {
       this.areaOfInterests[index]=res[index]; 
      }
    },
    (err:any) => {
      console.log(err);
      });

    };
    
  }
