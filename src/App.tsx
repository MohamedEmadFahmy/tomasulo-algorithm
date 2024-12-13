import React, { useState } from "react";
import InputForm from "./components/InputForm";
import SimulatorView from "./components/SimulatorView";
import { TInstruction } from "./backend/types";

const App: React.FC = () => {
	const [isStarted, setIsStarted] = useState<boolean>(true);

	const [instructionMemory, setInstructionMemory] = useState<TInstruction[]>(
		[]
	);

	const [config, setConfig] = useState<Config>({
		reservation_stations_sizes: {
			"Integer ADD/SUB": 3,
			"FP ADD/SUB": 3,
			"FP MUL/DIV": 3,
		},
		cache_size: 1024,
		block_size: 16,
		buffer_sizes: {
			LOAD: 3,
			STORE: 3,
		},
	});

	return !isStarted ? (
		<InputForm
			config={config}
			setConfig={setConfig}
			setIsStarted={setIsStarted}
			instructionMemory={instructionMemory}
			setInstructionMemory={setInstructionMemory}
		/>
	) : (
		<SimulatorView config={config} instructionMemory={instructionMemory} />
	);
};

export default App;

export interface ReservationStationsSizes {
	"Integer ADD/SUB": number;
	"FP ADD/SUB": number;
	"FP MUL/DIV": number;
}

export interface BufferSizes {
	LOAD: number;
	STORE: number;
}

export interface Config {
	reservation_stations_sizes: ReservationStationsSizes;
	buffer_sizes: BufferSizes;
	cache_size: number;
	block_size: number;
}
