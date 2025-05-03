
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
        <LoaderCircle className="animate-spin h-8 w-8 text-[#1A2750]" />
      </div>
    );
  }

  if (!tournament) {
    return <TournamentCreator />;
  }

  return (
    <div className="space-y-6">
      <TournamentHeader />
      
      <Tabs defaultValue="pairings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#1A2750]/10">
          <TabsTrigger 
            value="pairings" 
            className="data-[state=active]:bg-[#1A2750] data-[state=active]:text-white"
          >
            Current Pairings
          </TabsTrigger>
          <TabsTrigger 
            value="standings"
            className="data-[state=active]:bg-[#1A2750] data-[state=active]:text-white"
          >
            Standings
          </TabsTrigger>
          <TabsTrigger 
            value="nextRound"
            className="data-[state=active]:bg-[#1A2750] data-[state=active]:text-white"
          >
            Next Round
          </TabsTrigger>
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
        <header className="mb-10 text-center flex flex-col items-center">
          <div className="mb-4">
            <img 
              src="/lovable-uploads/2430fcde-9a4a-4859-a9d4-454afac56eab.png" 
              alt="Warriors Port Credit Logo" 
              className="h-32 w-32" 
            />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-[#1A2750]">Chess Tournament Manager</h1>
          <p className="text-[#1A2750]/80 text-lg">Port Credit Warriors Chess Club</p>
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
