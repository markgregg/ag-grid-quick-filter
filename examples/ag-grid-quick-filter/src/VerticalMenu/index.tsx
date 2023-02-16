import { useState, FC } from "react";
import "./VerticalMenu.css";

interface VerticalMenuProps {
  title: string;
  options: string[];
  onSelect: (option: string) => void;
}

const VerticalMenu: FC<VerticalMenuProps> = ({
  title,
  options,
  onSelect,
}) => {
  const [active, setActive] = useState<string>();

  return (
    <div
      className="vmenu"
    >
      <h3 className="vmenu-heading">{title}</h3>
      <ul className="vmenu-items">
        {options.map((option) => (
          <li
            key={option}
            className={ option === active ? "active-option" : "option" }
            onClick={() => {
              setActive(option);
              onSelect(option);
            }}
          >
            <p className='vmenu-text'>{option}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerticalMenu;
