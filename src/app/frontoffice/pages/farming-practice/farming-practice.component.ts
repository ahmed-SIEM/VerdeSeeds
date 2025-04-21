import { Component, OnInit } from '@angular/core';
import { FormationService } from '../../services/farmingpractices.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-farming-practice',
  templateUrl: './farming-practice.component.html',
  styleUrls: ['./farming-practice.component.css']
})
export class FarmingPracticeComponent implements OnInit {
  formations: any[] = [];
  calendarEvents: any[] = [];
  showCalendar = false;

  constructor(private formationService: FormationService, private http: HttpClient) {}

  ngOnInit(): void {
    this.formationService.getAllFormations().subscribe(data => {
      this.formations = data;
    });
  }

  getImagePath(photoPath: string): string {
    return `http://localhost:8081/${photoPath}`;
  }

  showCalendarPopup(): void {
    this.http.get<any[]>('http://localhost:8081/formations/calendar').subscribe(data => {
      this.calendarEvents = data;
      this.showCalendar = true;
    });
  }

  closeCalendarPopup(): void {
    this.showCalendar = false;
  }
}
