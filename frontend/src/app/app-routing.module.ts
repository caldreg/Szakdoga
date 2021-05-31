import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectAuthorizedToHome = () => redirectLoggedInTo(['/home']);

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectAuthorizedToHome }
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'user-management',
    loadChildren: () => import('./pages/user-management/user-management.module').then( m => m.UserManagementPageModule)
  },
  {
    path: 'projects',
    loadChildren: () => import('./pages/projects/projects.module').then( m => m.ProjectsPageModule)
  },
  {
    path: 'deploy',
    loadChildren: () => import('./modals/deploy/deploy.module').then( m => m.DeployPageModule)
  },
  {
    path: 'add-project',
    loadChildren: () => import('./modals/add-project/add-project.module').then( m => m.AddProjectPageModule)
  },
  {
    path: 'rollback',
    loadChildren: () => import('./modals/rollback/rollback.module').then( m => m.RollbackPageModule)
  },
  {
    path: 'migrate',
    loadChildren: () => import('./pages/migrate/migrate.module').then( m => m.MigratePageModule)
  },
  {
    path: 'edit-project',
    loadChildren: () => import('./modals/edit-project/edit-project.module').then( m => m.EditProjectPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
