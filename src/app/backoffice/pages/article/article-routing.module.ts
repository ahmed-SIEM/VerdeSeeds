import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListearticleComponent } from './list-article/list-article.component';
import { ArticleFormComponent } from './article-form/article-form.component';

const routes: Routes = [
  { path: '', component: ListearticleComponent },
  { path: 'new', component: ArticleFormComponent },
  { path: 'edit/:id', component: ArticleFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
