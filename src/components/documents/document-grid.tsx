"use client";

import * as React from "react";
import { DocumentCard } from "./document-card";
import { useDocumentStore } from "@/stores";
import { useShallow } from "zustand/react/shallow";
import type { DisplayDocument } from "@/types/ui-document";

interface DocumentGridProps {
  documents: DisplayDocument[];
}

export const DocumentGrid = React.memo(function DocumentGrid({ documents }: DocumentGridProps) {
  // Use shallow comparison to prevent re-renders when unrelated state changes
  const { viewMode, selectedDocuments, toggleDocumentSelection, setCurrentDocument } = useDocumentStore(
    useShallow((state) => ({
      viewMode: state.viewMode,
      selectedDocuments: state.selectedDocuments,
      toggleDocumentSelection: state.toggleDocumentSelection,
      setCurrentDocument: state.setCurrentDocument,
    }))
  );

  const handleDocumentClick = React.useCallback((document: DisplayDocument) => {
    setCurrentDocument(document as Parameters<typeof setCurrentDocument>[0]);
  }, [setCurrentDocument]);

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
});
