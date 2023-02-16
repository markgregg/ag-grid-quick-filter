import { OptionType } from './optionType';

export type LookUp = (option: OptionType) => string;

export interface ChoiceDefinition<T extends OptionType> {
  key: string;
  prefix?: string;
  options?: T[];
  text?: (option: T) => string;
  value?: (option: T) => string;
  choiceDisplayName?: string;
  lookUp?: (text: string) => Promise<T[]>;
  regExMatch?: RegExp;
  valueGetter?: (text: string) => string | undefined;
  maximumSelections?: number;
  maxAvailableChoices?: number;
  search?: 'text' | 'value' | 'both';
  showSelectedValue?: boolean;
  agGridColumn?: string;
  sourceAg?: boolean;
  filterType?: "text" | "number" | "date";
  valueConverter?: (option: OptionType) => any; //when using aggrid
  replaceExisting?: boolean; //replace exsiting ag choice
}
