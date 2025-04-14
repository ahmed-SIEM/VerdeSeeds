import { Component,OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';


interface User {
  idUser: number;
  typePack: string;
}




@Component({
  selector: 'app-platforme',
  templateUrl: './platforme.component.html',
  styleUrls: ['./platforme.component.css']
})
export class PlatformeComponent implements OnInit {
  private readonly USER_ID = 1;
   User = {};
   typePack = '';

  constructor(
    private platformeService: PlateformeService,
    private CommonService : CommonService
  ) {}


  ngOnInit(): void {
    this.loadUser();
  }


  selectBasicPlan() {
    this.platformeService.updateUserPlan(this.USER_ID, 'BASIC').subscribe(
      (response) => {
        console.log('Plan updated successfully:', response);
        window.location.reload();

      },
      (error) => {
        console.error('Error updating plan:', error);
      }
    );
  }

  selectAdvancedPlan() {

    this.platformeService.updateUserPlan(this.USER_ID, 'ADVANCED').subscribe(
      (response) => {
        console.log('Plan updated successfully:', response);
        window.location.reload();
      },
      (error) => {
        console.error('Error updating plan:', error);
      }
    );
  }

  selectPremiumPlan() {
    this.platformeService.updateUserPlan(this.USER_ID, 'PREMIUM').subscribe(
      (response) => {
        console.log('Plan updated successfully:', response);
        window.location.reload();

      },
      (error) => {
        console.error('Error updating plan:', error);
      }
    );
  }



  loadUser() {
    this.CommonService.getUserById(this.USER_ID).subscribe(
      (response) => {
        this.User = response;
        this.typePack = response.typePack;
        console.log('User loaded successfully:', this.User);
        
      },
      (error) => {
        console.error('Error loading user:', error);
      }
    );
  }




}
