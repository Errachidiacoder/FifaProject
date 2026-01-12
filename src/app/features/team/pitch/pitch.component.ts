import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../../models/player.model';
import { FORMATIONS, FormationName, PositionStyle } from '../../../core/constants/formations';

@Component({
    selector: 'app-pitch',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="relative w-full aspect-[3/4] md:aspect-[4/3] bg-green-600 rounded-xl overflow-hidden shadow-2xl border-4 border-white/20 select-none">
      <!-- Pitch Lines -->
      <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-30">
        <div class="w-full h-px bg-white/50"></div> <!-- Center Line Horizontal (for vertical pitch) -->
        <div class="absolute w-32 h-32 border-2 border-white/50 rounded-full"></div> <!-- Center Circle -->
        <div class="absolute top-0 w-48 h-24 border-b-2 border-l-2 border-r-2 border-white/50"></div> <!-- Top Box -->
        <div class="absolute bottom-0 w-48 h-24 border-t-2 border-l-2 border-r-2 border-white/50"></div> <!-- Bottom Box -->
      </div>
      
      <!-- Lawn Pattern -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>

      <!-- Players / Slots -->
      <div *ngFor="let pos of currentPositions; let i = index" 
           class="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
           [style.top]="pos.top" 
           [style.left]="pos.left">
        
        <!-- Slot Container -->
        <div class="flex flex-col items-center group cursor-pointer"
             (click)="slotClicked.emit(i)">
          
          <!-- Player Token / Card Mini -->
          <div class="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 bg-slate-800/80 backdrop-blur-sm shadow-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 relative"
               [ngClass]="{'border-yellow-400': getPlayer(i), 'border-dashed border-white/40': !getPlayer(i)}">
            
            <ng-container *ngIf="getPlayer(i) as p; else emptySlot">
              <img [src]="p.photo" class="w-full h-full object-cover" onerror="this.src='assets/placeholder-player.png'">
              <!-- Rating Badge -->
              <div class="absolute bottom-0 right-0 bg-yellow-500 text-black text-xs font-bold px-1 rounded-full">
                {{ p.rating }}
              </div>
            </ng-container>
            
            <ng-template #emptySlot>
              <span class="text-white/50 font-bold text-sm">{{ pos.name }}</span>
            </ng-template>
          </div>

          <!-- Name Label -->
          <div *ngIf="getPlayer(i) as p" class="mt-1 bg-black/70 px-2 py-0.5 rounded text-white text-[10px] md:text-xs">
            {{ p.name }}
          </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class PitchComponent implements OnChanges {
    @Input() players: Player[] = [];
    @Input() formation: string = '4-4-2';
    @Output() slotClicked = new EventEmitter<number>();

    currentPositions: PositionStyle[] = [];

    ngOnChanges() {
        this.updatePositions();
    }

    updatePositions() {
        this.currentPositions = FORMATIONS[this.formation as FormationName] || FORMATIONS['4-4-2'];
    }

    getPlayer(index: number): Player | undefined {
        return this.players[index];
    }
}
