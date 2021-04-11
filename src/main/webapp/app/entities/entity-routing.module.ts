import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'compte',
        data: { pageTitle: 'myblogApp.compte.home.title' },
        loadChildren: () => import('./compte/compte.module').then(m => m.CompteModule),
      },
      {
        path: 'panier',
        data: { pageTitle: 'myblogApp.panier.home.title' },
        loadChildren: () => import('./panier/panier.module').then(m => m.PanierModule),
      },
      {
        path: 'course',
        data: { pageTitle: 'myblogApp.course.home.title' },
        loadChildren: () => import('./course/course.module').then(m => m.CourseModule),
      },
      {
        path: 'produit',
        data: { pageTitle: 'myblogApp.produit.home.title' },
        loadChildren: () => import('./produit/produit.module').then(m => m.ProduitModule),
      },
      {
        path: 'restaurant',
        data: { pageTitle: 'myblogApp.restaurant.home.title' },
        loadChildren: () => import('./restaurant/restaurant.module').then(m => m.RestaurantModule),
      },
      {
        path: 'cooperative',
        data: { pageTitle: 'myblogApp.cooperative.home.title' },
        loadChildren: () => import('./cooperative/cooperative.module').then(m => m.CooperativeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
