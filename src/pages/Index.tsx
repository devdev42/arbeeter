
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TournamentProvider } from "../contexts/TournamentContext";
import TournamentCreator from "../components/TournamentCreator";
import TournamentHeader from "../components/TournamentHeader";
import PairingsList from "../components/PairingsList";
import StandingsList from "../components/StandingsList";
import NewRoundCreator from "../components/NewRoundCreator";
import { useTournament } from "../contexts/TournamentContext";
import { LoaderCircle } from "lucide-react";

const TournamentManager = () => {
  const { tournament, isLoading, exportStandings } = useTournament();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <LoaderCircle className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!tournament) {
    return <TournamentCreator />;
  }

  return (
    <div className="space-y-6">
      <TournamentHeader />
      
      <Tabs defaultValue="pairings">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pairings">Current Pairings</TabsTrigger>
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="nextRound">Next Round</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pairings" className="mt-6">
          {tournament.rounds.length > 0 && (
            <PairingsList round={tournament.rounds[tournament.currentRound - 1]} />
          )}
        </TabsContent>
        
        <TabsContent value="standings" className="mt-6">
          <StandingsList players={tournament.players} exportStandings={exportStandings} />
        </TabsContent>
        
        <TabsContent value="nextRound" className="mt-6">
          <NewRoundCreator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen chess-bg">
      <div className="container py-8 max-w-7xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2">Chess Tournament Organizer</h1>
        </header>
        
        <main>
          <TournamentProvider>
            <TournamentManager />
          </TournamentProvider>
        </main>
      </div>
    </div>
  );
};

export default Index;
