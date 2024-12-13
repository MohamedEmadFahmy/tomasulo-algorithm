/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Config } from "../App";
import {
	InstructionTypeEnum,
	ReservationStationTypeEnum,
	TInstruction,
	TReservationStation,
} from "../backend/types";
import GenericTable from "./GenericTable";
import { GenericTableTypeEnum } from "../constants";
import {
	simulateStep,
	setupSystem,
	ITomasuloSystem,
} from "../backend/tomasulo";

let TomasuloSystem: ITomasuloSystem = {
	ReservationStations: [
		{
			reservationStationType: ReservationStationTypeEnum.ADD_SUB,
			stations: [
				{
					tag: "RS1",
					op: InstructionTypeEnum.ADD_D,
					VJ: 10,
					VK: 20,
					QJ: "",
					QK: "",
					busy: 1,
					res: 0,
					cyclesRemaining: 2,
				},
			],
		},
		{
			reservationStationType: ReservationStationTypeEnum.MUL_DIV,
			stations: [
				{
					tag: "RS2",
					op: InstructionTypeEnum.MUL_D,
					VJ: 5,
					VK: 4,
					QJ: "",
					QK: "",
					busy: 1,
					res: 0,
					cyclesRemaining: 3,
				},
			],
		},
		{
			reservationStationType: ReservationStationTypeEnum.INTEGER,
			stations: [
				{
					tag: "RS2",
					op: InstructionTypeEnum.MUL_D,
					VJ: 5,
					VK: 4,
					QJ: "",
					QK: "",
					busy: 1,
					res: 0,
					cyclesRemaining: 3,
				},
			],
		},
	],
	Buffers: [
		{
			bufferType: "Load",
			buffers: [
				{
					op: InstructionTypeEnum.LD,
					tag: "B1",
					busy: 1,
					address: 100,
					V: 0,
					Q: "",
					res: 0,
					cyclesRemaining: 2,
				},
			],
		},
		{
			bufferType: "Store",
			buffers: [
				{
					op: InstructionTypeEnum.SD,
					tag: "B2",
					busy: 1,
					address: 200,
					V: 42,
					Q: "",
					res: 0,
					cyclesRemaining: 2,
				},
			],
		},
	],
	registerFile: [
		{ tag: "R1", Q: "", content: 10 },
		{ tag: "R2", Q: "RS1", content: 0 },
		{ tag: "R3", Q: "", content: 15 },
	],
	dataMemory: {
		memory: new Int8Array(256),
	},
	cache: {
		cache: [
			{
				address: [0, 16],
				data: new Int8Array(16).fill(0),
			},
		],
	},
	InstructionMemory: [
		{
			type: InstructionTypeEnum.ADD_D,
			d: "R1",
			s: "R2",
			t: "R3",
			latency: 2,
		},
		{
			type: InstructionTypeEnum.MUL_D,
			d: "R3",
			s: "R1",
			t: "R2",
			latency: 3,
		},
	],
	instructionQueue: [
		{
			type: InstructionTypeEnum.LD,
			d: "R2",
			s: "",
			t: "",
			latency: 2,
		},
		{
			type: InstructionTypeEnum.SD,
			d: "",
			s: "R3",
			t: "",
			latency: 2,
		},
	],
	clock: 0,
};

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

	useEffect(() => {
		TomasuloSystem = setupSystem(config, instructionMemory);
		setToggleState(!toggleState);
		console.log(TomasuloSystem);
	}, []);

	return (
		<div className="bg-black w-full h-screen flex flex-col items-center">
			<div className="p-2">
				<h1 className="text-white text-4xl font-bold">
					Tomasulo Algorithm Simulator
				</h1>
			</div>
			<div className="bg-gray-300 flex-[10] w-full flex flex-col items-center gap-10">
				<p className="text-5xl font-bold">
					Current Clock Cycle:{" "}
					{TomasuloSystem ? TomasuloSystem.clock : "0"}
				</p>
				<button className="bg-blue-300 p-4" onClick={handleClick}>
					Next Clock Cycle
				</button>

				{/* Loop through the reservation stations and display them */}

				<GenericTable
					type={GenericTableTypeEnum.ReservationStations}
					data={
						TomasuloSystem
							? TomasuloSystem.ReservationStations[0]?.stations
							: []
					}
					title={
						TomasuloSystem
							? TomasuloSystem
								? TomasuloSystem.ReservationStations[0]
										?.reservationStationType
								: {} + " Reservation Station"
							: "undefined"
					}
				></GenericTable>
				<GenericTable
					type={GenericTableTypeEnum.ReservationStations}
					data={
						TomasuloSystem
							? TomasuloSystem.ReservationStations[1]?.stations
							: []
					}
					title={
						TomasuloSystem
							? TomasuloSystem.ReservationStations[1]
									?.reservationStationType +
							  " Reservation Station"
							: "undefined"
					}
				></GenericTable>
				<GenericTable
					type={GenericTableTypeEnum.ReservationStations}
					data={
						TomasuloSystem
							? TomasuloSystem.ReservationStations[2]?.stations
							: []
					}
					title={
						TomasuloSystem
							? TomasuloSystem.ReservationStations[2]
									?.reservationStationType +
							  " Reservation Station"
							: "undefined"
					}
				></GenericTable>

				{/* Load Buffer */}
				<GenericTable
					type={GenericTableTypeEnum.LoadBuffer}
					data={
						TomasuloSystem ? TomasuloSystem.Buffers[0]?.buffers : []
					}
					title={
						TomasuloSystem
							? TomasuloSystem.Buffers[0]?.bufferType + " Buffer"
							: "undefined"
					}
				></GenericTable>

				{/* Store Buffer */}
				<GenericTable
					type={GenericTableTypeEnum.StoreBuffer}
					data={
						TomasuloSystem ? TomasuloSystem.Buffers[1]?.buffers : []
					}
					title={
						TomasuloSystem
							? TomasuloSystem.Buffers[1]?.bufferType + " Buffer"
							: "undefined"
					}
				></GenericTable>

				{/* Instruction Memory */}

				<div className=" bg-blue-300 flex flex-col gap-5 p-4 rounded-md">
					<h2 className="text-center text-5xl text-white font-bold">
						Program
					</h2>
					<ol
						start={0}
						className="list-decimal list-inside mt-4 overflow-y-auto max-h-[70vh] text-xl font-bold"
					>
						{instructionMemory.length > 0 ? (
							instructionMemory.map((inst, index) => (
								<li key={index} className="text-white">
									{inst.t
										? `${inst.type} ${inst.d}, ${inst.s}, ${inst.t} ` // (Latency: ${inst.latency})
										: `${inst.type} ${inst.d}, ${inst.s} `}
									{/* // (Latency: ${inst.latency})}  */}
								</li>
							))
						) : (
							<p className="text-white">No instructions added</p>
						)}
					</ol>
				</div>
				<div className="mb-2"></div>

				{/* Register File */}
				<GenericTable
					type={GenericTableTypeEnum.RegisterFile}
					data={TomasuloSystem ? TomasuloSystem.registerFile : []}
					title={"Register File"}
				></GenericTable>

				{/* Cache */}
				<div className="bg-blue-300 flex flex-col gap-5 p-4 rounded-md">
					<h2 className="text-center text-5xl text-white font-bold">
						Cache
					</h2>
					<div className="overflow-y-auto max-h-[70vh]">
						{TomasuloSystem?.cache?.cache?.length > 0 ? (
							<table className="table-auto w-full text-xl font-bold text-white">
								<thead>
									<tr className="bg-blue-500">
										<th className="px-4 py-2">
											Block Index
										</th>
										<th className="px-4 py-2">Address</th>
										<th className="px-4 py-2">Data</th>
									</tr>
								</thead>
								<tbody>
									{TomasuloSystem?.cache?.cache?.map(
										(block, index) => (
											<tr
												key={index}
												className="even:bg-blue-400 odd:bg-blue-300"
											>
												<td className="px-4 py-2">
													{index}
												</td>
												<td className="px-4 py-2">
													[{block?.address[0]},{" "}
													{block?.address[1]}]
												</td>
												<td className="px-4 py-2">
													{Array.from(
														block?.data
													).join(", ")}
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						) : (
							<p
								className="text-white text-center"
								aria-live="polite"
							>
								No cache added
							</p>
						)}
					</div>
				</div>

				{/* Instruction Queue */}
				<GenericTable
					type={GenericTableTypeEnum.InstructionQueue}
					data={TomasuloSystem ? TomasuloSystem.instructionQueue : []}
					title={"Instruction Queue"}
				></GenericTable>
			</div>
		</div>
	);
};

export default SimulatorView;
