import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  menuItems = [
    { label: 'Inicio', route: '/', icon: '🏠' },
    { label: 'Calculadora', route: '/solver', icon: '🧮' },
    { label: 'Historial', route: '/history', icon: '📊' },
    { label: 'Ayuda', route: '/help', icon: '❓' }
  ];

  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}