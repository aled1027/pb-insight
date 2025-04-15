export interface MenuItem {
  icon: string;
  label: string;
  action?: () => void;
}

// Response structure
export interface ApiSearchResponse {
  status: string;
  result: ApiPaginatedResult;
}

// Paginated result containing player data
export interface ApiPaginatedResult {
  offset: number;
  limit: number;
  total: number;
  hits: ApiPlayerProfile[];
  totalValueRelation: "EQUAL_TO" | "GREATER_THAN" | "LESS_THAN";
  empty: boolean;
  hasPrevious: boolean;
  hasMore: boolean;
}

// Player profile with personal information and ratings
export interface ApiPlayerProfile {
  id: number;
  fullName: string;
  firstName?: string;
  lastName?: string;
  shortAddress: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  age: number;
  ratings: ApiPlayerRatings;
  distance: string;
  enablePrivacy: boolean;
  distanceInMiles: number;
  isPlayer1: boolean;
  verifiedEmail: boolean;
  registrationType?: "INVITATION" | string;
  registered: boolean;
  duprId: string;
  showRatingBanner: boolean;
  status: "ACTIVE" | string;
  sponsor: Record<string, any>;
  lucraConnected: boolean;
}

// Player ratings information
export interface ApiPlayerRatings {
  singles: string;
  singlesVerified: string;
  singlesProvisional: boolean;
  singlesReliabilityScore?: number;
  doubles: string;
  doublesVerified: string;
  doublesProvisional: boolean;
  doublesReliabilityScore?: number;
  defaultRating?: "SINGLES" | "DOUBLES";
  provisionalRatings: {
    singlesRating: string | null;
    doublesRating: string | null;
    coach: string | null;
  };
}

// Match-related types
export interface ApiMatchResponse {
  status: string;
  result: ApiMatchPaginatedResult;
}

export interface ApiMatchPaginatedResult {
  offset: number;
  limit: number;
  total: number;
  hits: ApiMatch[];
  totalValueRelation: "EQUAL_TO" | "GREATER_THAN" | "LESS_THAN";
  empty: boolean;
  hasPrevious: boolean;
  hasMore: boolean;
}

export interface ApiMatch {
  id: number;
  matchId: number;
  userId: number;
  displayIdentity: string;
  venue: string;
  location: string;
  matchScoreAdded: boolean;
  league: string;
  eventDate: string;
  eventFormat: "SINGLES" | "DOUBLES";
  confirmed: boolean;
  teams: ApiMatchTeam[];
  created: string;
  modified: string;
  eventName: string;
  matchSource: string;
  noOfGames: number;
  status: string;
  matchType: string;
  eloCalculated: boolean;
  initialization: boolean;
}

export interface ApiMatchTeam {
  id: number;
  serial: number;
  player1: ApiMatchPlayer;
  player2: ApiMatchPlayer;
  game1: number;
  game2: number;
  game3: number;
  game4: number;
  game5: number;
  winner: boolean;
  delta: string;
  teamRating: string;
  preMatchRatingAndImpact: ApiPreMatchRatingAndImpact;
}

export interface ApiMatchPlayer {
  id: number;
  fullName: string;
  duprId: string;
  imageUrl: string | null;
  allowSubstitution: boolean;
  postMatchRating: {
    singles: number | null;
    doubles: number | null;
  };
  validatedMatch: boolean;
}

export interface ApiPreMatchRatingAndImpact {
  preMatchSingleRatingPlayer1: number | null;
  matchSingleRatingImpactPlayer1: number | null;
  preMatchDoubleRatingPlayer1: number | null;
  matchDoubleRatingImpactPlayer1: number | null;
  preMatchSingleRatingPlayer2: number | null;
  matchSingleRatingImpactPlayer2: number | null;
  preMatchDoubleRatingPlayer2: number | null;
  matchDoubleRatingImpactPlayer2: number | null;
}