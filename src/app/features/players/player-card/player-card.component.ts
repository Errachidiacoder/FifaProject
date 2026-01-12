import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../../models/player.model';

@Component({
    selector: 'app-player-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="relative w-full max-w-[200px] aspect-[2/3] mx-auto bg-cover bg-center rounded-xl overflow-visible transition-transform hover:scale-105 hover:z-10 cursor-pointer group"
         [ngClass]="getCardBackground(player!.rating)"
         (click)="select.emit(player)">
      
      <!-- Card Border/Shape Simulation using CSS -->
      <div class="absolute inset-0 bg-gradient-to-b from-yellow-700/80 to-yellow-900/90 border-2 border-yellow-400 rounded-t-xl clip-path-badge shadow-2xl p-2 flex flex-col items-center">
        
        <!-- Top Info -->
        <div class="w-full flex justify-between items-start px-2 mt-2 text-yellow-100 font-bold text-shadow">
          <div class="flex flex-col items-center">
            <span class="text-2xl leading-none">{{ player?.rating }}</span>
            <span class="text-sm uppercase">{{ player?.position }}</span>
          </div>
        </div>

        <!-- Player Image -->
        <div class="w-24 h-24 my-1 overflow-hidden">
             <img [src]="player?.photo" alt="{{ player?.name }}" class="w-full h-full object-contain drop-shadow-lg"
                  onerror="this.src='assets/placeholder-player.png'">
        </div>

        <!-- Name -->
        <div class="w-full text-center mt-1">
          <h3 class="text-lg font-bold text-white truncate uppercase tracking-tighter">{{ player?.name }}</h3>
          <div class="h-0.5 w-16 bg-yellow-400/50 mx-auto my-1"></div>
        </div>

        <!-- Stats Grid -->
        <div class="w-full grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-bold text-yellow-100 px-1 mt-1">
          <div class="flex justify-between"><span>PAC</span><span>{{ player?.stats?.pac }}</span></div>
          <div class="flex justify-between"><span>DRI</span><span>{{ player?.stats?.dri }}</span></div>
          <div class="flex justify-between"><span>SHO</span><span>{{ player?.stats?.sho }}</span></div>
          <div class="flex justify-between"><span>DEF</span><span>{{ player?.stats?.def }}</span></div>
          <div class="flex justify-between"><span>PAS</span><span>{{ player?.stats?.pas }}</span></div>
          <div class="flex justify-between"><span>PHY</span><span>{{ player?.stats?.phy }}</span></div>
        </div>
      </div>
    
      <!-- Action Overlay (Add/Remove) -->
      <div class="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
        <span class="text-white font-bold bg-blue-600 px-4 py-2 rounded-full transform scale-0 group-hover:scale-110 transition-transform">
          {{ actionLabel }}
        </span>
      </div>
    </div>
  `,
    styles: [`
    .text-shadow {
      text-shadow: 1px 1px 0 #000;
    }
  `]
})
export class PlayerCardComponent {
    @Input() player: Player | undefined;
    @Input() actionLabel: string = 'Select';
    @Output() select = new EventEmitter<Player>();

    getCardBackground(rating: number = 75): string {
        if (rating >= 90) return 'text-yellow-400'; // Gold/Special
        if (rating >= 80) return 'text-yellow-200'; // Gold
        if (rating >= 70) return 'text-slate-300'; // Silver
        return 'text-orange-300'; // Bronze
    }
}
