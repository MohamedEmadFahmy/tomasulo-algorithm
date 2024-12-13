/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Config } from "../App";
import { TInstruction } from "../backend/types";
import { TomasuloSystem } from "../backend/tomasulo";
import GenericTable from "./GenericTable";
import { GenericTableTypeEnum } from "../constants";
import { simulateStep } from "../backend/tomasulo";

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
