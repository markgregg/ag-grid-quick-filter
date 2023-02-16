import { OptionType } from './optionType';

export interface Choices {
  key: string;
  options?: OptionType[];
  offset?: number;
  priority?: number;
}
