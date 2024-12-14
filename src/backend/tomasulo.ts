// /* eslint-disable @typescript-eslint/no-unused-vars */
import { Config } from "../App";
import {
  MainMemory,
  DataCache,
  InstructionMemory,
  loadWordCache,
  loadDoubleCache,
  storeWordCache,
  storeDoubleCache,
  checkForCacheMiss,
  cacheMissPenalty,
  cacheHitLatency,
  setMemory,
  initMemory,
  initCache,
} from "./memory";
import {
  TInstruction,
  TReservationStationRow,
  TReservationStation,
  TBuffer,
  TRegisterFile,
  InstructionTypeEnum,
  TCDB,
  TBufferRow,
  ReservationStationTypeEnum,
  Memory,
  SystemCache,
} from "./types";
let userInput = {
  noOfAddSubRS: 10,
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
export let poppedIntstruction: TInstruction | undefined = undefined;

let bus: TCDB = {
  tag: "",
  value: 0,
};

let ReservationStation1: TReservationStation = {
  reservationStationType: ReservationStationTypeEnum.ADD_SUB,
  stations: Array.from({ length: userInput.noOfAddSubRS }, (_, i) => ({
    tag: `A${i + 1}`,
    op: InstructionTypeEnum.NONE,
    VJ: 0,
    VK: 0,
    QJ: "0",
    QK: "0",
    busy: 0,
    cyclesRemaining: 0,
    res: Number.MIN_VALUE,
  })),
};

let ReservationStation2: TReservationStation = {
  reservationStationType: ReservationStationTypeEnum.MUL_DIV,
  stations: Array.from({ length: userInput.noOfMulDivRS }, (_, i) => ({
    tag: `M${i + 1}`,
    op: InstructionTypeEnum.NONE,
    VJ: 0,
    VK: 0,
    QJ: "0",
    QK: "0",
    busy: 0,
    cyclesRemaining: 0,
    res: Number.MIN_VALUE,
  })),
};

let ReservationStationInteger: TReservationStation = {
  reservationStationType: ReservationStationTypeEnum.INTEGER,
  stations: Array.from({ length: userInput.noOfIntegerAddSubRS }, (_, i) => ({
    tag: `AI${i + 1}`,
    op: InstructionTypeEnum.NONE,
    VJ: 0,
    VK: 0,
    QJ: "0",
    QK: "0",
    busy: 0,
    res: Number.MIN_VALUE,
    cyclesRemaining: 0,
  })),
};

let LoadBuffer: TBuffer = {
  bufferType: ReservationStationTypeEnum.LOAD,
  buffers: Array.from({ length: userInput.noOfLoadBuffers }, (_, i) => ({
    op: InstructionTypeEnum.NONE,
    tag: `LD${i + 1}`,
    busy: 0,
    address: 0,
    cyclesRemaining: 0,
    res: Number.MIN_VALUE,
  })),
};

let StoreBuffer: TBuffer = {
  bufferType: ReservationStationTypeEnum.STORE,
  buffers: Array.from({ length: userInput.noOfStoreBuffers }, (_, i) => ({
    op: InstructionTypeEnum.NONE,
    tag: `STR${i + 1}`,
    busy: 0,
    address: 0,
    V: 0,
    Q: "0",
    cyclesRemaining: 0,
  })),
};

let registerFile: TRegisterFile[] = [
  { tag: "R0", Q: "0", content: 0 },
  { tag: "R1", Q: "0", content: 0 },
  { tag: "R2", Q: "0", content: 0 },
  { tag: "R3", Q: "0", content: 0 },
  { tag: "R4", Q: "0", content: 0 },
  { tag: "R5", Q: "0", content: 0 },
  { tag: "R6", Q: "0", content: 0 },
  { tag: "R7", Q: "0", content: 0 },
  { tag: "R8", Q: "0", content: 0 },
  { tag: "R9", Q: "0", content: 0 },
  { tag: "R10", Q: "0", content: 0 },
  { tag: "R11", Q: "0", content: 0 },
  { tag: "R12", Q: "0", content: 0 },
  { tag: "R13", Q: "0", content: 0 },
  { tag: "R14", Q: "0", content: 0 },
  { tag: "R15", Q: "0", content: 0 },
  { tag: "R16", Q: "0", content: 0 },
  { tag: "R17", Q: "0", content: 0 },
  { tag: "R18", Q: "0", content: 0 },
  { tag: "R19", Q: "0", content: 0 },
  { tag: "R20", Q: "0", content: 0 },
  { tag: "R21", Q: "0", content: 0 },
  { tag: "R22", Q: "0", content: 0 },
  { tag: "R23", Q: "0", content: 0 },
  { tag: "R24", Q: "0", content: 0 },
  { tag: "R25", Q: "0", content: 0 },
  { tag: "R26", Q: "0", content: 0 },
  { tag: "R27", Q: "0", content: 0 },
  { tag: "R28", Q: "0", content: 0 },
  { tag: "R29", Q: "0", content: 0 },
  { tag: "R30", Q: "0", content: 0 },
  { tag: "R31", Q: "0", content: 0 },
  { tag: "F0", Q: "0", content: 0 },
  { tag: "F1", Q: "0", content: 0 },
  { tag: "F2", Q: "0", content: 0 },
  { tag: "F3", Q: "0", content: 0 },
  { tag: "F4", Q: "0", content: 0 },
  { tag: "F5", Q: "0", content: 0 },
  { tag: "F6", Q: "0", content: 0 },
  { tag: "F7", Q: "0", content: 0 },
  { tag: "F8", Q: "0", content: 0 },
  { tag: "F9", Q: "0", content: 0 },
  { tag: "F10", Q: "0", content: 0 },
  { tag: "F11", Q: "0", content: 0 },
  { tag: "F12", Q: "0", content: 0 },
  { tag: "F13", Q: "0", content: 0 },
  { tag: "F14", Q: "0", content: 0 },
  { tag: "F15", Q: "0", content: 0 },
  { tag: "F16", Q: "0", content: 0 },
  { tag: "F17", Q: "0", content: 0 },
  { tag: "F18", Q: "0", content: 0 },
  { tag: "F19", Q: "0", content: 0 },
  { tag: "F20", Q: "0", content: 0 },
  { tag: "F21", Q: "0", content: 0 },
  { tag: "F22", Q: "0", content: 0 },
  { tag: "F23", Q: "0", content: 0 },
  { tag: "F24", Q: "0", content: 0 },
  { tag: "F25", Q: "0", content: 0 },
  { tag: "F26", Q: "0", content: 0 },
  { tag: "F27", Q: "0", content: 0 },
  { tag: "F28", Q: "0", content: 0 },
  { tag: "F29", Q: "0", content: 0 },
  { tag: "F30", Q: "0", content: 0 },
  { tag: "F31", Q: "0", content: 0 },
];

let instructionQueue: TInstruction[] = [];

export let TomasuloSystem: ITomasuloSystem = {
  ReservationStations: [
    ReservationStation1,
    ReservationStation2,
    ReservationStationInteger,
  ],
  Buffers: [LoadBuffer, StoreBuffer],
  registerFile: registerFile,
  dataMemory: MainMemory,
  //filled in by user input
  InstructionMemory: InstructionMemory.instructions,
  cache: DataCache,
  instructionQueue: instructionQueue,
  clock: 0,
};

// initialize
InstructionMemory.instructions = userInput.programInstructions;

export function setupSystem(
  systemUserInput: Config,
  systemProgramInstructions: TInstruction[]
): ITomasuloSystem {
  setUserInput(systemUserInput, systemProgramInstructions);
  setMemory(systemUserInput, systemProgramInstructions);
  setBusDetails();
  setReservationStations();
  setRegisterFile();
  setInstructionQueue();
  setProgramInstructions();
  createTomasuloSystem();
  initMemory();
  initCache();
  return TomasuloSystem;
}

function setUserInput(
  systemUserInput: Config,
  systemProgramInstructions: TInstruction[]
) {
  // console.log(`UI user input:`);
  // console.table(systemUserInput);

  userInput = {
    noOfAddSubRS: systemUserInput.reservation_stations_sizes["FP ADD/SUB"],
    noOfMulDivRS: systemUserInput.reservation_stations_sizes["FP MUL/DIV"],
    noOfLoadBuffers: systemUserInput.buffer_sizes.LOAD,
    noOfStoreBuffers: systemUserInput.buffer_sizes.STORE,
    noOfIntegerAddSubRS:
      systemUserInput.reservation_stations_sizes["Integer ADD/SUB"],
    cacheSize: systemUserInput.cache_size,
    cacheBlockSize: systemUserInput.block_size,
    programInstructions: systemProgramInstructions,
  };

  // console.log(`User input from tomasulo:`);
  // console.table(userInput);
}

function setBusDetails() {
  bus = {
    tag: "",
    value: 0,
  };
}

function setReservationStations() {
  ReservationStation1 = {
    reservationStationType: ReservationStationTypeEnum.ADD_SUB,
    stations: Array.from({ length: userInput.noOfAddSubRS }, (_, i) => ({
      tag: `A${i + 1}`,
      op: InstructionTypeEnum.NONE,
      VJ: 0,
      VK: 0,
      QJ: "0",
      QK: "0",
      busy: 0,
      cyclesRemaining: 0,
      res: Number.MIN_VALUE,
    })),
  };

  ReservationStation2 = {
    reservationStationType: ReservationStationTypeEnum.MUL_DIV,
    stations: Array.from({ length: userInput.noOfMulDivRS }, (_, i) => ({
      tag: `M${i + 1}`,
      op: InstructionTypeEnum.NONE,
      VJ: 0,
      VK: 0,
      QJ: "0",
      QK: "0",
      busy: 0,
      cyclesRemaining: 0,
      res: Number.MIN_VALUE,
    })),
  };

  ReservationStationInteger = {
    reservationStationType: ReservationStationTypeEnum.INTEGER,
    stations: Array.from({ length: userInput.noOfIntegerAddSubRS }, (_, i) => ({
      tag: `AI${i + 1}`,
      op: InstructionTypeEnum.NONE,
      VJ: 0,
      VK: 0,
      QJ: "0",
      QK: "0",
      busy: 0,
      res: Number.MIN_VALUE,
      cyclesRemaining: 0,
    })),
  };

  LoadBuffer = {
    bufferType: ReservationStationTypeEnum.LOAD,
    buffers: Array.from({ length: userInput.noOfLoadBuffers }, (_, i) => ({
      op: InstructionTypeEnum.NONE,
      tag: `LD${i + 1}`,
      busy: 0,
      address: 0,
      cyclesRemaining: 0,
      res: Number.MIN_VALUE,
    })),
  };

  StoreBuffer = {
    bufferType: ReservationStationTypeEnum.STORE,
    buffers: Array.from({ length: userInput.noOfStoreBuffers }, (_, i) => ({
      op: InstructionTypeEnum.NONE,
      tag: `STR${i + 1}`,
      busy: 0,
      address: 0,
      V: 0,
      Q: "0",
      cyclesRemaining: 0,
    })),
  };
}

function setRegisterFile() {
  registerFile = [
    { tag: "R0", Q: "0", content: 0 },
    { tag: "R1", Q: "0", content: 5 },
    { tag: "R2", Q: "0", content: 0 },
    { tag: "R3", Q: "0", content: 0 },
    { tag: "R4", Q: "0", content: 0 },
    { tag: "R5", Q: "0", content: 0 },
    { tag: "R6", Q: "0", content: 0 },
    { tag: "R7", Q: "0", content: 0 },
    { tag: "R8", Q: "0", content: 0 },
    { tag: "R9", Q: "0", content: 0 },
    { tag: "R10", Q: "0", content: 0 },
    { tag: "R11", Q: "0", content: 0 },
    { tag: "R12", Q: "0", content: 0 },
    { tag: "R13", Q: "0", content: 0 },
    { tag: "R14", Q: "0", content: 0 },
    { tag: "R15", Q: "0", content: 0 },
    { tag: "R16", Q: "0", content: 0 },
    { tag: "R17", Q: "0", content: 0 },
    { tag: "R18", Q: "0", content: 0 },
    { tag: "R19", Q: "0", content: 0 },
    { tag: "R20", Q: "0", content: 0 },
    { tag: "R21", Q: "0", content: 0 },
    { tag: "R22", Q: "0", content: 0 },
    { tag: "R23", Q: "0", content: 0 },
    { tag: "R24", Q: "0", content: 0 },
    { tag: "R25", Q: "0", content: 0 },
    { tag: "R26", Q: "0", content: 0 },
    { tag: "R27", Q: "0", content: 0 },
    { tag: "R28", Q: "0", content: 0 },
    { tag: "R29", Q: "0", content: 0 },
    { tag: "R30", Q: "0", content: 0 },
    { tag: "R31", Q: "0", content: 0 },
    { tag: "F0", Q: "0", content: 0 },
    { tag: "F1", Q: "0", content: 3 },
    { tag: "F2", Q: "0", content: 3 },
    { tag: "F3", Q: "0", content: 3 },
    { tag: "F4", Q: "0", content: 0 },
    { tag: "F5", Q: "0", content: 0 },
    { tag: "F6", Q: "0", content: 0 },
    { tag: "F7", Q: "0", content: 0 },
    { tag: "F8", Q: "0", content: 0 },
    { tag: "F9", Q: "0", content: 0 },
    { tag: "F10", Q: "0", content: 0 },
    { tag: "F11", Q: "0", content: 0 },
    { tag: "F12", Q: "0", content: 0 },
    { tag: "F13", Q: "0", content: 0 },
    { tag: "F14", Q: "0", content: 0 },
    { tag: "F15", Q: "0", content: 0 },
    { tag: "F16", Q: "0", content: 0 },
    { tag: "F17", Q: "0", content: 0 },
    { tag: "F18", Q: "0", content: 0 },
    { tag: "F19", Q: "0", content: 0 },
    { tag: "F20", Q: "0", content: 0 },
    { tag: "F21", Q: "0", content: 0 },
    { tag: "F22", Q: "0", content: 0 },
    { tag: "F23", Q: "0", content: 0 },
    { tag: "F24", Q: "0", content: 0 },
    { tag: "F25", Q: "0", content: 0 },
    { tag: "F26", Q: "0", content: 0 },
    { tag: "F27", Q: "0", content: 0 },
    { tag: "F28", Q: "0", content: 0 },
    { tag: "F29", Q: "0", content: 0 },
    { tag: "F30", Q: "0", content: 0 },
    { tag: "F31", Q: "0", content: 0 },
  ];
}

function setInstructionQueue() {
  instructionQueue = [];
}

function setProgramInstructions() {
  InstructionMemory.instructions = userInput.programInstructions;
}

function createTomasuloSystem() {
  TomasuloSystem = {
    ReservationStations: [
      ReservationStation1,
      ReservationStation2,
      ReservationStationInteger,
    ],
    Buffers: [LoadBuffer, StoreBuffer],
    registerFile: registerFile,
    dataMemory: MainMemory,
    //filled in by user input
    InstructionMemory: InstructionMemory.instructions,
    cache: DataCache,
    instructionQueue: instructionQueue,
    clock: 0,
  };
}

//initialize the system

export interface ITomasuloSystem {
  ReservationStations: TReservationStation[];
  Buffers: TBuffer[];
  registerFile: TRegisterFile[];
  dataMemory: Memory;
  cache: SystemCache;
  InstructionMemory: TInstruction[];
  instructionQueue: TInstruction[];
  clock: number;
}

// initialize
InstructionMemory.instructions = userInput.programInstructions;

// Instruction Queue

function fetchInstruction(): void {
  if (InstructionMemory.PC >= InstructionMemory.instructions.length) {
    console.log("No more instructions to fetch.");
    return;
  }

  const instruction = InstructionMemory.instructions[InstructionMemory.PC];

  instructionQueue.push(instruction);
  InstructionMemory.PC++;
  // [1] --> [1,2]
}

function issue(): void {
  //fetch
  fetchInstruction();

  if (instructionQueue.length === 0) {
    console.log("No more instructions to issue.");
    return;
  }

  const instruction = instructionQueue[instructionQueue.length - 1]; //always fetches last
  console.log("Instruction Fetched", instruction);
  //issue
  switch (instruction.type) {
    case InstructionTypeEnum.ADD_D:
    case InstructionTypeEnum.ADD_S:
    case InstructionTypeEnum.SUB_D:
    case InstructionTypeEnum.SUB_S:
      issueToReservationStation1(instruction);

      break;

    case InstructionTypeEnum.MUL_D:
    case InstructionTypeEnum.MUL_S:
    case InstructionTypeEnum.DIV_D:
    case InstructionTypeEnum.DIV_S:
      issueToReservationStation2(instruction);

      break;

    case InstructionTypeEnum.DADDI:
    case InstructionTypeEnum.DSUBI:
      issueToReservationStationInteger(instruction);

      break;

    case InstructionTypeEnum.LW:
    case InstructionTypeEnum.LD:
    case InstructionTypeEnum.L_D:
    case InstructionTypeEnum.L_S:
      issueToLoadBuffer(instruction);

      break;

    case InstructionTypeEnum.SW:
    case InstructionTypeEnum.SD:
    case InstructionTypeEnum.S_D:
    case InstructionTypeEnum.S_S:
      issueToStoreBuffer(instruction);

      break;
    case InstructionTypeEnum.BNE:
    case InstructionTypeEnum.BEQ:
      execBranch(parseInt(instruction.t));

      break;
    default:
      console.error(`Unknown operation: ${instruction.type}`);
      break;
  }
}

function issueToReservationStation1(instruction: TInstruction): void {
  const rs = ReservationStation1.stations.find((rs) => rs.busy === 0);
  if (!rs) {
    console.log("No available reservation station for ADD/SUB operation.");
    return;
  }
  poppedIntstruction = instructionQueue.pop();

  //loading operands
  rs.op = instruction.type;
  rs.VJ = registerFile.find((r) => r.tag === instruction.s)!.content;
  rs.VK = registerFile.find((r) => r.tag === instruction.t)!.content;
  rs.QJ = registerFile.find((r) => r.tag === instruction.s)!.Q;
  rs.QK = registerFile.find((r) => r.tag === instruction.t)!.Q;
  rs.busy = 1;
  rs.cyclesRemaining = instruction.latency;

  //set the tag in the register file
  registerFile.find((r) => r.tag === instruction.d)!.Q = rs.tag;
}

function issueToReservationStation2(instruction: TInstruction): void {
  const rs = ReservationStation2.stations.find((rs) => rs.busy === 0);
  if (!rs) {
    console.log("No available reservation station for MUL/DIV operation.");
    return;
  }
  poppedIntstruction = instructionQueue.pop();

  //loading operands
  rs.op = instruction.type;
  rs.VJ = registerFile.find((r) => r.tag === instruction.s)!.content;
  rs.VK = registerFile.find((r) => r.tag === instruction.t)!.content;
  rs.QJ = registerFile.find((r) => r.tag === instruction.s)!.Q;
  rs.QK = registerFile.find((r) => r.tag === instruction.t)!.Q;
  rs.busy = 1;
  rs.cyclesRemaining = instruction.latency;

  //set the tag in the register file
  registerFile.find((r) => r.tag === instruction.d)!.Q = rs.tag;
}

function issueToReservationStationInteger(instruction: TInstruction): void {
  const rs = ReservationStationInteger.stations.find((rs) => rs.busy === 0);
  if (!rs) {
    console.log("No available reservation station for integer operation.");
    return;
  }
  poppedIntstruction = instructionQueue.pop();

  //loading operands
  rs.op = instruction.type;
  rs.VJ = registerFile.find((r) => r.tag === instruction.s)!.content;
  rs.VK = parseInt(instruction.t);
  rs.QJ = registerFile.find((r) => r.tag === instruction.s)!.Q;
  rs.QK = "0";
  rs.busy = 1;
  rs.cyclesRemaining = instruction.latency;

  //set the tag in the register file
  registerFile.find((r) => r.tag === instruction.d)!.Q = rs.tag;
}

function issueToLoadBuffer(instruction: TInstruction): void {
  const buffer = LoadBuffer.buffers.find((buffer) => buffer.busy === 0);
  const checkStoreBuffer = StoreBuffer.buffers.find(
    (buf) => buf.address === parseInt(instruction.s) && buf.busy === 1
  );
  if (checkStoreBuffer) {
    console.log("Store buffer with the same effective address found.");
    //stall
    return;
  }
  if (!buffer) {
    console.log("No available load buffer.");
    //stall
    return;
  }
  poppedIntstruction = instructionQueue.pop();

  //loading operands
  buffer.op = instruction.type;
  buffer.address = parseInt(instruction.s);
  buffer.busy = 1;
  buffer.cyclesRemaining =
    (checkForCacheMiss(parseInt(instruction.s))
      ? cacheMissPenalty
      : cacheHitLatency) + instruction.latency;

  //set the tag in the register file
  registerFile.find((r) => r.tag === instruction.d)!.Q = buffer.tag;
}

function issueToStoreBuffer(instruction: TInstruction): void {
  const buffer = StoreBuffer.buffers.find((buffer) => buffer.busy === 0);
  const checkStoreBuffer = StoreBuffer.buffers.find(
    (buf) => buf.address === parseInt(instruction.s) && buf.busy === 1
  );
  const checkLoadBuffer = LoadBuffer.buffers.find(
    (buf) => buf.address === parseInt(instruction.s) && buf.busy === 1
  );
  if (checkStoreBuffer || checkLoadBuffer) {
    console.log("Store or Load buffer with the same effective address found.");
    //stall
    return;
  }
  if (!buffer) {
    console.log("No available store buffer.");
    return;
  }
  poppedIntstruction = instructionQueue.pop();

  //loading operands

  buffer.op = instruction.type;

  buffer.address = parseInt(instruction.s);
  buffer.V = registerFile.find((r) => r.tag === instruction.d)!.content;
  buffer.Q = registerFile.find((r) => r.tag === instruction.d)!.Q;
  buffer.busy = 1;
  buffer.cyclesRemaining =
    (checkForCacheMiss(parseInt(instruction.s))
      ? cacheMissPenalty
      : cacheHitLatency) + instruction.latency;

  // //set the tag in the register file
  // registerFile.find((r) => r.tag === instruction.d)!.Q = buffer.tag;
}

function get_op(rs: TReservationStationRow): InstructionTypeEnum {
  return rs.op;
}

function get_op2(rs: TBufferRow): InstructionTypeEnum {
  return rs.op;
}

function execute_ADD(rs: TReservationStationRow): number {
  const VJ = rs.VJ;
  const VK = rs.VK;

  if (rs.cyclesRemaining <= 1) {
    const result = VJ + VK;
    console.log(`ADD operation completed. Result: ${result}`);
    rs.cyclesRemaining--;
    return result;
  } else {
    rs.cyclesRemaining--;
    console.log(
      `ADD operation in progress, cycles remaining: ${rs.cyclesRemaining}`
    );
    return Number.MIN_VALUE;
  }
}

function execute_SUB(rs: TReservationStationRow): number {
  const VJ = rs.VJ;
  const VK = rs.VK;

  if (rs.cyclesRemaining <= 1) {
    const result = VJ - VK;
    rs.cyclesRemaining--;
    return result;
  } else {
    rs.cyclesRemaining--;
    return Number.MIN_VALUE;
  }
}

function execute_MUL(rs: TReservationStationRow): number {
  const VJ = rs.VJ;
  const VK = rs.VK;

  if (rs.cyclesRemaining <= 1) {
    const result = VJ * VK;
    rs.cyclesRemaining--;
    return result;
  } else {
    rs.cyclesRemaining--;
    return Number.MIN_VALUE;
  }
}

function execute_DIV(rs: TReservationStationRow): number {
  const VJ = rs.VJ;
  const VK = rs.VK;

  // Prevent division by zero
  if (VK === 0) {
    throw new Error("Division by zero");
  }

  if (rs.cyclesRemaining <= 1) {
    const result = VJ / VK;
    rs.cyclesRemaining--;
    return result;
  } else {
    rs.cyclesRemaining--;
    return Number.MIN_VALUE;
  }
}

function isReady(TReservationStationRow: TReservationStationRow): boolean {
  if (TReservationStationRow.QJ !== "0" || TReservationStationRow.QK !== "0")
    return false;
  else return true;
}

function isReady2(TBufferRow: TBufferRow): boolean {
  if (TBufferRow.Q !== "0") return false;
  else return true;
}

// Function to execute instructions from reservation stations
function execResInt(reservationStation: TReservationStation): void {
  for (let i = 0; i < reservationStation.stations.length; i++) {
    const rs = reservationStation.stations[i];
    const op = get_op(rs); // Get the operation type from the reservation station
    switch (op) {
      case InstructionTypeEnum.DADDI:
        if (isReady(rs)) {
          console.log(
            `Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`
          );
          const result = execute_ADD(rs);
          if (rs.cyclesRemaining <= 0) rs.res = result;
          //     writeBackInt(i, rs.tag, result);
        } else {
          console.log(`${op} is not ready`);
          if (bus.tag === rs.QJ) {
            rs.VJ = bus.value;
            rs.QJ = "0";
          }
          if (bus.tag === rs.QK) {
            rs.VK = bus.value;
            rs.QK = "0";
          }
        }
        break;
      case InstructionTypeEnum.DSUBI:
        if (isReady(rs)) {
          console.log(
            `Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`
          );
          const result = execute_SUB(rs);
          if (rs.cyclesRemaining <= 0) rs.res = result;
          //     writeBackInt(i, rs.tag, result);
        } else {
          console.log(`${op} is not ready`);
          if (bus.tag === rs.QJ) {
            rs.VJ = bus.value;
            rs.QJ = "0";
          }
          if (bus.tag === rs.QK) {
            rs.VK = bus.value;
            rs.QK = "0";
          }
        }
        break;
    }
  }
}

function execRes1(reservationStation: TReservationStation): void {
  for (let i = 0; i < reservationStation.stations.length; i++) {
    const rs = reservationStation.stations[i];
    const op = get_op(rs); // Get the operation type from the reservation station

    // Execute logic based on operation type
    switch (op) {
      case InstructionTypeEnum.ADD_D:
        if (isReady(rs)) {
          console.log(
            `Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`
          );
          const result = execute_ADD(rs);
          rs.res = result;
          if (rs.cyclesRemaining <= 0) rs.res = result;
          //     writeBack1(i, rs.tag, result);
        } else {
          console.log(`${op} is not ready`);
          if (bus.tag === rs.QJ) {
            rs.VJ = bus.value;
            rs.QJ = "0";
          }
          if (bus.tag === rs.QK) {
            rs.VK = bus.value;
            rs.QK = "0";
          }
        }
        break;
      case InstructionTypeEnum.ADD_S:
        if (isReady(rs)) {
          console.log(
            `Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`
          );
          const result = execute_ADD(rs);
          if (rs.cyclesRemaining <= 0) rs.res = result;
          //     writeBack1(i, rs.tag, result);
        } else {
          console.log(`${op} is not ready`);
          if (bus.tag === rs.QJ) {
            rs.VJ = bus.value;
            rs.QJ = "0";
          }
          if (bus.tag === rs.QK) {
            rs.VK = bus.value;
            rs.QK = "0";
          }
        }
        break;

      case InstructionTypeEnum.SUB_D:
        if (isReady(rs)) {
          console.log(
            `Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`
          );
          const result = execute_SUB(rs);
          if (rs.cyclesRemaining <= 0) rs.res = result;
          //     writeBack1(i, rs.tag, result);
        } else {
          console.log(`${op} is not ready`);
          if (bus.tag === rs.QJ) {
            rs.VJ = bus.value;
            rs.QJ = "0";
          }
          if (bus.tag === rs.QK) {
            rs.VK = bus.value;
            rs.QK = "0";
          }
        }
        break;
      case InstructionTypeEnum.SUB_S:
        if (isReady(rs)) {
          console.log(
            `Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`
          );
          const result = execute_SUB(rs);
          if (rs.cyclesRemaining <= 0) rs.res = result;
          //     writeBack1(i, rs.tag, result);
        } else {
          console.log(`${op} is not ready`);
          if (bus.tag === rs.QJ) {
            rs.VJ = bus.value;
            rs.QJ = "0";
          }
          if (bus.tag === rs.QK) {
            rs.VK = bus.value;
            rs.QK = "0";
          }
        }
        break;

      default:
        console.error(`Unknown operation: ${op}`);
        break;
    }
  }
}

function execRes2(reservationStation: TReservationStation): void {
  for (let i = 0; i < reservationStation.stations.length; i++) {
    const rs = reservationStation.stations[i];
    const op = get_op(rs); // Get the operation type from the reservation station

    // Execute logic based on operation type
    switch (op) {
      case InstructionTypeEnum.MUL_D:
        if (isReady(rs)) {
          console.log(
            `Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`
          );
          const result = execute_MUL(rs);
          if (rs.cyclesRemaining <= 0) rs.res = result;
          //     writeBack2(i, rs.tag, result);
        } else {
          console.log(`${op} is not ready`);
          if (bus.tag === rs.QJ) {
            rs.VJ = bus.value;
            rs.QJ = "0";
          }
          if (bus.tag === rs.QK) {
            rs.VK = bus.value;
            rs.QK = "0";
          }
        }
        break;
      case InstructionTypeEnum.MUL_S:
        if (isReady(rs)) {
          console.log(
            `Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`
          );
          const result = execute_MUL(rs);
          if (rs.cyclesRemaining <= 0) rs.res = result;
          //     writeBack2(i, rs.tag, result);
        } else {
          console.log(`${op} is not ready`);
          if (bus.tag === rs.QJ) {
            rs.VJ = bus.value;
            rs.QJ = "0";
          }
          if (bus.tag === rs.QK) {
            rs.VK = bus.value;
            rs.QK = "0";
          }
        }
        break;

      case InstructionTypeEnum.DIV_D:
        if (isReady(rs)) {
          console.log(
            `Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`
          );
          const result = execute_DIV(rs);
          if (rs.cyclesRemaining <= 0) rs.res = result;
          //     writeBack2(i, rs.tag, result);
        } else {
          console.log(`${op} is not ready`);
          if (bus.tag === rs.QJ) {
            rs.VJ = bus.value;
            rs.QJ = "0";
          }
          if (bus.tag === rs.QK) {
            rs.VK = bus.value;
            rs.QK = "0";
          }
        }
        break;
      case InstructionTypeEnum.DIV_S:
        if (isReady(rs)) {
          console.log(
            `Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`
          );
          const result = execute_DIV(rs);
          if (rs.cyclesRemaining <= 0) rs.res = result;
          //     writeBack2(i, rs.tag, result);
        } else {
          console.log(`${op} is not ready`);
          if (bus.tag === rs.QJ) {
            rs.VJ = bus.value;
            rs.QJ = "0";
          }
          if (bus.tag === rs.QK) {
            rs.VK = bus.value;
            rs.QK = "0";
          }
        }
        break;

      default:
        console.error(`Unknown operation: ${op}`);
        break;
    }
  }
}

function execLoad(Tbuffer: TBuffer): void {
  for (let i = 0; i < Tbuffer.buffers.length; i++) {
    const rs = Tbuffer.buffers[i];
    const op = get_op2(rs); // Get the operation type from the reservation station

    // Execute logic based on operation type
    if (rs.cyclesRemaining <= 1) {
      switch (op) {
        case InstructionTypeEnum.LW:
          {
            const word = loadWordCache(rs.address);
            rs.res = word;
            rs.cyclesRemaining--;
            // writeBack3(i, rs.tag, word);
          }
          break;
        case InstructionTypeEnum.LD:
          {
            const word = loadDoubleCache(rs.address);
            rs.res = word;
            rs.cyclesRemaining--;
            // writeBack2(i, rs.tag, word);
          }
          break;

        case InstructionTypeEnum.L_D:
          {
            const word = loadDoubleCache(rs.address);
            rs.res = word;
            rs.cyclesRemaining--;
            // writeBack2(i, rs.tag, word);
          }
          break;
        case InstructionTypeEnum.L_S:
          {
            const word = loadWordCache(rs.address);
            rs.res = word;
            rs.cyclesRemaining--;
            // writeBack2(i, rs.tag, word);
          }
          break;

        default:
          console.error(`Unknown operation: ${op}`);
          break;
      }
    }
    else {
      rs.cyclesRemaining--;
    }
  }
}

function execStore(Tbuffer: TBuffer): void {
  for (let i = 0; i < Tbuffer.buffers.length; i++) {
    const rs = Tbuffer.buffers[i];

    const op = get_op2(rs); // Get the operation type from the reservation station

    if (rs.cyclesRemaining <= 1) {
      // console.log("Store buffer Op BrolosBaskat: ", op);
      // Execute logic based on operation type
      switch (op) {
        case InstructionTypeEnum.SW:
          if (isReady2(rs)) {
            const value = rs.V!;
            const address = rs.address!;
            storeWordCache(value, address);
            rs.cyclesRemaining--;
          } else {
            if (bus.tag === rs.Q) {
              rs.V = bus.value;
              rs.Q = "0";
            }
          }
          break;
        case InstructionTypeEnum.SD:
          if (isReady2(rs)) {
            const value = rs.V!;
            const address = rs.address!;
            storeDoubleCache(value, address);
            rs.cyclesRemaining--;
          } else {
            if (bus.tag === rs.Q) {
              rs.V = bus.value;
              rs.Q = "0";
            }
          }
          break;

        case InstructionTypeEnum.S_S:
          if (isReady2(rs)) {
            const value = rs.V!;
            const address = rs.address!;
            storeWordCache(value, address);
            rs.cyclesRemaining--;
          } else {
            if (bus.tag === rs.Q) {
              rs.V = bus.value;
              rs.Q = "0";
            }
          }
          break;
        case InstructionTypeEnum.S_D:
          if (isReady2(rs)) {
            const value = rs.V!;
            const address = rs.address!;
            storeDoubleCache(value, address);
            rs.cyclesRemaining--;
          } else {
            if (bus.tag === rs.Q) {
              rs.V = bus.value;
              rs.Q = "0";
            }
          }
          break;

        default:
          console.error(`Unknown operation: ${op}`);
          break;
      }
    } else {
      rs.cyclesRemaining--;
    }
  }
}

function execBranch(branchAddress: number): void {
  // Implement branch logic here
  InstructionMemory.PC = branchAddress;
}

function isBusAvailable(): boolean {
  return bus.tag === "";
}
function writeBackInt(index: number, tag: string, result: number): void {
  if (!isBusAvailable()) {
    console.log("Bus is not available");
    return;
  }

  // Publish the result to the bus

  bus.tag = tag;
  bus.value = result;

  console.log(`Writing back result ${result} to register file with tag ${tag}`);

  // Update the register file
  for (const register of registerFile) {
    if (register.Q === tag) {
      register.Q = "0"; // Clear Q field
      register.content = result; // Update content with the result
      break;
    }
  }

  //update the reservation stations that need the tag
  for (const rs of ReservationStation1.stations) {
    if (rs.QJ === tag) {
      rs.VJ = result;
      rs.QJ = "0";
    }
    if (rs.QK === tag) {
      rs.VK = result;
      rs.QK = "0";
    }
  }
  for (const rs of ReservationStation2.stations) {
    if (rs.QJ === tag) {
      rs.VJ = result;
      rs.QJ = "0";
    }
    if (rs.QK === tag) {
      rs.VK = result;
      rs.QK = "0";
    }
  }
  for (const rs of ReservationStationInteger.stations) {
    if (rs.QJ === tag) {
      rs.VJ = result;
      rs.QJ = "0";
    }
    if (rs.QK === tag) {
      rs.VK = result;
      rs.QK = "0";
    }
  }
  for (const buf of StoreBuffer.buffers) {
    if (buf.Q === tag) {
      buf.V = result;
      buf.Q = "0";
    }
  }



  // Clear the reservation station
  ReservationStationInteger.stations[index].op = InstructionTypeEnum.NONE;
  ReservationStationInteger.stations[index].VJ = 0;
  ReservationStationInteger.stations[index].VK = 0;
  ReservationStationInteger.stations[index].busy = 0;
  ReservationStationInteger.stations[index].cyclesRemaining = 0;
}
function writeBack1(index: number, tag: string, result: number): void {
  if (!isBusAvailable()) {
    console.log("Bus is not available");
    return;
  }

  // Publish the result to the bus
  bus.tag = tag;
  bus.value = result;

  // Update the register file
  for (const register of registerFile) {
    if (register.Q === tag) {
      register.Q = "0"; // Clear Q field
      register.content = result; // Update content with the result
      break;
    }
  }

  //update the reservation stations that need the tag
  for (const rs of ReservationStation1.stations) {
    if (rs.QJ === tag) {
      rs.VJ = result;
      rs.QJ = "0";
    }
    if (rs.QK === tag) {
      rs.VK = result;
      rs.QK = "0";
    }
  }
  for (const rs of ReservationStation2.stations) {
    if (rs.QJ === tag) {
      rs.VJ = result;
      rs.QJ = "0";
    }
    if (rs.QK === tag) {
      rs.VK = result;
      rs.QK = "0";
    }
  }
  for (const rs of ReservationStationInteger.stations) {
    if (rs.QJ === tag) {
      rs.VJ = result;
      rs.QJ = "0";
    }
    if (rs.QK === tag) {
      rs.VK = result;
      rs.QK = "0";
    }
  }
  for (const buf of StoreBuffer.buffers) {
    if (buf.Q === tag) {
      buf.V = result;
      buf.Q = "0";
    }
  }

  // feed the result in the reservation stations that need it

  // Clear the reservation station
  ReservationStation1.stations[index].op = InstructionTypeEnum.NONE;
  ReservationStation1.stations[index].VJ = 0;
  ReservationStation1.stations[index].VK = 0;
  ReservationStation1.stations[index].busy = 0;
  ReservationStation1.stations[index].cyclesRemaining = 0;
}
function writeBack2(index: number, tag: string, result: number): void {
  if (!isBusAvailable()) {
    console.log("Bus is not available");
    return;
  }

  // Publish the result to the bus
  bus.tag = tag;
  bus.value = result;

  // Update the register file
  for (const register of registerFile) {
    if (register.Q === tag) {
      register.Q = "0"; // Clear Q field
      register.content = result; // Update content with the result
      break;
    }
  }

  //update the reservation stations that need the tag
  for (const rs of ReservationStation1.stations) {
    if (rs.QJ === tag) {
      rs.VJ = result;
      rs.QJ = "0";
    }
    if (rs.QK === tag) {
      rs.VK = result;
      rs.QK = "0";
    }
  }
  for (const rs of ReservationStation2.stations) {
    if (rs.QJ === tag) {
      rs.VJ = result;
      rs.QJ = "0";
    }
    if (rs.QK === tag) {
      rs.VK = result;
      rs.QK = "0";
    }
  }
  for (const rs of ReservationStationInteger.stations) {
    if (rs.QJ === tag) {
      rs.VJ = result;
      rs.QJ = "0";
    }
    if (rs.QK === tag) {
      rs.VK = result;
      rs.QK = "0";
    }
  }
  for (const buf of StoreBuffer.buffers) {
    if (buf.Q === tag) {
      buf.V = result;
      buf.Q = "0";
    }
  }

  // Clear the reservation station
  ReservationStation2.stations[index].op = InstructionTypeEnum.NONE;
  ReservationStation2.stations[index].VJ = 0;
  ReservationStation2.stations[index].VK = 0;
  ReservationStation2.stations[index].busy = 0;
  ReservationStation2.stations[index].cyclesRemaining = 0;
}
function writeBack3(index: number, tag: string, result: number): void {
  if (!isBusAvailable()) {
    console.log("Bus is not available");
    return;
  }

  // Publish the result to the bus
  bus.tag = tag;
  bus.value = result;

  // Update the register file
  for (const register of registerFile) {
    if (register.Q === tag) {
      register.Q = "0"; // Clear Q field
      register.content = result; // Update content with the result
      break;
    }
  }

  //update the reservation stations that need the tag
  for (const rs of ReservationStation1.stations) {
    if (rs.QJ === tag) {
      rs.VJ = result;
      rs.QJ = "0";
    }
    if (rs.QK === tag) {
      rs.VK = result;
      rs.QK = "0";
    }
  }
  for (const rs of ReservationStation2.stations) {
    if (rs.QJ === tag) {
      rs.VJ = result;
      rs.QJ = "0";
    }
    if (rs.QK === tag) {
      rs.VK = result;
      rs.QK = "0";
    }
  }
  for (const rs of ReservationStationInteger.stations) {
    if (rs.QJ === tag) {
      rs.VJ = result;
      rs.QJ = "0";
    }
    if (rs.QK === tag) {
      rs.VK = result;
      rs.QK = "0";
    }
  }
  for (const buf of StoreBuffer.buffers) {
    if (buf.Q === tag) {
      buf.V = result;
      buf.Q = "0";
    }
  }

  // Clear the reservation station
  LoadBuffer.buffers[index].op = InstructionTypeEnum.NONE;
  LoadBuffer.buffers[index].busy = 0;
  LoadBuffer.buffers[index].address = 0;
}

function writeBack4(index: number): void {

  console.log("Store buffer write back", index);
  // Clear the reservation station
  StoreBuffer.buffers[index].op = InstructionTypeEnum.NONE;
  StoreBuffer.buffers[index].busy = 0;
  StoreBuffer.buffers[index].address = 0;
  StoreBuffer.buffers[index].Q = "0";
  StoreBuffer.buffers[index].V = 0;
}

function writeBack() {
  //iterate over all reservation stations and buffers
  // check if the result is ready
  // if ready in IntResStation, use WriteBackInt write back
  // if ready in ResStation1, use WriteBack1 write back

  // find the tag of all the instructions that want to write and check priority and start writing the highest priority
  let maxPriority = 0;
  let highestPriorityTag = "";

  for (const rs of ReservationStation1.stations) {
    if (rs.res !== Number.MIN_VALUE) {
      const priority = buspriority(rs.tag);
      if (priority >= maxPriority) {
        maxPriority = priority;
        highestPriorityTag = rs.tag;
      }
    }
  }
  for (const rs of ReservationStation2.stations) {
    if (rs.res !== Number.MIN_VALUE) {
      const priority = buspriority(rs.tag);
      if (priority >= maxPriority) {
        maxPriority = priority;
        highestPriorityTag = rs.tag;
      }
    }
  }
  for (const rs of ReservationStationInteger.stations) {
    if (rs.res !== Number.MIN_VALUE) {
      const priority = buspriority(rs.tag);
      if (priority >= maxPriority) {
        maxPriority = priority;
        highestPriorityTag = rs.tag;
      }
    }
  }
  for (const buf of LoadBuffer.buffers) {
    if (buf.res !== Number.MIN_VALUE) {
      const priority = buspriority(buf.tag);
      if (priority >= maxPriority) {
        maxPriority = priority;
        highestPriorityTag = buf.tag;
      }
    }
  }

  console.log("####################");

  console.log("Highest priority tag: ", highestPriorityTag);
  console.log("Max priority: ", maxPriority);

  console.log("####################");

  // write the highest priority

  for (const rs of ReservationStation1.stations) {
    if (rs.tag === highestPriorityTag) {
      writeBack1(ReservationStation1.stations.indexOf(rs), rs.tag, rs.res);
      rs.res = Number.MIN_VALUE;
      bus.tag = "";
      return;
    }
  }
  for (const rs of ReservationStation2.stations) {
    if (rs.tag === highestPriorityTag) {
      writeBack2(ReservationStation2.stations.indexOf(rs), rs.tag, rs.res);
      rs.res = Number.MIN_VALUE;
      bus.tag = "";
      return;
    }
  }
  for (const rs of ReservationStationInteger.stations) {
    if (rs.tag === highestPriorityTag) {
      writeBackInt(
        ReservationStationInteger.stations.indexOf(rs),
        rs.tag,
        rs.res
      );
      //reset reservation station
      rs.res = Number.MIN_VALUE;
      bus.tag = "";
      return;
    }
  }
  for (const buf of LoadBuffer.buffers) {
    if (buf.tag === highestPriorityTag) {
      writeBack3(LoadBuffer.buffers.indexOf(buf), buf.tag, buf.res!);
      buf.res = Number.MIN_VALUE;
      bus.tag = "";
      return;
    }
  }
  for (const buf of StoreBuffer.buffers) {
    if (buf.busy == 1 && buf.cyclesRemaining<=0) {
      writeBack4(StoreBuffer.buffers.indexOf(buf));
      // buf.res = Number.MIN_VALUE;
      bus.tag = "";
      return;
    }
  }
}

function buspriority(tag: string): number {
  let count = 0;
  const reservationStations = [
    ReservationStation1,
    ReservationStation2,
    ReservationStationInteger,
  ];
  for (const rs of reservationStations) {
    for (const station of rs.stations) {
      if (station.tag === tag) {
        count++;
      }
    }
  }

  for (const buf of LoadBuffer.buffers) {
    if (buf.tag === tag) {
      count++;
    }
  }
  return count;
}



// function processWriteBack(instructions: Array<{ index: number, tag: string, result: number }>): void {
//     instructions.sort((a, b) => buspriority(b.tag) - buspriority(a.tag));

//     for (const instruction of instructions) {
//         const { index, tag, result } = instruction;
//         if () {
//             writeBackInt(index, tag, result);
//         } else if () {
//             writeBack1(index, tag, result);
//         } else if () {
//             writeBack2(index, tag, result);
//         } else if () {
//             writeBack3(index, tag, result);
//         } else if () {
//             writeBack4(index);
//         }
//     }
// }

function execute(): void {
  execRes1(ReservationStation1);
  execRes2(ReservationStation2);
  execLoad(LoadBuffer);
  execStore(StoreBuffer);
  execResInt(ReservationStationInteger);
}

// function printTomasuloSystemReservationStations(): void {
//   console.log("Reservation Stations:");
//   console.log("Reservation Station Add/Sub:");
//   console.table(ReservationStation1.stations);
//   console.log("Reservation Station Mul/Div:");
//   console.table(ReservationStation2.stations);
//   console.log("Integer Reservation Station ADDI/SUBI:");
//   console.table(ReservationStationInteger.stations);
// }

// function printTomasuloSystemBuffers() {
//   console.log("Load Buffer:");
//   console.table(LoadBuffer.buffers);
//   console.log("Store Buffer:");
//   console.table(StoreBuffer.buffers);
// }
// function printTomasuloSystemRegisterFile(): void {
//   console.log("Register File:");
//   console.table(registerFile);
// }
// function printInstructionQueue(): void {
//   console.log("Instruction Queue:");
//   console.table(instructionQueue);
// }

function printMemory(): void {
  console.log("Memory:");
  console.table(MainMemory);
}

function printTomasuloSystem(): void {
  printMemory();
}

export function simulateStep() {
  // if(instructionQueue.length<=0){
  // }
  // console.log(`PC: ${InstructionMemory.PC}`)
  writeBack();
  execute();
  issue();
  printTomasuloSystem();

  // instructionQueue.pop();
  TomasuloSystem.clock++;
}
