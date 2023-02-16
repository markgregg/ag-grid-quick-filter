import CSS from "csstype";
import { FC, MouseEvent } from "react";
import { ChoiceProps, ChoiceStyle } from "../types";
import "./FilterChoice.css";

export interface FilterChoiceProps extends ChoiceProps, ChoiceStyle {}

const FilterChoice: FC<FilterChoiceProps> = ({
  choiceText,
  choice,
  choiceHighlighted,
  onSelected,
  choiceStyle,
  choiceHoverStyle,
  choiceClassName,
  choiceHoverClassName
}) => {
  const selectItem = (event: MouseEvent<HTMLDivElement>) => {
    onSelected(choice);
    event.stopPropagation();
  };

  const getChoiceStyle = (): CSS.Properties =>
    choiceHighlighted && choiceHoverStyle
      ? choiceHoverStyle
      : choiceStyle ?? {};

  const getChoiceClassName = (): string =>
    choiceHighlighted 
      ? ( choiceHoverClassName ?` ${choiceHoverClassName}` : " csQuickFilterChoiceHighlighed" )
      : ( choiceClassName ? ` ${choiceClassName}` : "");

  return (
    <div
      className={"csQuickFilterChoice" + getChoiceClassName()}
      style={getChoiceStyle()}
      onClick={selectItem}
    >
      <p className="csQuickFilterChoiceText">{choiceText}</p>
    </div>
  );
};

export default FilterChoice;
