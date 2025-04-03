import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditPlatformComponent } from './edit-platform/edit-platform.component';

const routes: Routes = [
  { path: 'new', component: EditPlatformComponent },
  { path: ':id/edit', component: EditPlatformComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformManagementRoutingModule {}