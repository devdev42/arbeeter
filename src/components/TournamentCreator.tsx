
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CSVUploader from "./CSVUploader";
import { useTournament } from "../contexts/TournamentContext";

const TournamentCreator = () => {
  const [name, setName] = useState("");
  const [csvData, setCsvData] = useState<string | null>(null);
  const { initializeTournament } = useTournament();

  const handleCSVUpload = (csv: string) => {
    setCsvData(csv);
  };

  const handleCreateTournament = () => {
    if (name && csvData) {
      initializeTournament(name, csvData);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Tournament</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="tournamentName">Tournament Name</Label>
              <Input
                id="tournamentName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter tournament name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <CSVUploader
        onUpload={handleCSVUpload}
        title="Upload Player List"
        description="Upload a CSV with format: Name, ELO, School Name"
        buttonText="Upload Players"
      />

      <Button
        onClick={handleCreateTournament}
        disabled={!name || !csvData}
        className="bg-chess-accent hover:bg-chess-accent/90"
      >
        Create Tournament
      </Button>
    </div>
  );
};

export default TournamentCreator;
