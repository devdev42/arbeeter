
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CSVUploaderProps {
  onUpload: (csv: string) => void;
  title: string;
  description?: string;
  buttonText?: string;
}

const CSVUploader = ({
  onUpload,
  title,
  description,
  buttonText = "Import CSV"
}: CSVUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const text = await file.text();
      onUpload(text);
      setFile(null);
      // Reset the input to allow uploading the same file again
      const input = document.getElementById('csvFile') as HTMLInputElement;
      if (input) input.value = '';
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csvFile">CSV File</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          disabled={!file}
          className="bg-chess-accent hover:bg-chess-accent/90"
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CSVUploader;
