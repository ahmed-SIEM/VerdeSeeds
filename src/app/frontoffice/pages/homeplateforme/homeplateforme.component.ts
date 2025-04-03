import { Component } from '@angular/core';

@Component({
  selector: 'app-homeplateforme',
  templateUrl: './homeplateforme.component.html',
  styleUrls: ['./homeplateforme.component.css']
})
export class HomeplateformeComponent {
  color = "#48A6A7";
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
    about: {
      title1: 'About Us Title',
      title2: 'About Us Subtitle',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      imageUrl: 'https://picsum.photos/400/300',

    }
  }


  elements = {
    headerwithicons: `
    <app-headerwithicons
    [title]="settings.headerwithicons.title"
    [subtitle]="settings.headerwithicons.subtitle"
    [color]="color"
    [Ftitle]="settings.headerwithicons.Ftitle"
    [Fimage]="settings.headerwithicons.Fimage"
    [Stitle]="settings.headerwithicons.Stitle"
    [Simage]="settings.headerwithicons.Simage"
    [Ttitle]="settings.headerwithicons.Ttitle"
    [Timage]="settings.headerwithicons.Timage"
    [Ptitle]="settings.headerwithicons.Ptitle"
    [Pimage]="settings.headerwithicons.Pimage">
    </app-headerwithicons>
    `,
    centeredhero: `
    <app-centeredhero
    [title]="settings.centeredhero.title"
    [subtitle]="settings.centeredhero.subtitle"
    [imageUrl]="settings.centeredhero.imageUrl"
    [color]="color">
    </app-centeredhero>`,
    herowithimage: `
    <app-herowithimage
    [title]="settings.herowithimage.title"
    [subtitle]="settings.herowithimage.subtitle"
    [imageUrl]="settings.herowithimage.imageUrl"
    [color]="color">
    </app-herowithimage>`,
    verticallycenteredhero: `
    <app-verticallycenteredhero
    [title]="settings.verticallycenteredhero.title"
    [subtitle]="settings.verticallycenteredhero.subtitle"
    [color]="color">
    </app-verticallycenteredhero>`,
    columnswithicons: `
    <app-columnswithicons
    [MainTitle]="settings.columnswithicons.MainTitle"
    [Ftitle]="settings.columnswithicons.Ftitle"
    [Fdescription]="settings.columnswithicons.Fdescription"
    [Fimage]="settings.columnswithicons.Fimage"
    [Stitle]="settings.columnswithicons.Stitle"
    [Sdescription]="settings.columnswithicons.Sdescription"
    [Simage]="settings.columnswithicons.Simage"
    [Ttitle]="settings.columnswithicons.Ttitle"
    [Tdescription]="settings.columnswithicons.Tdescription"
    [Timage]="settings.columnswithicons.Timage"
    [color]="color">
    </app-columnswithicons>`,
    customcards: `
    <app-customcards
    [MainTitle]="settings.customcards.MainTitle"
    [Ftitle]="settings.customcards.Ftitle"
    [Fimage]="settings.customcards.Fimage"
    [Stitle]="settings.customcards.Stitle"
    [Simage]="settings.customcards.Simage"
    [Ttitle]="settings.customcards.Ttitle"
    [Timage]="settings.customcards.Timage"
    [color]="color">
    </app-customcards>`,
    headings: `
  <div class="container marketing">
    <app-headings
    [Ftitle]="settings.headings.Ftitle"
    [Fdescription]="settings.headings.Fdescription"
    [Fimage]="settings.headings.Fimage"
    [Stitle]="settings.headings.Stitle"
    [Sdescription]="settings.headings.Sdescription"
    [Simage]="settings.headings.Simage"
    [Ttitle]="settings.headings.Ttitle"
    [Tdescription]="settings.headings.Tdescription"
    [Timage]="settings.headings.Timage"
    [color]="color">
    </app-headings>
  </div>`,
    headingleftwithimage: `<div class="container marketing">

  <app-headingleftwithimage
    [title]="settings.headingleftwithimage.title"
    [subtitle]="settings.headingleftwithimage.subtitle"
    [imageUrl]="settings.headingleftwithimage.imageUrl"
    [color]="color" >
    </app-headingleftwithimage>
</div>`,
    headingrightwithimage: ` 
  <app-headingrightwithimage
    [title]="settings.headingrightwithimage.title"
    [subtitle]="settings.headingrightwithimage.subtitle"
    [imageUrl]="settings.headingrightwithimage.imageUrl"
    [color]="color" >
  </app-headingrightwithimage>`,
    newsletter: `
  <app-newsletter
    [titleA]="settings.newsletter.titleA"
    [titleB]="settings.newsletter.TextB"
    [titleC]="settings.newsletter.TextC"
    [Image]="settings.newsletter.Image"
    [color]="color" >
  </app-newsletter>`,
    plateformeabout: `
  <app-plateformeabout
    [title1]="settings.about.title1"
    [title2]="settings.about.title2"
    [description]="settings.about.description"
    [imageUrl]="settings.about.imageUrl"
    [color]="color">
  </app-plateformeabout>`,

  }

  // append 

  selectedElement = 'headerwithicons';

  // append element to homeplateforme.html 

  



}
