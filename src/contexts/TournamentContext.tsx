import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tournament, Player, Round } from '../types/chess';
import { parseCSV, generateNewRound } from '../utils/tournamentUtils';
import { useToast } from "@/components/ui/use-toast";

interface TournamentContextType {
  tournament: Tournament | null;
  initializeTournament: (name: string, playersCSV: string, firstRoundType: "elo" | "score" | "score-rating") => void;
  startNewRound: (roundType: "elo" | "score" | "score-rating") => void;
  updatePlayers: (playersCSV: string) => void;
  exportStandings: () => string;
  exitTournament: () => void;
  isLoading: boolean;
}

const TournamentContext = createContext<TournamentContextType>({
  tournament: null,
  initializeTournament: () => {},
  startNewRound: () => {},
  updatePlayers: () => {},
  exportStandings: () => "",
  exitTournament: () => {},
  isLoading: false
});

export const useTournament = () => useContext(TournamentContext);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Load tournament data from localStorage on initial render
  useEffect(() => {
    const savedTournament = localStorage.getItem('chessOrganizerTournament');
    if (savedTournament) {
      try {
        setTournament(JSON.parse(savedTournament));
      } catch (error) {
        console.error("Error loading tournament from localStorage:", error);
        localStorage.removeItem('chessOrganizerTournament');
      }
    }
  }, []);

  // Save tournament data to localStorage whenever it changes
  useEffect(() => {
    if (tournament) {
      localStorage.setItem('chessOrganizerTournament', JSON.stringify(tournament));
    }
  }, [tournament]);

  const initializeTournament = (name: string, playersCSV: string, firstRoundType: "elo" | "score" | "score-rating") => {
    try {
      setIsLoading(true);
      
      // Parse the initial players CSV
      const players = parseCSV(playersCSV, false);
      
      if (players.length < 2) {
        toast({
          title: "Error",
          description: "Not enough players in the CSV. Need at least 2 players.",
          variant: "destructive"
        });
        return;
      }
      
      // Create the initial tournament structure
      const newTournament: Tournament = {
        name,
        players,
        rounds: [],
        currentRound: 0
      };
      
      setTournament(newTournament);
      
      // Start the first round with the selected pairing method
      startNewRound(firstRoundType);
      
      toast({
        title: "Tournament Created",
        description: `Tournament "${name}" initialized with ${players.length} players.`
      });
    } catch (error) {
      console.error("Error initializing tournament:", error);
      toast({
        title: "Error",
        description: "Failed to initialize tournament. Check your CSV format.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewRound = (roundType: "elo" | "score" | "score-rating") => {
    if (!tournament) return;
    
    try {
      setIsLoading(true);
      
      const roundNumber = tournament.currentRound + 1;
      const newRound = generateNewRound(tournament.players, roundType, roundNumber);
      
      setTournament(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          rounds: [...prev.rounds, newRound],
          currentRound: roundNumber
        };
      });
      
      toast({
        title: "New Round Started",
        description: `Round ${roundNumber} pairings generated based on ${roundType === "elo" ? "ELO ratings" : "scores"}.`
      });
    } catch (error) {
      console.error("Error starting new round:", error);
      toast({
        title: "Error",
        description: "Failed to generate pairings for the next round.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlayers = (playersCSV: string) => {
    if (!tournament) return;
    
    try {
      setIsLoading(true);
      
      // Parse the updated players CSV with scores
      const updatedPlayers = parseCSV(playersCSV, true);
      
      // Preserve opponent history from previous players
      const mergedPlayers = updatedPlayers.map(newPlayer => {
        const existingPlayer = tournament.players.find(p => p.name === newPlayer.name);
        if (existingPlayer) {
          return {
            ...newPlayer,
            opponents: existingPlayer.opponents || [],
            id: existingPlayer.id
          };
        }
        return newPlayer;
      });
      
      setTournament(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          players: mergedPlayers
        };
      });
      
      toast({
        title: "Players Updated",
        description: `${updatedPlayers.length} players updated with new scores.`
      });
    } catch (error) {
      console.error("Error updating players:", error);
      toast({
        title: "Error",
        description: "Failed to update players. Check your CSV format.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportStandings = (): string => {
    if (!tournament) return "";
    
    let csv = "Rank,Name,School,ELO,Score\n";
    
    tournament.players
      .filter(player => player.name !== "BYE")
      .sort((a, b) => {
        if ((b.score || 0) === (a.score || 0)) {
          return b.elo - a.elo;
        }
        return (b.score || 0) - (a.score || 0);
      })
      .forEach((player, index) => {
        csv += `${index + 1},${player.name},${player.school},${player.elo},${player.score || 0}\n`;
      });
    
    return csv;
  };

  const exitTournament = () => {
    setTournament(null);
    localStorage.removeItem('chessOrganizerTournament');
    toast({
      title: "Tournament Exited",
      description: "You have successfully exited the tournament."
    });
  };

  return (
    <TournamentContext.Provider
      value={{
        tournament,
        initializeTournament,
        startNewRound,
        updatePlayers,
        exportStandings,
        exitTournament,
        isLoading
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};
