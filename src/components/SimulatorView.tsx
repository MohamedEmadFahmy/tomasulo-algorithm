/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Config } from "../App";
import { TInstruction } from "../backend/types";
import { TomasuloSystem } from "../backend/tomasulo";
import GenericTable from "./GenericTable";
import { GenericTableTypeEnum } from "../constants";
import { simulateStep } from "../backend/tomasulo";
// import { getInputFromUser } from "../backend/tomasulo";
// import { getInputFromUser2 } from "../backend/memory";

interface SimulatorViewProps {
	config: Config; // Ensure this property exists on SimulatorViewProps
	instructionMemory: TInstruction[];
}
const SimulatorView: React.FC<SimulatorViewProps> = ({
	config,
	instructionMemory,
}) => {
	const [toggleState, setToggleState] = useState(false);

	const handleClick = () => {
		console.log("Old system state: ", TomasuloSystem);
		simulateStep();
		console.log("New system state: ", TomasuloSystem);
		setToggleState(!toggleState);
	};

	// useEffect(() => {
	// 	console.log("Config: ", config);

	// 	const noOfAddSubRS = config.reservation_stations_sizes["FP ADD/SUB"];

	// 	console.log("No of ADD/SUB RS: ", noOfAddSubRS);

	// 	const noOfMulDivRS = config.reservation_stations_sizes["FP MUL/DIV"];

	// 	const noOfLoadBuffers = config.buffer_sizes.LOAD;

	// 	const noOfStoreBuffers = config.buffer_sizes.STORE;

	// 	const noOfIntegerAddSubRS =
	// 		config.reservation_stations_sizes["Integer ADD/SUB"];

	// 	const cacheSize = config.cache_size;

	// 	const cacheBlockSize = config.block_size;

	// 	const programInstructions = instructionMemory;

	// 	getInputFromUser(
	// 		noOfAddSubRS,
	// 		noOfMulDivRS,
	// 		noOfLoadBuffers,
	// 		noOfStoreBuffers,
	// 		noOfIntegerAddSubRS,
	// 		cacheSize,
	// 		cacheBlockSize,
	// 		programInstructions
	// 	);

	// 	getInputFromUser2(
	// 		noOfAddSubRS,
	// 		noOfMulDivRS,
	// 		noOfLoadBuffers,
	// 		noOfStoreBuffers,
	// 		noOfIntegerAddSubRS,
	// 		cacheSize,
	// 		cacheBlockSize,
	// 		programInstructions
	// 	);
	// }, []);

	return (
		<div className="bg-black w-full h-screen flex flex-col items-center">
			<div className="p-2">
				<h1 className="text-white text-4xl font-bold">
					Tomasulo Algorithm Simulator
				</h1>
			</div>
			<div className="bg-gray-300 flex-[10] w-full flex flex-col items-center gap-10">
				<p className="text-5xl font-bold">
					Current Clock Cycle: {TomasuloSystem.clock}
				</p>
				<button className="bg-blue-300 p-4" onClick={handleClick}>
					Next Clock Cycle
				</button>

				{/* Loop through the reservation stations and display them */}

				<GenericTable
					type={GenericTableTypeEnum.ReservationStations}
					data={TomasuloSystem.ReservationStations[0].stations}
					title={
						TomasuloSystem.ReservationStations[0]
							.reservationStationType + " Reservation Station"
					}
				></GenericTable>
				<GenericTable
					type={GenericTableTypeEnum.ReservationStations}
					data={TomasuloSystem.ReservationStations[1].stations}
					title={
						TomasuloSystem.ReservationStations[1]
							.reservationStationType + " Reservation Station"
					}
				></GenericTable>
				<GenericTable
					type={GenericTableTypeEnum.ReservationStations}
					data={TomasuloSystem.ReservationStations[2].stations}
					title={
						TomasuloSystem.ReservationStations[2]
							.reservationStationType + " Reservation Station"
					}
				></GenericTable>
			</div>
		</div>
	);
};

export default SimulatorView;
