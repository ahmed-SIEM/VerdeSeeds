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

export const ComponentRegistry: { [key: string]: Type<any> } = {
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
};
