
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import CSVUploader from "./CSVUploader";
import { useTournament } from "../contexts/TournamentContext";

const NewRoundCreator = () => {
  const [roundType, setRoundType] = useState<"elo" | "score">("score");
  const { startNewRound, updatePlayers } = useTournament();

  const handleCSVUpload = (csv: string) => {
    updatePlayers(csv);
  };

  const handleStartRound = () => {
    startNewRound(roundType);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Start New Round</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium">Pairing Method</h3>
              <RadioGroup 
                value={roundType} 
                onValueChange={(value) => setRoundType(value as "elo" | "score")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="elo" id="elo" />
                  <Label htmlFor="elo">ELO-Based Pairings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="score" id="score" />
                  <Label htmlFor="score">Score-Based Pairings</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              onClick={handleStartRound}
              className="bg-chess-accent hover:bg-chess-accent/90"
            >
              Generate New Round
            </Button>
          </div>
        </CardContent>
      </Card>

      <CSVUploader
        onUpload={handleCSVUpload}
        title="Update Players & Scores"
        description="Upload a CSV with format: Name, ELO, School Name, Total Score (only first 4 columns will be used)"
        buttonText="Update Players"
      />
    </div>
  );
};

export default NewRoundCreator;
