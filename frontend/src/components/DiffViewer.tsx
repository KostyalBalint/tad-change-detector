import React, { useEffect, useState } from "react";
import ReactDiffViewer from "react-diff-viewer";
import { SubjectResponse } from "@backend/index";
import { SubjectWithTextContent } from "@backend/scrape-subject";

export function DiffViewer({
  code,
  oldFile,
  newFile,
}: {
  code: string;
  oldFile: string;
  newFile: string;
}) {
  const [subject, setSubject] = useState<SubjectWithTextContent>({
    code: "",
    createdAt: new Date(),
    name: "",
    rawHtml: "",
    textContent: "",
    url: "",
  });
  const [newSubject, setNewSubject] = useState<SubjectWithTextContent>({
    code: "",
    createdAt: new Date(),
    name: "",
    rawHtml: "",
    textContent: "",
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
      <div>
        <div className={"text-center mb-3"}>
          <a href={subject.url} target={"_blank"}>
            {subject.name} - {subject.code}
          </a>
        </div>
        <ReactDiffViewer
          oldValue={subject.textContent}
          newValue={newSubject.textContent}
          splitView={true}
        />
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
