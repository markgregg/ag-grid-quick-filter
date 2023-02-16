import { Selection, ChoiceDefinition } from './';
import { GridApi } from "ag-grid-community";

export type AgFilterOnChange = (selection: Selection[]) => void;
export interface SelectProps {
  title: string; //select title and key for cache
  choices: ChoiceDefinition<any>[]; //available static choices
  selected?: Selection[]; //currently selected items
  showWithNoFilter?: boolean; //Show items even if user has not typed
  cacheLookUp?: boolean; //should cache items
  cacheTimeToLive?: number; //how long should items exist for in seconds
  cacheExpiryCheck?: number; //how often should item expiry be checked in seconds
  onChange?: AgFilterOnChange; //notify of change
  disabled?: boolean; // is control disable
  noItemText?: string; //custom no item text
  typePromptText?: string; //tell user to type
  caseSensitive?: boolean; //perform case sensitive matching
  toolTipValueLimit?: number; //Maxium number of items to display
  maxAvailableChoices?: number; //Maxium choices to display for all catagories
  hideOnSelect?: boolean; //Close option list when an item is selected
  noClearTextOnSelect?: boolean; //don't clear input text on selection
  selectIfOnlyOption?: boolean; //select the option if it is the only one
  agGridApi?: GridApi; //Ag grid api, if supplied allows automatic filtering of ag-grid
}
