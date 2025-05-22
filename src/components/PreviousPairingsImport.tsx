
import { useState } from "react";
import { useTournament } from "../contexts/TournamentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet } from "lucide-react";
import CSVUploader from "./CSVUploader";

const PreviousPairingsImport = () => {
  const { tournament, importPreviousPairings } = useTournament();
  const { toast } = useToast();
  const [csvText, setCsvText] = useState<string>("");

  const handleCSVUpload = (csv: string) => {
    setCsvText(csv);
  };

  const handleImport = () => {
    if (!csvText.trim()) {
      toast({
        title: "Error",
        description: "Upload or paste a CSV file first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = importPreviousPairings(csvText);
      toast({
        title: "Previous Pairings Imported",
        description: result,
      });
      setCsvText("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import pairings.",
        variant: "destructive",
      });
    }
  };

  const getExampleCSV = () => {
    if (!tournament || !tournament.players.length) return "";
    
    const players = tournament.players.filter(player => player.name !== "BYE").slice(0, 4);
    if (players.length < 2) return "Round,White,Black";
    
    let csv = "Round,White,Black\n";
    csv += `1,${players[0].name},${players[1].name}\n`;
    if (players.length >= 4) {
      csv += `1,${players[2].name},${players[3].name}\n`;
    }
    return csv;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Previous Pairings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert>
              <AlertTitle>How to use this feature</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  Import previous pairings from a CSV file to ensure no players are paired against each other twice.
                </p>
                <p className="mb-2">
                  CSV in this order: Round, White, Black. Example:
                </p>
                <pre className="bg-slate-100 p-2 rounded text-sm overflow-auto">
                  {"Round,White,Black\n1,joe,catie"}
                </pre>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <CSVUploader
                onUpload={handleCSVUpload}
                title="Upload Previous Pairings"
                description="Upload a CSV with format: Round, White, Black"
                buttonText="Upload Pairings CSV"
              />
              
              <div className="border p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Or paste CSV content here:</h3>
                <Textarea
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="Round,White,Black"
                  className="h-32 mb-4"
                />
                <Button 
                  onClick={handleImport}
                  disabled={!csvText.trim()}
                  className="bg-[#1A2750] hover:bg-[#1A2750]/90 text-[#FECC00]"
                >
                  Import Pairings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviousPairingsImport;
