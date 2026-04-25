"use client";

import {
  useState,
  useRef,
  useEffect,
  type ElementType,
  type KeyboardEvent,
} from "react";
import { Pencil } from "lucide-react";
import { useSiteContent } from "@/contexts/SiteContentContext";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div" | "li";

interface EditableTextProps {
  contentKey: string;
  className?: string;
  tag?: Tag;
  multiline?: boolean;
}

export default function EditableText({
  contentKey,
  className = "",
  tag = "span",
  multiline = false,
}: EditableTextProps) {
  const { content, isAdmin, isEditMode, updateContent } = useSiteContent();
  const value = content[contentKey] ?? "";

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => { setDraft(content[contentKey] ?? ""); }, [content, contentKey]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const save = () => {
    setEditing(false);
    if (draft !== (content[contentKey] ?? "")) updateContent(contentKey, draft);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) { e.preventDefault(); save(); }
    if (e.key === "Escape") { setDraft(content[contentKey] ?? ""); setEditing(false); }
  };

  if (!isAdmin || !isEditMode) {
    const Tag = tag as ElementType;
    return <Tag className={className}>{value}</Tag>;
  }

  if (editing) {
    const shared = {
      ref: inputRef,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setDraft(e.target.value),
      onBlur: save,
      onKeyDown,
      onClick: (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); },
      className: `${className} bg-black/30 border border-blue-400 outline-none px-1`,
    };
    return multiline ? (
      <textarea {...(shared as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} rows={3} style={{ width: "100%", resize: "vertical" }} />
    ) : (
      <input {...(shared as React.InputHTMLAttributes<HTMLInputElement>)} style={{ width: "100%" }} />
    );
  }

  const Tag = tag as ElementType;
  return (
    <Tag
      className={`${className} relative group cursor-pointer`}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setEditing(true);
      }}
    >
      {value || <span className="opacity-30 italic">clique para editar</span>}
      <span className="absolute -top-6 left-0 hidden group-hover:flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 z-50 whitespace-nowrap pointer-events-none">
        <Pencil size={8} /> Editar texto
      </span>
      <span className="absolute inset-0 outline outline-2 outline-dashed outline-blue-400/50 pointer-events-none" />
    </Tag>
  );
}
