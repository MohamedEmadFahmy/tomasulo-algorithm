enum InstructionTypeEnum {
	DADDI = "DADDI",
	DSUBI = "DSUBI",
	ADD_D = "ADD.D",
	ADD_S = "ADD.S",
	SUB_D = "SUB.D",
	SUB_S = "SUB.S",
	MUL_D = "MUL.D",
	MUL_S = "MUL.S",
	DIV_D = "DIV.D",
	DIV_S = "DIV.S",
	LW = "LW",
	LD = "LD",
	L_S = "L.S",
	L_D = "L.D",
	SW = "SW",
	SD = "SD",
	S_S = "S.S",
	S_D = "S.D",
	BNE = "BNE",
	BEQ = "BEQ",
}

type TInstruction = {
	name: InstructionTypeEnum;
	d: string;
	s: string;
	t: string;
	latency: number;
};

type TReservationStationRow = {
	tag: string;
	op: InstructionTypeEnum;
	VJ: number;
	VK: number;
	QJ: string;
	QK: string;
	busy: boolean;
	timeRemaining: number;
};

// add/sub, mul/div, addi/subi
type TReservationStation = {
	reservationStationType: string;
	stations: [TReservationStationRow];
};

type TBufferRow = {
	tag: string;
	busy: number;
	address: number;
	V?: number;
	Q?: string;
};

type TBuffer = {
	bufferType: string;
	buffers: [TBufferRow];
};

type TRegisterFile = {
	tag: string;
	Q: string;
	content: number;
};

type TCDB = {
	tag: string;
	value: number;
};

export type {
	InstructionTypeEnum,
	TInstruction,
	TReservationStationRow,
	TReservationStation,
	TBufferRow,
	TBuffer,
	TRegisterFile,
	TCDB,
};
