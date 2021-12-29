import React, { Component, useEffect, useState } from "react";
import ReactDiffViewer from "react-diff-viewer";
import { useParams } from "react-router";

export function DiffViewer() {
  const [subject, setSubject] = useState<Subject>({
    htmlDataFields: "",
  });
  const [newSubject, setNewSubject] = useState<Subject>({
    htmlDataFields: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const { code } = useParams();

  useEffect(() => {
    fetch(`http://api.localhost/subjects/${code}`)
      .then((res) => res.json())
      .then((json) => {
        setSubject(json.subject);
        setNewSubject(json.newSubject);
        setIsLoaded(true);
      });
  });

  if (isLoaded) {
    return (
      <ReactDiffViewer
        oldValue={subject.htmlDataFields}
        newValue={newSubject.htmlDataFields}
        splitView={true}
      />
    );
  } else {
    return <div>Loading...</div>;
  }
}

//TODO: Move Subject type to a cental location
type Subject = {
  htmlDataFields: string;
};
