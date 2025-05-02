
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pairing, Round } from "../types/chess";

interface PairingsListProps {
  round: Round;
}

const PairingsList = ({ round }: PairingsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Round {round.number} Pairings
          <span className="text-sm font-normal ml-2">
            ({round.type === "elo" ? "ELO-based" : "Score-based"})
          </span>
        </CardTitle>
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
