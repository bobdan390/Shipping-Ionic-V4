import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children:
      [
        {
          path: 'categories',
          children:
            [
              {
                path: '',
                //loadChildren: './../categories/categories.module#CategoriesPageModule'
                loadChildren: () => import('./../categories/categories.module').then( m => m.CategoriesPageModule)
              }
            ]
        },
        {
          path: 'orders',
          children:
            [
              {
                path: '',
                //loadChildren: '../explore/explore.module#ExplorePageModule'
                loadChildren: () => import('../orders/orders.module').then( m => m.OrdersPageModule)
              }
            ]
        },
        {
          path: 'cart',
          children:
            [
              {
                path: '',
                //loadChildren: '../cart/cart.module#CartPageModule'
                loadChildren: () => import('./../cart/cart.module').then( m => m.CartPageModule)
              }
            ]
        },
        {
          path: 'account',
          children:
            [
              {
                path: '',
                //loadChildren: '../account/account.module#AccountPageModule'
                loadChildren: () => import('./../account/account.module').then( m => m.AccountPageModule)
              }
            ]
        },
        {
          path: 'restaurants/:data',
          children:
            [
              {
                path: '',
                 loadChildren: () => import('./../restaurants/restaurants.module').then( m => m.RestaurantsPageModule)
              }
            ]
        },
        {
          path: '',
          redirectTo: '/tabs/tabs/categories',
          pathMatch: 'full'
        }
      ]
  },
  {
    path: '',
    redirectTo: '/tabs/tabs/categories',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
