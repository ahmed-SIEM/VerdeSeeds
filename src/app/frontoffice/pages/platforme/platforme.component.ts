import { Component } from '@angular/core';
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
export class PlatformeComponent  {
  private readonly USER_ID = 1;
   User = {};
   typePack = '';

  constructor(
    private platformeService: PlateformeService,
    private CommonService : CommonService
  ) {}




  selectBasicPlan() {
    this.platformeService.updateUserPlan('BASIC').subscribe(
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

    this.platformeService.updateUserPlan( 'ADVANCED').subscribe(
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
    this.platformeService.updateUserPlan('PREMIUM').subscribe(
      (response) => {
        console.log('Plan updated successfully:', response);
        window.location.reload();

      },
      (error) => {
        console.error('Error updating plan:', error);
      }
    );
  }








}
