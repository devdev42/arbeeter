
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CSVUploader from "./CSVUploader";
import { useTournament } from "../contexts/TournamentContext";

const TournamentCreator = () => {
  const [name, setName] = useState("");
  const [csvData, setCsvData] = useState<string | null>(null);
  const [firstRoundType, setFirstRoundType] = useState<"elo" | "score">("elo");
  const { initializeTournament } = useTournament();

  const handleCSVUpload = (csv: string) => {
    setCsvData(csv);
  };

  const handleCreateTournament = () => {
    if (name && csvData) {
      initializeTournament(name, csvData, firstRoundType);
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
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">First Round Pairing Method</h3>
              <RadioGroup 
                value={firstRoundType} 
                onValueChange={(value) => setFirstRoundType(value as "elo" | "score")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="elo" id="first-round-elo" />
                  <Label htmlFor="first-round-elo">ELO-Based Pairings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="score" id="first-round-score" />
                  <Label htmlFor="first-round-score">Score-Based Pairings</Label>
                </div>
              </RadioGroup>
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
