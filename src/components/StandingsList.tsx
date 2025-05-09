
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Player } from "../types/chess";
import { generateStandings, generateSchoolStandings } from "../utils/tournamentUtils";

interface StandingsListProps {
  players: Player[];
  exportStandings: () => string;
}

const StandingsList = ({ players, exportStandings }: StandingsListProps) => {
  const standings = generateStandings(players);
  const schoolStandings = generateSchoolStandings(players);

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
        <Tabs defaultValue="players" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#1A2750]/10 mb-4">
            <TabsTrigger 
              value="players" 
              className="data-[state=active]:bg-[#1A2750] data-[state=active]:text-[#FECC00]"
            >
              Player Standings
            </TabsTrigger>
            <TabsTrigger 
              value="schools"
              className="data-[state=active]:bg-[#1A2750] data-[state=active]:text-[#FECC00]"
            >
              School Standings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="players">
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
          </TabsContent>
          
          <TabsContent value="schools">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Players</TableHead>
                  <TableHead>Avg. ELO</TableHead>
                  <TableHead>Total Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolStandings.map((school, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{school.name}</TableCell>
                    <TableCell>{school.playerCount}</TableCell>
                    <TableCell>{Math.round(school.averageElo)}</TableCell>
                    <TableCell>{school.totalScore.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StandingsList;
