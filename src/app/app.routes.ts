import { Routes } from '@angular/router';
import { FeaturedProductsComponent } from './pages/featured-products/featured-products.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';

export const routes: Routes = [
    { path: "", component: FeaturedProductsComponent },
    { path: "login", component: LoginPageComponent },
    { path: "cart", component: CartPageComponent },
    { path: "about", component: AboutPageComponent },
    {
        path: "product/:id", loadComponent: () =>
            import('./pages/product-details/product-details.component').then(m => m.ProductDetailsComponent)
    },
    {
        path: "checkout", loadComponent: () =>
            import('./pages/checkout-page/checkout-page.component').then(m => m.CheckoutPageComponent)
    },
    {
        path: "orders", loadComponent: () =>
            import('./pages/order-history/order-history.component').then(m => m.OrderHistoryComponent)
    },
    {
        path: "checkout-option", loadComponent: () =>
            import('./pages/checkout-option/checkout-option.component').then(m => m.CheckoutOptionComponent)
    },
    {
        path: "login", loadComponent: () =>
            import('./pages/login-page/login-page.component').then(m => m.LoginPageComponent)
    },
    {
        path: 'register', loadComponent: () =>
            import('./pages/register-page/register-page.component').then(m => m.RegisterPageComponent)
    },
];
