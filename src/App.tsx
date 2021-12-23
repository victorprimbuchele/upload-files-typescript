import React, { useState } from "react";

import FileUpload from "./components/FileUpload/FileUpload";
import { IFile } from "./components/FileUpload/FileUpload";

function App() {
  const [newUserInfo, setNewUserInfo] = useState({
    profileImages: [],
  });

  const updateUploadedFiles = (files: IFile[] | any) =>
    setNewUserInfo({ ...newUserInfo, profileImages: files });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    //logic to create new user...
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FileUpload
          accept=".jpg,.png,.jpeg"
          label="Profile Image(s)"
          multiple
          updateFilesCb={updateUploadedFiles}
        />
        <button type="submit">Create New User</button>
      </form>
    </div>
  );
}

export default App;
