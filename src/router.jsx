import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/organisms/header";
import Home from "./components/pages/home";
import LogIn from "./components/pages/logIn";
import Organization from "./components/pages/organization";
import SignUp from "./components/pages/signUp";

const Router = () => {
  return (
    <BrowserRouter>
      {/* 로그인, 로그아웃 용 헤더!! */}
      <Header />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/organization" element={<Organization/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
