
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Pairing, Round } from "../types/chess";

interface PairingsListProps {
  round: Round;
}

const PairingsList = ({ round }: PairingsListProps) => {
  const exportPairingsCSV = () => {
    let csv = "Board,White Player,White ELO,White School,Black Player,Black ELO,Black School\n";
    
    round.pairings.forEach((pairing, index) => {
      const blackName = pairing.black.name === "BYE" ? "BYE" : pairing.black.name;
      const blackElo = pairing.black.name === "BYE" ? "" : pairing.black.elo;
      const blackSchool = pairing.black.name === "BYE" ? "" : pairing.black.school;
      
      csv += `${index + 1},${pairing.white.name},${pairing.white.elo},${pairing.white.school},${blackName},${blackElo},${blackSchool}\n`;
    });
    
    // Create a blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `round_${round.number}_pairings.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Round {round.number} Pairings
          <span className="text-sm font-normal ml-2">
            ({round.type === "elo" ? "ELO-based" : "Score-based"})
          </span>
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 border-[#1A2750] text-[#1A2750] hover:bg-[#1A2750]/10"
          onClick={exportPairingsCSV}
        >
          <FileText className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Board</TableHead>
              <TableHead>White</TableHead>
              <TableHead>White ELO</TableHead>
              <TableHead>White School</TableHead>
              <TableHead>Black</TableHead>
              <TableHead>Black ELO</TableHead>
              <TableHead>Black School</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {round.pairings.map((pairing, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{pairing.white.name}</TableCell>
                <TableCell>{pairing.white.elo}</TableCell>
                <TableCell>{pairing.white.school}</TableCell>
                <TableCell>
                  {pairing.black.name === "BYE" ? (
                    <span className="text-muted-foreground">BYE</span>
                  ) : (
                    pairing.black.name
                  )}
                </TableCell>
                <TableCell>
                  {pairing.black.name === "BYE" ? "-" : pairing.black.elo}
                </TableCell>
                <TableCell>
                  {pairing.black.name === "BYE" ? "-" : pairing.black.school}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PairingsList;
