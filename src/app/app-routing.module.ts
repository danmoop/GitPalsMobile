import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../../dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('../../search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'dialogs',
    loadChildren: () => import('../../dialogs/dialogs.module').then( m => m.DialogsPageModule)
  },
  {
    path: 'submit-project',
    loadChildren: () => import('../../submit-project/submit-project.module').then( m => m.SubmitProjectPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
