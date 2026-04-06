import { useCallback, useState, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const MAX_SIZE = 10 * 1024 * 1024;

export function ImageUpload({ onFileSelected, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validate = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) return "Only PNG, JPG and JPEG images are allowed.";
    if (file.size > MAX_SIZE) return "File size must be under 10 MB.";
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const err = validate(file);
      if (err) {
        setError(err);
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    setPreview(null);
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="space-y-3">
      {!preview ? (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 cursor-pointer transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        >
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-center">
            <p className="font-medium">Drag & drop tumor image here</p>
            <p className="text-sm text-muted-foreground">or click to browse (PNG, JPG — max 10 MB)</p>
          </div>
          <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={onChange} disabled={disabled} />
        </label>
      ) : (
        <div className="relative rounded-lg border overflow-hidden">
          <img src={preview} alt="Selected scan" className="w-full max-h-72 object-contain bg-muted/30" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={clear}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 p-3 bg-muted/50 text-sm">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{selectedFile?.name}</span>
            <span className="text-muted-foreground ml-auto">
              {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive font-medium">{error}</p>
      )}
    </div>
  );
}
