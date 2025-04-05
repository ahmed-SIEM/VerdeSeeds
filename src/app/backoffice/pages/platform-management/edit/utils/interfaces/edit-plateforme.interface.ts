export interface PlatformContent {
    header?: {
      type: string;
      title: string;
    };
    component1?: {
      type: string;
      title: string;
      order: number;
    };
    component2?: {
      type: string;
      title: string;
      order: number;
    };
    component3?: {
      type: string;
      title: string;
      order: number;
    };
    [key: string]: any;
  }
  

  
  export enum TypePack {
    BASIC = 'BASIC',
    STANDARD = 'STANDARD',
    PREMIUM = 'PREMIUM'
  }
  
  export const headerelements = [
    { name: 'headerwithicons', label: 'Header with Icons' },
    { name: 'centeredhero', label: 'Centered Hero' },
    { name: 'herowithimage', label: 'Hero with Image' },
    { name: 'verticallycenteredhero', label: 'Vertically Centered Hero' }
  ];
  
  export const featuredelements = [
    { name: 'columnswithicons', label: 'Columns with Icons' },
    { name: 'customcards', label: 'Custom Cards' }
  ];
  
  export const headingelements = [
    { name: 'headings', label: 'Headings' },
    { name: 'headingleftwithimage', label: 'Heading Left with Image' },
    { name: 'headingrightwithimage', label: 'Heading Right with Image' }
  ];
  
  export const otherselements = [
    { name: 'newsletter', label: 'Newsletter' },
    { name: 'plateformeabout', label: 'Platform About' }
  ];


  export interface ElementsFields {
    [key: string]: string[];
  }



  