import {
  RefObject,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from "react";
import CSS from "csstype";
import { Cache, createCache } from "../cache/cache";
import { errorMessage, itemText, itemValue } from "../utils/domUtils";
import { generateGuid } from "../utils/guidGenerator";
import { scrollIntoView } from "../utils/domUtils";
import {
  Choice,
  Choices,
  ChoiceDefinition,
  Selection,
  SelectProps,
} from "../types";
import { OptionType } from "../types/optionType";
import { LookUp } from "../types/choiceDefinition";
import { Comparison } from "../types/comparison";
import { Operand } from "../types/operand";
import { GridApi } from "ag-grid-community";

export interface AgGridQuickFilterModel {
  definitionMap: Map<string,ChoiceDefinition<any>>;
  lookUpGuidMap: Map<string,string>;
  lookUpChoiceMap: Map<string,OptionType[]>;
  cache?: Cache;
  inputText: string;
  filterText: string;
  showChoices: boolean;
  highlightedIndex: number;
  visibleChoices: Choices[];
  visibleChoiceCount: number;
  selected: Selection[];
  listPosition: CSS.Property.Top;
  token: string;
  selectId: string;
  comparison?: Comparison;
  operand?: Operand;
  agGridApi?: GridApi;
  props: SelectProps;
  inputRef?: RefObject<HTMLInputElement>;
  selectRef?: RefObject<HTMLDivElement>;
  active?: number;
  refresh?: () => void;

  updateProps: (props: SelectProps) => void;
  updateRefs: (inputRef?: RefObject<HTMLInputElement>, selectRef?: RefObject<HTMLDivElement>) => void;
  updateDisplay: () => void;
  signalChange: () => void;
  fetchChoices: (text: string) => void;
  buildVisibleChoices: () => void;
  includeItemText: (item: OptionType, exact: boolean, lookUp?: LookUp) => boolean;
  includeItemValue: (item: OptionType, exact: boolean, lookUp?: LookUp) => boolean;
  includeItem: (definition: ChoiceDefinition<any>, item: OptionType, exact: boolean) => boolean;
  updateVisibleChoices: () => void;
  hideList: () => void;
  showList: () => void;
  updateListPosition: () => void;
  clickedAway: (mouseEvent: MouseEvent) => void;
  setFocus: () => void;
  updateFilterText: (text: string) => void;
  textInputClicked: () => void;
  textChanged: (event: ChangeEvent<HTMLInputElement>) => void;
  updateAgGrid: (definition?: ChoiceDefinition<any>) => void;
  updateSelection: () => void;
  selectItem: (choice: Choice) => void;
  deselectItem: (selection: Selection) => void;
  clearSelection: (event: ReactMouseEvent) => void;
  makeItemVisible: (index: number) => void;
  adjustHighlightedIndex: (index: number) => void;
  adjustHighlightedIndexOnly: (index: number) => void;
  getItemAtIndex: () => Choice | undefined;
  inputKeyPressed: (event: KeyboardEvent<HTMLDivElement>) => void;
}

export const createAgGridQuickFilterModel = (initialProps: SelectProps) : AgGridQuickFilterModel => {

  const constructChoiceMap = (choices: ChoiceDefinition<any>[]): Map<string, any> => {
    const map = new Map<string, any>();
    choices.forEach((choice) => map.set(choice.key, choice));
    return map;
  };

  const comparisonSupported = (comparison: string, definition: ChoiceDefinition<any>): boolean => {
    switch( definition.filterType ) {
      case "number":
        return comparison === "=" || comparison === "!" || comparison === "<" || comparison === ">" || comparison === "<=" || comparison === ">=";
      case "date":
        return comparison === "=" || comparison === "!" || comparison === "<" || comparison === ">";
      default: //text
        return comparison === "=" || comparison === "!" || comparison === "%" || comparison === "!%" || comparison === "%<" || comparison === "%>";
    }
  }

  const getValue = (option: OptionType, definition: ChoiceDefinition<any>): any => {
    if( definition.valueConverter ) {
      return definition.valueConverter(option);
    }
    switch( definition.filterType ) {
      case "number":
        return +itemText(option, definition?.text);
      case "date":
        return new Date(itemText(option, definition?.text));
      default:
        return option;
    }
  }
  
  const getFilterType = (comparison: string): string => {
    switch(comparison) {
      case "!":
        return "notEqual";
      case ">":
        return "greaterThan";
      case "<":
        return "lessThan";
      case ">=":
        return "greaterThanOrEqual";
      case "<=":
        return "lessThanOrEqual";
      case "%":
        return "contains";
      case "!%":
        return "notContains";
      case "%<":
        return "startsWith";
      case "%>":
        return "endsWith";
      default:
        return "equals";
    }
  }
  
  const createFilter = (selection: Selection[], definition: ChoiceDefinition<any>): any => {
    const [selection1, selection2] = selection;
    if( !selection2 ) {
      return createCondition(selection1, definition);
    }
    return {
      condition1: createCondition(selection1, definition),
      condition2: createCondition(selection2, definition),
      filterType: definition?.filterType ?? "text",
      operator: selection2.operand === "|" ? "OR" : "AND"
    }
  };
  
  const createCondition = (selection: Selection, definition: ChoiceDefinition<any>): any => {
    switch(definition?.filterType) {
      case "date":
        return {
          filterType: "date",
          dateFrom: getValue(selection.option, definition),
          dateTo: null,
          type: getFilterType(selection.comparison ?? "")
        };
      default: 
        return {
          filterType: definition.filterType ?? "text",
          filter: getValue(selection.option, definition),
          type: getFilterType(selection.comparison ?? "")
        };
    }
  };

  const getDistinctValuesFromAgGrid = (agGridApi: GridApi, column: string): string[] => {
    const unique = new Set<string>();
    agGridApi.forEachNodeAfterFilter( row => {
      if( row.data ) {
        const value = row.data[column];
        if( value ) {
          unique.add(value);
        }
      }
    });
    return [...unique].sort();
  }

  const model: AgGridQuickFilterModel = {
    agGridApi: initialProps.agGridApi,
    definitionMap: constructChoiceMap(initialProps.choices),
    lookUpGuidMap: new Map(),
    lookUpChoiceMap: new Map(),
    cache: initialProps.cacheLookUp
      ? createCache(initialProps.title, initialProps.cacheTimeToLive, initialProps.cacheExpiryCheck)
      : undefined,
    inputText: "",
    filterText: "",
    showChoices: false,
    highlightedIndex: -1,
    visibleChoices: [],
    visibleChoiceCount: 0,
    selected: [],
    selectId: generateGuid(),
    token: "",
    listPosition: "40px",
    props: initialProps,

    updateProps: (props: SelectProps) => {
      if( props.choices !== model.props.choices) {
        model.definitionMap = constructChoiceMap(initialProps.choices);
        model.updateVisibleChoices();
        model.updateDisplay();
      }
      if( props.agGridApi !== model.agGridApi ) {
        model.agGridApi = props.agGridApi;
      }
      model.props = props;
    },

    updateRefs: (inputRef?: RefObject<HTMLInputElement>, selectRef?: RefObject<HTMLDivElement>) => {
      model.inputRef = inputRef;
      model.selectRef = selectRef;
    },

    updateDisplay: () => {
      if( model.refresh ) {
        model.refresh();
      }
    },

    signalChange: () => {
      if (model.props.onChange) {
        model.props.onChange(model.selected);
      }
    },
    
    fetchChoices: (text: string) => {
      model.definitionMap.forEach((definition) => {
        try {
          let regEx: string | undefined;
          if (definition.regExMatch) {
            model.lookUpChoiceMap.set(definition.key,[]);
            const selectedCount = model.selected.filter( sel => sel.key == definition.key).length
            if ( text !== "" && 
              model.comparison && 
              definition.regExMatch.test(text) &&
              (!definition?.maximumSelections ||
                selectedCount < definition?.maximumSelections) &&
              (!model.agGridApi || 
                definition.replaceExisting ||
                selectedCount < 2 ) //when using ag-grid limit selection to 2
              ) {
              regEx = definition?.valueGetter ? definition?.valueGetter(text) : text;
              if ( regEx && !definition.lookUp ) {
                model.lookUpChoiceMap.set(definition.key,[regEx]); 
                model.updateVisibleChoices();
              }
            }
          }
          if (definition.lookUp) {
            const limit =
              definition.maxAvailableChoices ?? model.props.maxAvailableChoices ?? 5;
              model.lookUpChoiceMap.set(definition.key,[]);
            if (text !== "" && model.cache) {
              //fetch options from cache
              try {
                const cachedItems = model.cache.getCachedItems(definition.key + "_" + text);
                if (cachedItems) { //return caches items plus reg ex
                  model.lookUpChoiceMap.set(definition.key,(regEx ? [regEx,...cachedItems] : cachedItems).slice(0, limit));
                  model.updateVisibleChoices();
                  return;
                }
              } catch (error) {
                console.log(
                  `Failed to fetch options from cache, reason: ${errorMessage(
                    error
                  )}`
                );
              }
            }
    
            if( text !== "" ) {
              //look up options
              const guid = model.token = generateGuid()
              //store guid to check if call is still the current call
              model.lookUpGuidMap.set(definition.key, guid);
    
              definition
                .lookUp(text)
                .then((options) => {
                  try {
                    if (model.cache) { //if there is a cache store items
                      model.cache.cacheItems(definition.key + "_" + text, options);
                    }
                    //check if the guide is the most recent
                    if (guid === model.lookUpGuidMap.get(definition.key)) {
                      //if it is then update options
                      model.lookUpChoiceMap.set(definition.key,(regEx ? [regEx,...options] : options).slice(0, limit));
                     model.updateVisibleChoices();
                    }
                  } catch (error) {
                    console.log(
                      `Failed to fetch items from options for ${
                        definition.key
                      }, reason: ${errorMessage(error)}`
                    );
                  }
                })
                .catch((error) => {
                  console.log(
                    `Failed to fetch options, reason: ${errorMessage(error)}`
                  );
                });
            }
          }
        } catch (error) {
          console.log(
            `Failed to fetch options, reason: ${errorMessage(error)}`
          );
        }
      });
    },
    
    buildVisibleChoices: (): void => {
      try {
        //filter out selected items and items that do not contain text input
        model.visibleChoiceCount = 0;
        const visibleChoices: Choices[] = [];
        model.definitionMap.forEach((definition, key) => {
          const lookupChoices = model.lookUpChoiceMap.get(key) ?? [];
          const agOptions = definition.sourceAg && definition.agGridColumn && model.agGridApi ? 
             getDistinctValuesFromAgGrid(model.agGridApi, definition.agGridColumn) : undefined;
          const staticOptions = (agOptions ?? definition.options ?? []).filter( item => model.includeItem(definition, item, false, ));
          const exactMatch = staticOptions.find(item => model.includeItem(definition, item, true, )) !== undefined;
          if (staticOptions.length > 0 || //do we have options or lookup options
              lookupChoices.length > 0 ) {
            const limit =
              definition.maxAvailableChoices ?? model.props.maxAvailableChoices ?? 5;
            const options: Choices = {
              key,
              priority: exactMatch ? -1 : staticOptions.length === 1 ? 0 : 1,
              options:
                ( model.props.showWithNoFilter || //no filter 
                  ( model.filterText !== "" && //or we have text and (not comparison or current comparison is supported)
                  (!model.comparison || comparisonSupported(model.comparison, definition)))
                  ? (staticOptions.length > 1 ? [...lookupChoices,...staticOptions] : [...staticOptions,...lookupChoices])
                      : [] ).slice(0, limit)
            }
            if (options.options && options.options?.length > 0) {
              model.visibleChoiceCount += options.options?.length ?? 0;
              visibleChoices.push(options);
            }
          }
        });
        visibleChoices.sort( (x,y) => (x.priority??0) < (y.priority??0) ? -1 : x.priority === y.priority ? 0 : 1);
        let offset = 0;
        visibleChoices.forEach( choices => {
            choices.offset = offset;
            offset += choices.options?.length ?? 0;
        });
        model.visibleChoices = visibleChoices;
      } catch (error) {
        console.log(
          `Failed to build visible choices, reason: ${errorMessage(error)}`
        );
      }
    },
    
    includeItemText: (item: OptionType, exact: boolean, lookUp?: LookUp): boolean => {
      const text = !model.props.caseSensitive
          ? itemText(item, lookUp).toLocaleLowerCase()
          : itemText(item, lookUp);
      const compareToValue = !model.props.caseSensitive ? model.filterText.toLowerCase() : model.filterText;
      return exact
        ? text === compareToValue
        : text.includes(compareToValue);
    },
    
    includeItemValue: (item: OptionType, exact: boolean, lookUp?: LookUp): boolean => {
      const text = !model.props.caseSensitive
          ? itemValue(item, lookUp).toLocaleLowerCase()
          : itemValue(item, lookUp)
      const compareToValue = !model.props.caseSensitive ? model.filterText.toLowerCase() : model.filterText;
      return exact
        ? text === compareToValue
        : text.includes(compareToValue);
    },
    
    //check if item should be filtered
    includeItem: (
      definition: ChoiceDefinition<any>,
      item: OptionType,
      exact: boolean
    ): boolean => {
      if (typeof item === "string") {
        return model.includeItemText(item, exact, definition.text);
      }
      switch (definition.search ?? "both") {
        case "text":
          return model.includeItemText(item, exact, definition.text);
        case "value":
          return model.includeItemValue(item, exact, definition.value);
        default:
          return (
            model.includeItemText(item, exact, definition.text) ||
            model.includeItemValue(item, exact, definition.value)
          );
      }
    },
    
    updateVisibleChoices: () => {
      model.buildVisibleChoices();
      if( model.visibleChoiceCount === 0 ) {
        model.adjustHighlightedIndex(-1);
      } else if (model.highlightedIndex >= model.visibleChoiceCount) {
        model.adjustHighlightedIndex(model.visibleChoiceCount-1);
      } else if( model.highlightedIndex === -1 ) {
        model.adjustHighlightedIndex(0);
      }
      model.updateListPosition();
      model.updateDisplay();
    },
    
    //hides the list and clears the input choices
    hideList: () => {
      model.showChoices = false;
      model.comparison = undefined;
      model.inputText = "";      
      model.showChoices = false;
      model.updateFilterText("", );
      model.updateDisplay();
    },
    
    //shows the list and sets the highlighted index to -1
    showList: () => {
      model.showChoices = true;
      model.adjustHighlightedIndex(-1);
      model.updateListPosition();
      model.updateDisplay();
    },
    
    updateListPosition: () => {
      setTimeout(
        () => {
          if( model.selectRef && model.selectRef.current ) {
            model.listPosition = `${model.selectRef.current?.clientHeight}px` ?? "40px";
            model.updateDisplay();
          }
        }, 1
      );
    },
    
    //document click handler
    clickedAway: (mouseEvent: MouseEvent) => {
      if (!model.showChoices) {
        return;
      }
      try {
        //get the control
        const input = document.getElementById("csInput" + model.selectId);
        const list = document.getElementById("csList" + model.selectId);
        //check if the click was outside the controls area
        if (
          mouseEvent.target !== null &&
          !input?.contains(mouseEvent.target as Node) === true &&
          !list?.contains(mouseEvent.target as Node) === true
        ) {
          model.hideList();
        }
      } catch (error) {
        console.log(
          `Failed to handle click away, reason: ${errorMessage(error)}`
        );
      }
    },
    
    setFocus: () => {
      setTimeout(() => {
        if (model.inputRef && model.inputRef.current) {
          model.inputRef.current.focus();
        }
      }, 10);
    },
    
    //update the text input into the input contorl
    updateFilterText: (text: string) => {
      model.filterText = text;
      model.updateVisibleChoices();
    },
    
    //hanlder for clicking on the control
    textInputClicked: () => {
      if (model.props.disabled) {
        return;
      }
    
      model.setFocus();
    
      //if list already shown do nothing.
      if (model.showChoices) {
        return;
      }
      //clear the input text
      model.updateFilterText("", );
      model.showList();
    },
    
    //called when text entered into the input control
    textChanged: (event: ChangeEvent<HTMLInputElement>) => {
      //update text
      model.comparison = undefined;
      model.operand = undefined;
      var filterText = event.target.value;
      
      //capture operand
      if( filterText.startsWith("&") ) {
        model.operand = "&";
        filterText = filterText.substring(1);
      } else if( filterText.startsWith("|") ) {
        model.operand = "|";
        filterText = filterText.substring(1);
      }
      filterText = filterText.trimStart();
      //capture operation
      if( filterText.startsWith("!%" ) ) {
        model.comparison = "!%"
        filterText = filterText.substring(2);
      } else if( filterText.startsWith("%<" ) ) {
        model.comparison = "%<"
        filterText = filterText.substring(2);
      } else if( filterText.startsWith("%>" ) ) {
        model.comparison = "%>"
        filterText = filterText.substring(2);
      } else if( filterText.startsWith(">=" ) ) {
        model.comparison = ">="
        filterText = filterText.substring(2);
      } else if( filterText.startsWith("<=" ) ) {
        model.comparison = "<="
        filterText = filterText.substring(2);
      } else if( filterText.startsWith("!" ) ) {
        model.comparison = "!"
        filterText = filterText.substring(1);
      } else if( filterText.startsWith("%" ) ) {
        model.comparison = "%"
        filterText = filterText.substring(1);
      } else if( filterText.startsWith("=" ) ) {
        model.comparison = "="
        filterText = filterText.substring(1);
      } else if( filterText.startsWith(">" ) ) {
        model.comparison = ">"
        filterText = filterText.substring(1);
      } else if( filterText.startsWith("<" ) ) {
        model.comparison = "<"
        filterText = filterText.substring(1);
      }
    
      model.fetchChoices(filterText, );
      model.updateFilterText(filterText, );
      
      model.inputText = event.target.value;
      model.updateDisplay(); //required due to update filter and fetch choices
    },
    
    updateAgGrid: (definition?: ChoiceDefinition<any>) => {
      if( !definition || !definition.agGridColumn ) {
        return;
      }
      const instance = model.agGridApi?.getFilterInstance(definition.agGridColumn);
      if( instance && instance !== null ) {
        const selectedItems = model.selected.filter( sel => sel.key === definition.key);
        const filter = selectedItems.length > 0 ? createFilter(selectedItems, definition) : null;
        instance.setModel(filter);
        model.agGridApi?.onFilterChanged();
      }
    },
    
    updateSelection: () => {
      model.updateVisibleChoices();
      model.signalChange();
    },
    
    //called when a choice is selected.
    selectItem: (choice: Choice) => {
      const definition = model.definitionMap.get(choice.key);
      //get the number of selected items in the catagory
      const defintionSelectionCount = model.selected.filter( sel => sel.key === choice.key ).length;
      if ( !model.selected.find( sel => sel.key === choice.key && //can't add if choice already selected
                  sel.option === choice.option && 
                  sel.comparison == (model.comparison ?? "=")) && 
        (!definition?.maximumSelections || //no maxium selection or selected count is less
        definition?.replaceExisting ||
        defintionSelectionCount < definition?.maximumSelections) && 
        (definition?.replaceExisting || //using ag-grid, and either no items are selected or we can replace
          !model.agGridApi ||
          defintionSelectionCount < 2 ) //when using ag-grid limit selection to 2
      ) {
        //create item
        const selection: Selection = { 
          key: choice.key, 
          option: choice.option, 
          comparison: model.comparison ?? "=",
          operand: defintionSelectionCount > 0 ? model.operand ?? "&" : undefined
        }
        if( ( (model.agGridApi && defintionSelectionCount > 1 ) || definition?.maximumSelections === defintionSelectionCount ) && definition?.replaceExisting ) {
          //if there is a limit to the number of items and repalced selected then replace the last item
          const [toRemove] = model.selected.filter( sel => sel.key === choice.key ).reverse();
          model.selected.splice(model.selected.indexOf(toRemove), 1, selection);
        } else {
          if( model.agGridApi && defintionSelectionCount > 0 ) {
            //if agrid and and we have an item, then get item and insert at the next index
            const item = model.selected.find( sel => sel.key === choice.key);
            model.selected.splice(model.selected.indexOf(item!)+1, 0, selection);
          } else {
            model.selected.push(selection);
          }
        }
        model.updateSelection();
        if( model.agGridApi ) {
          model.updateAgGrid(definition)
        }
      }
      if (!model.props.noClearTextOnSelect) {
        model.inputText = "";
        model.updateFilterText("", );
      }
      if (model.props.hideOnSelect) {
        model.hideList();
      } else {
        model.updateDisplay();
      }
    },
    
    //called when a deselected item is clicked
    deselectItem: (selection: Selection) => {
      try {
        // if the selected items greater than minimum then deselect
        const selectedItem = model.selected.find( sel => sel.key === selection.key && 
                    sel.option === selection.option &&
                    sel.comparison == selection.comparison)
        if (selectedItem) {
          model.selected.splice( model.selected.indexOf(selectedItem), 1)
          model.selected.filter( sel => sel.key === selection.key ).forEach( sel => sel.operand = undefined);
          model.updateSelection();
          if( model.agGridApi ) {
            model.updateAgGrid(model.definitionMap.get(selection.key));
          }
          model.updateDisplay();
        }
      } catch (error) {
        console.log(`Failed to deselect item, reason: ${errorMessage(error)}`);
      }
    },
    
    //called when clear all selected items clicked.
    clearSelection: (event: ReactMouseEvent) => {
      if (model.props.disabled) {
        return;
      }
      const activeFilters: string[] = [];
      model.selected.forEach( selection => {
        if(activeFilters.indexOf(selection.key) === -1) {  //only clear grid filter once
          activeFilters.push(selection.key)
        }
      });
      model.selected = [];
      activeFilters.forEach( key => {
        const definition = model.definitionMap.get(key); //get definition
          if( definition && definition.agGridColumn ) {
            model.updateAgGrid(definition); //call update ag-grid for defintion - selection will be blank
          }
      });
      model.updateSelection();
      model.updateDisplay();
      event.stopPropagation();
    },
    
    //makes highlighted item visible
    makeItemVisible: (index: number) => {
      try {
        const input = document.getElementById(`item_${index}`);
        const list = document.getElementById("csList" + model.selectId);
        if (input && list) {
          scrollIntoView(list, input);
        }
      } catch (error) {
        console.log(
          `Failed to make highlighted item visible, reason: ${errorMessage(
            error
          )}`
        );
      }
    },
    
    //updates the highlighted item index
    adjustHighlightedIndex: (index: number) => {
      model.highlightedIndex = index;
      if (index !== -1) {
        model.makeItemVisible(index);
      }
    },
    
    adjustHighlightedIndexOnly: (index: number) => {
      model.adjustHighlightedIndex(index);
      model.updateDisplay();
    },
    
    getItemAtIndex: (): Choice | undefined => {
      for (let index = 0; index < model.visibleChoices.length; index++) {
        const choices = model.visibleChoices[index];
        if (
          choices.options &&
          model.highlightedIndex >= (choices.offset ?? 0) &&
          model.highlightedIndex <
            (choices.offset ?? 0) + (choices.options?.length ?? 0)
        ) {
          return {
            key: choices.key,
            option:
              choices.options[model.highlightedIndex - (choices.offset ?? 0)],
          }
        }
      }
      return undefined;
    },
    
    //called when a key is pressed
    inputKeyPressed: (event: KeyboardEvent<HTMLInputElement>) => {
      try {
        switch (event.code) {
          case "ArrowLeft": 
            if( (event.target as HTMLInputElement).value.length === 0 ) {
              if( model.active === undefined ) {
                if( model.selected.length > 0 ) {
                  model.active = model.selected.length - 1;
                }
              } else {
                if( model.selected.length === 0  ) {
                  model.active = undefined;
                } else {
                  model.active = model.active > 0 ? model.active - 1 :  model.selected.length -1;
                }
              }
              model.updateDisplay();
            }
            break;
          case "ArrowRight":
            if( (event.target as HTMLInputElement).value.length === 0 ) {
              if( model.active === undefined ) {
                if( model.selected.length > 0 ) {
                  model.active = 0;
                }
              } else {
                if( model.selected.length === 0  ) {
                  model.active = undefined;
                } else {
                  model.active = model.active < model.selected.length - 1 ? model.active + 1 :  0;
                }
              }
              model.updateDisplay();
            }
            break;
          case "ArrowDown":
            //if the highlited item less than max move down
            if (
              model.showChoices && model.visibleChoiceCount > 0
            ) {
              if (model.highlightedIndex === -1 || model.highlightedIndex >= model.visibleChoiceCount - 1) {
                model.adjustHighlightedIndexOnly(0);
              } else {
                model.adjustHighlightedIndexOnly(model.highlightedIndex + 1);
              }
            } 
            event.preventDefault();
            break;
          case "ArrowUp":
            //if the highlited item greater than 0 move up
            if (
              model.showChoices && model.visibleChoiceCount > 0
            ) {
              if (model.highlightedIndex <= 0) {
                model.adjustHighlightedIndexOnly(model.visibleChoiceCount-1);
              } else {
                model.adjustHighlightedIndexOnly(model.highlightedIndex - 1);
              }
            } 
            event.preventDefault();
            break;
          case "Home":
            //move to start
            if (model.showChoices && model.visibleChoiceCount > 0) {
              model.adjustHighlightedIndexOnly(0);
            }
            event.preventDefault();
            break;
          case "End":
            //move to end
            if (model.showChoices && model.visibleChoiceCount > 0) {
              model.adjustHighlightedIndexOnly(model.visibleChoiceCount-1);
            }
            event.preventDefault();
            break;
          case "NumpadEnter":
          case "Enter":
            //select item
            if (
              model.highlightedIndex > -1 &&
              model.highlightedIndex < model.visibleChoiceCount
            ) {
              const item = model.getItemAtIndex();
              if  (item ) {
                model.selectItem(item, );
              }
            }
            event.preventDefault();
            break;
          case "Backspace":
            if( model.active !== undefined ) {
              model.deselectItem(model.selected[model.active]);
              if( model.selected.length === 0 ) {
                model.active = undefined;
              } else if( model.active > model.selected.length -1 ) {
                model.active = model.selected.length -1;
              }
              model.updateDisplay();
              event.preventDefault();
            } else if( model.inputText === "" && model.selected.length > 0 ) {
              model.deselectItem(model.selected[model.selected.length-1], );
              event.preventDefault();
            }
            break;
          case "Delete": 
            if( model.active !== undefined ) {
              model.deselectItem(model.selected[model.active]);
              if( model.selected.length === 0 ) {
                model.active = undefined;
              } else if( model.active > model.selected.length -1 ) {
                model.active = model.selected.length -1;
              }
              model.updateDisplay();
              event.preventDefault();
            }
            break;
          default:
            if( model.active !== undefined ) {
              model.active = undefined;
              model.updateDisplay();
            }
            break;
        }
        
      } catch (error) {
        console.log(`Failed to hanle key press, reason: ${errorMessage(error)}`);
      }
    }
  };
 
  
  return model;
}