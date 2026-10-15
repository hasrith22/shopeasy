import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { ProductsComponent } from './products/products';
import { RegisterComponent } from './register/register';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'ShopEasy - Find Your Everyday Essentials',
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Products Catalogue | ShopEasy',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Create Account | ShopEasy',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
