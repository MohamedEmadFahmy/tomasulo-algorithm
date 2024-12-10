/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";

interface InputFormProps {
	setIsStarted: (isStarted: boolean) => void;
}

const InputForm: React.FC<InputFormProps> = ({ setIsStarted }) => {
	const [instructions, setInstructions] = useState<string>("");
	const [instructionList, setInstructionList] = useState<string[]>([]);
	const [reservationStationSizes, setReservationStationSizes] = useState<
		Record<string, number>
	>({
		ALU: 5,
		LOAD: 5,
		STORE: 5,
		BRANCH: 5,
		MULTIPLY: 5,
	});
	const [instructionLatencies, setInstructionLatencies] = useState<
		Record<string, number>
	>({
		ADD: 2,
		SUB: 2,
		MUL: 10,
		DIV: 20,
		LOAD: 2,
		STORE: 2,
		BRANCH: 1,
	});

	const handleAddInstruction = () => {
		if (instructions.trim() !== "") {
			setInstructionList((prev) => [...prev, instructions]);
			setInstructions("");
		}
	};

	const handleLatencyChange = (instructionType: string, newValue: number) => {
		setInstructionLatencies((prev) => ({
			...prev,
			[instructionType]: newValue,
		}));
	};

	const handleSizeChange = (stationType: string, newValue: number) => {
		setReservationStationSizes((prev) => ({
			...prev,
			[stationType]: newValue,
		}));
	};

	const handleSubmit = () => {
		setIsStarted(true);
	};

	return (
		<div className="bg-black flex flex-col items-center p-4">
			<h1 className="text-white text-4xl font-bold">
				Tomasulo Algorithm Simulator
			</h1>

			<div className="flex-1 bg-orange-300 w-full flex flex-col justify-center items-center p-4 gap-4">
				<div id="containers" className="w-full flex flex-1 gap-4">
					{/* Left Container: Input Instructions */}
					<div className="flex-[1] flex flex-col gap-4 bg-red-300 p-4">
						<h2 className="text-center text-white font-bold">
							Add Instructions
						</h2>

						{/* Instruction Form */}
						<div className="flex flex-col gap-4">
							{/* Select Instruction Name */}
							<label className="text-white font-semibold">
								Select Instruction
							</label>
							<select
								className="w-full p-2 border border-gray-300 rounded-md"
								value={instructions}
								onChange={(e) =>
									setInstructions(e.target.value)
								}
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

							{/* Operands Section */}
							{instructions && (
								<div className="flex flex-col gap-4">
									<h3 className="text-white font-semibold">
										Operands
									</h3>

									{/* Check if the instruction is an arithmetic/logic instruction */}
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
									].includes(instructions) && (
										<>
											{/* Destination Register */}
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
																destReg:
																	e.target
																		.value,
															})
														)
													}
												>
													<option value="">
														-- Select Destination
														Register --
													</option>
													{[
														"R1",
														"R2",
														"R3",
														"R4",
														"F1",
														"F2",
														"F3",
														"F4",
													].map((reg) => (
														<option
															key={reg}
															value={reg}
														>
															{reg}
														</option>
													))}
												</select>
											</div>

											{/* Source Registers */}
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
																srcReg1:
																	e.target
																		.value,
															})
														)
													}
												>
													<option value="">
														-- Select Source
														Register 1 --
													</option>
													{[
														"R1",
														"R2",
														"R3",
														"R4",
														"F1",
														"F2",
														"F3",
														"F4",
													].map((reg) => (
														<option
															key={reg}
															value={reg}
														>
															{reg}
														</option>
													))}
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
																srcReg2:
																	e.target
																		.value,
															})
														)
													}
												>
													<option value="">
														-- Select Source
														Register 2 --
													</option>
													{[
														"R1",
														"R2",
														"R3",
														"R4",
														"F1",
														"F2",
														"F3",
														"F4",
													].map((reg) => (
														<option
															key={reg}
															value={reg}
														>
															{reg}
														</option>
													))}
												</select>
											</div>
										</>
									)}

									{/* Check if the instruction is a load/store instruction */}
									{[
										"LW",
										"LD",
										"L.S",
										"L.D",
										"SW",
										"SD",
										"S.S",
										"S.D",
									].includes(instructions) && (
										<>
											{/* Address Register */}
											<div>
												<label className="text-white block mb-1">
													Base Address Register
												</label>
												<select
													className="w-full p-2 border border-gray-300 rounded-md"
													value={
														instructionOperands.addressReg ||
														""
													}
													onChange={(e) =>
														setInstructionOperands(
															(prev) => ({
																...prev,
																addressReg:
																	e.target
																		.value,
															})
														)
													}
												>
													<option value="">
														-- Select Address
														Register --
													</option>
													{[
														"R1",
														"R2",
														"R3",
														"R4",
													].map((reg) => (
														<option
															key={reg}
															value={reg}
														>
															{reg}
														</option>
													))}
												</select>
											</div>

											{/* Offset */}
											<div>
												<label className="text-white block mb-1">
													Offset
												</label>
												<input
													type="number"
													className="w-full p-2 border border-gray-300 rounded-md"
													value={
														instructionOperands.offset ||
														""
													}
													onChange={(e) =>
														setInstructionOperands(
															(prev) => ({
																...prev,
																offset: Number(
																	e.target
																		.value
																),
															})
														)
													}
												/>
											</div>
										</>
									)}

									{/* Check if the instruction is a branch instruction */}
									{["BNE", "BEQ"].includes(instructions) && (
										<>
											{/* Branch Registers */}
											<div>
												<label className="text-white block mb-1">
													Register 1
												</label>
												<select
													className="w-full p-2 border border-gray-300 rounded-md"
													value={
														instructionOperands.branchReg1 ||
														""
													}
													onChange={(e) =>
														setInstructionOperands(
															(prev) => ({
																...prev,
																branchReg1:
																	e.target
																		.value,
															})
														)
													}
												>
													<option value="">
														-- Select Register --
													</option>
													{[
														"R1",
														"R2",
														"R3",
														"R4",
													].map((reg) => (
														<option
															key={reg}
															value={reg}
														>
															{reg}
														</option>
													))}
												</select>
											</div>

											<div>
												<label className="text-white block mb-1">
													Register 2
												</label>
												<select
													className="w-full p-2 border border-gray-300 rounded-md"
													value={
														instructionOperands.branchReg2 ||
														""
													}
													onChange={(e) =>
														setInstructionOperands(
															(prev) => ({
																...prev,
																branchReg2:
																	e.target
																		.value,
															})
														)
													}
												>
													<option value="">
														-- Select Register --
													</option>
													{[
														"R1",
														"R2",
														"R3",
														"R4",
													].map((reg) => (
														<option
															key={reg}
															value={reg}
														>
															{reg}
														</option>
													))}
												</select>
											</div>
										</>
									)}
								</div>
							)}
						</div>

						<button
							onClick={handleAddInstruction}
							className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
						>
							Add Instruction
						</button>
					</div>

					{/* Middle Container: Display Instructions */}
					<div className="flex-[2] flex-2 bg-blue-300 p-4">
						<h2 className="text-center text-white font-bold">
							Instruction Queue
						</h2>
						<ol className="list-decimal list-inside mt-4 overflow-y-auto max-h-96">
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
					<div className="flex-[1] flex flex-col bg-lime-300 gap-0 p-4">
						<h2 className="text-center text-white font-bold flex-1">
							Settings
						</h2>

						{/* Reservation Station Sizes */}
						<div className="flex-[5]">
							<h3 className="text-white font-bold mb-2">
								Reservation Station Sizes
							</h3>
							{Object.entries(reservationStationSizes).map(
								([stationType, size]) => (
									<div key={stationType} className="mb-2">
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

						{/* Instruction Latencies */}
						<div className="flex-[5]">
							<h3 className="text-white font-bold mb-2">
								Instruction Latencies
							</h3>
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

				{/* Submit Button */}
				<button
					onClick={handleSubmit}
					className="bg-red-500 px-4 py-2 text-white font-bold rounded-md"
				>
					Start Simulation
				</button>
			</div>
		</div>
	);
};

export default InputForm;
