import CompactSelect from "compact-select";
import React, { useState, useEffect } from "react";
import Examples from "./Examples";
import GettingStarted from './GettingStarted';
import "./App.css";
import Demo from "./Demo";
import { applyTheme, themes, Themes } from "./themes/themes";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const pages = ["Examples", "Demo", "Getting Started", "Back To Demos"];
 
const App = () => {
  const [themeName, setThemeName] = useState<string>(Themes.Plain.toString());
  const [page, setPage] = useState<string>("Demo");
  
  useEffect(()=> {
    applyTheme(Themes.Plain);
  },[])

  const setTheme = (theme: string[]) => {
    setThemeName(theme[0]);
    applyTheme(theme[0]);
  }

  const openPage = (page: string) => {
    if( page === 'Back To Demos') {
      window.location.href = "https://markgregg.github.io/demo-home/"; 
    } else {
      setPage(page);
    } 
  }

  return (
    <div className="frame">
      <div className="page">
        <div className="header">
          <div className="heading">
            <h1 className="title">Ag Grid Quick Filter</h1>
            <p className="statement">
              A powerful, flexible filter control that provide a quick way to filter Ag-Grid
            </p>
          </div>
          <div className="menu-bar">
            <div className="menu">
              {pages.map((pg) => (
                <div
                  key={pg}
                  className="menu-item"
                  onClick={() => openPage(pg)}
                >
                  <p className="menu-text">{pg}</p>
                </div>
              ))}
            </div>
            <div className="theme">
              <CompactSelect
                maximumSelections={1}
                minimumSelections={1}
                selectType="dropdown"
                title="themes"
                choices={themes}
                selected={themeName}
                onChange={setTheme}
                width="80px"
              />
            </div>
          </div>
        </div>
        <div className={"body"+ (themeName===Themes.Dark 
            ? " dark"
            : themeName===Themes.Light
              ? " light"
              : themeName===Themes.Blue
              ? " blue"
              : " plain")
          }
        >
          <div className="context">
            {
              (page === "Examples" && <Examples/>) ||
              (page === "Demo" && <Demo/>) ||
              (page === "Getting Started"  && <GettingStarted/>)
            }
          </div>
          <div className="footer">
            <p>Created by Mark Gregg</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
