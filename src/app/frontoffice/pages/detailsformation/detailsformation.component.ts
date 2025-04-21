import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormationService } from '../../services/farmingpractices.service';

@Component({
  selector: 'app-detailsformation',
  templateUrl: './detailsformation.component.html',
  styleUrls: ['./detailsformation.component.css']
})
export class DetailsformationComponent implements OnInit {
  detail: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.formationService.getDetailsByFormationId(id).subscribe({
      next: (data) => {
        this.detail = data;
        this.isLoading = false;
      },
      error: () => {
        this.detail = null;
        this.isLoading = false;
      }
    });
  }
}
