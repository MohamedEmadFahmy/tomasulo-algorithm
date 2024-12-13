import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import {
  initMemory,
  loadByte,
  printMemory,
  printByte,
  printByteRange,
  returnByteString,
  setByte,
  loadWord,
  storeWord,
  storeDouble,
  loadDouble,
  storeWordCache,
  initCache,
  printCache,
  storeDoubleCache,
} from "./backend/tomasulo";

function App() {
  const [count, setCount] = useState(0);

  initCache();
  initMemory();
  storeWordCache(20, 0);
  console.log(loadWord(0));
  storeWordCache(2147483647, 4);
  console.log(loadWord(4));
  storeDoubleCache(9241421688590567425, 8);
  console.log(loadDouble(8));
  printCache();
  
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-blue-900">Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
