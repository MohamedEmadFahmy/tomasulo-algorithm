import { MainMemory, DataCache, InstructionMemory } from "./memory";
import { Memory, TInstruction, TReservationStationRow, TReservationStation, TBuffer, TRegisterFile, InstructionTypeEnum, TCDB, TBufferRow, ReservationStationTypeEnum } from "./types";

/* conventions:
 * 1. Memory is byte addressable
 * 2. All numbers are in 8-bit two's complement
 * 3. A Word is stored in 4 bytes and the least significant byte is stored at the lowest address
 * 4. The memory is 2048 bytes long
 * 5. When using a SW the word needs to be 32bit representable otherwise most significant bytes are set to 0
 */

export default function test() {
    const int8 = new Int8Array(2);
    int8[0] = 420;
    console.log(int8[0]); // 42
    console.log(int8.length); // 2
    console.log(int8.BYTES_PER_ELEMENT); // 1
}



export const userInput = {
    noOfAddSubRS: 3,
    noOfMulDivRS: 3,
    noOfLoadBuffers: 3,
    noOfStoreBuffers: 3,
    cacheSize: 16,
    cacheBlockSize: 4,
    latency: {
        ADD: 2,
        SUB: 2,
        MUL: 10,
        DIV: 40,
        LOAD: 2,
        STORE: 2,
    },
    programInstructions: [
        { type: InstructionTypeEnum.DADDI, d: "R1", s: "R2", t: "10", latency: 2 },
        { type: InstructionTypeEnum.DSUBI, d: "R2", s: "R1", t: "10", latency: 2 },
        { type: InstructionTypeEnum.ADD_D, d: "F1", s: "F2", t: "F3", latency: 2 },
        { type: InstructionTypeEnum.ADD_S, d: "F1", s: "F2", t: "F3", latency: 2 },
        { type: InstructionTypeEnum.SUB_D, d: "F1", s: "F2", t: "F3", latency: 2 },
        { type: InstructionTypeEnum.SUB_S, d: "F1", s: "F2", t: "F3", latency: 2 },
        { type: InstructionTypeEnum.MUL_D, d: "F1", s: "F2", t: "F3", latency: 2 },
        { type: InstructionTypeEnum.MUL_S, d: "F1", s: "F2", t: "F3", latency: 2 },
        { type: InstructionTypeEnum.DIV_D, d: "F1", s: "F2", t: "F3", latency: 2 },
        { type: InstructionTypeEnum.DIV_S, d: "F1", s: "F2", t: "F3", latency: 2 },
        { type: InstructionTypeEnum.LW, d: "R1", s: "R2", t: "10", latency: 2 },
        { type: InstructionTypeEnum.LD, d: "R1", s: "R2", t: "10", latency: 2 },
        { type: InstructionTypeEnum.L_D, d: "F1", s: "F2", t: "10", latency: 2 },
        { type: InstructionTypeEnum.L_S, d: "F1", s: "F2", t: "10", latency: 2 },
        { type: InstructionTypeEnum.SW, d: "R1", s: "R2", t: "10", latency: 2 },
    ]
};
// initialise system


const bus: TCDB = {
    tag: "",
    value: 0,
};

const ResvationStation1: TReservationStation = {
    reservationStationType: ReservationStationTypeEnum.ADD_SUB,
    stations: Array.from({ length: userInput.noOfAddSubRS }, (_, i) => ({
        tag: `A${i + 1}`,
        op: InstructionTypeEnum.NONE,
        VJ: 0,
        VK: 0,
        QJ: "",
        QK: "",
        busy: 0,
        cyclesRemaining: 0,
    })),
};

const ResvationStation2: TReservationStation = {
    reservationStationType: ReservationStationTypeEnum.MUL_DIV,
    stations: Array.from({ length: userInput.noOfMulDivRS }, (_, i) => ({
        tag: `M${i + 1}`,
        op: InstructionTypeEnum.NONE,
        VJ: 0,
        VK: 0,
        QJ: "",
        QK: "",
        busy: 0,
        cyclesRemaining: 0,
    })),
};

const ReservationStationInteger: TReservationStation = {
    reservationStationType: ReservationStationTypeEnum.INTEGER,
    stations: Array.from({ length: 32 }, (_, i) => ({
        tag: `R${i + 1}`,
        op: InstructionTypeEnum.NONE,
        VJ: 0,
        VK: 0,
        QJ: "",
        QK: "",
        busy: 0,
        cyclesRemaining: 0,
    })),
};

const LoadBuffer: TBuffer = {
    bufferType: ReservationStationTypeEnum.LOAD,
    buffers: Array.from({ length: userInput.noOfLoadBuffers }, (_, i) => ({
        op: InstructionTypeEnum.NONE,
        tag: `LD${i + 1}`,
        busy: 0,
        address: 0,
    })),
};

const StoreBuffer: TBuffer = {
    bufferType: ReservationStationTypeEnum.STORE,
    buffers: Array.from({ length: userInput.noOfStoreBuffers }, (_, i) => ({
        op: InstructionTypeEnum.NONE,
        tag: `STR${i + 1}`,
        busy: 0,
        address: 0,
    })),
};

const registerFile: TRegisterFile[] = [
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
    { tag: "R32", Q: "0", content: 0 },
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
    { tag: "F32", Q: "0", content: 0 }
];

const instructionQueue: TInstruction[] = [];

//initialize the system
const tomasuloSystem = {
    ReservationStations: [
        ResvationStation1,
        ResvationStation2,
        ReservationStationInteger,
    ],
    Buffers: [
        LoadBuffer,
        StoreBuffer
    ],
    registerFile,
    dataMemory: MainMemory,
    //filled in by user input
    InstructionMemory: InstructionMemory,
    cache: DataCache,
    instructionQueue: instructionQueue,
}

// Instruction Queue

function fetchInstruction(): void {
    const instruction = InstructionMemory.instructions.shift();
    if (!instruction) {
        console.log("No more instructions to fetch.");
        return;
    }
    instructionQueue.push(instruction);
}

function issue(): void {

    //fetch
    fetchInstruction();

    const instruction = instructionQueue[instructionQueue.length - 1];
    if (!instruction) {
        console.log("No more instructions to issue.");
        return;
    }

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

        default:
            console.error(`Unknown operation: ${instruction.type}`);
            break;
    }
}

function issueToReservationStation1(instruction: TInstruction): void {
    const rs = ResvationStation1.stations.find((rs) => rs.busy === 0);
    if (!rs) {
        console.log("No available reservation station for ADD/SUB operation.");
        return;
    }

    //loading operands
    rs.op = instruction.type;
    rs.VJ = registerFile.find((r) => r.tag === instruction.s)!.content;
    rs.VK = registerFile.find((r) => r.tag === instruction.t)!.content;
    rs.QJ = registerFile.find((r) => r.tag === instruction.s)!.Q ?? "0";
    rs.QK = registerFile.find((r) => r.tag === instruction.t)!.Q;  
    rs.busy = 1;
    rs.cyclesRemaining = instruction.latency;
}

function issueToReservationStation2(instruction: TInstruction): void {
    const rs = ResvationStation2.stations.find((rs) => rs.busy === 0);
    if (!rs) {
        console.log("No available reservation station for MUL/DIV operation.");
        return;
    }
    //loading operands
    rs.op = instruction.type;
    rs.VJ = registerFile.find((r) => r.tag === instruction.s)!.content;
    rs.VK = registerFile.find((r) => r.tag === instruction.t)!.content;
    rs.QJ = registerFile.find((r) => r.tag === instruction.s)!.Q;
    rs.QK = registerFile.find((r) => r.tag === instruction.t)!.Q;  
    rs.busy = 1;
    rs.cyclesRemaining = instruction.latency;
}

function issueToReservationStationInteger(instruction: TInstruction): void {
    const rs = ReservationStationInteger.stations.find((rs) => rs.busy === 0);
    if (!rs) {
        console.log("No available reservation station for integer operation.");
        return;
    }

    //loading operands
    rs.op = instruction.type;
    rs.VJ = registerFile.find((r) => r.tag === instruction.s)!.content;
    rs.VK = parseInt(instruction.t);
    rs.QJ = registerFile.find((r) => r.tag === instruction.s)!.Q;
    rs.QK = registerFile.find((r) => r.tag === instruction.t)!.Q;  
    rs.busy = 1;
    rs.cyclesRemaining = instruction.latency;
}

function issueToLoadBuffer(instruction: TInstruction): void {
    const buffer = LoadBuffer.buffers.find((buffer) => buffer.busy === 0);
    const checkStoreBuffer = StoreBuffer.buffers.find((buf) => buf.address === parseInt(instruction.t) && buf.busy === 1);
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

    //loading operands
    buffer.op = instruction.type;
    buffer.address = registerFile.find((r) => r.tag === instruction.s)!.content;
    buffer.busy = 1;
}

function issueToStoreBuffer(instruction: TInstruction): void {
    const buffer = StoreBuffer.buffers.find((buffer) => buffer.busy === 0);
    const checkStoreBuffer = StoreBuffer.buffers.find((buf) => buf.address === parseInt(instruction.t) && buf.busy === 1);
    const checkLoadBuffer = LoadBuffer.buffers.find((buf) => buf.address === parseInt(instruction.t) && buf.busy === 1);
    if (checkStoreBuffer || checkLoadBuffer) {
        console.log("Store or Load buffer with the same effective address found.");
        //stall
        return;
    }
    if (!buffer) {
        console.log("No available store buffer.");
        return;
    }

    //loading operands
    buffer.op = instruction.type;
    buffer.address = registerFile.find((r) => r.tag === instruction.s)!.content;
    buffer.V = registerFile.find((r) => r.tag === instruction.t)!.content;
    buffer.Q = registerFile.find((r) => r.tag === instruction.t)!.Q;
    buffer.busy = 1;
}


function get_op(rs: TReservationStationRow): InstructionTypeEnum {
    return rs.op;
}
function get_op2(rs: TBufferRow): InstructionTypeEnum {
    return rs.op;
}
function get_latency(inst: TInstruction): number {
    return inst.latency;
}

function execute_ADD(rs: TReservationStationRow): number {
    const VJ = rs.VJ;
    const VK = rs.VK;

    while (rs.cyclesRemaining > 0) {
        rs.cyclesRemaining--;
        console.log(`ADD operation in progress, cycles remaining: ${rs.cyclesRemaining}`);
    }

    const result = VJ + VK;
    console.log(`ADD operation complete, result: ${result}`);

    rs.cyclesRemaining = 0;

    return result;
}

function execute_SUB(rs: TReservationStationRow): number {
    const VJ = rs.VJ;
    const VK = rs.VK;

    while (rs.cyclesRemaining > 0) {
        rs.cyclesRemaining--;
        console.log(`SUB operation in progress, cycles remaining: ${rs.cyclesRemaining}`);
    }

    const result = VJ - VK;
    console.log(`SUB operation complete, result: ${result}`);

    rs.cyclesRemaining = 0;
    return result;
}

function execute_MUL(rs: TReservationStationRow): number {
    const VJ = rs.VJ;
    const VK = rs.VK;

    while (rs.cyclesRemaining > 0) {
        rs.cyclesRemaining--;
        console.log(`MUL operation in progress, cycles remaining: ${rs.cyclesRemaining}`);
    }

    const result = VJ * VK;
    console.log(`MUL operation complete, result: ${result}`);

    rs.cyclesRemaining = 0;
    return result;
}

function execute_DIV(rs: TReservationStationRow): number {
    const VJ = rs.VJ;
    const VK = rs.VK;

    // Prevent division by zero
    if (VK === 0) {
        throw new Error("Division by zero");
    }

    while (rs.cyclesRemaining > 0) {
        rs.cyclesRemaining--;
        console.log(`DIV operation in progress, cycles remaining: ${rs.cyclesRemaining}`);
    }

    const result = VJ / VK;
    console.log(`DIV operation complete, result: ${result}`);

    rs.cyclesRemaining = 0;
    return result;
}

function execute_STR(rs: TBufferRow): void {
    const value = rs.V;
    const address = rs.address;
    // Prevent division by zero
    if (value !== undefined) memory[address] = value;
    else throw new Error(" value is undefined");
}

function isReady(TReservationStationRow: TReservationStationRow): boolean {
    if (TReservationStationRow.VJ === null || TReservationStationRow.VK === null) return false;
    else return true;
}

function isReady2(TBufferRow: TBufferRow): boolean {
    if (TBufferRow.V === undefined) return false;
    else return true;
}
// Function to execute instructions from reservation stations
function execRes1(reservationStation: TReservationStation): void {
    for (let i = 0; i < reservationStation.stations.length; i++) {
        const rs = reservationStation.stations[i];
        const op = get_op(rs); // Get the operation type from the reservation station

        // Execute logic based on operation type
        switch (op) {
            case InstructionTypeEnum.DADDI:
                if (isReady(rs)) {
                    console.log(`Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`);
                    const result = execute_ADD(rs);
                    writeBack1(rs, result);
                } else {
                    console.log(`${op} is not ready`);
                    if (bus.tag === rs.QJ) {
                        rs.VJ = bus.value;
                        rs.QJ = "";
                    }
                    if (bus.tag === rs.QK) {
                        rs.VK = bus.value;
                        rs.QK = "";
                    }
                    if (isReady(rs)) {
                        const result = execute_ADD(rs);
                        writeBack1(rs, result);

                        // writeBack1(rs.tag,result);
                    }
                }
                break;
            case InstructionTypeEnum.DSUBI:
                if (isReady(rs)) {
                    console.log(`Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`);
                    const result = execute_SUB(rs);
                    writeBack1(rs, result);
                } else {
                    console.log(`${op} is not ready`);
                    if (bus.tag === rs.QJ) {
                        rs.VJ = bus.value;
                        rs.QJ = "";
                    }
                    if (bus.tag === rs.QK) {
                        rs.VK = bus.value;
                        rs.QK = "";
                    }
                    if (isReady(rs)) {
                        const result = execute_SUB(rs);

                        writeBack1(rs, result);
                    }
                }
                break;
            case InstructionTypeEnum.ADD_D:
                if (isReady(rs)) {
                    console.log(`Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`);
                    const result = execute_ADD(rs);
                    writeBack1(rs, result);
                } else {
                    console.log(`${op} is not ready`);
                    if (bus.tag === rs.QJ) {
                        rs.VJ = bus.value;
                        rs.QJ = "";
                    }
                    if (bus.tag === rs.QK) {
                        rs.VK = bus.value;
                        rs.QK = "";
                    }
                    if (isReady(rs)) {
                        const result = execute_ADD(rs);

                        writeBack1(rs, result);
                    }
                }
                break;
            case InstructionTypeEnum.ADD_S:
                if (isReady(rs)) {
                    console.log(`Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`);
                    const result = execute_ADD(rs);
                    writeBack1(rs, result);
                } else {
                    console.log(`${op} is not ready`);
                    if (bus.tag === rs.QJ) {
                        rs.VJ = bus.value;
                        rs.QJ = "";
                    }
                    if (bus.tag === rs.QK) {
                        rs.VK = bus.value;
                        rs.QK = "";
                    }
                    if (isReady(rs)) {
                        const result = execute_ADD(rs);

                        writeBack1(rs, result);
                    }
                }
                break;

            case InstructionTypeEnum.SUB_D:
                if (isReady(rs)) {
                    console.log(`Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`);
                    const result = execute_SUB(rs);
                    writeBack1(rs, result);
                } else {
                    console.log(`${op} is not ready`);
                    if (bus.tag === rs.QJ) {
                        rs.VJ = bus.value;
                        rs.QJ = "";
                    }
                    if (bus.tag === rs.QK) {
                        rs.VK = bus.value;
                        rs.QK = "";
                    }
                    if (isReady(rs)) {
                        const result = execute_SUB(rs);

                        writeBack1(rs, result);
                    }
                }
                break;
            case InstructionTypeEnum.SUB_S:
                if (isReady(rs)) {
                    console.log(`Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`);
                    const result = execute_SUB(rs);
                    writeBack1(rs, result);
                } else {
                    console.log(`${op} is not ready`);
                    if (bus.tag === rs.QJ) {
                        rs.VJ = bus.value;
                        rs.QJ = "";
                    }
                    if (bus.tag === rs.QK) {
                        rs.VK = bus.value;
                        rs.QK = "";
                    }
                    if (isReady(rs)) {
                        const result = execute_SUB(rs);

                        writeBack1(rs, result);
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
                    console.log(`Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`);
                    const result = execute_MUL(rs);
                    writeBack1(rs, result);
                } else {
                    console.log(`${op} is not ready`);
                    if (bus.tag === rs.QJ) {
                        rs.VJ = bus.value;
                        rs.QJ = "";
                    }
                    if (bus.tag === rs.QK) {
                        rs.VK = bus.value;
                        rs.QK = "";
                    }
                    if (isReady(rs)) {
                        const result = execute_MUL(rs);
                        writeBack1(rs, result);
                    }
                }
                break;
            case InstructionTypeEnum.MUL_S:
                if (isReady(rs)) {
                    console.log(`Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`);
                    const result = execute_MUL(rs);
                    writeBack1(rs, result);
                } else {
                    console.log(`${op} is not ready`);
                    if (bus.tag === rs.QJ) {
                        rs.VJ = bus.value;
                        rs.QJ = "";
                    }
                    if (bus.tag === rs.QK) {
                        rs.VK = bus.value;
                        rs.QK = "";
                    }
                    if (isReady(rs)) {
                        const result = execute_MUL(rs);
                        writeBack1(rs, result);
                    }
                }
                break;

            case InstructionTypeEnum.DIV_D:
                if (isReady(rs)) {
                    console.log(`Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`);
                    const result = execute_DIV(rs);
                    writeBack1(rs, result);
                } else {
                    console.log(`${op} is not ready`);
                    if (bus.tag === rs.QJ) {
                        rs.VJ = bus.value;
                        rs.QJ = "";
                    }
                    if (bus.tag === rs.QK) {
                        rs.VK = bus.value;
                        rs.QK = "";
                    }
                    if (isReady(rs)) {
                        const result = execute_DIV(rs);
                        writeBack1(rs, result);
                    }
                }
                break;
            case InstructionTypeEnum.DIV_S:
                if (isReady(rs)) {
                    console.log(`Executing immediate operation ${op} with VJ: ${rs.VJ} and immediate VK: ${rs.VK}`);
                    const result = execute_DIV(rs);
                    writeBack1(rs, result);
                } else {
                    console.log(`${op} is not ready`);
                    if (bus.tag === rs.QJ) {
                        rs.VJ = bus.value;
                        rs.QJ = "";
                    }
                    if (bus.tag === rs.QK) {
                        rs.VK = bus.value;
                        rs.QK = "";
                    }
                    if (isReady(rs)) {
                        const result = execute_DIV(rs);
                        writeBack1(rs, result);
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
        switch (op) {
            case InstructionTypeEnum.LW:
                writeBack2(rs, rs.address);
                break;
            case InstructionTypeEnum.LD:
                writeBack2(rs, rs.address);

                break;

            case InstructionTypeEnum.L_D:
                writeBack2(rs, rs.address);

                break;
            case InstructionTypeEnum.L_S:
                writeBack2(rs, rs.address);

                break;

            default:
                console.error(`Unknown operation: ${op}`);
                break;
        }
    }
}

function execStore(Tbuffer: TBuffer): void {
    for (let i = 0; i < Tbuffer.buffers.length; i++) {
        const rs = Tbuffer.buffers[i];
        const op = get_op2(rs); // Get the operation type from the reservation station

        // Execute logic based on operation type
        switch (op) {
            case InstructionTypeEnum.SW:
                if (isReady2(rs)) {
                    execute_STR(rs);
                } else {
                    if (bus.tag === rs.Q) {
                        rs.V = bus.value;
                        rs.Q = undefined;
                    }
                    if (isReady2(rs)) {
                        execute_STR(rs);
                    }
                }
                break;
            case InstructionTypeEnum.SD:
                if (isReady2(rs)) {
                    execute_STR(rs);
                } else {
                    if (bus.tag === rs.Q) {
                        rs.V = bus.value;
                        rs.Q = undefined;
                    }
                    if (isReady2(rs)) {
                        execute_STR(rs);
                    }
                }
                break;

            case InstructionTypeEnum.S_S:
                if (isReady2(rs)) {
                    execute_STR(rs);
                } else {
                    if (bus.tag === rs.Q) {
                        rs.V = bus.value;
                        rs.Q = undefined;
                    }
                    if (isReady2(rs)) {
                        execute_STR(rs);
                    }
                }
                break;
            case InstructionTypeEnum.S_D:
                if (isReady2(rs)) {
                    execute_STR(rs);
                } else {
                    if (bus.tag === rs.Q) {
                        rs.V = bus.value;
                        rs.Q = undefined;
                    }
                    if (isReady2(rs)) {
                        execute_STR(rs);
                    }
                }
                break;

            default:
                console.error(`Unknown operation: ${op}`);
                break;
        }
    }
}

function isBusAvailable(): boolean {
    return bus.tag === "";
}

function writeBack1(rs: TReservationStationRow, result: number): void {
    if (!isBusAvailable()) {
        console.log("Bus is not available");
        return;
    }

    // Publish the result to the bus
    bus.tag = rs.tag;
    bus.value = result;

    console.log(`Result ${result} from ${rs.tag} written to the bus.`);

    // Clear the reservation station
    rs.tag = "";
    rs.op = InstructionTypeEnum.NONE;
    rs.VJ = 0;
    rs.VK = 0;
    rs.busy = 0;
    rs.cyclesRemaining = 0;

    // Simulate bus usage for a cycle
    setTimeout(() => {
        // Clear the bus after one cycle
        bus.tag = "";
        bus.value = 0;
        console.log("Bus cleared.");
    }, 1000); // Adjust timeout based on your simulation clock
}

function writeBack2(buffer: TBufferRow, result: number): void {
    if (!isBusAvailable()) {
        console.log("Bus is not available");
        return;
    }

    // Publish the result to the bus
    bus.tag = buffer.tag;
    bus.value = result;

    console.log(`Result ${result} from ${buffer.tag} written to the bus.`);

    // Clear the reservation station
    buffer.op = InstructionTypeEnum.NONE;
    buffer.tag = "";
    buffer.busy = 0;
    buffer.address = 0;

    // Simulate bus usage for a cycle
    setTimeout(() => {
        // Clear the bus after one cycle
        bus.tag = "";
        bus.value = 0;
        console.log("Bus cleared.");
    }, 1000); // Adjust timeout based on your simulation clock
}

function execute(): void {
    while (1) {
        // execRes1(ResvationStation1);
        // execRes2(ResvationStation2);
        // execLoad(ResvationStationLD);
        // execStore(ResvationStationSTR);
    }
}
