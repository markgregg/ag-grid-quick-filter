import { useState } from "react";
import { AiOutlineEdit, AiOutlineCopy, AiOutlineCode } from "react-icons/ai";
import { complex, Complex, fetchItems, formatDate, typed, words } from "../data/data";
import { Selection } from "ag-grid-quick-filter";
import AgGridQuickFilter, { AgGridQuickFilterProps } from "ag-grid-quick-filter";
import { CodeBlock, googlecode } from "react-code-blocks";
import { ColDef, GridApi, GridReadyEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

interface DemoItemProperties {
  title: string;
  description: string;
  points?: string[];
  props: AgGridQuickFilterProps;
  code?: string;
  sandbox?: string;
  showAgGrid?: boolean
}

const isMobile = (): boolean => {
  return window.matchMedia("only screen and (max-width: 600px)").matches;
}

const DemoItem = (props: DemoItemProperties) => {
  const [showCode, setShowCode] = useState<string>("");
  const [showCopied, setShowCopied] = useState<boolean>(false);
  const [selected, setSelected] = useState<Selection[]>([]);
  const [selectedDemo,setSelectedDemo] = useState<string>("");
  const [rowData] = useState<Complex[]>(complex);
  const [columnDefs] = useState<ColDef<Complex>[]>([
      { field: "name", headerName: "Name", filter: "agSetColumnFilter", resizable: true, width: 100 },
      { field: "value", headerName: "Value", filter: "agNumberColumnFilter", resizable: true, width: 90 },
      { field: "description", headerName: "Description", filter: "agTextColumnFilter", resizable: true, width: 300 },
  ]);
  const [aggridApi,setAggridApi] = useState<GridApi<Complex>>();
  const style = {
    height: "400px",
    width: "800px",
    "--ag-foreground-color": "var(--QuickFilterSelectFontColor)",
    "--ag-background-color": "var(--pageColor5)",
    "--ag-header-foreground-color": "var(--QuickFilterSelectFontColor)",
    "--ag-header-background-color": "var(--pageColor2)",
    "--ag-odd-row-background-color": "var(--pageColor4)",
    "--ag-header-column-resize-handle-color": "var(--pageFont)"   
  };

  const gridReady = (event: GridReadyEvent<Complex>) => {
    setAggridApi(event.api);
  }

  const model = aggridApi?.getFilterInstance("value")?.getModel();
  
  return (
    <div className="demo" key={"demo" + props.title}>
      <h2 className="demo-title">{props.title}</h2>
      <div className="demo-description">
        <p>{props.description}</p>
        {
          props.points?.map( (point,index) => <p key={props.title + index} className="demo-point">{point}</p>)
        }
      </div>
      <div className="demo-item">
        <AgGridQuickFilter
          key={props.title}
          onChange={sel => {
            setSelected(sel);
            setSelectedDemo(props.title)
          }}
          agGridApi={props.showAgGrid ? aggridApi : undefined}
          {...props.props}
        />
        <div className="icons">
          <AiOutlineCode
            onClick={() => {
              setShowCode(showCode === props.title ? "" : props.title);
            }}
          />
          <div className="copy-wrapper">
            <AiOutlineCopy
              onClick={() => {
                navigator.clipboard.writeText(props.code ?? "");
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 2000);
              }}
            />
            {showCopied && <p className="copied-text">Copied</p>}
          </div>
          <AiOutlineEdit onClick={() => window.open(props.sandbox, "_blank")} />
        </div>
      </div>
      <div>
        <h6 className="nospace">Selection</h6>
        <p key={"selected" + props.title} className="nospace">{selectedDemo === props.title ? JSON.stringify(selected) : ""}</p>
      </div>
      {
        props.showAgGrid && <div className="ag-theme-alpine" style={style}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            onGridReady={gridReady}
          />
        </div>
      }
      {showCode === props.title && (
        <div className="code">
          <CodeBlock
            width="100%"
            text={props.code}
            language="typescript"
            showLineNumbers={false}
            theme={googlecode}
          />
        </div>
      )}
    </div>
  );
};

export interface Category {
  name: string;
  demo: () => JSX.Element;
}

export const categories: Category[] = [
  {
    name: "Binding",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Bind to strings"
          description="The simpliest way to use the quick filter select - set the options to an array of strings"
          props={{
            minWidth: isMobile() ? "240px" : "400px",
            title: "Bind String",
            choices: [
              {
                key: "Words",
                options: words,
              },
            ],
          }}
          code={`import AgGridQuickFilter from "ag-grid-quick-filter";
          import { options } from "./data";
          
          import "./styles.css";
          
          export default function App() {
            return (
              <div className="Space">
                <AgGridQuickFilter
                  title="test"
                  choices={[
                    {
                      key: "Words",
                      options: options,
                    }
                  ]}
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/universal-string-binding-ooesy7"
        />
        <DemoItem
          title="Bind to objects"
          description="The quick filter can be bound to objects"
          props={{
            minWidth: isMobile() ? "240px" : "400px",
            title: "Bind Object",
            choices: [
              {
                key: "Words",
                options: complex,
                text: (option: Complex) => option.name,
                value: (option: Complex) => option.value.toString(),
                search: "both"
              },
            ],
          }}
          code={`import AgGridQuickFilter from "ag-grid-quick-filter";
          import { options, Complex } from "./data";
          
          import "./styles.css";
          
          export default function App() {
            return (
              <div className="Space">
                <AgGridQuickFilter
                  title="test"
                  choices={[
                    {
                      key: "Words",
                      options: options,
                      text: (option: Complex) => option.name,
                      value: (option: Complex) => option.value,
                      search: "both"
                    }
                  ]}
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/universal-object-binding-forked-oripsu"
        />
        <DemoItem
          title="Bind to typed"
          description="It can also be bound to an object that implements OptionType"
          props={{
            minWidth: isMobile() ? "240px" : "400px",
            title: "Bind Typed",
            choices: [
              {
                key: "Words",
                options: typed,
                search: "both"
              },
            ],
          }}
          code={`import AgGridQuickFilter from "ag-grid-quick-filter";
          import { options } from "./data";
          
          import "./styles.css";
          
          export default function App() {
            return (
              <div className="Space">
                <AgGridQuickFilter
                  title="test"
                  choices={[
                    {
                      key: "Words",
                      prefix: "words",
                      options: options,
                      search: "both"
                    }
                  ]}
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/universal-typed-binding-forked-dqgq6g"
        />
      </div>
    ),
  },
  {
    name: "Single Select",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Single"
          description="Limit users to one selection"
          props={{
            minWidth: isMobile() ? "240px" : "400px",
            title: "Single select",
            choices: [
              {
                key: "Words",
                options: words,
                maximumSelections: 1
              },
            ],
          }}
          code={`import AgGridQuickFilter from "ag-grid-quick-filter";
          import { options } from "./data";
          
          import "./styles.css";
          
          export default function App() {
            return (
              <div className="Space">
                <AgGridQuickFilter
                  title="test"
                  choices={[
                    {
                      key: "Words",
                      options: options,
                      maximumSelections: 1
                    }
                  ]}
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/universal-single-selection-forked-izdhxr"
        />
      </div>
    ),
  },
  {
    name: "Multi Select",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Multi"
          description="Limit users to 3 selections"
          props={{
            minWidth: isMobile() ? "240px" : "400px",
            title: "Multi Select",
            choices: [
              {
                key: "Words",
                prefix: "words",
                options: words,
                maximumSelections: 3
              },
            ],
          }}
          code={`import AgGridQuickFilter from "ag-grid-quick-filter";
          import { options } from "./data";
          
          import "./styles.css";
          
          export default function App() {
            return (
              <div className="Space">
                <AgGridQuickFilter
                  title="test"
                  choices={[
                    {
                      key: "Words",
                      prefix: "words",
                      options: options,
                      maximumSelections: 3
                    }
                  ]}
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/universal-multi-selection-forked-dg5vb2"
        />
      </div>
    ),
  },
  {
    name: "Look-up",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Look-up"
          description="Use a promise to provide options"
          props={{
            minWidth: isMobile() ? "240px" : "400px",
            title: "Look-up",
            choices: [
              {
                key: "Words",
                lookUp: fetchItems
              },
            ],
          }}
          code={`import AgGridQuickFilter from "ag-grid-quick-filter";
          import { fetchItems } from "./data";
          
          import "./styles.css";
          
          export default function App() {
            return (
              <div className="Space">
                <AgGridQuickFilter
                  title="test"
                  choices={[
                    {
                      key: "Words",
                      prefix: "words",
                      lookUp: fetchItems
                    }
                  ]}
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/universal-look-up-forked-r3upk7"
        />
        <DemoItem
          title="Cache"
          description="Use a promise to provide and cache results"
          props={{
            minWidth: isMobile() ? "240px" : "400px",
            title: "Cache",
            choices: [
              {
                key: "Words",
                lookUp: fetchItems
              }
            ],
            cacheLookUp: true
          }}
          code={`import AgGridQuickFilter from "ag-grid-quick-filter";
          import { fetchItems } from "./data";
          
          import "./styles.css";
          
          export default function App() {
            return (
              <div className="Space">
                <AgGridQuickFilter
                  title="test"
                  choices={[
                    {
                      key: "Words",
                      lookUp: fetchItems
                    }
                  ]}
                  cacheLookUp={true}
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/universal-look-up-cached-forked-1hdzzv"
        />
        <DemoItem
          title="Expiry"
          description="Use a promise to provide and cache results. Results will expire after a specified time"
          props={{
            minWidth: isMobile() ? "240px" : "400px",
            title: "Expiry",
            choices: [
              {
                key: "Words",
                lookUp: fetchItems
              }
            ],
            cacheLookUp: true,
            cacheTimeToLive: 5,
            cacheExpiryCheck: 5
          }}
          code={`import AgGridQuickFilter from "ag-grid-quick-filter";
          import { fetchItems } from "./data";
          
          import "./styles.css";
          
          export default function App() {
            return (
              <div className="Space">
                <AgGridQuickFilter
                  title="test"
                  choices={[
                    {
                      key: "Words",
                      lookUp: fetchItems
                    }
                  ]}
                  cacheLookUp={true}
                  cacheTimeToLive={5}
                  cacheExpiryCheck={5}
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/universal-look-up-cached-expire-forked-lldoph"
        />
      </div>
    ),
  },
  {
    name: "Custom Values",
    demo: () => (
      <div className="String">
        <DemoItem
          title="Custom Text"
          description="No list, just enter one of the below operators and enter a string. For example !%abc."
          points={["= (equals)", "! (not equals)", "% (contains)", "!% (not contains)", "%< (starts with)", "%> (ends with)", "& (and)", "| (or)"]}
          props={{
            minWidth: isMobile() ? "240px" : "400px",
            title: "Custom Text",
            choices: [
              {
                key: "Words",
                regExMatch: /.*/
              },
            ],
          }}
          code={`import AgGridQuickFilter from "ag-grid-quick-filter";
          import { fetchItems } from "./data";
          
          import "./styles.css";
          
          export default function App() {
            return (
              <div className="Space">
                <AgGridQuickFilter
                  title="test"
                  choices={[
                    {
                      key: "Words",
                      regExMatch: /.*/
                    }
                  ]}
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/universal-custom-values-scvyjk"
        />
        <DemoItem
          title="Custom number"
          description="No list, just enter one of the below operators and enter a string. For example <=.5."
          points={["= (equals)", "! (not equals)", "> (greater)", "< (less)", ">= (greater equal)", "<= (less equals)", "& (and)", "| (or)"]}
          props={{
            minWidth: isMobile() ? "240px" : "400px",
            title: "Custom Number",
            choices: [
              {
                key: "Words",
                regExMatch: /^\d{0,1}(\.\d{1,4})?$/,
                filterType: "number"
              }
            ],
            cacheLookUp: true
          }}
          code={`import AgGridQuickFilter from "ag-grid-quick-filter";

          import "./styles.css";
          
          export default function App() {
            return (
              <div className="Space">
                <AgGridQuickFilter
                  title="test"
                  choices={[
                    {
                      key: "Words",
                      regExMatch: /^\d{0,1}(\.\d{1,4})?$/,
                      filterType: "number"
                    }
                  ]}
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/universal-custom-number-forked-d0eq1z"
        />
        <DemoItem
          title="Custom Dates"
          description="No list, just enter one of the below operators and enter a number. For example >50."
          points={["= (equals)", "! (not equals)", "> (greater)", "< (less)", "& (and)", "| (or)" ]}
          props={{
            minWidth: isMobile() ? "240px" : "400px",
            title: "Cusom Dateas",
            choices: [
              {
                key: "Words",
                regExMatch: /^[0-9]{0,2}$/,
                valueGetter: (text: string) => {
                  const now = new Date();
                  const years = parseInt(text);
                  return formatDate(new Date(now.setFullYear(now.getFullYear() + years)));
                },
                filterType: "date"
              }
            ],
            cacheLookUp: true
          }}
          code={`import AgGridQuickFilter from "ag-grid-quick-filter";

          import "./styles.css";
          
          export default function App() {
            return (
              <div className="Space">
                <AgGridQuickFilter
                  title="test"
                  choices={[
                    {
                      key: "Words",
                      regExMatch: /^[0-9]{0,2}$/,
                      valueGetter: (text: string) => {
                        const now = new Date();
                        const years = parseInt(text);
                        return formatDate(
                          new Date(now.setFullYear(now.getFullYear() + years))
                        );
                      },
                      filterType: "date"
                    }
                  ]}
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/universal-custom-dates-forked-3ijv6h"
        />
      </div>
    ),
  },
  {
    name: "Selection prefixed",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Prefixed"
          description="If using multiple sources, selections can be prefixed."
          props={{
            minWidth: isMobile() ? "240px" : "400px",
            title: "Prefixed",
            choices: [
              {
                prefix: "Words",
                key: "Words",
                options: words
              },
            ]
          }}
          code={`import AgGridQuickFilter from "ag-grid-quick-filter";
          import { options } from "./data";
          
          import "./styles.css";
          
          export default function App() {
            return (
              <div className="Space">
                <AgGridQuickFilter
                  title="test"
                  choices={[
                    {
                      prefix: "Words",
                      key: "Words",
                      options: options
                    }
                  ]}
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/universal-no-prefix-b9c2kf"
        />
      </div>
    ),
  },
  {
    name: "Disabled",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Disabled"
          description="The quick fitler can be disabled."
          props={{
            minWidth: isMobile() ? "240px" : "400px",
            title: "Disabled",
            choices: [
              {
                key: "Words",
                options: words
              },
            ],
            disabled: true
          }}
          code={`import AgGridQuickFilter from "ag-grid-quick-filter";
          import { options } from "./data";
          
          import "./styles.css";
          
          export default function App() {
            return (
              <div className="Space">
                <AgGridQuickFilter
                  title="test"
                  choices={[
                    {
                      key: "Words",
                      options: options
                    }
                  ]}
                  disabled
                />
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/universal-disabled-zrbojv"
        />
      </div>
    ),
  },
  {
    name: "Ag-Grid",
    demo: () => (
      <div className="demo">
        <DemoItem
          title="Ag-Grid"
          description="Linking selection to an a-grid will filter the ag-grid in response."
          props={{
            minWidth: isMobile() ? "240px" : "400px",
            title: "Ag-Grid",
            choices: [
              {
                key: "Name",
                prefix: "Name",
                options: words,
                regExMatch: /.*/,
                agGridColumn: "name"
              },
              {
                key: "Value",
                prefix: "Value",
                regExMatch: /\d+/g,
                filterType: "number",
                agGridColumn: "value",
                replaceExisting: true
              },
              {
                key: "Descripton",
                prefix: "Desc",
                regExMatch: /.*/,
                filterType: "text",
                agGridColumn: "description"
              }
            ],
          }}
          showAgGrid={true}
          code={`import { useState } from "react";
          import AgGridQuickFilter from "ag-grid-quick-filter";
          import { AgGridReact } from "ag-grid-react";
          import { ColDef, GridApi, GridReadyEvent } from "ag-grid-community";
          import { words, Complex, complex } from "./data";
          import "ag-grid-community/styles/ag-grid.css";
          import "ag-grid-community/styles/ag-theme-alpine.css";
          import "./styles.css";
          
          export default function App() {
            const [rowData] = useState<Complex[]>(complex);
            const [columnDefs] = useState<ColDef<Complex>[]>([
              { field: "name", headerName: "Name", filter: "agSetColumnFilter", resizable: true, width: 100 },
              { field: "value", headerName: "Value", filter: "agNumberColumnFilter", resizable: true, width: 90 },
              { field: "description", headerName: "Description", filter: "agTextColumnFilter", resizable: true, width: 300 }
            ]);
            const [aggridApi, setAggridApi] = useState<GridApi<Complex>>();
          
            const style = {
              height: "200px",
              width: "100%"
            };
          
            const gridReady = (event: GridReadyEvent<Complex>) => {
              setAggridApi(event.api);
              event.columnApi.autoSizeAllColumns();
            };
          
            return (
              <div className="Space">
                <AgGridQuickFilter
                  title="test"
                  agGridApi={aggridApi}
                  choices={[
                    {
                      key: "Name",
                      options: words,
                      agGridColumn: "name"
                    },
                    {
                      key: "Value",
                      regExMatch: /\d+/g,
                      filterType: "number",
                      agGridColumn: "value"
                    },
                    {
                      key: "Descripton",
                      regExMatch: /.*/,
                      filterType: "text",
                      agGridColumn: "description"
                    }
                  ]}
                />
                <div className="ag-theme-alpine" style={style}>
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    onGridReady={gridReady}
                  />
                </div>
              </div>
            );
          }`}
          sandbox="https://codesandbox.io/s/universal-ag-grid-92zqot"
        />
      </div>
    ),
  }
];
