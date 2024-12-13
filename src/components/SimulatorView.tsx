/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Config } from "../App";
import { TInstruction } from "../backend/types";
import { initCache, initMemory } from "../backend/memory";

interface SimulatorViewProps {
	config: Config; // Ensure this property exists on SimulatorViewProps
	instructionMemory: TInstruction[];
}
const SimulatorView: React.FC<SimulatorViewProps> = ({
	config,
	instructionMemory,
}) => {
	useEffect(() => {
		initMemory();
		initCache();
		// console.log("config: ", config);
		// console.log("instructionMemory: ", instructionMemory);
		// console.log("cache size: "));
	}, []);

	return (
		<div className="bg-black w-full h-screen flex flex-col items-center">
			<div className="p-2">
				<h1 className="text-white text-4xl font-bold">
					Tomasulo Algorithm Simulator
				</h1>
			</div>
			<div className="bg-gray-300 flex-[10] w-full">
				{/* <h3>Cycle: {simulationState.cycle}</h3>
				<button onClick={nextCycle}>Next Cycle</button>

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

				<div>
					<h4>Register File</h4>
					{Object.entries(simulationState.registerFile).map(
						([reg, val]) => (
							<p key={reg}>{`${reg}: ${val}`}</p>
						)
					)}
				</div> */}
			</div>
		</div>
	);
};

export default SimulatorView;
