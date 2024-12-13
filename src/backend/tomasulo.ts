import { Memory, TInstruction, TReservationStationRow, TReservationStation, TBuffer, TRegisterFile, InstructionTypeEnum, TCDB, TBufferRow } from "./types";

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
const bus: TCDB = {
  tag: "",
  value: 0,
};

// Memory
const MainMemory: Memory = {
  memory: new Int8Array(2048),
};

// const registerFile: TRegisterFile[] = [
//   { tag: "R0", Q: "", content: 0 },
//   { tag: "R1", Q: "", content: 0 },
//   { tag: "R2", Q: "", content: 0 },
//   { tag: "R3", Q: "", content: 0 },
// ];

// function initMemory() {
//     for(let i = 0; i < MainMemory.memory.length; i++) {

//     }
// }

// function loadWord(address:number) {
//     const word = "";
//     for(let  i = 0; i < 3; i++) {

//     }
// }

export function storeWord2(value: number, address: number) {
  // console.log(`Value: ${value}`);
  // console.log(`Address: ${address}`);
  const bitRep = value.toString(2);
  // console.log(`BitRep: ${bitRep}`);
  const msb = bitRep[0];
  let slicedBitRep = bitRep;
  let remBits = "";
  for (let i = 0; i < 4; i++) {
    console.log(`SlicedBitRep1 : ${slicedBitRep}`);

    if (remBits !== "NONE") {
      if (slicedBitRep.length >= 8) {
        slicedBitRep = bitRep.slice(slicedBitRep.length - (i + 1) * 8, slicedBitRep.length);
        remBits = bitRep.slice(0, bitRep.length - (i + 1) * 8);
        console.log(`SlicedBitRep2 : ${slicedBitRep}`);
      } else {
        slicedBitRep = slicedBitRep.padStart(8, "0");
        remBits = "NONE";
        console.log(`SlicedBitRep3 : ${slicedBitRep}`);
      }
    } else {
      slicedBitRep = slicedBitRep.padStart(8, `${msb}`);
    }
    MainMemory.memory[address + i] = parseInt(slicedBitRep, 2);
    slicedBitRep = remBits;

    // console.log(`SlicedBitRep: ${bitRep.slice(bitRep.length-(i*8),bitRep.length)}`);
    // console.log(`ParsedInt: ${ parseInt(bitRep.slice(i*8, (i+1)*8), 2 )}`);
    console.log(`Main Memory: ${MainMemory.memory[address + i]}`);
  }
}

export function storeWord(value: number, address: number) {
  const bitRep = value.toString(2);
  if (bitRep.length > 32) {
    console.log(`BitRep > 32: ${bitRep}`);

    throw new Error("Word is not 32 bit representable");
  } else {
    const slicedBitRep = convertToTwoComplement(value, 32);
    // const slicedBitRep = bitRep.padStart(32, '0');
    for (let i = 0; i < 4; i++) {
      MainMemory.memory[address + (3 - i)] = parseInt(slicedBitRep.slice(i * 8, (i + 1) * 8), 2);
      console.log(`Bit Representation: ${slicedBitRep.slice(i * 8, (i + 1) * 8)}`);
      console.log(`Parsed Int: ${parseInt(slicedBitRep.slice(i * 8, (i + 1) * 8), 2)}`);
      console.log(`Main Memory at Address ${address + (3 - i)}: ${MainMemory.memory[address + (3 - i)]}`);
    }
  }
}

export function storeDouble(value: number, address: number) {
  const bitRep = value.toString(2);
  if (bitRep.length > 64) {
    throw new Error("Double is not 64 bit representable");
  } else {
    const slicedBitRep = convertToTwoComplement(value, 64);
    // const slicedBitRep = bitRep.padStart(64, '0');
    for (let i = 0; i < 8; i++) {
      MainMemory.memory[address + (7 - i)] = parseInt(slicedBitRep.slice(i * 8, (i + 1) * 8), 2);
      console.log(`Bit Representation: ${slicedBitRep.slice(i * 8, (i + 1) * 8)}`);
      console.log(`Parsed Int: ${parseInt(slicedBitRep.slice(i * 8, (i + 1) * 8), 2)}`);
      console.log(`Main Memory at Address ${address + (7 - i)}: ${MainMemory.memory[address + (7 - i)]}`);
    }
  }
}

export function convertToTwoComplement(value: number, padding: number): string {
  if (padding === 32) {
    return value < 0 ? (0xffffffff + value + 1).toString(2) : value.toString(2).padStart(32, "0");
  } else {
    return value < 0 ? (0xffffffffffffffffn + BigInt(value) + 1n).toString(2) : value.toString(2).padStart(64, "0");
  }
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
