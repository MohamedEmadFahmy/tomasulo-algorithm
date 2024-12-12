export enum InstructionTypeEnum {
  NONE = "NONE",
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

export type Memory = {
  memory: Int8Array;
};

export type TInstruction = {
  type: InstructionTypeEnum;
  d: string;
  s: string;
  t: string;
  latency: number;
};

export type TReservationStationRow = {
  tag: string;
  op: InstructionTypeEnum;
  VJ: number;
  VK: number;
  QJ: string;
  QK: string;
  busy: number;
  cyclesRemaining: number;
};

// add/sub, mul/div, addi/subi
export type TReservationStation = {
  reservationStationType: string;
  stations: [TReservationStationRow];
};

export type TBufferRow = {
  op: InstructionTypeEnum;
  tag: string;
  busy: number;
  address: number;
  V?: number;
  Q?: string;
};

export type TBuffer = {
  bufferType: string;
  buffers: [TBufferRow];
};

export type TRegisterFile = {
  tag: string;
  Q: string;
  content: number;
};

export type TCDB = {
  tag: string;
  value: number;
};
