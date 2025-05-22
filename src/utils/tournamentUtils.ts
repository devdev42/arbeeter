import { Player, Pairing, Round } from "../types/chess";

// Function to parse CSV data
export const parseCSV = (csvData: string, hasScore: boolean = false): Player[] => {
  const lines = csvData.trim().split('\n');
  const players: Player[] = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    
    if (values.length >= 3) {
      const player: Player = {
        name: values[0].trim(),
        elo: parseInt(values[1].trim()) || 0,
        school: values[2].trim(),
        opponents: [],
        id: `player-${i}-${Date.now()}`
      };
      
      // Only use the total score (4th column) if it exists and hasScore is true
      if (hasScore && values.length >= 4) {
        player.score = parseFloat(values[3].trim()) || 0;
      } else {
        player.score = 0;
      }
      
      players.push(player);
    }
  }
  
  return players;
};

// Function to generate pairings based on ELO
export const generateEloPairings = (players: Player[]): Pairing[] => {
  // Sort players by ELO
  const sortedPlayers = [...players].sort((a, b) => b.elo - a.elo);
  return generatePairingsWithSchoolCheck(sortedPlayers);
};

// Function to generate pairings based on score
export const generateScorePairings = (players: Player[]): Pairing[] => {
  // Sort players by score and then by ELO for tiebreaker
  const sortedPlayers = [...players].sort((a, b) => {
    if ((b.score || 0) === (a.score || 0)) {
      return b.elo - a.elo;
    }
    return (b.score || 0) - (a.score || 0);
  });
  
  return generatePairingsWithSchoolCheck(sortedPlayers);
};

// Function to generate pairings based on score first, then rating (Score/Rating pairing)
export const generateScoreRatingPairings = (players: Player[]): Pairing[] => {
  // Group players by score buckets
  const playersByScore = new Map<number, Player[]>();
  
  players.forEach(player => {
    const score = player.score || 0;
    if (!playersByScore.has(score)) {
      playersByScore.set(score, []);
    }
    playersByScore.get(score)!.push(player);
  });
  
  // Sort score buckets in descending order
  const sortedScores = Array.from(playersByScore.keys()).sort((a, b) => b - a);
  
  // Process each score group separately to create pairings
  const pairings: Pairing[] = [];
  const remainingPlayers: Player[] = [];
  
  // First, sort players within each score bucket by rating and create pairings
  for (const score of sortedScores) {
    const playersWithSameScore = playersByScore.get(score)!;
    
    // Sort by rating within the score bucket
    playersWithSameScore.sort((a, b) => b.elo - a.elo);
    
    // If we have an odd number of players in this score bucket and there are more score buckets coming,
    // save the last player to be paired with someone from the next score bucket
    if (playersWithSameScore.length % 2 !== 0 && sortedScores.indexOf(score) < sortedScores.length - 1) {
      // Process pairs within this score bucket
      for (let i = 0; i < playersWithSameScore.length - 1; i += 2) {
        const whitePlayer = playersWithSameScore[i];
        const blackPlayer = playersWithSameScore[i + 1];
        
        // Skip if they've already played each other
        if (whitePlayer.opponents?.includes(blackPlayer.id || '') || blackPlayer.opponents?.includes(whitePlayer.id || '')) {
          // If they've already played, add both to remainingPlayers for later pairing
          remainingPlayers.push(whitePlayer, blackPlayer);
          continue;
        }
        
        // Update opponents lists
        if (!whitePlayer.opponents) whitePlayer.opponents = [];
        if (!blackPlayer.opponents) blackPlayer.opponents = [];
        
        whitePlayer.opponents.push(blackPlayer.id || '');
        blackPlayer.opponents.push(whitePlayer.id || '');
        
        pairings.push({ white: whitePlayer, black: blackPlayer });
      }
      
      // Add the last player to remainingPlayers
      remainingPlayers.push(playersWithSameScore[playersWithSameScore.length - 1]);
    } else {
      // Process all players in this score bucket
      for (let i = 0; i < playersWithSameScore.length; i += 2) {
        if (i + 1 >= playersWithSameScore.length) {
          // Odd player out, add to remainingPlayers
          remainingPlayers.push(playersWithSameScore[i]);
          continue;
        }
        
        const whitePlayer = playersWithSameScore[i];
        const blackPlayer = playersWithSameScore[i + 1];
        
        // Skip if they've already played each other
        if (whitePlayer.opponents?.includes(blackPlayer.id || '') || blackPlayer.opponents?.includes(whitePlayer.id || '')) {
          // If they've already played, add both to remainingPlayers for later pairing
          remainingPlayers.push(whitePlayer, blackPlayer);
          continue;
        }
        
        // Update opponents lists
        if (!whitePlayer.opponents) whitePlayer.opponents = [];
        if (!blackPlayer.opponents) blackPlayer.opponents = [];
        
        whitePlayer.opponents.push(blackPlayer.id || '');
        blackPlayer.opponents.push(whitePlayer.id || '');
        
        pairings.push({ white: whitePlayer, black: blackPlayer });
      }
    }
  }
  
  // If we have any remaining players that couldn't be paired within their score groups
  if (remainingPlayers.length > 0) {
    // Sort remaining players by score first, then by rating
    remainingPlayers.sort((a, b) => {
      if ((b.score || 0) === (a.score || 0)) {
        return b.elo - a.elo;
      }
      return (b.score || 0) - (a.score || 0);
    });
    
    // Use the school-checking pairing function for remaining players
    const remainingPairings = generatePairingsWithSchoolCheck(remainingPlayers);
    pairings.push(...remainingPairings);
  }
  
  return pairings;
};

// Helper function to generate pairings while avoiding school conflicts and previous opponents
const generatePairingsWithSchoolCheck = (sortedPlayers: Player[]): Pairing[] => {
  const pairings: Pairing[] = [];
  const remainingPlayers = [...sortedPlayers];
  
  while (remainingPlayers.length >= 2) {
    const whitePlayer = remainingPlayers.shift()!;
    let blackPlayerIndex = -1;
    
    // First priority: Find an opponent from a different school and not played before
    for (let i = 0; i < remainingPlayers.length; i++) {
      const potentialOpponent = remainingPlayers[i];
      
      const differentSchools = whitePlayer.school !== potentialOpponent.school;
      const notPlayedBefore = !whitePlayer.opponents?.includes(potentialOpponent.id) && 
                              !potentialOpponent.opponents?.includes(whitePlayer.id);
      
      if (differentSchools && notPlayedBefore) {
        blackPlayerIndex = i;
        break;
      }
    }
    
    // Second priority: Find an opponent not played before (even if same school)
    if (blackPlayerIndex === -1) {
      for (let i = 0; i < remainingPlayers.length; i++) {
        const potentialOpponent = remainingPlayers[i];
        
        const notPlayedBefore = !whitePlayer.opponents?.includes(potentialOpponent.id) && 
                                !potentialOpponent.opponents?.includes(whitePlayer.id);
        
        if (notPlayedBefore) {
          blackPlayerIndex = i;
          break;
        }
      }
    }
    
    // Last resort: Take the first available opponent
    // This should only happen if all remaining players have already played against this player
    if (blackPlayerIndex === -1) {
      console.log(`Warning: Player ${whitePlayer.name} has already played against all remaining opponents.`);
      blackPlayerIndex = 0;
    }
    
    const blackPlayer = remainingPlayers.splice(blackPlayerIndex, 1)[0];
    
    // Update opponents lists
    if (!whitePlayer.opponents) whitePlayer.opponents = [];
    if (!blackPlayer.opponents) blackPlayer.opponents = [];
    
    whitePlayer.opponents.push(blackPlayer.id);
    blackPlayer.opponents.push(whitePlayer.id);
    
    pairings.push({ white: whitePlayer, black: blackPlayer });
  }
  
  // Handle odd number of players (give the last player a bye)
  if (remainingPlayers.length === 1) {
    const byePlayer = remainingPlayers[0];
    console.log(`Player ${byePlayer.name} has a bye this round.`);
    
    const byeOpponent: Player = {
      name: "BYE",
      elo: 0,
      school: "BYE",
      score: 0,
      id: "bye"
    };
    
    pairings.push({ white: byePlayer, black: byeOpponent });
  }
  
  return pairings;
};

// Function to convert players to CSV
export const playersToCSV = (players: Player[]): string => {
  let csv = "Name,ELO,School,Score\n";
  
  players.forEach(player => {
    csv += `${player.name},${player.elo},${player.school},${player.score || 0}\n`;
  });
  
  return csv;
};

// Function to generate standings sorted by score and then ELO
export const generateStandings = (players: Player[]): Player[] => {
  return [...players]
    .filter(player => player.name !== "BYE") // Filter out BYE players
    .sort((a, b) => {
      if ((b.score || 0) === (a.score || 0)) {
        return b.elo - a.elo;
      }
      return (b.score || 0) - (a.score || 0);
    });
};

// Interface for school standings
interface SchoolStanding {
  name: string;
  playerCount: number;
  totalScore: number;
  averageElo: number;
}

// Function to generate school standings
export const generateSchoolStandings = (players: Player[]): SchoolStanding[] => {
  const schoolMap = new Map<string, { players: Player[], totalScore: number, totalElo: number }>();
  
  // Filter out BYE players and group players by school
  players
    .filter(player => player.name !== "BYE")
    .forEach(player => {
      const schoolName = player.school;
      if (!schoolMap.has(schoolName)) {
        schoolMap.set(schoolName, { 
          players: [], 
          totalScore: 0, 
          totalElo: 0 
        });
      }
      
      const schoolData = schoolMap.get(schoolName)!;
      schoolData.players.push(player);
      schoolData.totalScore += player.score || 0;
      schoolData.totalElo += player.elo;
    });
  
  // Convert map to array and calculate stats
  const schoolStandings: SchoolStanding[] = Array.from(schoolMap.entries()).map(([name, data]) => {
    return {
      name,
      playerCount: data.players.length,
      totalScore: data.totalScore,
      averageElo: data.totalElo / data.players.length
    };
  });
  
  // Sort by total score (descending)
  return schoolStandings.sort((a, b) => b.totalScore - a.totalScore);
};

// Function to generate new round
export const generateNewRound = (players: Player[], roundType: "elo" | "score" | "score-rating", roundNumber: number): Round => {
  let pairings: Pairing[];
  
  switch (roundType) {
    case "elo":
      pairings = generateEloPairings(players);
      break;
    case "score":
      pairings = generateScorePairings(players);
      break;
    case "score-rating":
      pairings = generateScoreRatingPairings(players);
      break;
    default:
      pairings = generateScorePairings(players);
  }
    
  return {
    number: roundNumber,
    pairings,
    type: roundType
  };
};

// Interface for storing parsed pairing data
interface PreviousPairing {
  round: number;
  white: string;
  black: string;
}

// Function to parse previous pairings CSV
export const parsePreviousPairingsCSV = (
  csvData: string,
  players: Player[]
): { pairings: PreviousPairing[], errors: string[] } => {
  const lines = csvData.trim().split('\n');
  const pairings: PreviousPairing[] = [];
  const errors: string[] = [];
  const playerNames = players
    .filter(player => player.name !== "BYE")
    .map(player => player.name);
  
  // Ensure CSV has a header row
  if (lines.length < 2) {
    errors.push("CSV must contain a header row and at least one pairing");
    return { pairings, errors };
  }
  
  // Check header
  const header = lines[0].toLowerCase().split(',');
  if (!header.includes('round') || !header.includes('white') || !header.includes('black')) {
    errors.push("CSV header must include 'Round', 'White', and 'Black' columns");
    return { pairings, errors };
  }
  
  // Find column indices
  const roundIdx = header.indexOf('round');
  const whiteIdx = header.indexOf('white');
  const blackIdx = header.indexOf('black');
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    
    const values = lines[i].split(',');
    
    if (values.length <= Math.max(roundIdx, whiteIdx, blackIdx)) {
      errors.push(`Line ${i + 1}: Missing required columns`);
      continue;
    }
    
    const round = parseInt(values[roundIdx].trim());
    const white = values[whiteIdx].trim();
    const black = values[blackIdx].trim();
    
    if (isNaN(round) || round <= 0) {
      errors.push(`Line ${i + 1}: Invalid round number "${values[roundIdx]}"`);
      continue;
    }
    
    if (!playerNames.includes(white)) {
      errors.push(`Line ${i + 1}: White player "${white}" not found in tournament`);
      continue;
    }
    
    if (!playerNames.includes(black)) {
      errors.push(`Line ${i + 1}: Black player "${black}" not found in tournament`);
      continue;
    }
    
    pairings.push({ round, white, black });
  }
  
  return { pairings, errors };
};
