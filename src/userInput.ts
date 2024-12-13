import { InstructionTypeEnum } from "./backend/types";

export const userInput = {
	noOfAddSubRS: 3,
	noOfMulDivRS: 3,
	noOfLoadBuffers: 3,
	noOfStoreBuffers: 3,
	noOfIntegerAddSubRS: 3,
	cacheSize: 16,
	cacheBlockSize: 4,
	programInstructions: [
		{
			type: InstructionTypeEnum.DADDI,
			d: "R1",
			s: "R2",
			t: "10",
			latency: 2,
		},
		// { type: InstructionTypeEnum.DSUBI, d: "R2", s: "R1", t: "10", latency: 2 },
		// { type: InstructionTypeEnum.ADD_D, d: "F1", s: "F2", t: "F3", latency: 2 },
		// { type: InstructionTypeEnum.ADD_S, d: "F1", s: "F2", t: "F3", latency: 2 },
		// { type: InstructionTypeEnum.SUB_D, d: "F1", s: "F2", t: "F3", latency: 2 },
		// { type: InstructionTypeEnum.SUB_S, d: "F1", s: "F2", t: "F3", latency: 2 },
		// { type: InstructionTypeEnum.MUL_D, d: "F1", s: "F2", t: "F3", latency: 2 },
		// { type: InstructionTypeEnum.MUL_S, d: "F1", s: "F2", t: "F3", latency: 2 },
		// { type: InstructionTypeEnum.DIV_D, d: "F1", s: "F2", t: "F3", latency: 2 },
		// { type: InstructionTypeEnum.DIV_S, d: "F1", s: "F2", t: "F3", latency: 2 },
		// { type: InstructionTypeEnum.LW, d: "R1", s: "R2", t: "10", latency: 2 },
		// { type: InstructionTypeEnum.LD, d: "R1", s: "R2", t: "10", latency: 2 },
		// { type: InstructionTypeEnum.L_D, d: "F1", s: "F2", t: "10", latency: 2 },
		// { type: InstructionTypeEnum.L_S, d: "F1", s: "F2", t: "10", latency: 2 },
		// { type: InstructionTypeEnum.SW, d: "R1", s: "R2", t: "10", latency: 2 },
	],
};