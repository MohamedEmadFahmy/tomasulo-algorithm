/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { TInstruction } from "../backend/types";

interface InputFormProps {
	setIsStarted: (isStarted: boolean) => void;
	instructionMemory: TInstruction[];
	setInstructionMemory: React.Dispatch<React.SetStateAction<TInstruction[]>>;
}

// const [instructions, setInstructions] = useState<string>("");

// // Fix: Added useState for instructionOperands
// const [instructionOperands, setInstructionOperands] = useState<{
// 	destReg?: string;
// 	srcReg1?: string;
// 	srcReg2?: string;
// 	addressReg?: string;
// 	offset?: number;
// 	branchReg1?: string;
// 	branchReg2?: string;
// }>({});

// const handleAddInstruction = () => {
// 	if (instructions.trim() !== "") {
// 		setInstructionList((prev) => [...prev, instructions]);
// 		setInstructions("");
// 		setInstructionOperands({}); // Reset operands when new instruction is added
// 	}
// };

const InputForm: React.FC<InputFormProps> = ({
	setIsStarted,
	instructionMemory,
	setInstructionMemory,
}) => {
	const [reservationStationSizes, setReservationStationSizes] = useState<
		Record<string, number>
	>({
		"Integer Add/Sub": 1,
		"Floating Point Add/Sub": 2,
		"Floating Point MUL/DIV": 3,
		LOAD: 4,
		STORE: 5,
		BRANCH: 6,
	});
	const handleSizeChange = (stationType: string, newValue: number) => {
		setReservationStationSizes((prev) => ({
			...prev,
			[stationType]: newValue,
		}));
	};

	const [instructionLatencies, setInstructionLatencies] = useState<
		Record<string, number>
	>({
		"Integer ADD/SUB": 2,
		"FP ADD/SUB": 2,
		"FP MUL": 10,
		"FP DIV": 20,
		LOAD: 2,
		STORE: 2,
		BRANCH: 1,
	});

	const handleLatencyChange = (instructionType: string, newValue: number) => {
		setInstructionLatencies((prev) => ({
			...prev,
			[instructionType]: newValue,
		}));
	};

	const [instructionList, setInstructionList] = useState<string[]>([
		"moski",
		"moski2",
	]);

	const handleSubmit = () => {
		setIsStarted(true);
	};

	const instructionData = {
		DADDI: {
			name: "DADDI",
		},
		DSUBI: {
			name: "DSUBI",
		},
		ADD_D: {
			name: "ADD.D",
		},
		ADD_S: {
			name: "ADD.S",
		},
		SUB_D: {
			name: "SUB.D",
		},
		SUB_S: {
			name: "SUB.S",
		},
		MUL_D: {
			name: "MUL.D",
		},
		MUL_S: {
			name: "MUL.S",
		},
		DIV_D: {
			name: "DIV.D",
		},
		DIV_S: {
			name: "DIV.S",
		},
		LW: {
			name: "LW",
		},
		LD: {
			name: "LD",
		},
		L_S: {
			name: "L.S",
		},
		L_D: {
			name: "L.D",
		},
		SW: {
			name: "SW",
		},
		SD: {
			name: "SD",
		},
		S_S: {
			name: "S.S",
		},
		S_D: {
			name: "S.D",
		},
		BNE: {
			name: "BNE",
		},
		BEQ: {
			name: "BEQ",
		},
	};

	return (
		<div className="bg-black w-full h-screen flex flex-col items-center ">
			<div className="p-2">
				<h1 className="text-white text-4xl font-bold">
					Tomasulo Algorithm Simulator
				</h1>
			</div>
			<div className="flex-1 bg-orange-300 w-full flex flex-col justify-center items-center p-4 gap-4">
				<div id="containers" className="w-full flex flex-1 gap-4">
					{/* Left Container: Input Instructions */}
					<div className="flex-[2] flex flex-col gap-4 bg-red-300 p-4">
						<h2 className="text-5xl text-center text-white font-bold">
							Add Instructions
						</h2>

						{/*

						<div className="flex flex-col gap-4">
							<label className="text-white font-semibold">
								Select Instruction
							</label>
							<select
								className="w-full p-2 border border-gray-300 rounded-md"
								value={instructions}
								onChange={(e) => {
									setInstructions(e.target.value);
									handleAddInstruction();
								}}
							>
								<option value="">
									-- Select an Instruction --
								</option>
								{[
									"DADDI",
									"DSUBI",
									"ADD.D",
									"ADD.S",
									"SUB.D",
									"SUB.S",
									"MUL.D",
									"MUL.S",
									"DIV.D",
									"DIV.S",
									"LW",
									"LD",
									"L.S",
									"L.D",
									"SW",
									"SD",
									"S.S",
									"S.D",
									"BNE",
									"BEQ",
								].map((instruction) => (
									<option
										key={instruction}
										value={instruction}
									>
										{instruction}
									</option>
								))}
							</select>

							{instructions && (
								<div className="flex flex-col gap-4">
									<h3 className="text-white font-semibold">
										Operands
									</h3>

									<div>
										<label className="text-white block mb-1">
											Destination Register
										</label>
										<select
											className="w-full p-2 border border-gray-300 rounded-md"
											value={
												instructionOperands.destReg ||
												""
											}
											onChange={(e) =>
												setInstructionOperands(
													(prev) => ({
														...prev,
														destReg: e.target.value,
													})
												)
											}
										>
											<option value="">
												-- Select Destination Register
												--
											</option>
											{["R1", "R2", "R3", "R4"].map(
												(reg) => (
													<option
														key={reg}
														value={reg}
													>
														{reg}
													</option>
												)
											)}
										</select>
									</div>

									<div>
										<label className="text-white block mb-1">
											Source Register 1
										</label>
										<select
											className="w-full p-2 border border-gray-300 rounded-md"
											value={
												instructionOperands.srcReg1 ||
												""
											}
											onChange={(e) =>
												setInstructionOperands(
													(prev) => ({
														...prev,
														srcReg1: e.target.value,
													})
												)
											}
										>
											<option value="">
												-- Select Source Register 1 --
											</option>
											{["R1", "R2", "R3", "R4"].map(
												(reg) => (
													<option
														key={reg}
														value={reg}
													>
														{reg}
													</option>
												)
											)}
										</select>
									</div>

									<div>
										<label className="text-white block mb-1">
											Source Register 2
										</label>
										<select
											className="w-full p-2 border border-gray-300 rounded-md"
											value={
												instructionOperands.srcReg2 ||
												""
											}
											onChange={(e) =>
												setInstructionOperands(
													(prev) => ({
														...prev,
														srcReg2: e.target.value,
													})
												)
											}
										>
											<option value="">
												-- Select Source Register 2 --
											</option>
											{["R1", "R2", "R3", "R4"].map(
												(reg) => (
													<option
														key={reg}
														value={reg}
													>
														{reg}
													</option>
												)
											)}
										</select>
									</div>
								</div>
							)}
						</div> */}
					</div>

					{/* Middle Container: Display Instructions */}
					<div className="flex-[3] bg-blue-300 p-4 flex flex-col gap-5">
						<h2 className="text-center text-5xl text-white font-bold">
							Instruction Queue
						</h2>
						<ol className="list-decimal list-inside mt-4 overflow-y-auto max-h-96 text-xl font-bold">
							{instructionList.length > 0 ? (
								instructionList.map((inst, index) => (
									<li key={index} className="text-white">
										{inst}
									</li>
								))
							) : (
								<p className="text-white">
									No instructions added
								</p>
							)}
						</ol>
					</div>

					{/* Right Container: Edit Latencies and Reservation Station Sizes */}
					<div className="flex-[3] flex flex-col bg-gray-500 gap-10 p-4">
						<h2 className="text-5xl text-center text-white font-bold">
							Settings
						</h2>

						{/* Reservation Station Sizes */}
						<div className="">
							<h3 className="text-white font-bold mb-2">
								Reservation Station Sizes
							</h3>
							<div className="grid grid-cols-3 gap-2">
								{Object.entries(reservationStationSizes).map(
									([stationType, size]) => (
										<div key={stationType}>
											<label className="text-white block mb-1">
												{stationType} Size
											</label>
											<input
												type="number"
												className="w-full p-2 border border-gray-300 rounded-md"
												value={size}
												onChange={(e) =>
													handleSizeChange(
														stationType,
														Number(e.target.value)
													)
												}
											/>
										</div>
									)
								)}
							</div>
						</div>

						{/* Instruction Latencies */}

						<div className="">
							<h3 className="text-white font-bold mb-2">
								Instruction Latencies
							</h3>
							<div className="grid grid-cols-3 gap-6">
								{Object.entries(instructionLatencies).map(
									([instType, latency]) => (
										<div key={instType} className="mb-2">
											<label className="text-white block mb-1">
												{instType} Latency
											</label>
											<input
												type="number"
												className="w-full p-2 border border-gray-300 rounded-md"
												value={latency}
												onChange={(e) =>
													handleLatencyChange(
														instType,
														Number(e.target.value)
													)
												}
											/>
										</div>
									)
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Submit Button */}
				<button
					className="bg-red-500 text-white p-2 rounded-md mt-4"
					onClick={handleSubmit}
				>
					Start Simulation
				</button>
			</div>
		</div>
	);
};

export default InputForm;
