import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('../pages/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'dialogs',
    loadChildren: () => import('../pages/dialogs/dialogs.module').then( m => m.DialogsPageModule)
  },
  {
    path: 'submit-project',
    loadChildren: () => import('../pages/submit-project/submit-project.module').then( m => m.SubmitProjectPageModule)
  },
  {
    path: 'view-project/:project',
    loadChildren: () => import('../pages/view-project/view-project.module').then( m => m.ViewProjectPageModule)
  },
  {
    path: 'view-user',
    loadChildren: () => import('../pages/view-user/view-user.module').then( m => m.ViewUserPageModule)
  },
  {
    path: 'view-forum-post',
    loadChildren: () => import('../pages/view-forum-post/view-forum-post.module').then( m => m.ViewForumPostPageModule)
  },
  {
    path: 'view-dialog/:name',
    loadChildren: () => import('../pages/view-dialog/view-dialog.module').then( m => m.ViewDialogPageModule)
  },
  {
    path: 'view-notifications',
    loadChildren: () => import('../pages/view-notifications/view-notifications.module').then( m => m.ViewNotificationsPageModule)
  },
  {
    path: 'edit-project/:id',
    loadChildren: () => import('../pages/edit-project/edit-project.module').then( m => m.EditProjectPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
