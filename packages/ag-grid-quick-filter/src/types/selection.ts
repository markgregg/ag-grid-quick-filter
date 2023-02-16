import { Comparison } from "./comparison";
import { Operand } from "./operand";
import { OptionType } from "./optionType";

export interface Selection {
  key: string;
  option: OptionType;
  comparison?: Comparison;
  operand?: Operand;
}