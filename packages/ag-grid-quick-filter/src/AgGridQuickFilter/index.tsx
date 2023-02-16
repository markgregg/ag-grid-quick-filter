import {
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import CSS from "csstype";
import { itemText, itemValue } from "../utils/domUtils";
import { IoIosClose } from "react-icons/io";
import { RiArrowDropDownFill } from "react-icons/ri";
import QuickFiltersalChoice from "../FilterChoice";
import {
  Choice,
  ChoiceStyle,
  SelectProps,
  SelectStyle,
  ChoiceProps,
  SelectionProps,
  SelectionStyle,
  Selection,

} from "../types";
import "./AgGridQuickFilter.css";
import QuickFiltersalSelection from "../FilterSelection";
import { createAgGridQuickFilterModel, AgGridQuickFilterModel } from "./AgGridQuickFilter";

export interface AgGridQuickFilterProps
  extends SelectProps,
    SelectStyle,
    ChoiceStyle,
    SelectionStyle {}

const AgGridQuickFilter = (props: AgGridQuickFilterProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const [,refresh] = useState<number>(0);
  const refreshDisplay = () => {
    refresh(performance.now());
  }
  const model = useMemo<AgGridQuickFilterModel>( () => createAgGridQuickFilterModel(props), [] );
  model.refresh = refreshDisplay;
  model.updateRefs( inputRef, selectRef );
  model.updateProps(props);
    
  useEffect(() => {
    //detected when to close item list
    document.addEventListener("click", model.clickedAway, true);
    return () => {
      document.removeEventListener("click", model.clickedAway, true);
    };
  }, []);

  const QuickFiltersalSelectWrapperStyle = (): CSS.Properties => {
    return {
      height: props.height,
      width: props.width,
      minWidth: props.minWidth ?? "80px",
      maxWidth: props.maxWidth,
      ...props.style
    };
  }

  const inputClassName = (): string =>
    props.disabled 
      ? ( props.inputDisabledClassName ? ` ${props.inputDisabledClassName}` : " csQuickFilterInputDisabled" )
      : ( props.inputClassName ? ` ${props.inputClassName}` : "" );

  const inputStyle = (): CSS.Properties =>
    props.disabled && props.inputDisabledStyle
      ? props.inputDisabledStyle
      : props.inputStyle ?? {};

  const QuickFiltersalSelectStyle = (): CSS.Properties =>
    props.disabled && props.selectDisabledStyle
      ? props.selectDisabledStyle
      : props.selectStyle ?? {};


  const QuickFilteralSelectClassName = (): string =>
    props.disabled
      ? ( props.disabledClassName ? ` ${props.disabledClassName}` : " csQuickFilterSelectDsiabled" )
      : ( props.className ? ` ${props.className}` : "" );

  const clearSelectedStyle = (): CSS.Properties =>
    props.clearSelectionStyle ?? {};

  const titleDisplayStyle = (): CSS.Properties =>
    props.disabled && props.titleDisabledStyle
      ? props.titleDisabledStyle
      : props.titleStyle ?? {};

  const titleClassName = (): string =>
    props.disabled
      ? ( props.titleDisabledClassName ? ` ${props.titleDisabledClassName}` : " csQuickFilterSelectDisabled" )
      : ( props.titleClassName  ? ` ${props.titleClassName}` : "" );

  const dropdownIconStyle = (): CSS.Properties =>
    props.dropdownIconStyle ?? {};

  const choiceProps = (
    highlighted: boolean,
    choice: Choice,
    choiceText: string
  ): ChoiceProps & ChoiceStyle => {
    return {
      choice,
      choiceText,
      onSelected: model.selectItem,
      choiceHighlighted: highlighted,
      ...(props as ChoiceStyle),
    };
  };

  const constructChoice = (
    highlighted: boolean,
    choice: Choice,
    choiceText: string
  ): JSX.Element =>
    props.choiceComponent ? (
      <div key={(highlighted ? "high-" : "") + choice.key + choice.option}>
        {props.choiceComponent({
          ...choiceProps(highlighted, choice, choiceText),
        })}
      </div>
    ) : (
      <QuickFiltersalChoice
        key={(highlighted ? "high-" : "") + choice.key + choice.option}
        {...choiceProps(highlighted, choice, choiceText)}
      />
    );

  const selectionProps = (
    selection: Selection,
    selectionText: string,
    index: number,
    prefix?: string
  ): SelectionProps & SelectionStyle => {
    return {
      prefix,
      selection,
      selectionText,
      disabled: props.disabled,
      onDeselected: model.deselectItem,
      active: index === model.active,
      ...(props as SelectionStyle),
    };
  };

  const constructSelection = (
    selection: Selection,
    selectionText: string,
    selectionValue: string,
    index: number,
    prefix?: string
  ): JSX.Element => {
    return props.selectComponent ? (
      <div key={"sel-" + selection.key + selection.option}>
        {props.selectComponent({
          ...selectionProps(selection, selectionText, index, prefix),
        })}
      </div>
    ) : (
      <QuickFiltersalSelection
        key={"sel-" + selection.key + selectionValue}
        {...selectionProps(selection, selectionText, index, prefix)}
      />
    );
  };

  return (
    <div 
      className="csQuickFilterWrapper" 
      ref={selectRef}
      style={QuickFiltersalSelectWrapperStyle()}
    >
      <div
        className={"csQuickFilterSelect" + QuickFilteralSelectClassName()}
        style={QuickFiltersalSelectStyle()}
        onClick={model.textInputClicked}
      >
        {model.selected.length > 0 && (
          <div
            className="csQuickFilterClearSelection"
            onClick={model.clearSelection}
          >
            {props.clearSelectionIcon ? (
              <props.clearSelectionIcon 
                className={props.clearSelectionClassName} 
                style={clearSelectedStyle()}
              />
            ) : (
              <IoIosClose 
                className={props.clearSelectionClassName} 
                style={clearSelectedStyle()}
              />
            )}
          </div>
        )}
        <div className="csQuickFilterSelections">
          {
            model.selected.map( (selection, index) => {
              const definition = model.definitionMap.get(selection.key);
              return constructSelection(
                selection,
                (selection.operand ? `${selection.operand} ` : "") + 
                (selection.comparison ? `${selection.comparison} ` : "") + 
                  (definition?.showSelectedValue === true
                    ? itemValue(selection.option, definition?.value)
                    : itemText(selection.option, definition?.text)),
                itemValue(selection.option, definition?.value),
                index,
                definition?.prefix
              );
            })
          }
          {model.showChoices && (
            <input
              ref={inputRef}
              id={"csInput" + model.selectId}
              className={"csQuickFilterInput" + inputClassName()}
              style={inputStyle()}
              value={model.inputText}
              disabled={props.disabled}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              onChange={model.textChanged}
              onKeyDownCapture={model.inputKeyPressed}
            />
          )}
        </div>
        {!model.showChoices && model.selected.length === 0 && (
          <div className="csQuickFilterTextWrapper">
            {
              <p
                className={"csQuickFilterSelectCommon csQuickFilterSelectTitle" + titleClassName()}
                style={titleDisplayStyle()}
              >
                {props.title}
              </p>
            }
          </div>
        )}
        {!props.hideDropdownIcon && (
          <div className="csQuickFilterDropDownIcon">
            {props.dropdownIcon ? (
              <props.dropdownIcon 
                className={props.dropIconClassName} 
                style={dropdownIconStyle()}
              />
            ) : (
              <RiArrowDropDownFill 
                className={props.dropIconClassName} 
                style={dropdownIconStyle()}
              />
            )}
          </div>
        )}
        {(model.showChoices || model.selected.length > 0) && !props.hideTitle && (
          <p
            className={"csQuickFilterSelectCommon csQuickFilterSelectfloatingTitle" + titleClassName()}
            style={titleDisplayStyle()}
          >
            {props.title}
          </p>
        )}
        {!props.disabled && model.showChoices && (
          <div
            id={"csList" + model.selectId}
            className={
              "csQuickFilterChoiceContainer" +
              (props.choiceListClassName ? ` ${props.choiceListClassName}` : "")
            }
            style={{
              top: model.listPosition,
              ...props.choiceListStyle,
            }}
          >
            <ul className="csQuickFilterChoiceList">
              {model.visibleChoiceCount > 0 &&
                model.visibleChoices.map(choices => (
                  <div key={`cat_${choices.key}`}>
                    <p
                      className={
                        "csQuickFilterCatagoryTitle" +
                        (props.catagoryClassName
                          ? ` ${props.catagoryClassName}`
                          : "")
                      }
                      style={props.catagoryStyle}
                    >
                      {(model.definitionMap.get(choices.key)?.choiceDisplayName ??
                        choices.key) + (model.comparison ? ` (${model.comparison})` : "") }
                    </p>
                    {choices.options?.map((option, index) => {
                      const definition = model.definitionMap.get(choices.key);
                      return (
                        <li
                          id={`item_${(choices.offset ?? 0) + index}`}
                          key={`item_${(choices.offset ?? 0) + index}`}
                          onMouseOverCapture={() =>
                            model.adjustHighlightedIndexOnly(
                              (choices.offset ?? 0) + index
                            )
                          }
                        >
                          {constructChoice(
                            model.highlightedIndex === (choices.offset ?? 0) + index,
                            {
                              key: choices.key,
                              option: option,
                            },
                            itemText(option, definition?.text)
                          )}
                        </li>
                      );
                    })}
                  </div>
                ))}
              {model.visibleChoiceCount === 0 && (
                <p
                  className={
                    "csQuickFilterNoItems" +
                    (props.loadingTextClassName
                      ? ` ${props.loadingTextClassName}`
                      : "")
                  }
                  style={props.loadingTextStyle}
                >
                  {model.inputText !== ""
                    ? props.noItemText ?? "No options."
                    : props.typePromptText ?? "Type to see available options."}
                </p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgGridQuickFilter;
