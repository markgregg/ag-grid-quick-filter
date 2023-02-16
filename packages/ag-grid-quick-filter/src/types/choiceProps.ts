import { Choice } from './choice';

export interface ChoiceProps {
  choiceText: string;
  choice: Choice;
  choiceHighlighted?: boolean;
  onSelected: (item: Choice) => void;
}
