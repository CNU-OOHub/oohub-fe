import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { adminState, loginState } from "../../atom";
import theme from "../../styles/theme";
import {
  AiOutlineSearch,
  AiFillCaretDown,
  AiFillCaretUp,
  AiOutlineFile,
} from "react-icons/ai";
import { IoIosClose } from "react-icons/io";
import { BiSave } from "react-icons/bi";
import Button from "../atoms/button";
import { CONSOLE, TERMINAL } from "../../constants";
import styled from "styled-components";
import FlexRow from "../molecules/flexRow";
import Text from "../atoms/text";
import DropDown from "../atoms/dropdown";
import Switch from "react-switch";
import Input from "../atoms/input";
import { VscRunAll } from "react-icons/vsc";
import {
  runFile,
  runLine,
  useGetAllOrganizations,
  useGetAllSharedFiles,
  useGetFiles,
  useGetFile,
  addSharedFileInOrganization,
  deleteSharedFile,
  useGetSharedFileContent,
  addFile,
} from "../../api";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { BsFolderPlus } from "react-icons/bs";
import { FiFilePlus } from "react-icons/fi";
import { BiGroup } from "react-icons/bi";

import FolderTree from "react-folder-tree";
import "react-folder-tree/dist/style.css";

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  width: 16rem;
  height: 92vh;
  background-color: ${theme.darkGreyColor};
  overflow: auto;
  white-space: nowrap;
  padding-left: 3rem;
  //resize: horizontal;
`;

const SearchArea = styled.div`
  height: 4rem;
  padding-top: 1rem;
`;

const NoneFile = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 92vh;
  background-color: ${theme.blackGreyColor};
  justify-content: center;
`;

const File = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 92vh;
  background-color: ${theme.blackGreyColor};
  justify-content: space-around;
`;

const FileHeader = styled.div`
  height: 4rem;
  align-items: center;
  flex-direction: row;
  display: flex;
  background-color: #373737;
`;

const FileContainer = styled.div`
  display: inline-block;
  flex: 1;
  background-color: ${theme.blackGreyColor};
`;

const FileContent = styled.textarea`
  font-size: 1.2rem;
  color: white;
  width: 100%;
  height: 100%;
  background-color: ${theme.blackGreyColor};
  border: none;
  white-space: pre-wrap;
  outline: none;
`;

const Terminal = styled.div`
  display: inline-block;
  height: 13rem;
  background-color: ${theme.blackGreyColor};
  border-top: 0.5px solid grey;
`;

const TerminalHeader = styled.div`
  margin-left: 1rem;
`;

const Scroll = styled.div`
  width: 100%;
  height: 10.5rem;
  align-content: center;
  align-items: center;
  text-align: center;
  overflow: scroll;
  // margin-top: 1.5rem;
  padding: 0.5rem;
  border-radius: 10px;
  background: ${theme.blackGreyColor};
`;

const FileView = () => {
  const [login, setLogin] = useRecoilState(loginState);
  const [admin, setAdmin] = useRecoilState(adminState);
  const [sharedFileMenuOpened, SetSharedFileMenuOpened] = useState(false);
  const [myFileMenuOpened, SetMyFileMenuOpened] = useState(false);
  const [isFileShared, setIsFileShared] = useState(false);
  const [openedFileName, setOpenedFileName] = useState("?????????");
  const [sharedFileOrganizationName, setSharedFileOrganizationName] =
    useState("?????????");
  const [opendGroupName, setOpendGroupName] = useState("??????????????????");
  const [readOnly, setReadOnly] = useState(false);
  const [fileDefaultState, setFileDefaultState] = useState(true);
  /*
 ?????? ????????? key?????? ????????? ???????????? ???????????? ???(folderNames)??? ?????? ????????????. 
 /??? split?????? ????????? ????????? ?????? ?????? ???????????? folderNames ?????????.

 ?????????????????? workspace ????????? ?????? ?????? ?????????, 
 1) ?????? ????????? key?????? k/??? ???????????? ????????? ???????????? ????????????, k key??? ?????? values?????? folderName??? ?????? ????????? ????????? ???????????? ?????????.
 
 ???????????? ????????? ????????? ???????????? ????????????????????? ????????? ????????? ???????????? 1)??? ?????? ??????, ?????? ????????? ????????? ???????????? api ????????? ?????? ????????????.
 */

  const [terminalOpened, setTerminalOpened] = useState(CONSOLE);
  // TODO:
  // openedFile??? ????????? ???????????? ???????????? ??????
  // "" ??? ???????????? file ?????? ????????????. ""?????? ?????? oohub ????????? ???????????????! ????????? ?????????
  // fileShare recoil??? ?????? ?????? ???. ?????? recoil??? ????????? ?????? useState????????? ????????? ?????? ??????.
  // const [sharedFiles, setSharedFiles] = useState([]);
  const onTreeStateChange = (state, event) => console.log(state, event);
  const [groupNames, setGroupNames] = useState([]);
  const [filePathInfo, setFilePathInfo] = useState({
    filePath: "",
  });
  const [fileName, setFileName] = useState("");
  const [isFileClicked, setIsFileClicked] = useState(false);
  const [isSharedFileClicked, setIsSharedFileClicked] = useState(false);

  // ???????????? ?????? ?????? get
  const { data: groups, isLoading: getOrganizationIsLoading } =
    useGetAllOrganizations(localStorage.getItem("username"));

  // ???????????? ?????? ????????? ????????? ?????? get
  const useSharedFiles = useGetAllSharedFiles(groupNames);

  // ??? ?????? ?????? get
  const { data: myFiles, isLoading: myFilesIsLoading } = useGetFiles();

  // ?????? ?????? ??????
  const {
    isLoading: isLoadingGetFile,
    refetch,
    isFetched,
    data: fileData,
  } = useGetFile(filePathInfo);

  // ?????? ?????? ?????? ??????
  const {
    isLoading: isLoadingGetSharedFile,
    refetch: refetchShared,
    data: sharedFileData,
  } = useGetSharedFileContent(opendGroupName, openedFileName, filePathInfo);

  // ?????? ??????
  const queryClient = new QueryClient();

  const fileSaveMutation = useMutation(
    () =>
      addFile(
        fileContents.contents,
        filePathInfo.filePath,
        filePathInfo.filePath
      ),
    {
      onSuccess: () => {
        alert("????????? ?????????????????????");
        queryClient.invalidateQueries();
      },
    }
  );

  useEffect(() => {
    if (!getOrganizationIsLoading) {
      const temp = Array.from(groups, (group) => group.name);
      setGroupNames(temp);
    }
  }, [getOrganizationIsLoading, groups]);

  const [fileContents, setFileContents] = useState({
    contents: "",
  });
  // ????????? input ?????????
  const [terminalLine, setTerminalLine] = useState({
    command: "",
  });
  // ????????? input ?????????, ????????? map list
  // command: "",
  // runTerminalResult: []
  const [terminalDivList, setTerminalDivList] = useState([]);
  const [runConsoleResult, setRunConsoleResult] = useState([]);
  const [runTerminalResult, setRunTerminalResult] = useState([]);

  const [terminalItem, setTerminalItem] = useState({
    command: "",
    result: [],
  });

  useEffect(() => {
    if (sessionStorage.getItem("accessToken")) {
      setLogin(true);
    }
    if (localStorage.getItem("isAdmin") === "true") {
      setAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (isFileClicked) {
      refetch().then(() => {
        setIsSharedFileClicked(false);
        setSharedFileOrganizationName(fileData.organizationName);
        changeFileContent("contents", fileData.contents.join("\r\n"));
        setIsFileShared(fileData.isShared);
        setIsFileClicked(false);
      });
    }
  });

  useEffect(() => {
    if (isSharedFileClicked) {
      refetchShared().then(() => {
        console.log("????????????? " + JSON.stringify(sharedFileData.contents));
        changeFileContent("contents", sharedFileData.contents.join("\r\n"));
        setIsFileShared(true);
        setIsSharedFileClicked(false);
      });
    }
  });

  const terminalClicked = (clickedValue) => {
    setTerminalOpened(clickedValue);
  };

  const changeFileContent = (name, changedValue) => {
    setFileContents((prev) => ({ ...prev, [name]: changedValue }));
  };

  const changeFilePath = (name, changedValue) => {
    setFilePathInfo((prev) => ({ ...prev, [name]: changedValue }));
  };

  const changeTerminalLine = (name, changedValue) => {
    setTerminalLine((prev) => ({ ...prev, [name]: changedValue }));
  };

  const addTerminalDivList = () => {
    setTerminalDivList(...terminalDivList, terminalItem);
  };

  const changeTerminalItem = (command, result) => {
    setTerminalItem((prev) => ({ ...prev, command: command }));
    setTerminalItem((prev) => ({ ...prev, result: result }));

    addTerminalDivList();
    setTerminalDivList(...terminalDivList, {
      command: command,
      result: result,
    });
  };

  const executeFileMutation = useMutation(
    (fileContents) => runFile(fileContents),
    {
      onSuccess: (data) => {
        setRunConsoleResult(data.result);
      },
    }
  );

  const executeTerminalMutation = useMutation(
    (terminalLine) => runLine(terminalLine),
    {
      onSuccess: (data) => {
        setRunTerminalResult(data.result);
        changeTerminalItem(terminalLine, data.result);
      },
    }
  );

  // ?????? ?????? api ??????
  const executeFile = () => {
    executeFileMutation.mutate(fileContents);
  };

  // ????????? ??????
  const terminalEntered = (e) => {
    if (e.key === "Enter") {
      executeTerminalMutation.mutate(terminalLine);
    }
  };

  // ?????? ??????
  const fileClicked = (fileInfo) => {
    setReadOnly(false);
    let path = "/" + myFiles.name; // ????????? ????????? path??? ????????? ??????
    let temp = myFiles; // ????????? ????????? ?????? path
    const pathIndex = fileInfo.nodeData.path; // ????????? ????????? ??????(??????)
    for (var i = 0; i < pathIndex.length; i++) {
      path += "/" + temp.children[pathIndex[i]].name;
      temp = temp.children[pathIndex[i]];
    }
    setOpenedFileName(fileInfo.nodeData.name);
    changeFilePath("filePath", path);
    setIsFileClicked(true);
    setFileDefaultState(false);
  };

  // ?????? ?????? ??????
  const sharedFileCliked = (filePath, fileName, groupName) => {
    setReadOnly(true);
    setSharedFileOrganizationName(groupName);
    setOpendGroupName(groupName);
    setOpenedFileName(fileName);
    changeFilePath("filePath", filePath);
    setIsSharedFileClicked(true);
    setFileDefaultState(false);
    setFileName(fileName);
  };

  const clickedFileSharing = () => {
    addSharedFileInOrganization(sharedFileOrganizationName, filePathInfo);
  };

  const clickedFileSharingStop = () => {
    deleteSharedFile(sharedFileOrganizationName, openedFileName, filePathInfo);
    setSharedFileOrganizationName("");
  };

  return (
    <>
      <FileList>
        <SearchArea>
          <FlexRow justifyContent="center">
            <Input
              className="SearchForm"
              inputType="text"
              placeholder="?????????"
              height={2}
              width={65}
              fontSize={13}
            />
            <AiOutlineSearch size={23} color={theme.textGreyColor} />
          </FlexRow>
        </SearchArea>

        <div
          style={{
            alignItems: "center",
            height: "2rem",
            display: "flex",
          }}
        >
          <Button
            bgColor="rgb(0,0,0,0)"
            onClick={() => {
              SetSharedFileMenuOpened(!sharedFileMenuOpened);
            }}
          >
            {sharedFileMenuOpened ? (
              <AiFillCaretDown
                size={20}
                color={theme.textGreyColor}
                style={{ margin: "0 0.5rem 0 0.5rem" }}
              />
            ) : (
              <AiFillCaretUp
                size={20}
                color={theme.textGreyColor}
                style={{ margin: "0 0.5rem 0 0.5rem" }}
              />
            )}
          </Button>
          <Text color={theme.textGreyColor} fontSize={1.0}>
            ????????????
          </Text>
        </div>
        {sharedFileMenuOpened && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "0.5rem",
              marginLeft: "0.7rem",
              width: "min-content",
            }}
          >
            {!getOrganizationIsLoading &&
              groupNames.map((group, idx) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      //   marginBottom: "0.5rem",
                    }}
                    key={group}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BiGroup size={15} color={theme.lightGreyColor} />
                      <Text
                        color={theme.lightGreyColor}
                        fontSize={0.9}
                        fontWeight={600}
                        marginLeft="0.5rem"
                      >
                        {group}
                      </Text>
                    </div>
                    <div>
                      {!useSharedFiles[idx].isLoading &&
                        useSharedFiles[idx]["data"].length > 0 &&
                        // useSharedFiles[idx]["data"][0] !== undefined &&
                        useSharedFiles[idx]["data"].map((fileInfo) => {
                          return (
                            <div
                              key={fileInfo.filepath}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <AiOutlineFile
                                size={13}
                                color={theme.lightGreyColor}
                                style={{ marginLeft: "1rem" }}
                              />
                              <Text
                                onClick={() => {
                                  if (fileInfo.filepath) {
                                    sharedFileCliked(
                                      fileInfo.filepath,
                                      fileInfo.filename,
                                      group
                                    );
                                  }
                                }}
                                color={theme.lightGreyColor}
                                fontSize={0.9}
                                fontWeight={600}
                                marginLeft="0.5rem"
                              >
                                {fileInfo.filename}
                              </Text>
                              <Text
                                color={theme.lightGreyColor}
                                fontSize={0.5}
                                fontWeight={300}
                                marginLeft="0.5rem"
                              >
                                {fileInfo.filepath}
                              </Text>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        <div
          style={{
            alignItems: "center",
            height: "2rem",
            backgroundColor: `${theme.darkGreyColor}`,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              bgColor="rgb(0,0,0,0)"
              onClick={() => SetMyFileMenuOpened(!myFileMenuOpened)}
            >
              {myFileMenuOpened ? (
                <AiFillCaretDown
                  size={20}
                  color={theme.textGreyColor}
                  style={{ margin: "0 0.5rem 0 0.5rem" }}
                />
              ) : (
                <AiFillCaretUp
                  size={20}
                  color={theme.textGreyColor}
                  style={{ margin: "0 0.5rem 0 0.5rem" }}
                />
              )}
            </Button>
            <Text color={theme.textGreyColor} fontSize={1.0}>
              ??? ??????
            </Text>
          </div>
          <div>
            <BsFolderPlus
              size={15}
              color={theme.textGreyColor}
              style={{ marginRight: "0.5rem" }}
            />
            <FiFilePlus
              size={15}
              color={theme.textGreyColor}
              style={{ marginRight: "0.5rem" }}
            />
          </div>
        </div>
        {myFileMenuOpened && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: theme.lightGreyColor,
              marginBottom: "0.5rem",
              marginLeft: "0.5rem",
              width: "min-content",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            <FolderTree
              data={!myFilesIsLoading ? myFiles : []}
              onChange={onTreeStateChange}
              showCheckbox={false}
              onNameClick={(fileInfo) => {
                if (!fileInfo.nodeData.isOpen) {
                  // ????????? ???
                  fileClicked(fileInfo);
                }
              }}
            />
          </div>
        )}
      </FileList>
      {fileDefaultState ? (
        <NoneFile>
          <Text
            fontSize={2}
            fontWeight={700}
            marginLeft="auto"
            marginRight="auto"
            color={theme.lightGreyColor}
          >
            WELCOME TO OOHUB!!{"\n"}
          </Text>
          <Text
            fontSize={2}
            fontWeight={700}
            marginLeft="auto"
            marginRight="auto"
            color={theme.lightGreyColor}
          >
            CLICK FILE YOU WANT :)
          </Text>
          <Text fontSize={10} color={theme.blackGreyColor}>
            ARE YOU HACKER?
          </Text>
        </NoneFile>
      ) : (
        <File>
          <FileHeader>
            <FlexRow justifyContent="center" flexGrow={1}>
              <Text color={theme.textGreyColor} fontSize={1}>
                {openedFileName}
              </Text>
              <IoIosClose
                size={20}
                color={theme.textGreyColor}
                onClick={() => {
                  setFileDefaultState(true);
                }}
              />
              <div style={{ marginLeft: "3vh", display: "flex" }}>
                <VscRunAll
                  size="20"
                  color="green"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    executeFile();
                  }}
                />
                {/* ?????? */}
                {!readOnly && (
                  <BiSave
                    size={25}
                    style={{ marginLeft: "1rem" }}
                    color="orange"
                    onClick={() => {
                      const originalPath = filePathInfo.filePath;
                      if (originalPath !== undefined) {
                        fileSaveMutation.mutate(
                          fileContents.contents,
                          originalPath,
                          originalPath
                        );
                      }
                    }}
                  />
                )}
              </div>
            </FlexRow>
            <div style={{ width: "6rem" }}>
              <DropDown
                onChange={(e) => {
                  setSharedFileOrganizationName(e.target.value);
                }}
                options={getOrganizationIsLoading ? [] : groupNames}
                placeholder={"?????????"}
                selectedValue={sharedFileOrganizationName}
                color={theme.textGreyColor}
                height={2}
                fontSize={1.0}
                backgroundColor="#373737"
                disabled={isFileShared}
              />
            </div>
            <FlexRow flexGrow={1} justifyContent="center">
              {readOnly ? (
                <Text></Text>
              ) : (
                <>
                  <Text
                    color={theme.textGreyColor}
                    fontSize={1}
                    marginRight={10}
                  >
                    ??????
                  </Text>
                  <Switch
                    onChange={(e) => {
                      if (sharedFileOrganizationName === "") {
                        alert("???????????? ???????????? ?????????.");
                      } else {
                        if (isFileShared) {
                          setIsFileShared(false);
                          clickedFileSharingStop();
                        } else {
                          setIsFileShared(true);
                          clickedFileSharing();
                        }
                      }
                    }}
                    checked={isFileShared}
                    onColor={theme.primaryColor}
                    handleDiameter={17}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    width={45}
                    height={25}
                  />
                </>
              )}
            </FlexRow>
          </FileHeader>
          <FileContainer>
            <FileContent
              readOnly={readOnly ? "readOnly" : ""}
              name="fileContentArea"
              value={fileContents ? fileContents.contents : ""}
              onChange={(e) => {
                changeFileContent("contents", e.target.value);
              }}
            ></FileContent>
          </FileContainer>
          <Terminal>
            <TerminalHeader>
              <Button
                color={
                  terminalOpened === CONSOLE ? "white" : theme.lightGreyColor
                }
                fontSize={0.8}
                bgColor={theme.blackGreyColor}
                height={2}
                marginRight={2}
                fontWeight={400}
                onClick={() => {
                  terminalClicked(CONSOLE);
                }}
                {...(terminalOpened === CONSOLE && {
                  borderBottom: "1px solid white",
                })}
              >
                ??????
              </Button>
              <Button
                color={
                  terminalOpened === TERMINAL ? "white" : theme.lightGreyColor
                }
                fontSize={0.8}
                bgColor={theme.blackGreyColor}
                height={2}
                fontWeight={400}
                onClick={(e) => {
                  terminalClicked(TERMINAL);
                }}
                {...(terminalOpened === TERMINAL && {
                  borderBottom: "1px solid white",
                })}
              >
                ?????????
              </Button>
            </TerminalHeader>
            {terminalOpened === TERMINAL ? (
              // ?????????
              <Scroll>
                <div style={{ color: "white", padding: "10px", float: "left" }}>
                  <text
                    style={{
                      color: "white",
                      float: "left",
                      outline: "none",
                      fontWeight: "bolder",
                    }}
                  >
                    {">>>  "}{" "}
                  </text>
                  <input
                    type={"text"}
                    style={{
                      outline: "none",
                      backgroundColor: theme.blackGreyColor,
                      color: "white",
                      border: "none",
                      float: "left",
                      marginLeft: "10px",
                    }}
                    onChange={(e) => {
                      changeTerminalLine("command", e.target.value);
                    }}
                    onKeyDown={(e) => {
                      terminalEntered(e);
                    }}
                  ></input>
                  <br></br>
                  <p
                    color="white"
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "normal",
                      float: "left",
                    }}
                  >
                    {terminalItem.result}
                  </p>
                </div>
                ;
              </Scroll>
            ) : (
              // ??????
              <Scroll>
                <div style={{ color: "white", padding: "10px", float: "left" }}>
                  {runConsoleResult.map((result) => {
                    return (
                      <p
                        color="white"
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "normal",
                          textAlign: "left",
                        }}
                      >
                        {result}
                      </p>
                    );
                  })}
                </div>
              </Scroll>
            )}
          </Terminal>
        </File>
      )}
    </>
  );
};

export default FileView;
