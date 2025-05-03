
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      // Default to ELO-based for first round
      initializeTournament(name, csvData, "elo");
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <Card className="border-2 border-[#1A2750]/20 shadow-lg">
        <CardHeader className="warriors-header-gradient text-white">
          <CardTitle className="text-center">Create Tournament</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="tournamentName" className="text-[#1A2750] font-medium">Tournament Name</Label>
              <Input
                id="tournamentName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter tournament name"
                className="border-[#1A2750]/20 focus:border-[#FECC00] focus:ring-[#FECC00]"
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

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleCreateTournament}
          disabled={!name || !csvData}
          className="bg-[#1A2750] hover:bg-[#1A2750]/90 text-white px-8 py-2 rounded-md transition-colors"
        >
          Create Tournament
        </Button>
      </div>
    </div>
  );
};

export default TournamentCreator;
