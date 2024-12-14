import React, { useState } from "react";

// Define types for instruction inputs
type InstructionInputType = {
	type: string;
	requiredFields: {
		name: string;
		type: "register" | "immediate" | "offset";
		registerType?: "integer" | "float";
	}[];
};

const instructionInputTypes: Record<string, InstructionInputType> = {
	// Immediate Instructions
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
	},
	// Floating Point Arithmetic
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
	},
	// Load Instructions
	LW: {
		type: "load",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "integer",
			},
			{
				name: "Base Register",
				type: "register",
				registerType: "integer",
			},
			{ name: "Offset", type: "offset" },
		],
	},
	LD: {
		type: "load",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "integer",
			},
			{
				name: "Base Register",
				type: "register",
				registerType: "integer",
			},
			{ name: "Offset", type: "offset" },
		],
	},
	"L.S": {
		type: "load",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "float",
			},
			{
				name: "Base Register",
				type: "register",
				registerType: "integer",
			},
			{ name: "Offset", type: "offset" },
		],
	},
	"L.D": {
		type: "load",
		requiredFields: [
			{
				name: "Destination Register",
				type: "register",
				registerType: "float",
			},
			{
				name: "Base Register",
				type: "register",
				registerType: "integer",
			},
			{ name: "Offset", type: "offset" },
		],
	},
	// Store Instructions
	SW: {
		type: "store",
		requiredFields: [
			{
				name: "Source Register",
				type: "register",
				registerType: "integer",
			},
			{
				name: "Base Register",
				type: "register",
				registerType: "integer",
			},
			{ name: "Offset", type: "offset" },
		],
	},
	SD: {
		type: "store",
		requiredFields: [
			{
				name: "Source Register",
				type: "register",
				registerType: "integer",
			},
			{
				name: "Base Register",
				type: "register",
				registerType: "integer",
			},
			{ name: "Offset", type: "offset" },
		],
	},
	"S.S": {
		type: "store",
		requiredFields: [
			{
				name: "Source Register",
				type: "register",
				registerType: "float",
			},
			{
				name: "Base Register",
				type: "register",
				registerType: "integer",
			},
			{ name: "Offset", type: "offset" },
		],
	},
	"S.D": {
		type: "store",
		requiredFields: [
			{
				name: "Source Register",
				type: "register",
				registerType: "float",
			},
			{
				name: "Base Register",
				type: "register",
				registerType: "integer",
			},
			{ name: "Offset", type: "offset" },
		],
	},
	// Branch Instructions
	BNE: {
		type: "branch",
		requiredFields: [
			{ name: "Register 1", type: "register", registerType: "integer" },
			{ name: "Register 2", type: "register", registerType: "integer" },
			{ name: "Branch Offset", type: "offset" },
		],
	},
	BEQ: {
		type: "branch",
		requiredFields: [
			{ name: "Register 1", type: "register", registerType: "integer" },
			{ name: "Register 2", type: "register", registerType: "integer" },
			{ name: "Branch Offset", type: "offset" },
		],
	},
};

const InstructionInputForm: React.FC = () => {
	const [selectedInstruction, setSelectedInstruction] = useState<string>("");
	const [instructionInputs, setInstructionInputs] = useState<
		Record<string, string>
	>({});

	// Generate register options
	const integerRegisters = ["R0", "R1", "R2", "R3", "R4", "R5", "R6", "R7"];
	const floatRegisters = ["F0", "F1", "F2", "F3", "F4", "F5", "F6", "F7"];

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
		// Validate inputs and add to instruction list
		if (
			selectedInstruction &&
			Object.keys(instructionInputs).length ===
				instructionInputTypes[selectedInstruction].requiredFields.length
		) {
			// Construct instruction string
			const instructionString = `${selectedInstruction} ${Object.values(
				instructionInputs
			).join(", ")}`;
			console.log("Added Instruction:", instructionString);
			// Reset form
			setSelectedInstruction("");
			setInstructionInputs({});
		} else {
			alert("Please fill in all required fields");
		}
	};

	return (
		<div className="bg-gray-100 p-6">
			<div className="mb-4">
				<label className="block text-gray-700 font-bold mb-2">
					Select Instruction
				</label>
				<select
					value={selectedInstruction}
					onChange={(e) => handleInstructionChange(e.target.value)}
					className="w-full p-2 border rounded"
				>
					<option value="">-- Select Instruction --</option>
					{Object.keys(instructionInputTypes).map((inst) => (
						<option key={inst} value={inst}>
							{inst}
						</option>
					))}
				</select>
			</div>

			{selectedInstruction && (
				<div className="bg-white p-4 rounded shadow">
					<h2 className="text-xl font-bold mb-4">
						{selectedInstruction} Instruction
					</h2>

					{instructionInputTypes[
						selectedInstruction
					].requiredFields.map((field) => (
						<div key={field.name} className="mb-4">
							<label className="block text-gray-700 font-semibold mb-2">
								{field.name}
							</label>
							{field.type === "register" ? (
								<select
									value={instructionInputs[field.name] || ""}
									onChange={(e) =>
										handleInputChange(
											field.name,
											e.target.value
										)
									}
									className="w-full p-2 border rounded"
								>
									<option value="">
										-- Select {field.name} --
									</option>
									{field.registerType === "float"
										? floatRegisters.map((reg) => (
												<option key={reg} value={reg}>
													{reg}
												</option>
										  ))
										: integerRegisters.map((reg) => (
												<option key={reg} value={reg}>
													{reg}
												</option>
										  ))}
								</select>
							) : field.type === "immediate" ? (
								<input
									type="number"
									value={instructionInputs[field.name] || ""}
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
									value={instructionInputs[field.name] || ""}
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
						className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
					>
						Add Instruction
					</button>
				</div>
			)}
		</div>
	);
};

export default InstructionInputForm;
