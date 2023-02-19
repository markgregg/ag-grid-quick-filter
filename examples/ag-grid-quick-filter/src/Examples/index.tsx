import { useState } from "react";
import VerticalMenu from "../VerticalMenu";
import { categories } from "./Demos";
import "./Examples.css";

const Examples = () => {
  const [demo, setDemo] = useState<string>(categories[0].name);

  const constructDemo = (demoName: string): JSX.Element => {
    const category = categories.find((cat) => cat.name === demoName);
    return category ? category?.demo() : <div></div>;
  };

  return (
    <div
      className="examples"
      style={{
        color: "var(--pageFont)",
      }}
    >
      <VerticalMenu
        options={categories.map((c) => c.name)}
        onSelect={setDemo}
      />
      <div className="controls">
        {demo && constructDemo(demo)}
      </div>
    </div>
  );
};

export default Examples;

