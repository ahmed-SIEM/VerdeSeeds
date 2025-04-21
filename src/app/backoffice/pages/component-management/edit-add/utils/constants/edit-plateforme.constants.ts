import { ElementsFields } from "../interfaces/edit-plateforme.interface";





 export const headerelements = [
  "headerwithicons",
  "centeredhero",
  "herowithimage",
  "verticallycenteredhero",
 ]

 export const featuredelements = [
  "columnswithicons",
  "customcards"]

  export const headingelements = [
    "headings",
    "headingleftwithimage",
    "headingrightwithimage"]

    export const   otherselements = [
      "newsletter",
      "plateformeabout"
    ]


  


  export const  components = [ featuredelements,headingelements, headerelements, otherselements ]



  export const ELEMENTS_FIELDS: ElementsFields = {
    headerwithicons: [
      "title", "subtitle", "Ftitle", "Ficon",
      "Stitle", "Sicon", "Ttitle", "Ticon",
      "Ptitle", "Picon"
    ],
    centeredhero: [
      "title", "subtitle", "imageUrl"
    ],
    herowithimage: [
      "title", "subtitle", "imageUrl"
    ],
    verticallycenteredhero: [
      "title", "subtitle"
    ],
    columnswithicons: [
      "MainTitle", "Ftitle", "Fdescription", "Ficon",
      "Stitle", "Sdescription", "Sicon",
      "Ttitle", "Tdescription", "Ticon"
    ],
    customcards: [
      "MainTitle", "Ftitle", "Fimage",
      "Stitle", "Simage", "Ttitle", "Timage"
    ],
    headings: [
      "Ftitle", "Fdescription", "Fimage",
      "Stitle", "Sdescription", "Simage",
      "Ttitle", "Tdescription", "Timage"
    ],
    headingleftwithimage: [
      "title", "subtitle", "imageUrl"
    ],
    headingrightwithimage: [
      "title", "subtitle", "imageUrl"
    ],
    newsletter: [
      "titleA", "TextB", "TextC", "Image"
    ],
    plateformeabout: [
      "title1", "title2", "description", "imageUrl"
    ]
  };


  export const COMPONENTS = [featuredelements, headingelements, headerelements, otherselements];
