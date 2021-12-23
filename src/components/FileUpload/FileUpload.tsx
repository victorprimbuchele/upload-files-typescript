import React, { useRef, useState } from "react";
import {
  FileUploadContainer,
  FormField,
  DragDropText,
  UploadFileBtn,
  FilePreviewContainer,
  ImagePreview,
  PreviewContainer,
  PreviewList,
  FileMetaData,
  RemoveFileIcon,
  InputLabel,
} from "./fileUploadStyles";

const KILO_BYTES_PER_BYTE = 1000;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 500000;

// Converte objeto aninhado em array
const convertNestedObjectToArray = (nestedObj: any) => {
  const objectKeys: string[] = Object.keys(nestedObj);
  objectKeys.map((key: string): string => nestedObj[key]);
};

// Converte bytes em kilobytes e arredonda o resultado
const convertBytesToKB = (bytes: number) =>
  Math.round(bytes / KILO_BYTES_PER_BYTE);

// Propriedades usadas do arquivo a ser subido;
// O arquivo possui outras propriedades, tais como:
/** lastModified
 *  lastModifiedDate
 *  webkitRelativePath */
export type IFile = {
  size: number;
  name: string;
  type: string;
};

// Propriedades esperadas pelo componente
type IFileUploadProps = {
  label: string;
  updateFilesCb: (filesAsArray: []) => void;
  maxFileSizeInBytes?: number;
  accept: string;
  multiple: boolean;
};

const FileUpload = ({
  label,
  updateFilesCb,
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  ...otherProps
}: IFileUploadProps) => {
  const fileInputField = useRef<React.RefObject<HTMLInputElement> | any>(null);
  const [files, setFiles] = useState<any>({});

  // Capta resposta de interação com elemento do DOM
  const handleUploadBtnClick = () => {
    fileInputField?.current?.click();
  };

  // Adiciona novos arquivos
  const addNewFiles = (newFiles: IFile[]) => {
    // Itera array de arquivos
    for (let file of newFiles) {
      // Realiza validação de tamanho do arquivo
      if (file.size <= maxFileSizeInBytes) {
        // Caso não seja um upload com múltiplos arquivos
        if (!otherProps.multiple) {
          // Retorna apenas um arquivo
          return { file };
        }
        // Caso contrário, para cada nome de arquivo recebe um arquivo
        files[file.name] = file;
      }
    }
    // Retorna todos os arquivos
    return { ...files };
  };

  const callUpdateFilesCb = (files: {}) => {
    // Executa função de conversão
    const filesAsArray: any = convertNestedObjectToArray(files);
    // Atualiza arquivos
    updateFilesCb(filesAsArray);
  };

  const handleNewFileUpload = (
    e: React.ChangeEvent<HTMLInputElement | any>
  ) => {
    // Capta os arquivos do evento de mudança do input
    const { files: newFiles } = e.target;
    // newFile é um objeto, onde: posição 0: próprio file, posição 1: length
    if (newFiles?.length) {
      // adiciona newFiles
      let updatedFiles = addNewFiles(newFiles);
      // altera estado de files
      setFiles(updatedFiles);
      // chama função de atualização de arquivos
      callUpdateFilesCb(updatedFiles);
    }
  };

  // recebe nome do arquivo clicado
  const removeFile = (fileName: string) => {
    // deleta o arquivo com aquele nome
    delete files[fileName];
    // sobrescreve files com os arquivo remanescentes
    setFiles({ ...files });
    // atualiza arquivos novamente
    callUpdateFilesCb({ ...files });
  };

  return (
    <>
      <FileUploadContainer>
        <InputLabel>{label}</InputLabel>
        <DragDropText>Drag and drop your files anywhere or</DragDropText>
        <UploadFileBtn type="button" onClick={handleUploadBtnClick}>
          <i className="fas fa-file-upload" />
          <span> Upload {otherProps.multiple ? "files" : "a file"}</span>
        </UploadFileBtn>
        <FormField
          type="file"
          ref={fileInputField}
          onChange={handleNewFileUpload}
          title=""
          value=""
          {...otherProps}
        />
      </FileUploadContainer>
      <FilePreviewContainer>
        <span>To Upload</span>
        <PreviewList>
          {Object.keys(files).map((fileName, index) => {
            let file = files[fileName];
            let isImageFile = file.type.split("/")[0] === "image";
            return (
              <PreviewContainer key={fileName}>
                <div>
                  {isImageFile && (
                    <ImagePreview
                      src={URL.createObjectURL(file)}
                      alt={`file preview ${index}`}
                    />
                  )}
                  <FileMetaData isImageFile={isImageFile}>
                    <span>{file.name}</span>
                    <aside>
                      <span>{convertBytesToKB(file.size)} kb</span>
                      <RemoveFileIcon
                        className="fas fa-trash-alt"
                        onClick={() => removeFile(fileName)}
                      />
                    </aside>
                  </FileMetaData>
                </div>
              </PreviewContainer>
            );
          })}
        </PreviewList>
      </FilePreviewContainer>
    </>
  );
};

export default FileUpload;
