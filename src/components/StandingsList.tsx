
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Player } from "../types/chess";
import { generateStandings } from "../utils/tournamentUtils";

interface StandingsListProps {
  players: Player[];
  exportStandings: () => string;
}

const StandingsList = ({ players, exportStandings }: StandingsListProps) => {
  const standings = generateStandings(players);

  const handleExport = () => {
    const csv = exportStandings();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tournament-standings.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Current Standings</CardTitle>
          <CardDescription>Ranked by score, then by ELO rating</CardDescription>
        </div>
        <Button onClick={handleExport} className="bg-[#1A2750] hover:bg-[#1A2750]/90 text-[#FECC00]">
          Export Standings
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>ELO</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((player, index) => (
              <TableRow key={player.id || index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.elo}</TableCell>
                <TableCell>{player.school}</TableCell>
                <TableCell>{player.score || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StandingsList;
