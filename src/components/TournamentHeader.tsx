
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTournament } from "../contexts/TournamentContext";

const TournamentHeader = () => {
  const { tournament } = useTournament();

  if (!tournament) return null;

  return (
    <Card className="bg-chess-black/10">
      <CardHeader>
        <CardTitle className="text-2xl">{tournament.name}</CardTitle>
        <CardDescription>
          {tournament.players.length} Players • Round {tournament.currentRound}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <div className="rounded-md bg-primary/10 p-2">
            <p className="text-sm font-medium">Total Players</p>
            <p className="text-2xl font-bold">{tournament.players.filter(p => p.name !== "BYE").length}</p>
          </div>
          <div className="rounded-md bg-primary/10 p-2">
            <p className="text-sm font-medium">Current Round</p>
            <p className="text-2xl font-bold">{tournament.currentRound}</p>
          </div>
          <div className="rounded-md bg-primary/10 p-2">
            <p className="text-sm font-medium">Round Type</p>
            <p className="text-2xl font-bold">
              {tournament.rounds[tournament.currentRound - 1]?.type === "elo" ? "ELO-Based" : "Score-Based"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentHeader;
