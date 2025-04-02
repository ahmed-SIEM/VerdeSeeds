import { Component } from '@angular/core';

@Component({
  selector: 'app-homeplateforme',
  templateUrl: './homeplateforme.component.html',
  styleUrls: ['./homeplateforme.component.css']
})
export class HomeplateformeComponent {
 

  settings = {
    centeredhero : {
      title: 'Heading Left with Image Title',
      subtitle: 'Heading Left with Image Subtitle',
      imageUrl: 'https://picsum.photos/200/',
      color : "#cd0000"
    },
    herowithimage : {
      title: 'Heading Right with Image Title',
      subtitle: 'Heading Right with Image Subtitle',
      imageUrl: 'https://picsum.photos/200/',
      color : "#cd0000"
    },

    verticallycenteredhero : {
      title: 'Centered Hero Title',
      subtitle: 'Centered Hero Subtitle',
      imageUrl: 'https://picsum.photos/400/300',
      color : "#cd0000"
    },

    columnswithicons : {
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
      color : "#cd0000"
    },
  
    customcards : {
      MainTitle: 'Columns with Icons',
      Ftitle: 'Lorem ipsum dolor sit amet,commodo consequat.',
      Fimage: 'https://picsum.photos/400/300',
      Stitle: 'Lorem ipsum dolor sit aaduip ex ea commodo consequat.',
      Simage: 'https://picsum.photos/400/300',
      Ttitle: 'Lorem ipstrudx ea commodo consequat.',
      Timage: 'https://picsum.photos/400/300',
      color : "#cd0000"
    },
  
    headings : {
      Ftitle: 'Lorem ipsum dolor sit amet,commodo consequat.',
      Fdescription: 'Lorem ipsum dolor sit amet,commodo consequat.',
      Fimage: 'https://picsum.photos/400/300',
      Stitle: 'Lorem ipsum dolor sit aaduip ex ea commodo consequat.',
      Sdescription: 'Lorem ipsum dolor sit aaduip ex ea commodo consequat.',
      Simage: 'https://picsum.photos/400/300',
      Ttitle: 'Lorem ipstrudx ea commodo consequat.',
      Tdescription: 'Lorem ipstrudx ea commodo consequat.',
      Timage: 'https://picsum.photos/400/300',
      color : "#cd0000"
    },

    headingleftwithimage : {
      title: 'Centered Hero Title',
      subtitle: 'Centered Hero Subtitle',
      imageUrl: 'https://picsum.photos/400/300',
      color : "#cd0000"
    },

    headingrightwithimage : {
      title: 'Centered Hero Title',
      subtitle: 'Centered Hero Subtitle',
      imageUrl: 'https://picsum.photos/400/300',
      color : "#cd0000"
    }


  }









}
