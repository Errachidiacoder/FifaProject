import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
    isSidebarOpen = false;
    isMobile = false;

    constructor() {
        this.checkScreenSize();
    }

    @HostListener('window:resize', [])
    onResize() {
        this.checkScreenSize();
    }

    checkScreenSize() {
        this.isMobile = window.innerWidth < 768;
        if (!this.isMobile) {
            this.isSidebarOpen = true; // Always open on desktop
        } else {
            this.isSidebarOpen = false;
        }
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}
