import React, { useState } from "react";
import InputForm from "./components/InputForm";
import SimulatorView from "./components/SimulatorView";
import { TInstruction } from "./backend/types";

const App: React.FC = () => {
	const [isStarted, setIsStarted] = useState<boolean>(false);

	const [instructionMemory, setInstructionMemory] = useState<TInstruction[]>(
		[]
	);

	return !isStarted ? (
		<InputForm
			setIsStarted={setIsStarted}
			instructionMemory={instructionMemory}
			setInstructionMemory={setInstructionMemory}
		/>
	) : (
		<SimulatorView />
	);
};

export default App;
