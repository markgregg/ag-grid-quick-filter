import { useState, FC } from "react";
import "./VerticalMenu.css";

interface VerticalMenuProps {
  options: string[];
  onSelect: (option: string) => void;
}


const VerticalMenu: FC<VerticalMenuProps> = ({
  options,
  onSelect,
}) => {
  const [active, setActive] = useState<string>();

  return (
    <div className="menu-border">
      <div className="vmenu">
        <ul>
          {options.map((option) => (
            <li
              className={option === active ? "active-option" : ""}
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
    </div>
  );
};

export default VerticalMenu;
