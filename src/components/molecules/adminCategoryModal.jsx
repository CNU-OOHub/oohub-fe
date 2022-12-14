import React from "react";
import ReactDOM from "react-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { adminCategoryModalVisibleState, adminPageState } from "../../atom";
import {
  AUTHORIZATION_AREA,
  CHANGE_PASSWORD,
  RESOURCE_MONITORING,
} from "../../constants";
import theme from "../../styles/theme";
import Text from "../atoms/text";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 0;
  top: 8.15vh;
  background-color: ${theme.greyColor};
  border: 1px solid grey;
  // z-index: 10000;
`;

const Table = styled.table`
  width: 10rem;
  height: 10rem;
`;

const TableRow = styled.tr`
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;
`;

const TableData = styled.td`
  text-align: center;
  vertical-align: middle;
`;



const AdminCategoryModal = () => {
  const [adminPage, setAdminPage] = useRecoilState(adminPageState);
  let navigate = useNavigate(); 

  const routeChange = () =>{ 
    navigate(`/monitoring`);
  }

  const setAdminCategoryModal = useSetRecoilState(
    adminCategoryModalVisibleState
  );

  const modalClose = () => {
    setAdminCategoryModal(false);
  };

  return ReactDOM.createPortal(
    <Container>
      <Table>
        <tbody>
          <TableRow>
            <TableData>
              <Text
                color={theme.textGreyColor}
                fontSize={1.0}
                onClick={() => {
                  setAdminPage({
                    pageName: AUTHORIZATION_AREA,
                    visible: true,
                  });
                  modalClose();
                }}
              >
                Authorization Area
              </Text>
            </TableData>
          </TableRow>
          <TableRow>
            <TableData>
              <Text
                color={theme.textGreyColor}
                fontSize={1.0}
                onClick={() => {
                  setAdminPage({
                    pageName: CHANGE_PASSWORD,
                    visible: true,
                  });
                  modalClose();
                }}
              >
                Change Password
              </Text>
            </TableData>
          </TableRow>
          <TableRow>
            <TableData>
              <Text
                color={theme.textGreyColor}
                fontSize={1.0}
                onClick={() => {
                  setAdminPage({
                    pageName: RESOURCE_MONITORING,
                    visible: true,
                  });
                  modalClose();
                  routeChange()
                }}
              >
                Resource Monitoring
              </Text>
            </TableData>
          </TableRow>
        </tbody>
      </Table>
    </Container>,
    document.getElementById("modal-root")
  );
};

export default AdminCategoryModal;
