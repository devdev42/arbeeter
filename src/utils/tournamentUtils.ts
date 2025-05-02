
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

// Helper function to generate pairings while avoiding school conflicts
const generatePairingsWithSchoolCheck = (sortedPlayers: Player[]): Pairing[] => {
  const pairings: Pairing[] = [];
  const remainingPlayers = [...sortedPlayers];
  
  while (remainingPlayers.length >= 2) {
    const whitePlayer = remainingPlayers.shift()!;
    let blackPlayerIndex = -1;
    
    // Try to find an opponent from a different school
    for (let i = 0; i < remainingPlayers.length; i++) {
      const potentialOpponent = remainingPlayers[i];
      
      // Check if players are from different schools and haven't played each other
      const differentSchools = whitePlayer.school !== potentialOpponent.school;
      const notPlayedBefore = !whitePlayer.opponents?.includes(potentialOpponent.id || '') && 
                              !potentialOpponent.opponents?.includes(whitePlayer.id || '');
      
      if (differentSchools && notPlayedBefore) {
        blackPlayerIndex = i;
        break;
      }
    }
    
    // If no suitable opponent found, take the first one (not ideal but prevents hanging)
    if (blackPlayerIndex === -1) {
      for (let i = 0; i < remainingPlayers.length; i++) {
        const potentialOpponent = remainingPlayers[i];
        const notPlayedBefore = !whitePlayer.opponents?.includes(potentialOpponent.id || '') && 
                                !potentialOpponent.opponents?.includes(whitePlayer.id || '');
                                
        if (notPlayedBefore) {
          blackPlayerIndex = i;
          break;
        }
      }
      
      // If still no suitable opponent found, just take the first player
      if (blackPlayerIndex === -1) {
        blackPlayerIndex = 0;
      }
    }
    
    const blackPlayer = remainingPlayers.splice(blackPlayerIndex, 1)[0];
    
    // Update opponents lists
    whitePlayer.opponents = [...(whitePlayer.opponents || []), blackPlayer.id || ''];
    blackPlayer.opponents = [...(blackPlayer.opponents || []), whitePlayer.id || ''];
    
    pairings.push({ white: whitePlayer, black: blackPlayer });
  }
  
  // Handle odd number of players (give the last player a bye)
  if (remainingPlayers.length === 1) {
    const byePlayer = remainingPlayers[0];
    console.log(`Player ${byePlayer.name} has a bye this round.`);
    
    // You could create a special pairing for a bye, or handle it separately
    // For now, we'll add a "bye" player
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

export const generateNewRound = (players: Player[], roundType: "elo" | "score", roundNumber: number): Round => {
  const pairings = roundType === "elo" 
    ? generateEloPairings(players) 
    : generateScorePairings(players);
    
  return {
    number: roundNumber,
    pairings,
    type: roundType
  };
};
