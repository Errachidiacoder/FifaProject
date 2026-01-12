import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Player } from '../models/player.model';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    private http = inject(HttpClient);

    private playersSubject = new BehaviorSubject<Player[]>([]);
    public players$ = this.playersSubject.asObservable();

    private myTeamSubject = new BehaviorSubject<Player[]>([]);
    public myTeam$ = this.myTeamSubject.asObservable();

    constructor() {
        this.loadPlayers();
        this.loadTeamFromStorage();
    }

    private loadPlayers() {
        this.http.get<Player[]>('data/players.json').subscribe({
            next: (data) => {
                this.playersSubject.next(data);
            },
            error: (err) => console.error('Failed to load players', err)
        });
    }

    private loadTeamFromStorage() {
        const savedTeam = localStorage.getItem('myFifATeam');
        if (savedTeam) {
            try {
                this.myTeamSubject.next(JSON.parse(savedTeam));
            } catch (e) {
                console.error('Error parsing saved team', e);
            }
        }
    }

    private saveTeam() {
        localStorage.setItem('myFifATeam', JSON.stringify(this.myTeamSubject.value));
    }

    addPlayerToTeam(player: Player): boolean {
        const currentTeam = this.myTeamSubject.value;
        if (currentTeam.length >= 11) {
            return false; // Team full
        }
        if (currentTeam.some(p => p.id === player.id)) {
            return false; // Already in team
        }

        // Check mostly logic (e.g. max 1 GK) layout usually handles this but we can add validation here
        // For now, allow adding logic 
        const updatedTeam = [...currentTeam, player];
        this.myTeamSubject.next(updatedTeam);
        this.saveTeam();
        return true;
    }

    removePlayerFromTeam(playerId: number) {
        const currentTeam = this.myTeamSubject.value;
        const updatedTeam = currentTeam.filter(p => p.id !== playerId);
        this.myTeamSubject.next(updatedTeam);
        this.saveTeam();
    }

    // Get players by position
    getPlayersByPosition(position: string): Observable<Player[]> {
        return this.players$.pipe(
            map(players => players.filter(p => p.position === position))
        );
    }
}
