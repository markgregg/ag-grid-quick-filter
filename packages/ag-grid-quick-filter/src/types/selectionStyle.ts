import CSS from 'csstype';
import { IconType } from 'react-icons/lib';

export interface SelectionStyle {
  selectionStyle?: CSS.Properties;
  selectionDisabledStyle?: CSS.Properties;
  selectionClassName?: string;
  selectionDisabledClassName?: string;
  deselectStyle?: CSS.Properties;
  deselectDisabledStyle?: CSS.Properties;
  deselectHoverStyle?: CSS.Properties;
  deselectClassName?: string;
  deselectDisabledClassName?: string;
  deselectHoverClassName?: string;
  selectionPrefixClassName?: string;
  selectionPrefixDisabledClassName?: CSS.Property.Color;
  selectionPrefixDisabledStyle?: CSS.Properties;
  selectionPrefixStyle?: CSS.Properties;
  selectionTextClassName?: string;
  selectionTextDisabledClassName?: CSS.Property.Color;
  selectionTextDisabledStyle?: CSS.Properties;
  selectionTextStyle?: CSS.Properties;
  selectionActiveClassName?: string;
  deselectIcon?: IconType;
}
