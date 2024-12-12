import { Memory } from "./types";

/* conventions:
 * 1. Memory is byte addressable
 * 2. All numbers are in 8-bit two's complement
 * 3. A Word is stored in 4 bytes
 */

export default function test() {
  const int8 = new Int8Array(2);
  int8[0] = 420;
  console.log(int8[0]); // 42
  console.log(int8.length); // 2
  console.log(int8.BYTES_PER_ELEMENT); // 1
}

//memory

const MainMemory: Memory = {
  memory: new Int8Array(2048),
};

export function initMemory() {
  for (let i = 0; i < MainMemory.memory.length; i++) {
    MainMemory.memory[i] = 0;
  }
}

export function printMemory() {
  for (let i = 0; i < MainMemory.memory.length; i++) {
    printByte(i);
  }
}

export function setByte(address: number, value: number) {
  MainMemory.memory[address] = value;
}

export function printByte(address: number) {
  const number = MainMemory.memory[address];
  console.log(
    "Index: " +
      address +
      "\tNumber: " +
      number +
      "\tBinary: " +
      number.toString(2)
  );
}

export function returnByteString(address: number): string {
  return MainMemory.memory[address].toString(2);
}

export function printByteRange(address: number, range: number) {
  const upperBoundExclusive = address + range;
  if (upperBoundExclusive >= MainMemory.memory.length - 1) {
    return console.log("Range out of bounds");
  }
  for (let i = address; i < upperBoundExclusive; i++) {
    printByte(i);
  }
}

export function loadByte(address: number): number {
  return MainMemory.memory[address];
}

function checkMemoryBounds(address: number, range: number) {
  const MaxIndex = address + range - 1;
  if (MaxIndex >= MainMemory.memory.length) {
    throw new Error("load out of memory bounds");
  }
}

export function doubleString(address: number): number {
  //check range
  checkMemoryBounds(address, 4);

  let wordString = "";

  for (let i = 3; i >= address; i--) {
    const byteValue = MainMemory.memory[address + i];
    wordString += getByteString(byteValue);
  }

  console.log(wordString);
  return getTwosComplementBinaryStringValue(wordString);
}

export function loadWord(address: number): number {
  //check range
  checkMemoryBounds(address, 4);

  let wordString = "";

  for (let i = 3; i >= address; i--) {
    const byteValue = MainMemory.memory[address + i];
    wordString += getByteString(byteValue);
  }

  console.log(wordString);
  return getTwosComplementBinaryStringValue(wordString);
}

export function loadDouble(address: number): number {
  //check range
  checkMemoryBounds(address, 8);

  let doubleString = "";

  for (let i = 7; i >= address; i--) {
    const byteValue = MainMemory.memory[address + i];
    doubleString += getByteString(byteValue);
  }

  console.log(doubleString);
  return getTwosComplementBinaryStringValue(doubleString);
}

export function testLoad() {
  for (let i = -128; i <= 127; i++) {
    for (let j = -128; j <= 127; j++) {
      for (let k = -128; k <= 127; k++) {
        for (let l = -128; l <= 127; l++) {
          setByte(0, i);
          setByte(1, j);
          setByte(2, k);
          setByte(3, l);
          const result = doubleString(0);

          //verify that doubleString produces correct value
        }
      }
    }
  }
}

function getTwosComplementBinaryStringValue(binaryString: string) {
  for (let i = 0; i < binaryString.length; i++) {
    if (binaryString[i] != "0" && binaryString[i] != "1") {
      throw new Error("Not binary String");
    }
  }

  //get smallest sign bit if starts with 1
  let minimumSignedBitPosition = 0;

  for (let i = 0; i < binaryString.length - 1; i++) {
    if (binaryString[i] != binaryString[i + 1]) break;

    minimumSignedBitPosition = i + 1;
  }

  let value = 0;
  for (let i = binaryString.length - 1; i >= minimumSignedBitPosition; i--) {
    let positionValue =
      Math.pow(2, binaryString.length - 1 - i) * parseInt(binaryString[i]);
    if (i == minimumSignedBitPosition && binaryString[i] == "1") {
      positionValue = -positionValue;
    }

    value += positionValue;
  }
  return value;
}

function getByteString(value: number): string {
  let byteString = "";

  //get sign magnitude form
  const signMagnitudeString = value.toString(2);

  //tostring for whole value --> tala3 string of binary rep
  //split into bytes --> a5ad each byte men el string
  //parseInt for each byte
  if (signMagnitudeString[0] == "-") {
    //find the unsigned number that maps to the same intenal binary representation
    // as the 2's complement negative binary number provided.
    const unsignedValue = value + (1 << 8);
    byteString = unsignedValue.toString(2);
  } else {
    byteString = signMagnitudeString.padStart(8, "0");
  }

  return byteString;
}

export function storeDouble(value: number, address: number) {
  const bitRep = value.toString(2);
  console.log(bitRep);
  if (bitRep.length > 64 && !(bitRep.length == 65 && bitRep[0] == "-")) {
    throw new Error("Double is not 64 bit representable");
  }

  const slicedBitRep = convertToTwoComplement(value, 64);
  // const slicedBitRep = bitRep.padStart(64, '0');
  for (let i = 0; i < 8; i++) {
    MainMemory.memory[address + (7 - i)] = parseInt(
      slicedBitRep.slice(i * 8, (i + 1) * 8),
      2
    );
    console.log(
      `Bit Representation: ${slicedBitRep.slice(i * 8, (i + 1) * 8)}`
    );
    console.log(
      `Parsed Int: ${parseInt(slicedBitRep.slice(i * 8, (i + 1) * 8), 2)}`
    );
    console.log(
      `Main Memory at Address ${address + (7 - i)}: ${
        MainMemory.memory[address + (7 - i)]
      }`
    );
  }
}

export function convertToTwoComplement(value: number, padding: number): string {
  if (padding === 32) {
    return value < 0
      ? (0xffffffff + value + 1).toString(2)
      : value.toString(2).padStart(32, "0");
  } else {
    return value < 0
      ? (0xffffffffffffffffn + BigInt(value) + 1n).toString(2)
      : value.toString(2).padStart(64, "0");
  }
}

export function storeWord(value: number, address: number) {
  const bitRep = value.toString(2);
  if (bitRep.length > 32 && !(bitRep.length == 33 && bitRep[0] == "-")) {
    console.log(`BitRep > 32: ${bitRep}`);

    throw new Error("Word is not 32 bit representable");
  }

  const slicedBitRep = convertToTwoComplement(value, 32);
  // const slicedBitRep = bitRep.padStart(32, '0');
  for (let i = 0; i < 4; i++) {
    MainMemory.memory[address + (3 - i)] = parseInt(
      slicedBitRep.slice(i * 8, (i + 1) * 8),
      2
    );
    console.log(
      `Bit Representation: ${slicedBitRep.slice(i * 8, (i + 1) * 8)}`
    );
    console.log(
      `Parsed Int: ${parseInt(slicedBitRep.slice(i * 8, (i + 1) * 8), 2)}`
    );
    console.log(
      `Main Memory at Address ${address + (3 - i)}: ${
        MainMemory.memory[address + (3 - i)]
      }`
    );
  }
}

//testing toString and parseInt complementarity
const number = -5;

const numberBinaryString = number.toString(2);

console.log(numberBinaryString);

// const convertedNumber = parseInt(numberBinaryString, 2);
// const isEqual = number == convertedNumber;

// console.log(
//   "Number: " +
//     number +
//     "\ttoString then parseInt: " +
//     convertedNumber +
//     "\tEquality: " +
//     isEqual
// );
