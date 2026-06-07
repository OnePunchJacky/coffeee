import { CheckIn, Badge } from '../types';

export function computeBadges(checkIns: CheckIn[]): Badge[] {
  const total = checkIns.length;
  const origins = new Set(checkIns.map(c => c.coffee.origin));
  const roasteries = new Set(checkIns.map(c => c.coffee.roastery));
  const espressos = checkIns.filter(c => c.brewMethod === 'espresso').length;
  const filterMethods = ['v60', 'aeropress', 'chemex', 'kalita', 'drip'];
  const filters = checkIns.filter(c => filterMethods.includes(c.brewMethod)).length;
  const naturals = checkIns.filter(c => c.coffee.processing === 'natural').length;
  const lightRoasts = checkIns.filter(c => c.coffee.roastLevel === 'light' || c.coffee.roastLevel === 'medium-light').length;
  const brewMethodsUsed = new Set(checkIns.map(c => c.brewMethod));

  const early = checkIns.length > 0
    ? checkIns.reduce((oldest, c) => c.createdAt < oldest.createdAt ? c : oldest).createdAt
    : undefined;

  return [
    {
      id: 'first-sip',
      name: 'First Sip',
      description: 'Log your very first coffee',
      icon: '☕',
      earned: total >= 1,
      earnedAt: early,
      progress: Math.min(total, 1),
      target: 1,
    },
    {
      id: 'ten-cups',
      name: 'Ten Cups',
      description: 'Check in 10 coffees',
      icon: '🏆',
      earned: total >= 10,
      progress: Math.min(total, 10),
      target: 10,
    },
    {
      id: 'century',
      name: 'Century Club',
      description: 'Check in 100 coffees',
      icon: '💯',
      earned: total >= 100,
      progress: Math.min(total, 100),
      target: 100,
    },
    {
      id: 'espresso-explorer',
      name: 'Espresso Explorer',
      description: '10 espresso check-ins',
      icon: '🔥',
      earned: espressos >= 10,
      progress: Math.min(espressos, 10),
      target: 10,
    },
    {
      id: 'filter-master',
      name: 'Filter Master',
      description: '10 pour-over / filter coffees',
      icon: '🔺',
      earned: filters >= 10,
      progress: Math.min(filters, 10),
      target: 10,
    },
    {
      id: 'globe-trotter',
      name: 'Globe Trotter',
      description: 'Try coffees from 5 different origins',
      icon: '🌍',
      earned: origins.size >= 5,
      progress: Math.min(origins.size, 5),
      target: 5,
    },
    {
      id: 'roastery-hopper',
      name: 'Roastery Hopper',
      description: 'Try coffees from 10 roasteries',
      icon: '🏪',
      earned: roasteries.size >= 10,
      progress: Math.min(roasteries.size, 10),
      target: 10,
    },
    {
      id: 'natural-lover',
      name: 'Natural Lover',
      description: '5 naturally processed coffees',
      icon: '🌱',
      earned: naturals >= 5,
      progress: Math.min(naturals, 5),
      target: 5,
    },
    {
      id: 'light-chaser',
      name: 'Light Chaser',
      description: '5 light or medium-light roasts',
      icon: '☀️',
      earned: lightRoasts >= 5,
      progress: Math.min(lightRoasts, 5),
      target: 5,
    },
    {
      id: 'method-collector',
      name: 'Method Collector',
      description: 'Brew with 5 different methods',
      icon: '🧪',
      earned: brewMethodsUsed.size >= 5,
      progress: Math.min(brewMethodsUsed.size, 5),
      target: 5,
    },
    {
      id: 'specialty-traveler',
      name: 'Specialty Traveler',
      description: 'Try coffee from 3 continents',
      icon: '✈️',
      earned: countContinents(checkIns) >= 3,
      progress: Math.min(countContinents(checkIns), 3),
      target: 3,
    },
    {
      id: 'taste-master',
      name: 'Taste Master',
      description: 'Average rating above 4.0 (min 10 check-ins)',
      icon: '⭐',
      earned: total >= 10 && avgRating(checkIns) >= 4.0,
      progress: total >= 10 ? (avgRating(checkIns) >= 4.0 ? 1 : 0) : 0,
      target: 1,
    },
  ];
}

function avgRating(checkIns: CheckIn[]): number {
  if (checkIns.length === 0) return 0;
  return checkIns.reduce((s, c) => s + c.rating, 0) / checkIns.length;
}

const CONTINENT_MAP: Record<string, string> = {
  Ethiopia: 'Africa', Kenya: 'Africa', Rwanda: 'Africa', Tanzania: 'Africa',
  Uganda: 'Africa', Burundi: 'Africa', Malawi: 'Africa', Zambia: 'Africa',
  Congo: 'Africa', Cameroon: 'Africa',
  Colombia: 'SouthAmerica', Brazil: 'SouthAmerica', Peru: 'SouthAmerica',
  Bolivia: 'SouthAmerica', Ecuador: 'SouthAmerica', Venezuela: 'SouthAmerica',
  Guatemala: 'CentralAmerica', Honduras: 'CentralAmerica', Mexico: 'CentralAmerica',
  'Costa Rica': 'CentralAmerica', Nicaragua: 'CentralAmerica', 'El Salvador': 'CentralAmerica',
  Panama: 'CentralAmerica', Cuba: 'CentralAmerica', Jamaica: 'CentralAmerica',
  Indonesia: 'Asia', Vietnam: 'Asia', India: 'Asia', Laos: 'Asia', Thailand: 'Asia',
  Yemen: 'Asia', 'Papua New Guinea': 'Oceania', Hawaii: 'NorthAmerica',
};

function countContinents(checkIns: CheckIn[]): number {
  const continents = new Set<string>();
  for (const c of checkIns) {
    for (const [country, continent] of Object.entries(CONTINENT_MAP)) {
      if (c.coffee.origin.includes(country)) {
        continents.add(continent);
        break;
      }
    }
  }
  return continents.size;
}
