import { Selection } from './selection';

export interface SelectionProps {
  prefix?: string;
  selectionText: string;
  selection: Selection;
  disabled?: boolean;
  onDeselected: (item: Selection) => void;
  active?: boolean;
}
