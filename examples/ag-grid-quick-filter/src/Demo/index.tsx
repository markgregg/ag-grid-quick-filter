import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridApi, GridReadyEvent } from "ag-grid-community"
import { MdOutlineHelpCenter } from "react-icons/md";
import "./Demo.css";
import { Bond } from "../interfaces/bond";
import { bondList } from "../data/bondList";
import AgGridQuickFilter, { ChoiceDefinition, OptionType } from "ag-grid-quick-filter";
import { formatDate } from "../data/data";

const stringToDate = (text: string): Date => {
  const dateParts = text.split('/');
  const day = Number(dateParts[0]);
  const month = Number(dateParts[1]) - 1;
  const year = Number(dateParts[2]);
  return new Date(year, month, day);
}

const stringToIsoDateString = (option: OptionType): string => {
  const dateParts = (option as string).split('/');
  const day = Number(dateParts[0]);
  const month = Number(dateParts[1]) - 1;
  const year = Number(dateParts[2]);
  return new Date(year, month, day).toISOString();
}

const dateCompare = (compareValue: Date, cellValue: any): number => {
  try {
    const cellDateString = cellValue as string;
    if (cellDateString == null) {
        return 0;
    }

    const cellDate = stringToDate(cellDateString);

    // Now that both parameters are Date objects, we can compare
    if (cellDate < compareValue) {
        return -1;
    } else if (cellDate > compareValue) {
        return 1;
    }
  } catch(error) {
    console.log(error);
    return -1;
  }
  return 0;
}

const definition = (column: string, prefix: string, name?: string, regEx?: RegExp): ChoiceDefinition<any> => {
  return {
    key: column,
    prefix,
    sourceAg: true,
    agGridColumn: column,
    choiceDisplayName: name ?? prefix,
    regExMatch: regEx
  }
}
const choices: ChoiceDefinition<any>[] = [
  definition("isinCode", "Isin", "Isin", /.*/),
  definition("haircutCategory", "Haircut Cut"),
  definition("type", "type", "Type"),
  definition("refMarket", "ref mkt", "Reference Market"),
  definition("demonination", "demon", "Demonination"),
  {
    key: "coupon",
    prefix: "coupon rate",
    agGridColumn: "couponRate",
    choiceDisplayName: "Coupon Rate",
    regExMatch: /^\d{0,1}(\.\d{1,4})?$/,
    filterType: "number",
    replaceExisting: true
  },
  {
    key: "issuranceDate",
    prefix: "issurance date",
    choiceDisplayName: "Issurance Date",
    regExMatch: /^(0?[1-9]|[12][0-9]|3[01])[\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
    agGridColumn: "issuranceDate",
    filterType: "date",
    valueConverter: stringToIsoDateString,
    replaceExisting: true
  },
  {
    key: "maturityDate",
    prefix: "maturity date",
    choiceDisplayName: "Maturity Date",
    regExMatch: /^[0-9]{0,2}$/,
    valueGetter: (text: string) => {
      const now = new Date();
      const years = parseInt(text);
      return formatDate(new Date(now.setFullYear(now.getFullYear() + years)));
    },
    agGridColumn: "maturityDate",
    filterType: "date",
    valueConverter: stringToIsoDateString,
    replaceExisting: true
  },
  definition("issuerCsd", "csd", "Issuer CSD"),
  {
    key: "issuerName",
    prefix: "issuerName",
    choiceDisplayName: "Issuer Name",
    agGridColumn: "issuerName",
    regExMatch: /.*/,
    replaceExisting: true
  },
  definition("issuerResidence", "issuer res", "Issuser Residence"),
  definition("issuerGroup", "issuer grp", "Issuer Group"),
  {
    key: "guarantorName",
    prefix: "guarantorName",
    choiceDisplayName: "Guarantor Name",
    agGridColumn: "guarantorName",
    regExMatch: /.*/,
    replaceExisting: true
  },  
  definition("guarantorResidence", "guarantor res", "Guarantor Residence"),
  definition("guarantorGroup", "guarantor grp", "Guarantor Group"),
  definition("couponDef", "coupon def", "Coupon Definition"),
  {
    key: "haircut",
    prefix: "haircut",
    choiceDisplayName: "Haircut",
    agGridColumn: "haircut",
    regExMatch: /^\d{0,2}(\.\d{1,4})?$/,
    filterType: "number",
    replaceExisting: true
  },
  
];

const Demo = () => {
  const [showHelp,setShowHelp] = useState<boolean>(false);
  const [rowData] = useState<Bond[]>(bondList);
  const [columnDefs] = useState<ColDef<Bond>[]>([
      { field: "isinCode", headerName: "ISIN Code", filter: "agSetColumnFilter", resizable: true, width: 150 },
      { field: "haircutCategory", headerName: "Haircut Category", filter: "agSetColumnFilter", resizable: true, width: 120 },
      { field: "type", headerName: "Type", filter: "agSetColumnFilter", resizable: true, width: 90 },
      { field: "refMarket", headerName: "Reference", filter: "agSetColumnFilter", resizable: true, width: 120 },
      { field: "demonination", headerName: "Demonination", filter: "agSetColumnFilter", resizable: true, width: 140 },
      { field: "issuranceDate", headerName: "Issuance Date", filter: "agDateColumnFilter", filterParams: { comparator: dateCompare }, resizable: true, width: 130 },
      { field: "maturityDate", headerName: "Maturity Date",filter: "agDateColumnFilter", filterParams: { comparator: dateCompare }, resizable: true, width: 130 },
      { field: "issuerCsd", headerName: "Issuer CSD", filter: "agSetColumnFilter", resizable: true, width: 120 },
      { field: "couponRate", headerName: "Coupon Rate", filter: "agNumberColumnFilter", resizable: true, width: 140 },
      { field: "issuerName", headerName: "Issuer Name", filter: "agTextColumnFilter", resizable: true, width: 300 },
      { field: "issuerResidence", headerName: "Issuer Residence", filter: "agSetColumnFilter", resizable: true, width: 130 },
      { field: "issuerGroup", headerName: "Issuer Group", filter: "agSetColumnFilter", resizable: true, width: 130 },
      { field: "guarantorName", headerName: "Guarantor Name", filter: "agTextColumnFilter", resizable: true, width: 300 },
      { field: "guarantorResidence", headerName: "Guarantor Residence", filter: "agSetColumnFilter", resizable: true, width: 130 },
      { field: "guarantorGroup", headerName: "Guarantor Group", filter: "agSetColumnFilter", resizable: true, width: 130 },
      { field: "couponDef", headerName: "Coupon Definition", filter: "agSetColumnFilter", resizable: true, width: 130 },
      { field: "haircut", headerName: "Haircut", filter: "agNumberColumnFilter", resizable: true, width: 150 }
  ]);
  const [aggridApi,setAggridApi] = useState<GridApi<Bond>>();

  const gridReady = (event: GridReadyEvent<Bond>) => {
    setAggridApi(event.api);
  }

  const gridStyle = {
    flex: 1,
    "--ag-foreground-color": "var(--universalSelectFontColor)",
    "--ag-background-color": "var(--pageColor5)",
    "--ag-header-foreground-color": "var(--universalSelectFontColor)",
    "--ag-header-background-color": "var(--pageColor2)",
    "--ag-odd-row-background-color": "var(--pageColor4)",
    "--ag-header-column-resize-handle-color": "var(--pageFont)"
  }

  return ( 
      <div className="bond-demo">
        <div className="select-area">
          <div className="help_container">
            <div 
              className="help"
              onClick={() => setShowHelp(!showHelp)}
            >
              <MdOutlineHelpCenter/>
            </div>
          </div>
          <AgGridQuickFilter
            title="Quick Filter"
            width="100%"
            choices={choices}
            agGridApi={aggridApi}
          />
        </div>
        {
          showHelp && <div className="explaination">
            <h4 className="headings">Lookup and choices</h4>
            <p className="prefixes">Use the below operations to filter the columns. Combinations are possible using &(and) or | (or)</p>
            <h4 className="headings">Text columns</h4>
            <p className="prefixes">Text columns that do not use lookup or choices (Iusser and Guarantor name) support the following prefixes</p>
              <p className="prefixes">= equals</p>
              <p className="prefixes">! not equals </p>
              <p className="prefixes">% contains</p>
              <p className="prefixes">!% not contains</p>
              <p className="prefixes">%{">"} ends width</p>
              <p className="prefixes">%{"<"} starts width</p>  
            <h4 className="headings">Number columns</h4>
            <p className="prefixes">Number columns (Coupon and Haircut) support the following prefixes</p>
              <p className="prefixes">= equals</p>
              <p className="prefixes">! not equals</p>
              <p className="prefixes">{">"} greater than</p>
              <p className="prefixes">{"<"} less than</p>
              <p className="prefixes">{"<"}= greater than or equal to</p>
              <p className="prefixes">{">"}= less than or equal to</p>
            <h4 className="headings">Date columns</h4>
            <p className="prefixes">Date columns (Maturity and Issurance) support the following prefixes</p>
              <p className="prefixes">= equals</p>
              <p className="prefixes">! not equals</p>
              <p className="prefixes">{">"} greater than</p>
              <p className="prefixes">{"<"} less than</p>
              <p className="prefixes">To enter maturity date, simply enter the number of years</p>
            <h4 className="headings">Usage</h4>
            <p className="prefixes">To use a prefix type it before entering text/numbers as follows</p>
              <p className="prefixes">${">"}50 = maturity dates greater than current date plus 50</p>
              <p className="prefixes">%Bank = string contains the letters bank</p>
              <p className="prefixes">!.0 = not where the number is 0 (Coupon and Haircut regex look for floats)</p>
          </div>
        }
        <div className="ag-theme-alpine" style={gridStyle}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              onGridReady={gridReady}
            />
        </div>
      </div>
  );
};

export default Demo;
