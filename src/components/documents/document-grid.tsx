"use client";

import * as React from "react";
import { DocumentCard } from "./document-card";
import { useDocumentStore } from "@/stores";
import type { Document } from "@/schemas";

interface DocumentGridProps {
  documents: Document[];
}

export function DocumentGrid({ documents }: DocumentGridProps) {
  const { viewMode, selectedDocuments, toggleDocumentSelection, setCurrentDocument } = useDocumentStore();

  const handleDocumentClick = (document: Document) => {
    setCurrentDocument(document);
  };

  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            viewMode="list"
            isSelected={selectedDocuments.has(doc.id)}
            onSelect={toggleDocumentSelection}
            onClick={handleDocumentClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          viewMode="grid"
          isSelected={selectedDocuments.has(doc.id)}
          onSelect={toggleDocumentSelection}
          onClick={handleDocumentClick}
        />
      ))}
    </div>
  );
}
