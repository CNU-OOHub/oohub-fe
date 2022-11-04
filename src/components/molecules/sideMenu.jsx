import React from "react";
import theme from "../../styles/theme";
import styled from "styled-components";
import { FOLDER, GROUPS, SETTING } from "../../constants";
import Button from "../atoms/button";
import { AiOutlineFolderOpen, AiOutlineSetting } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { RiGroup2Line } from "react-icons/ri";
import { useRecoilState } from "recoil";
import { sideMenuState } from "../../atom";
import { useNavigate } from "react-router-dom";

const SideMenuStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 5rem;
  min-height: 92vh;
  height: auto;
  background-color: ${theme.greyColor};
`;

const SideMenu = () => {
  const [sideMenu, setSideMenu] = useRecoilState(sideMenuState);
  const navigate = useNavigate();

  const sideMenuClicked = (clickedValue) => {
    setSideMenu(clickedValue);
  };

  const logOutClicked = () => {
    sessionStorage.removeItem("accessToken");
    // TODO : sessionStorage.removeItem("refreshToken");
    localStorage.clear();
    navigate("/logIn");
  };

  return (
    <SideMenuStyle>
      <Button bgColor={theme.greyColor} onClick={() => sideMenuClicked(FOLDER)}>
        <AiOutlineFolderOpen
          style={{
            marginTop: "1rem",
            width: "100%",
            borderLeft: sideMenu === FOLDER ? "5px solid white" : "none",
          }}
          size={35}
          color={sideMenu === FOLDER ? "white" : theme.lightGreyColor}
        />
      </Button>
      <Button
        bgColor={theme.greyColor}
        onClick={() => sideMenuClicked(SETTING)}
      >
        <AiOutlineSetting
          style={{
            marginTop: "1rem",
            width: "100%",
            borderLeft: sideMenu === SETTING ? "5px solid white" : "none",
          }}
          size={35}
          color={sideMenu === SETTING ? "white" : theme.lightGreyColor}
        />
      </Button>
      <Button bgColor={theme.greyColor} onClick={() => sideMenuClicked(GROUPS)}>
        <RiGroup2Line
          style={{
            marginTop: "1rem",
            width: "100%",
            borderLeft: sideMenu === GROUPS ? "5px solid white" : "none",
          }}
          size={35}
          color={sideMenu === GROUPS ? "white" : theme.lightGreyColor}
        />
      </Button>
      <BiLogOut
        style={{
          bottom: 20,
          width: "5rem",
          alignSelf: "center",
          position: "absolute",
          padding: "0",
        }}
        size={30}
        color={"white"}
        onClick={logOutClicked}
      />
    </SideMenuStyle>
  );
};

export default SideMenu;
