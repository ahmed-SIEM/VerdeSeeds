import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { DynamicLoaderService } from 'src/app/frontoffice/services/dynamic-loader.service';
import { ComponentRegistry } from './component-registry';
import { Type } from '@angular/core';
import { HeaderwithiconsComponent } from 'src/app/frontoffice/components/plateformeComps/heros/headerwithicons/headerwithicons.component';
import { CenteredheroComponent } from 'src/app/frontoffice/components/plateformeComps/heros/centeredhero/centeredhero.component';
import { HerowithimageComponent } from 'src/app/frontoffice/components/plateformeComps/heros/herowithimage/herowithimage.component';
import { VerticallycenteredheroComponent } from 'src/app/frontoffice/components/plateformeComps/heros/verticallycenteredhero/verticallycenteredhero.component';
import { ColumnswithiconsComponent } from 'src/app/frontoffice/components/plateformeComps/features/columnswithicons/columnswithicons.component';
import { CustomcardsComponent } from 'src/app/frontoffice/components/plateformeComps/features/customcards/customcards.component';
import { HeadingsComponent } from 'src/app/frontoffice/components/plateformeComps/others/headings/headings.component';
import { HeadingleftwithimageComponent } from 'src/app/frontoffice/components/plateformeComps/others/headingleftwithimage/headingleftwithimage.component';
import { HeadingrightwithimageComponent } from 'src/app/frontoffice/components/plateformeComps/others/headingrightwithimage/headingrightwithimage.component';
import { NewsletterComponent } from 'src/app/frontoffice/components/plateformeComps/others/newsletter/newsletter.component';
import { plateformeaboutComponent } from 'src/app/frontoffice/components/plateformeComps/others/about/about.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html'
})
export class PreviewComponent implements OnInit {


  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true }) dynamicContainer!: ViewContainerRef;

  settings = {
    headerwithicons: {
      title: 'Custom Header with Icons Title',
      subtitle: 'Custom Header with Icons Subtitle',
      Ftitle: 'Lorem ipsum dolor sit amet,commodo consequat.',
      Fimage: 'bi-balloon',
      Stitle: 'Lorem ipsum dolor sit aaduip ex ea commodo consequat.',
      Simage: 'bi-balloon',
      Ttitle: 'Lorem ipsum dolor sit amet,commodo consequat.',
      Timage: 'bi-balloon',
      Ptitle: 'Lorem ipsum dolor sit aaduip ex ea commodo consequat.',
      Pimage: 'bi-balloon',
    },
    centeredhero: {
      title: 'Heading Left with Image Title',
      subtitle: 'Heading Left with Image Subtitle',
      imageUrl: 'https://picsum.photos/200/',

    },
    herowithimage: {
      title: 'Heading Right with Image Title',
      subtitle: 'Heading Right with Image Subtitle',
      imageUrl: 'https://picsum.photos/200/',

    },

    verticallycenteredhero: {
      title: 'Centered Hero Title',
      subtitle: 'Centered Hero Subtitle',
      imageUrl: 'https://picsum.photos/400/300',

    },

    columnswithicons: {
      MainTitle: 'Columns with Icons',
      Ftitle: 'Lorem ipsum dolor sit amet,commodo consequat.',
      Fdescription: 'Lorem ipsum dolor sit amet,commodo consequat.',
      Fimage: 'bi bi-0-circle',
      Stitle: 'Lorem ipsum dolor sit aaduip ex ea commodo consequat.',
      Sdescription: 'Lorem ipsum dolor sit aaduip ex ea commodo consequat.',
      Simage: 'bi bi-0-circle',
      Ttitle: 'Lorem ipstrudx ea commodo consequat.',
      Tdescription: 'Lorem ipstrudx ea commodo consequat.',
      Timage: 'bi bi-0-circle',

    },

    customcards: {
      MainTitle: 'Columns with Icons',
      Ftitle: 'Lorem ipsum dolor sit amet,commodo consequat.',
      Fimage: 'https://picsum.photos/400/300',
      Stitle: 'Lorem ipsum dolor sit aaduip ex ea commodo consequat.',
      Simage: 'https://picsum.photos/400/300',
      Ttitle: 'Lorem ipstrudx ea commodo consequat.',
      Timage: 'https://picsum.photos/400/300',

    },

    headings: {
      Ftitle: 'Lorem ipsum dolor sit amet,commodo consequat.',
      Fdescription: 'Lorem ipsum dolor sit amet,commodo consequat.',
      Fimage: 'https://picsum.photos/400/300',
      Stitle: 'Lorem ipsum dolor sit aaduip ex ea commodo consequat.',
      Sdescription: 'Lorem ipsum dolor sit aaduip ex ea commodo consequat.',
      Simage: 'https://picsum.photos/400/300',
      Ttitle: 'Lorem ipstrudx ea commodo consequat.',
      Tdescription: 'Lorem ipstrudx ea commodo consequat.',
      Timage: 'https://picsum.photos/400/300',

    },

    headingleftwithimage: {
      title: 'Centered Hero Title',
      subtitle: 'Centered Hero Subtitle',
      imageUrl: 'https://picsum.photos/400/300',

    },

    headingrightwithimage: {
      title: 'Centered Hero Title',
      subtitle: 'Centered Hero Subtitle',
      imageUrl: 'https://picsum.photos/400/300',

    },

    newsletter: {
      titleA: 'Custom dqsdqsdsqNewsletter Title',
      TextB: 'Custom Newsletter Subtitle',
      TextC: 'Custom Newsletter Subtitle',
      Image: 'https://picsum.photos/400/300',
    },
    plateformeabout: {
      title1: 'About Us Title',
      title2: 'About Us Subtitle',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      imageUrl: 'https://picsum.photos/400/300',

    }
  }






  allComponent = {
    headerwithicons: HeaderwithiconsComponent,
    centeredhero: CenteredheroComponent,
    herowithimage: HerowithimageComponent,
    verticallycenteredhero: VerticallycenteredheroComponent,
    columnswithicons: ColumnswithiconsComponent,
    customcards: CustomcardsComponent,
    headings: HeadingsComponent,
    headingleftwithimage: HeadingleftwithimageComponent,
    headingrightwithimage: HeadingrightwithimageComponent,
    newsletter: NewsletterComponent,
    plateformeabout: plateformeaboutComponent,
  }












  selectedElements: (keyof typeof this.settings)[] = [
    'headerwithicons',
    'centeredhero',
    'herowithimage',
    'verticallycenteredhero',
    'columnswithicons',
    'customcards',
    'headings',
    'headingleftwithimage',
    'headingrightwithimage',
    'newsletter',
    'plateformeabout',
  ];

  color = "#1DCD9F";

  constructor(
    private dynamicLoader: DynamicLoaderService, private route: ActivatedRoute,
    private platformService: PlateformeService,
    private router: Router) { }


  loadSelectedComponents() {
    this.dynamicContainer.clear();
    this.selectedElements.forEach(elementKey => {

      const component = ComponentRegistry[elementKey];
      if (component) {
        this.dynamicLoader.loadComponent(this.dynamicContainer, component, {
          ...this.settings[elementKey],
          color: this.color,
        });
      }
    });
  }





  platform: any;


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.platformService.getPlateforme(+id).subscribe({
        next: (data) => {
          this.platform = data;
          this.color = this.platform.couleur;




          //platform.content is a json string, we need to parse it
          if (this.platform.content) {
            this.platform.content = JSON.parse(this.platform.content);
          }
        
          let list = []
          for (const key in this.platform.content) {
            if (Object.prototype.hasOwnProperty.call(this.platform.content, key)) {

      
              const element = this.platform.content[key];

              if (element.type.content) {
                element.type.content = JSON.parse(element.type.content);
              }
              list.push(element.type);

              if (element.type.type == "centeredhero") {
                console.log(`
                 <app-centeredhero
                 [title]="${element.type.content.title}"
                 [subtitle]="${element.type.content.subtitle}"
                 [imageUrl]="${element.type.content.imageUrl}"
                 [color]=${this.color}>
                 </app-centeredhero>`
                )
              }



            }
          }
          console.log(list);
        },
        error: (error) => {
          console.error('Error loading platform:', error);
        }
      });
    }
    this.loadSelectedComponents();


  }

}
