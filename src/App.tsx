import React, { useState } from "react";
import InputForm from "./components/InputForm";
import SimulatorView from "./components/SimulatorView";

const App: React.FC = () => {
	const [isStarted, setIsStarted] = useState<boolean>(false);

	return !isStarted ? (
		<InputForm setIsStarted={setIsStarted} />
	) : (
		<SimulatorView />
	);
};

export default App;
