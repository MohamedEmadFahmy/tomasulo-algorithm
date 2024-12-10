import React, { useState } from "react";
import InputForm from "./components/InputForm";
import SimulatorView from "./components/SimulatorView";

const App: React.FC = () => {
	const [isStarted, setIsStarted] = useState<boolean>(false);

	return (
		<div className="w-full h-screen bg-yellow-300">
			{!isStarted ? (
				<InputForm setIsStarted={setIsStarted} />
			) : (
				<SimulatorView />
			)}
		</div>
	);
};

export default App;

