import './GettingStarted.css';
import { CodeBlock, googlecode } from "react-code-blocks";

const GettingStarted = () => {
  return (
    <div className='started'>
      <div>
        <h2 className='no-space-after'>Getting Started</h2>
        <h3>Installation</h3>
        <p>To use AgGridQuickFilter in your project, follow the below instructions to install the library.</p>
        <pre>{
`    Install AgGridQuickFilter by
    
    npm i --save ag-grid-quick-filter
    or
    yarn add ag-grid-quick-filter
`}</pre>
        <h3>Adding the control</h3>
        <p>To add the control, copy the below code and paste it into a file within your project.</p>
        <div className='code-block'>
          <pre>{
`    <AgGridQuickFilter
      title="test"
      choices={[
        {
          key: "Words",
          options: ['options1','option2','option3'],
        }
      ]}
    />
        `}</pre>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
