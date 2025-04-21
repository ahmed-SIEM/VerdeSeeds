import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';



@Component({
  selector: 'app-plateformedetails',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsPlatformComponent implements OnInit {
  platform: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private platformService: PlateformeService,
    private router: Router
  ) {}
  categorizedComponents ={
    headerwithicons: { name: 'Header with Icons', preview: '../../../../../assets/backoffice/img/preview-images/CustomHeaderWithIcons.png' },
    centeredhero: { name: 'Centered Hero', preview: '../../../../../assets/backoffice/img/preview-images/HeadingWithImageTitle.png' },
    herowithimage: { name: 'Hero with Image', preview: '../../../../../assets/backoffice/img/preview-images/HeadingRightWithImageTitle.png' },
    verticallycenteredhero: { name: 'Vertically Centered Hero', preview: '../../../../../assets/backoffice/img/preview-images/VerticallyCenteredHeroSignUpForm.png' },
    columnswithicons: { name: 'Columns with Icons', preview: '../../../../../assets/backoffice/img/preview-images/ColumnsWithIcons.png' },
    customcards: { name: 'Custom Cards', preview: '../../../../../assets/backoffice/img/preview-images/CustomCards.png' },
    headings: { name: 'Headings', preview: '../../../../../assets/backoffice/img/preview-images/Headings.png' },
    headingleftwithimage: { name: 'Heading Left with Image', preview: '../../../../../assets/backoffice/img/preview-images/LeftImage.png' },
    headingrightwithimage: { name: 'Heading Right with Image', preview: '../../../../../assets/backoffice/img/preview-images/RightImage.png' },
    newsletter: { name: 'Newsletter', preview: '../../../../../assets/backoffice/img/preview-images/Newsletter.png' },
    plateformeabout: { name: 'Plateforme About', preview: '../../../../../assets/backoffice/img/preview-images/AboutUs.png' }
  };

  getPreviewImage(type: keyof typeof this.categorizedComponents): string | null {
    if (!this.categorizedComponents[type]) {
      return null;
    }
    return this.categorizedComponents[type].preview;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.platformService.getPlateforme(+id).subscribe({
        next: (data) => {
          this.platform = data;

          //platform.content is a json string, we need to parse it
          if (this.platform.content) {
            this.platform.content = JSON.parse(this.platform.content);
          }
         



          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading platform:', error);
          this.isLoading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/backoffice/platform']);
  }

  editPlatform() {
    this.router.navigate(['/backoffice/platform', this.platform.idPlateforme, 'edit']);
  }



async uploadImage(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);

    return fetch("http://localhost:5000/analyze-colors", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);  // { dominant_colors: [...], color_schemes: {...} }
    })
    .catch(error => {
        console.error('Error uploading image:', error);
    });
}

onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
        const file = input.files[0];
        this.uploadImage(file);
    }
}



}
