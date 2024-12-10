import React, { useState, useEffect } from "react";

const SimulatorView: React.FC = () => {
	const [simulationState, setSimulationState] = useState({
		cycle: 0,
		reservationStations: [],
		registerFile: { F0: 0, F1: 0, F2: 0, F3: 0 }, // Sample register file for display
		cache: [],
		instructionQueue: [
			{
				id: 1,
				type: "ADD",
				destination: "F0",
				source1: "F1",
				source2: "F2",
			},
			{
				id: 2,
				type: "SUB",
				destination: "F2",
				source1: "F0",
				source2: "F3",
			},
			{
				id: 3,
				type: "MUL",
				destination: "F3",
				source1: "F1",
				source2: "F0",
			},
		], // Sample instructions for display
	});

	const nextCycle = () => {
		// Increments the cycle count
		setSimulationState((prev) => ({
			...prev,
			cycle: prev.cycle + 1,
		}));
	};

	useEffect(() => {
		console.log("Simulation State Updated:", simulationState);
	}, [simulationState]);

	return (
		<div className="bg-black w-full h-full flex flex-col items-center p-4">
			<h1 className="text-white text-4xl font-bold flex-1">
				Tomasulo Algorithm Simulator
			</h1>
			<div className="bg-orange-300 flex-[10] w-1/2">
				<h2>Simulator</h2>
				<h3>Cycle: {simulationState.cycle}</h3>
				<button onClick={nextCycle}>Next Cycle</button>

				{/* Instruction Queue */}
				<div>
					<h4>Instruction Queue</h4>
					<ul>
						{simulationState.instructionQueue.map((inst) => (
							<li key={inst.id}>
								{`${inst.type} ${inst.destination}, ${inst.source1}, ${inst.source2}`}
							</li>
						))}
					</ul>
				</div>

				{/* Register File */}
				<div>
					<h4>Register File</h4>
					{Object.entries(simulationState.registerFile).map(
						([reg, val]) => (
							<p key={reg}>{`${reg}: ${val}`}</p>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default SimulatorView;
