import { FC } from "react";
import CSS from "csstype";
import { IoIosClose } from "react-icons/io";
import { MouseEvent } from "react";
import { SelectionProps, SelectionStyle } from "../types";
import "./FilterSelection.css";
import { IconType } from "react-icons/lib";

export interface FilterSelectionProps
  extends SelectionStyle,
    SelectionProps {}

const FilterSelection: FC<FilterSelectionProps> = ({
  prefix,
  selectionText,
  selection,
  disabled,
  onDeselected,
  selectionStyle,
  selectionDisabledStyle,
  selectionClassName,
  selectionDisabledClassName,
  deselectStyle,
  deselectClassName,
  deselectIcon,
  selectionPrefixClassName,
  selectionPrefixDisabledClassName,
  selectionPrefixDisabledStyle,
  selectionPrefixStyle,
  selectionTextClassName,
  selectionTextDisabledClassName,
  selectionTextDisabledStyle,
  selectionTextStyle,
  selectionActiveClassName,
  active
}) => {

  const deselectItem = (event: MouseEvent<HTMLDivElement>) => {
    onDeselected(selection);
    event.stopPropagation();
  };

  const getSelectionStyle = (): CSS.Properties =>
    disabled && selectionDisabledStyle
      ? selectionDisabledStyle
      : selectionStyle ?? { };

  const getSelectionClassName = (): string =>
    disabled
      ? ( selectionDisabledClassName ? ` ${selectionDisabledClassName}` : " csQuickFilterSelectionDisabled" )
      : active 
      ? ( selectionActiveClassName ? ` ${selectionActiveClassName}` : " csQuickFilterSelectionActive" )
      : ( selectionClassName ? ` ${selectionClassName}` : "" );

  const getDeselectStyle = (): CSS.Properties =>
    deselectStyle ?? {};
  
  const getDeselectClassName = (): string =>
    deselectClassName ? ` ${deselectClassName}` : "";

  const getSelectionPrefixStyle = (): CSS.Properties =>
    disabled && selectionPrefixDisabledStyle
      ? selectionPrefixDisabledStyle
      : selectionPrefixStyle ?? {};

  const getSelectionPrefixClassName = (): string =>
    disabled
      ? ( selectionPrefixDisabledClassName ? ` ${selectionPrefixDisabledClassName}` : "" )
      : ( selectionPrefixClassName ? ` ${selectionPrefixClassName}` : "" );

  const getSelectionTextStyle = (): CSS.Properties =>
    disabled && selectionTextDisabledStyle
      ? selectionTextDisabledStyle
      : selectionTextStyle ?? {};

  const getSelectionTextClassName = (): string =>
    disabled 
      ? ( selectionTextDisabledClassName ? ` ${selectionTextDisabledClassName}` : "" )
      : ( selectionTextClassName ? ` ${selectionTextClassName}` : "" );

  const DeselectIcon: IconType = deselectIcon ?? IoIosClose;

  return (
    <div>
      <div
        className={"csQuickFilterSelection" + getSelectionClassName()}
        style={getSelectionStyle()}
      >
        {prefix && (
          <p
            className={"csQuickFilterPrefixText" + getSelectionPrefixClassName()}
            style={getSelectionPrefixStyle()}
          >
            {prefix}
          </p>
        )}
        <div className="csQuickFilterContentAlign">
          <div onClick={deselectItem}>
            <DeselectIcon
              className={"csQuickFilterDeselect" + getDeselectClassName()}
              style={getDeselectStyle()}
            />
          </div>
          <p
            className={
              "csQuickFilterSelectionText" + getSelectionTextClassName()
            }
            style={getSelectionTextStyle()}
          >
            {selectionText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilterSelection;
