import React, { useState } from "react";
import { TInstruction } from "../backend/types";
import { InstructionTypeEnum } from "../backend/types"; // Assuming this exists
import { Config } from "../App";

interface InputFormProps {
	config: Config;
	setConfig: React.Dispatch<React.SetStateAction<Config>>; // Correct the type of setConfig
	setIsStarted: (isStarted: boolean) => void;
	instructionMemory: TInstruction[];
	setInstructionMemory: React.Dispatch<React.SetStateAction<TInstruction[]>>;
}

// Define types for instruction inputs
type InstructionInputType = {
	type: string;
	requiredFields: {
		name: string;
		type: "register" | "immediate" | "offset";
		registerType?: "integer" | "float";
	}[];
	latencyType: string;
};

const instructionInputTypes: Record<string, InstructionInputType> = {
	DADDI: {
		type: "immediate",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "integer",
			},
			{
				name: "Source Register",
				type: "register",
				registerType: "integer",
			},
			{ name: "Immediate Value", type: "immediate" },
		],
		latencyType: "Integer ADD",
	},
	DSUBI: {
		type: "immediate",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "integer",
			},
			{
				name: "Source Register",
				type: "register",
				registerType: "integer",
			},
			{ name: "Immediate Value", type: "immediate" },
		],
		latencyType: "Integer SUB",
	},
	"ADD.D": {
		type: "arithmetic",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 1",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 2",
				type: "register",
				registerType: "float",
			},
		],
		latencyType: "FP ADD",
	},
	"ADD.S": {
		type: "arithmetic",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 1",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 2",
				type: "register",
				registerType: "float",
			},
		],
		latencyType: "FP ADD",
	},
	"SUB.D": {
		type: "arithmetic",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 1",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 2",
				type: "register",
				registerType: "float",
			},
		],
		latencyType: "FP SUB",
	},
	"SUB.S": {
		type: "arithmetic",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 1",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 2",
				type: "register",
				registerType: "float",
			},
		],
		latencyType: "FP SUB",
	},
	"MUL.D": {
		type: "arithmetic",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 1",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 2",
				type: "register",
				registerType: "float",
			},
		],
		latencyType: "FP MUL",
	},
	"MUL.S": {
		type: "arithmetic",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 1",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 2",
				type: "register",
				registerType: "float",
			},
		],
		latencyType: "FP MUL",
	},
	"DIV.D": {
		type: "arithmetic",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 1",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 2",
				type: "register",
				registerType: "float",
			},
		],
		latencyType: "FP DIV",
	},
	"DIV.S": {
		type: "arithmetic",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 1",
				type: "register",
				registerType: "float",
			},
			{
				name: "Source Register 2",
				type: "register",
				registerType: "float",
			},
		],
		latencyType: "FP DIV",
	},
	LW: {
		type: "memory",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "integer",
			},
			{ name: "Memory Address", type: "immediate" },
		],
		latencyType: "LOAD",
	},
	LD: {
		type: "memory",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "float",
			},
			{ name: "Memory Address", type: "immediate" },
		],
		latencyType: "LOAD",
	},
	SW: {
		type: "memory",
		requiredFields: [
			{
				name: "Source Register",
				type: "register",
				registerType: "integer",
			},
			{ name: "Memory Address", type: "immediate" },
		],
		latencyType: "STORE",
	},
	SD: {
		type: "memory",
		requiredFields: [
			{
				name: "Source Register",
				type: "register",
				registerType: "float",
			},
			{ name: "Memory Address", type: "immediate" },
		],
		latencyType: "STORE",
	},
	BNE: {
		type: "branch",
		requiredFields: [
			{ name: "Register 1", type: "register", registerType: "integer" },
			{ name: "Register 2", type: "register", registerType: "integer" },
			{ name: "Address To Branch To", type: "immediate" },
		],
		latencyType: "BRANCH",
	},
	BEQ: {
		type: "branch",
		requiredFields: [
			{ name: "Register 1", type: "register", registerType: "integer" },
			{ name: "Register 2", type: "register", registerType: "integer" },
			{ name: "Address To Branch To", type: "immediate" },
		],
		latencyType: "BRANCH",
	},
};

const InputForm: React.FC<InputFormProps> = ({
	config,
	setConfig,
	setIsStarted,
	instructionMemory,
	setInstructionMemory,
}) => {
	const [instructionLatencies, setInstructionLatencies] = useState<
		Record<string, number>
	>({
		"Integer ADD": 1,
		"Integer SUB": 1,
		"FP ADD": 3,
		"FP SUB": 3,
		"FP MUL": 6,
		"FP DIV": 12,
		LOAD: 3,
		STORE: 3,
		// Branch latency will be undefined
	});

	// State for dynamic instruction input
	const [selectedInstruction, setSelectedInstruction] = useState<string>("");
	const [instructionInputs, setInstructionInputs] = useState<
		Record<string, string>
	>({});

	// Generate register options - now with 32 registers
	const integerRegisters = Array.from({ length: 32 }, (_, i) => `R${i}`);
	const floatRegisters = Array.from({ length: 32 }, (_, i) => `F${i}`);

	const handleSizeChange = (stationType: string, newValue: number) => {
		setConfig((prev) => ({
			...prev,
			reservation_stations_sizes: {
				...prev.reservation_stations_sizes,
				[stationType]: Math.max(1, newValue), // Ensure minimum size of 1
			},
		}));
	};

	const handleLatencyChange = (instructionType: string, newValue: number) => {
		setInstructionLatencies((prev) => ({
			...prev,
			[instructionType]: Math.max(1, newValue), // Ensure minimum latency of 1
		}));
	};

	const handleInstructionChange = (instruction: string) => {
		setSelectedInstruction(instruction);
		// Reset inputs when instruction changes
		setInstructionInputs({});
	};

	const handleInputChange = (field: string, value: string) => {
		setInstructionInputs((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleAddInstruction = () => {
		// Validate inputs and add to instruction memory
		if (
			selectedInstruction &&
			Object.keys(instructionInputs).length ===
				instructionInputTypes[selectedInstruction].requiredFields.length
		) {
			// Get input values in order
			const inputValues = instructionInputTypes[
				selectedInstruction
			].requiredFields.map((field) => instructionInputs[field.name]);

			// Construct instruction object based on number of inputs
			const newInstruction: TInstruction = {
				name: selectedInstruction as InstructionTypeEnum,
				d: inputValues[0] || "",
				s: inputValues[1] || "",
				t: inputValues[2] || "",
				latency:
					instructionLatencies[
						instructionInputTypes[selectedInstruction].latencyType
					],
			};

			// Update instruction memory

			setInstructionMemory((prev) => [...prev, newInstruction]);

			// Reset form
			setSelectedInstruction("");
			setInstructionInputs({});
		} else {
			alert("Please fill in all required fields");
		}
	};

	const handleSubmit = () => {
		if (instructionMemory.length > 0) {
			setIsStarted(true);
			// console.log("Starting Simulation with config: ", config);
		} else {
			alert(
				"Please add at least one instruction before starting the simulation"
			);
		}
	};

	return (
		<div className="bg-black w-full h-screen flex flex-col items-center ">
			<div className="p-2">
				<h1 className="text-white text-4xl font-bold">
					Tomasulo Algorithm Simulator
				</h1>
			</div>
			<div className="flex-1 bg-orange-300 w-full flex flex-col justify-center items-center p-4 gap-2">
				<div id="containers" className="w-full flex flex-1 gap-4">
					{/* Left Container: Input Instructions */}
					<div className="flex-[2] flex flex-col gap-4 bg-red-300 p-4 rounded-md">
						<h2 className="text-5xl text-center text-white font-bold">
							Add Instructions
						</h2>

						{/* Dynamic Instruction Input */}
						<div className="bg-white p-4 rounded shadow">
							<div className="mb-4">
								<label className="block text-gray-700 font-bold mb-2">
									Select Instruction
								</label>
								<select
									value={selectedInstruction}
									onChange={(e) =>
										handleInstructionChange(e.target.value)
									}
									className="w-full p-2 border rounded"
								>
									<option value="">
										-- Select Instruction --
									</option>
									{Object.keys(instructionInputTypes).map(
										(inst) => (
											<option key={inst} value={inst}>
												{inst}
											</option>
										)
									)}
								</select>
							</div>

							{selectedInstruction && (
								<div>
									{instructionInputTypes[
										selectedInstruction
									].requiredFields.map((field) => (
										<div key={field.name} className="mb-4">
											<label className="block text-gray-700 font-semibold mb-2">
												{field.name}
											</label>
											{field.type === "register" ? (
												<select
													value={
														instructionInputs[
															field.name
														] || ""
													}
													onChange={(e) =>
														handleInputChange(
															field.name,
															e.target.value
														)
													}
													className="w-full p-2 border rounded"
												>
													<option value="">
														-- Select {field.name}{" "}
														--
													</option>
													{field.registerType ===
													"float"
														? floatRegisters.map(
																(reg) => (
																	<option
																		key={
																			reg
																		}
																		value={
																			reg
																		}
																	>
																		{reg}
																	</option>
																)
														  )
														: integerRegisters.map(
																(reg) => (
																	<option
																		key={
																			reg
																		}
																		value={
																			reg
																		}
																	>
																		{reg}
																	</option>
																)
														  )}
												</select>
											) : field.type === "immediate" ? (
												<input
													type="number"
													value={
														instructionInputs[
															field.name
														] || ""
													}
													onChange={(e) =>
														handleInputChange(
															field.name,
															e.target.value
														)
													}
													className="w-full p-2 border rounded"
													placeholder={`Enter ${field.name}`}
												/>
											) : field.type === "offset" ? (
												<input
													type="number"
													value={
														instructionInputs[
															field.name
														] || ""
													}
													onChange={(e) =>
														handleInputChange(
															field.name,
															e.target.value
														)
													}
													className="w-full p-2 border rounded"
													placeholder="Enter Offset"
												/>
											) : null}
										</div>
									))}

									<button
										onClick={handleAddInstruction}
										className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-full"
									>
										Add Instruction
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Middle Container: Display Instructions */}
					<div className="flex-[3] bg-blue-300 flex flex-col gap-5 p-4 rounded-md">
						<h2 className="text-center text-5xl text-white font-bold">
							Program
						</h2>
						<ol className="list-decimal list-inside mt-4 overflow-y-auto max-h-[70vh] text-xl font-bold">
							{instructionMemory.length > 0 ? (
								instructionMemory.map((inst, index) => (
									<li key={index} className="text-white">
										{inst.t
											? `${inst.name} ${inst.d}, ${inst.s}, ${inst.t} ` // (Latency: ${inst.latency})
											: `${inst.name} ${inst.d}, ${inst.s} `}
										{/* // (Latency: ${inst.latency})}  */}
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
					<div className="flex-[3] flex flex-col bg-gray-500 gap-3 p-4 rounded-md">
						<h2 className="text-5xl text-center text-white font-bold">
							Settings
						</h2>

						{/* Reservation Station Sizes */}
						<div className="">
							<h3 className="text-2xl text-white font-bold mb-2">
								Reservation Station Sizes
							</h3>
							<div className="grid grid-cols-3 gap-2">
								{Object.entries(
									config.reservation_stations_sizes
								).map(([stationType, size]) => (
									<div
										key={stationType}
										className="flex flex-col"
									>
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
											min="1"
										/>
									</div>
								))}
							</div>
						</div>

						{/* Instruction Latencies */}
						<div className="">
							<h3 className="text-2xl text-white font-bold mb-2">
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
												min="1"
											/>
										</div>
									)
								)}
							</div>
						</div>

						{/* Cache Configuration */}
						<div className="">
							<h3 className="text-2xl text-white font-bold mb-2">
								Cache Configuration
							</h3>
							<div className="grid grid-cols-2 gap-6">
								<div className="mb-2">
									<label className="text-white block mb-1">
										Cache Size (Blocks)
									</label>
									<input
										type="number"
										className="w-full p-2 border border-gray-300 rounded-md"
										value={config.cache_size}
										onChange={(e) =>
											setConfig((prev) => ({
												...prev,
												cache_size: Math.max(
													1,
													Number(e.target.value)
												),
											}))
										}
										min="1"
									/>
								</div>
								<div className="mb-2">
									<label className="text-white block mb-1">
										Block Size (Bytes)
									</label>
									<input
										type="number"
										className="w-full p-2 border border-gray-300 rounded-md"
										value={config.block_size}
										onChange={(e) =>
											setConfig((prev) => ({
												...prev,
												block_size: Math.max(
													1,
													Number(e.target.value)
												),
											}))
										}
										min="1"
									/>
								</div>
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
