import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { SponsorServcie } from 'src/app/services/plateforme/sponsor.service';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { Platform, Sponsor } from 'src/app/models/sponsor.interface';

@Component({
  selector: 'app-componentedit-add',
  templateUrl: './edit-add.component.html',
  styleUrls: ['./edit-add.component.css']
})
export class EditAddSponsor implements OnInit {
  sponsorForm: FormGroup;
  isEditMode = false;
  platforms: Platform[] = [];
  sponsorId: number | null = null;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private sponsorService: SponsorServcie,
    private PlatformeService: PlateformeService,
  ) {
    this.sponsorForm = this.formBuilder.group({
      nomSponsor: ['', Validators.required],
      logo: ['', Validators.required],
      datepartenariat: ['', Validators.required],
      plateformeSponsor: ['', !this.isEditMode ? Validators.required : null]
    });
  }

  ngOnInit(): void {
    this.loadPlatforms();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.sponsorId = +id;
      this.loadSponsor(this.sponsorId);
    }
  }

  loadPlatforms() {
    this.PlatformeService.getAllPlatforms().subscribe({
      next: (platforms) => {
        this.platforms = platforms;
      },
      error: (error) => console.error('Error loading platforms:', error)
    });
  }

  loadSponsor(id: number) {
    this.sponsorService.getSponsor(id).subscribe({
      next: (sponsor: Sponsor) => {
        this.sponsorForm.patchValue({
          nomSponsor: sponsor.nomSponsor,
          logo: sponsor.logo,
          datepartenariat: sponsor.datepartenariat,
          plateformeSponsor: sponsor.plateformeSponsor // Now passing the full object
        });
        this.sponsorForm.get('plateformeSponsor')?.disable();
      },
      error: (error) => console.error('Error loading sponsor:', error)
    });
  }

  onSubmit() {
    if (this.sponsorForm.valid) {
      const sponsorData = {...this.sponsorForm.value};
      
      // Make sure we're using the full platform object
      if (!this.isEditMode) {
        sponsorData.plateformeSponsor = this.sponsorForm.get('plateformeSponsor')?.value;
      }
      
      const request = this.isEditMode && this.sponsorId
        ? this.sponsorService.updateSponsor({ ...sponsorData, idSponsor: this.sponsorId })
        : this.sponsorService.createSponsor(sponsorData);

      request.subscribe({
        next: () => this.router.navigate(['/backoffice/sponsor']),
        error: (error) => console.error('Error saving sponsor:', error)
      });
    }
  }

  onCancel() {
    this.router.navigate(['/backoffice/sponsor']);
  }
}
