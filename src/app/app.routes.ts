import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { ProductsComponent } from './products/products';
import { RegisterComponent } from './register/register';
import { LoginComponent } from './login/login';
import { CheckoutComponent } from './checkout/checkout';

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
    path: 'checkout',
    component: CheckoutComponent,
    title: 'Checkout | ShopEasy',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Sign In | ShopEasy',
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
