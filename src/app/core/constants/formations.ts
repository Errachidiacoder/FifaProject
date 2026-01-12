export interface PositionStyle {
    top: string;
    left: string;
    name: string; // GK, LB, etc.
}

export type FormationName = '4-4-2' | '4-3-3' | '3-5-2';

export const FORMATIONS: Record<FormationName, PositionStyle[]> = {
    '4-4-2': [
        { name: 'GK', top: '88%', left: '50%' },
        { name: 'LB', top: '75%', left: '15%' }, { name: 'LCB', top: '75%', left: '38%' }, { name: 'RCB', top: '75%', left: '62%' }, { name: 'RB', top: '75%', left: '85%' },
        { name: 'LM', top: '45%', left: '15%' }, { name: 'LCM', top: '45%', left: '38%' }, { name: 'RCM', top: '45%', left: '62%' }, { name: 'RM', top: '45%', left: '85%' },
        { name: 'ST', top: '15%', left: '35%' }, { name: 'ST', top: '15%', left: '65%' }
    ],
    '4-3-3': [
        { name: 'GK', top: '88%', left: '50%' },
        { name: 'LB', top: '75%', left: '15%' }, { name: 'LCB', top: '75%', left: '38%' }, { name: 'RCB', top: '75%', left: '62%' }, { name: 'RB', top: '75%', left: '85%' },
        { name: 'CM', top: '50%', left: '25%' }, { name: 'CM', top: '50%', left: '50%' }, { name: 'CM', top: '50%', left: '75%' },
        { name: 'LW', top: '20%', left: '15%' }, { name: 'ST', top: '15%', left: '50%' }, { name: 'RW', top: '20%', left: '85%' }
    ],
    '3-5-2': [
        { name: 'GK', top: '88%', left: '50%' },
        { name: 'CB', top: '75%', left: '25%' }, { name: 'CB', top: '75%', left: '50%' }, { name: 'CB', top: '75%', left: '75%' },
        { name: 'LWB', top: '50%', left: '10%' }, { name: 'CDM', top: '60%', left: '35%' }, { name: 'CDM', top: '60%', left: '65%' }, { name: 'RWB', top: '50%', left: '90%' }, { name: 'CAM', top: '40%', left: '50%' },
        { name: 'ST', top: '15%', left: '35%' }, { name: 'ST', top: '15%', left: '65%' }
    ]
};
