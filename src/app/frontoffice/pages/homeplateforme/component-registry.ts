import { Type } from '@angular/core';
import { HeaderwithiconsComponent } from '../../components/plateformeComps/heros/headerwithicons/headerwithicons.component';
import { CenteredheroComponent } from '../../components/plateformeComps/heros/centeredhero/centeredhero.component';
import { HerowithimageComponent } from '../../components/plateformeComps/heros/herowithimage/herowithimage.component';
import { VerticallycenteredheroComponent } from '../../components/plateformeComps/heros/verticallycenteredhero/verticallycenteredhero.component';
import { ColumnswithiconsComponent } from '../../components/plateformeComps/features/columnswithicons/columnswithicons.component';
import { CustomcardsComponent } from '../../components/plateformeComps/features/customcards/customcards.component';
import { HeadingsComponent } from '../../components/plateformeComps/others/headings/headings.component';
import { HeadingleftwithimageComponent } from '../../components/plateformeComps/others/headingleftwithimage/headingleftwithimage.component';
import { HeadingrightwithimageComponent } from '../../components/plateformeComps/others/headingrightwithimage/headingrightwithimage.component';
import { NewsletterComponent } from '../../components/plateformeComps/others/newsletter/newsletter.component';
import { plateformeaboutComponent } from '../../components/plateformeComps/others/about/about.component';

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
