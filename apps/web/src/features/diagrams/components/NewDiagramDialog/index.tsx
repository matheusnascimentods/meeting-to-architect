import { useState, useRef } from "react";
import { Dialog, Box, Button, Text, FormControl, IconButton, Flash, Spinner } from "@primer/react";
import * as Icons from "@primer/octicons-react";
import { DiagramType } from "@/features/diagrams/types";
import { api } from "@/shared/lib/api";
import { DIAGRAM_CATEGORIES, DIAGRAM_TYPES, TYPE_LABELS, DiagramCategory } from "./diagram-types";

const ALLOWED_EXTS = ['pdf', 'md', 'txt', 'vtt', 'srt'];

interface Props { onClose: () => void; onSuccess?: (d: any) => void }

export function NewDiagramDialog({ onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DiagramCategory>("structural");
  const [selected, setSelected] = useState<DiagramType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const canGenerate = file && selected && !loading;
  const filteredTypes = DIAGRAM_TYPES.filter(t => t.category === category);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = f.name.split('.').pop()?.toLowerCase();
    ext && ALLOWED_EXTS.includes(ext) ? (setFile(f), setError(null)) : setError(`Unsupported format. Use: ${ALLOWED_EXTS.join(', ')}`);
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true); setError(null);
    const form = new FormData();
    form.append("file", file); form.append("diagramType", selected);
    try {
      const { data } = await api.post("/agents/generate", form, { headers: { "Content-Type": "multipart/form-data" } });
      onSuccess?.(data); onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to generate diagram. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <Dialog
      title="New Diagram"
      subtitle="Upload a transcript and choose the type of diagram you want to generate."
      onClose={onClose}
      width="xlarge"
      footerButtons={[
        { content: "Cancel", buttonType: "default", onClick: onClose, disabled: loading },
        {
          content: loading ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Spinner size="small" /><Text>Generating...</Text></Box> : (selected ? `Generate ${TYPE_LABELS[selected]}` : "Generate Diagram"),
          buttonType: "primary", disabled: !canGenerate, onClick: handleGenerate,
        },
      ]}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: 560 }}>
        {error && <Flash variant="danger">{error}</Flash>}

        {/* Upload */}
        <FormControl>
          <FormControl.Label>Transcript File</FormControl.Label>
          {file ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, borderRadius: 2, border: '1px solid', borderColor: 'border.default', bg: 'canvas.subtle' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Icons.FileIcon size={18} />
                <Text sx={{ fontSize: 1, fontWeight: 'medium' }}>{file.name}</Text>
              </Box>
              <IconButton icon={Icons.XIcon} aria-label="Remove file" variant="invisible" size="small" onClick={() => setFile(null)} disabled={loading} />
            </Box>
          ) : (
            <Box onClick={() => !loading && fileRef.current?.click()} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 2, p: 4, borderRadius: 2, border: '2px dashed', borderColor: 'border.default', bg: 'canvas.subtle', textAlign: 'center', cursor: loading ? 'default' : 'pointer', transition: 'background 0.2s ease', '&:hover': { bg: loading ? 'canvas.subtle' : 'actionListItem.defaultHoverBg' } }}>
              <input type="file" ref={fileRef} style={{ display: 'none' }} accept=".pdf,.md,.txt,.vtt,.srt" onChange={handleFile} />
              <Box sx={{ color: 'fg.muted' }}><Icons.UploadIcon size={32} /></Box>
              <Text sx={{ fontSize: 1, fontWeight: 'medium' }}>Click or drag your transcript here</Text>
              <Text sx={{ fontSize: 0, color: 'fg.muted' }}>.pdf, .md, .txt, .vtt or .srt — max 10MB</Text>
              <Button size="small" disabled={loading} sx={{ mt: 1 }}>Select file</Button>
            </Box>
          )}
        </FormControl>

        {/* Diagram type */}
        <Box sx={{ width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <FormControl>
            <FormControl.Label>Diagram Type</FormControl.Label>

            {/* Category tabs */}
            <Box role="tablist" sx={{ display: 'flex', width: '100%', gap: 1, mt: 2, borderBottom: '1px solid', borderColor: 'border.default' }}>
              {DIAGRAM_CATEGORIES.map(cat => {
                const active = category === cat.id;
                return (
                  <Box key={cat.id} as="button" role="tab" aria-selected={active}
                    onClick={() => { setCategory(cat.id); setSelected(null); }}
                    sx={{ flex: 1, bg: 'transparent', border: 'none', p: 2, mb: '-1px', fontSize: 1, fontWeight: active ? 'semibold' : 'medium', color: active ? 'accent.fg' : 'fg.muted', borderBottom: active ? '2px solid' : '2px solid transparent', borderBottomColor: active ? 'accent.fg' : 'transparent', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', '&:hover': { color: active ? 'accent.fg' : 'fg.default' } }}>
                    {cat.label}
                  </Box>
                );
              })}
            </Box>

            {/* Type grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 3, overflowY: 'auto', flex: 1, minHeight: 0, pr: 1 }}>
              {filteredTypes.map(t => {
                const isSelected = selected === t.id;
                const Icon = (Icons as any)[t.icon] ?? Icons.CodeSquareIcon;
                return (
                  <Box key={t.id} role="button" tabIndex={0}
                    onClick={() => !loading && setSelected(t.id as DiagramType)}
                    onKeyDown={(e: React.KeyboardEvent) => { if ((e.key === "Enter" || e.key === " ") && !loading) { e.preventDefault(); setSelected(t.id as DiagramType); } }}
                    sx={{ gridColumn: t.id === 'c4' ? '1 / -1' : 'auto', minHeight: 80, p: 3, borderRadius: 2, cursor: loading ? 'default' : 'pointer', border: '1px solid', borderColor: isSelected ? 'accent.fg' : 'border.default', boxShadow: isSelected ? '0 0 0 1px var(--fgColor-accent)' : 'none', bg: isSelected ? 'accent.subtle' : 'canvas.default', transition: 'all 0.15s ease', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', '&:hover': { bg: isSelected ? 'accent.subtle' : 'canvas.subtle' } }}>
                    <Box sx={{ color: isSelected ? 'accent.fg' : 'fg.muted', display: 'inline-flex' }}><Icon size={20} /></Box>
                    <Text sx={{ fontSize: 1, fontWeight: 'bold' }}>{t.label}</Text>
                    <Text sx={{ fontSize: 0, color: 'fg.muted', lineHeight: 1.4 }}>{t.description}</Text>
                  </Box>
                );
              })}
            </Box>

            <FormControl.Caption sx={{ mt: 2 }}>
              Select the category and diagram type that best represents the content of your transcript.
            </FormControl.Caption>
          </FormControl>
        </Box>
      </Box>
    </Dialog>
  );
}
