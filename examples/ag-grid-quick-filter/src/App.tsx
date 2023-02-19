import CompactSelect from "compact-select";
import React, { useState, useEffect } from "react";
import Examples from "./Examples";
import GettingStarted from './GettingStarted';
import "./App.css";
import Demo from "./Demo";
import { applyTheme, themes, Themes } from "./themes/themes";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const pages = ['Examples','Get Started', 'Demo', 'More Demos'];

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
    if( page === 'More Demos') {
      window.location.href = "https://markgregg.github.io/demo-home/"; 
    } else {
      setPage(page);
    } 
  }

  return (
    <div className="frame">
      <div 
        className={ "page" + (themeName===Themes.Dark 
          ? " dark"
          : themeName===Themes.Light
            ? " light"
            : themeName===Themes.Blue
            ? " blue"
            : " plain")
        }
      >
        <div className='header'>
          <div className="heading">
            <h2 className="title">Ag Grid Quick Filter</h2>
            <p className="statement">
              A powerful, flexible quick filter
            </p>
          </div>
          <div className="menu-bar">
            <div className="menu-container">
              <div className="menu">
                {pages.map((pg) => (
                  <div className="menu-item" onClick={() => openPage(pg)}>
                    {
                      ( pg === page) 
                      ? <u><p className="menu-text">{pg}</p></u>
                      : <p className="menu-text">{pg}</p> 
                    }
                  </div>
                ))}
              </div>
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
              />
            </div>
          </div>

        </div>
        <div className="body">
          <div className="context">
            {
              (page === "Examples" && <Examples/>) ||
              (page === "Demo" && <Demo/>) ||
              (page === "Get Started"  && <GettingStarted/>)
            }
          </div>
        </div>
        <div className="footer-container">
          <div className="footer">
            <p className="no-padding">Created by Mark Gregg</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
