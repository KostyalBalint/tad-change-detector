import React, { useEffect, useState } from "react";
import ReactDiffViewer from "react-diff-viewer";
import { SubjectResponse } from "@backend/index";
import { Subject } from "@backend/scrape-subject";

export function DiffViewer({
  code,
  oldFile,
  newFile,
}: {
  code: string;
  oldFile: string;
  newFile: string;
}) {
  const [subject, setSubject] = useState<Subject>({
    code: "",
    createdAt: new Date(),
    name: "",
    rawHtml: "",
    url: "",
  });
  const [newSubject, setNewSubject] = useState<Subject>({
    code: "",
    createdAt: new Date(),
    name: "",
    rawHtml: "",
    url: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      `http://api.localhost/subjects/${code}?oldCode=${oldFile}&newCode=${newFile}`
    )
      .then((res) => res.json())
      .then((json) => {
        let subject = json as SubjectResponse;
        if (subject.error) {
          setIsLoaded(false);
          console.error(subject.error);
          setError(subject.error);
        } else if (subject.data.old && subject.data.new) {
          setError(null);
          setSubject(subject.data.old);
          setNewSubject(subject.data.new);
          setIsLoaded(true);
        }
      });
  }, [oldFile, newFile, code]);

  if (error) {
    return <div>{error}</div>;
  }

  if (isLoaded) {
    return (
      <ReactDiffViewer
        oldValue={subject.rawHtml}
        newValue={newSubject.rawHtml}
        splitView={true}
      />
    );
  } else {
    return <div>Loading...</div>;
  }
}
