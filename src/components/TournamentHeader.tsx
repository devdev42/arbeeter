
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTournament } from "../contexts/TournamentContext";

const TournamentHeader = () => {
  const { tournament, exitTournament } = useTournament();

  if (!tournament) return null;

  return (
    <Card className="bg-chess-black/10">
      <CardHeader className="relative">
        <div className="absolute right-6 top-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Exit Tournament</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Exit Tournament</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to exit this tournament? You will lose access to current pairings and standings.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={exitTournament}>
                  Exit Tournament
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
