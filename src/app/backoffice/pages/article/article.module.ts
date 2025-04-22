import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListearticleComponent } from './list-article/list-article.component';
import { ArticleFormComponent } from './article-form/article-form.component';
import { FilterTypePipe } from './filtertypepipe';
import { FormsModule } from '@angular/forms';
import { ArticleRoutingModule } from './article-routing.module';

@NgModule({
  declarations: [
    ListearticleComponent,
    ArticleFormComponent,
    FilterTypePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ArticleRoutingModule,
  ],
  exports: []
})
export class ArticleModule {}