import { Routes } from '@angular/router';
import { FeaturedProductsComponent } from './pages/featured-products/featured-products.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';

export const routes: Routes = [
    { path: "", component: FeaturedProductsComponent },
    { path: "login", component: LoginPageComponent },
    { path: "cart", component: CartPageComponent },
    {
        path: "product/:id", loadComponent: () =>
            import('./pages/product-details/product-details.component').then(m => m.ProductDetailsComponent)
    },
];
