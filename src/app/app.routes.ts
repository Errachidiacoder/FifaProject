import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TeamViewComponent } from './features/team/team-view/team-view.component';
import { PlayerListComponent } from './features/players/player-list/player-list.component';
import { MatchSimComponent } from './features/matches/match-sim/match-sim.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'team', component: TeamViewComponent },
            { path: 'players', component: PlayerListComponent },
            { path: 'matches', component: MatchSimComponent }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];
