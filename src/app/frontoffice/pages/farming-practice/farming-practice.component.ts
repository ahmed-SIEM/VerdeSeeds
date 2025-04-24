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
  filteredFormations: any[] = [];

  types: string[] = ['THEORIQUE', 'PRATIQUE', 'MIXTE'];
  selectedType: string = 'ALL';

  searchTerm: string = '';
  calendarEvents: any[] = [];
  showCalendar: boolean = false;

  constructor(
    private formationService: FormationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.formationService.getAllFormations().subscribe(data => {
      this.formations = data;
      this.filteredFormations = data;
    });
  }

  filterByType(): void {
    this.searchByName(); // permet de filtrer avec le nom + type en même temps
  }

  searchByName(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredFormations = this.formations.filter(f => {
      const matchesName = f.nom?.toLowerCase().includes(term);
      const matchesType = this.selectedType === 'ALL' || f.typeFormation === this.selectedType;
      return matchesName && matchesType;
    });
  }

  getImagePath(photoPath: string): string {
    return `http://localhost:8081/${photoPath}`;
  }

  showCalendarPopup(): void {
    this.formationService.getFormationsForCalendar().subscribe(data => {
      this.calendarEvents = data;
      this.showCalendar = true;
    });
  }
}
