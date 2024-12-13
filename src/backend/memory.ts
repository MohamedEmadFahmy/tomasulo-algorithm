import { InstructionTypeEnum, Memory, SystemCache } from "./types";
// import { userInput } from "./tomasulo";
/* conventions:
 * 1. Memory is byte addressable
 * 2. All numbers are in 8-bit two's complement
 * 3. A Word is stored in 4 bytes and the least significant byte is stored at the lowest address
 * 4. The memory is 2048 bytes long
 * 5. When using a SW the word needs to be 32bit representable otherwise most significant bytes are set to 0
 * 6. We do not treat floating point specially, they are stored as rounded integers
 * 7. Write Through Policy
 * 8. Cache Fully Associative
 * 9. Memory and Cache are word alligned, can only load and store at multiples of 4 and 8
 */

const userInput = {
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
		{
			type: InstructionTypeEnum.DSUBI,
			d: "R2",
			s: "R1",
			t: "10",
			latency: 2,
		},
		{
			type: InstructionTypeEnum.ADD_D,
			d: "F1",
			s: "F2",
			t: "F3",
			latency: 2,
		},
		{
			type: InstructionTypeEnum.ADD_S,
			d: "F1",
			s: "F2",
			t: "F3",
			latency: 2,
		},
		{
			type: InstructionTypeEnum.SUB_D,
			d: "F1",
			s: "F2",
			t: "F3",
			latency: 2,
		},
		{
			type: InstructionTypeEnum.SUB_S,
			d: "F1",
			s: "F2",
			t: "F3",
			latency: 2,
		},
		{
			type: InstructionTypeEnum.MUL_D,
			d: "F1",
			s: "F2",
			t: "F3",
			latency: 2,
		},
		{
			type: InstructionTypeEnum.MUL_S,
			d: "F1",
			s: "F2",
			t: "F3",
			latency: 2,
		},
		{
			type: InstructionTypeEnum.DIV_D,
			d: "F1",
			s: "F2",
			t: "F3",
			latency: 2,
		},
		{
			type: InstructionTypeEnum.DIV_S,
			d: "F1",
			s: "F2",
			t: "F3",
			latency: 2,
		},
		{ type: InstructionTypeEnum.LW, d: "R1", s: "R2", t: "10", latency: 2 },
		{ type: InstructionTypeEnum.LD, d: "R1", s: "R2", t: "10", latency: 2 },
		{
			type: InstructionTypeEnum.L_D,
			d: "F1",
			s: "F2",
			t: "10",
			latency: 2,
		},
		{
			type: InstructionTypeEnum.L_S,
			d: "F1",
			s: "F2",
			t: "10",
			latency: 2,
		},
		{ type: InstructionTypeEnum.SW, d: "R1", s: "R2", t: "10", latency: 2 },
	],
};

// User Input variables

const cacheSize: number = userInput.cacheSize; //No Of Blocks
const cacheBlockSize: number = userInput.cacheBlockSize; //Size Of Block
// Global variables

const memorySize: number = 2048;
let cacheMissFlag: boolean = false;
export const cacheHitLatency: number = 0;

// set cycle remaining of load and store instructions to cacheMissPenalty
export const cacheMissPenalty: number = 1;

let PC = 0;

//memory

export const MainMemory: Memory = {
	memory: new Int8Array(memorySize),
};

export const InstructionMemory = {
	//an array of all instructions entered by the user
	instructions: userInput.programInstructions,
	PC: PC,
};

//instruction memory

export const DataCache: DataCache = {
	cache: [],
};

export function initMemory() {
	for (let i = 0; i < MainMemory.memory.length; i++) {
		MainMemory.memory[i] = 0;
	}
}

export function initCache() {
	for (let i = 0; i < cacheSize; i++) {
		DataCache.cache[i] = {
			address: [-1, -1],
			data: new Int8Array(cacheBlockSize),
		};
	}
}

// ***************** Load and Store Functions *****************

// Load Functions

export function loadWordCache(address: number): number {
	if (checkForCacheMiss(address)) {
		console.log("Entered in read");
		//store the block in first empty position in cache
		const blockIndex = findEmptyBlockInCache();
		DataCache.cache[blockIndex].address = [
			address,
			address + cacheBlockSize - 1,
		];
		fetchBlockfromMem(address, blockIndex);
	}
	return readWordFromCache(address);
}

export function loadDoubleCache(address: number) {
	if (checkForCacheMiss(address)) {
		const blockIndex = findEmptyBlockInCache();
		DataCache.cache[blockIndex].address = [
			address,
			address + cacheBlockSize - 1,
		];
		fetchBlockfromMem(address, blockIndex);
	}
	return readDoubleFromCache(address);
}

// Store Functions

export function storeWordCache(value: number, address: number) {
	if (checkForCacheMiss(address)) {
		//store the block in first empty position in cache
		const blockIndex = findEmptyBlockInCache();
		DataCache.cache[blockIndex].address = [
			address,
			address + cacheBlockSize - 1,
		];
		writeThrough32(value, address);
		fetchBlockfromMem(address, blockIndex);
	} else {
		// Write Thr\
		writeWordOnCache(value, address);
		writeThrough32(value, address);
	}
}

export function storeDoubleCache(value: number, address: number) {
	if (checkForCacheMiss(address)) {
		//store the block in first empty position in cache
		const blockIndex = findEmptyBlockInCache();
		DataCache.cache[blockIndex].address = [
			address,
			address + cacheBlockSize - 1,
		];
		writeThrough64(value, address);
		fetchBlockfromMem(address, blockIndex);
	} else {
		// Write Thr\
		writeDoubleOnCache(value, address);
		writeThrough64(value, address);
	}
}

// ***************** Helper Functions *****************

export function printMemory() {
	for (let i = 0; i < MainMemory.memory.length; i++) {
		printByte(i);
	}
}

export function printCache() {
	for (let i = 0; i < DataCache.cache.length; i++) {
		console.log(`Block Number ${i}: `);
		console.log(`Block Bytes: `);
		for (let j = 0; j < cacheBlockSize; j++) {
			console.log(`Byte ${j}:  ${DataCache.cache[i].data[j]}`);
		}
		console.log("*****************");
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

function fetchBlockfromMem(address: number, blockIndex: number) {
	for (let j = 0; j < cacheBlockSize; j++) {
		if (address + j < memorySize)
			console.log(
				"Current main memory content: " + MainMemory.memory[address + j]
			);
		DataCache.cache[blockIndex].data[j] = MainMemory.memory[address + j];
		console.log(
			`Cache content at blockIndex: ${blockIndex} byteIndex: ${j} is: ${DataCache.cache[blockIndex].data[j]}`
		);
	}
}

function findEmptyBlockInCache(): number {
	for (let blockIndex = 0; blockIndex < cacheSize; blockIndex++) {
		if (
			DataCache.cache[blockIndex].address[0] === -1 &&
			DataCache.cache[blockIndex].address[1] === -1
		) {
			return blockIndex;
		}
	}
	return -1;
}

function findBlockIndex(address: number): number {
	for (let i = 0; i < cacheSize; i++) {
		if (checkIfAddressIsInRange(address, DataCache.cache[i].address)) {
			return i;
		}
	}
	return -1;
}

function getByteArray(value: number, size: number): Int8Array {
	const byteArray = new Int8Array(4);
	const slicedBitRep = convertToTwoComplement(value, 32);
	// const slicedBitRep = bitRep.padStart(32, '0');
	for (let i = 0; i < size; i++) {
		byteArray[3 - i] = parseInt(slicedBitRep.slice(i * 8, (i + 1) * 8), 2);
	}
	return byteArray;
}

function writeWordOnCache(value: number, address: number) {
	console.log(`Entered writeWordOnCache: value: ${value}`);
	const blockIndex = findBlockIndex(address);
	for (let i = 0; i < cacheBlockSize; i++) {
		if (address === DataCache.cache[blockIndex].address[0] + i) {
			const valueByteArray = getByteArray(value, 4);
			console.log(`valueByteArray: ${valueByteArray}`);
			//220 - 200 = 20
			const startingBlockAddress =
				address - DataCache.cache[blockIndex].address[0];
			console.log(`startingBlockAddress: ${startingBlockAddress}`);
			// console.log(`DataCache.cache[blockIndex].address[0] - 1`);
			for (let j = 0; j < valueByteArray.length; j++) {
				DataCache.cache[blockIndex].data[startingBlockAddress + j] =
					valueByteArray[j];
				console.log(
					`Cache content at writeWordOnCache blockIndex: ${blockIndex} byteIndex: ${j} is: ${
						DataCache.cache[blockIndex].data[
							startingBlockAddress + j
						]
					}`
				);
			}
		}
	}
}

function writeDoubleOnCache(value: number, address: number) {
	const blockIndex = findBlockIndex(address);
	for (let i = 0; i < cacheBlockSize; i++) {
		if (address === DataCache.cache[blockIndex].address[0] + i) {
			const valueByteArray = getByteArray(value, 8);
			//220 - 200 = 20
			const startingBlockAddress =
				address - DataCache.cache[blockIndex].address[0] - 1;
			for (let j = 0; j < valueByteArray.length; j++) {
				DataCache.cache[blockIndex].data[startingBlockAddress + j] =
					valueByteArray[j];
			}
		}
	}
}

function readWordFromCache(address: number): number {
	const blockIndex = findBlockIndex(address);
	const returnedArray = new Int8Array(4);

	for (let i = 0; i < cacheBlockSize; i++) {
		if (address === DataCache.cache[blockIndex].address[0] + i) {
			const startingBlockAddress =
				address - DataCache.cache[blockIndex].address[0];
			for (
				let j = startingBlockAddress;
				j <= startingBlockAddress + 3;
				j++
			) {
				returnedArray[j - startingBlockAddress] =
					DataCache.cache[blockIndex].data[j];
			}
			break;
		}
	}

	console.log(returnedArray);

	return getValue(returnedArray, 4);
}

function readDoubleFromCache(address: number): number {
	const blockIndex = findBlockIndex(address);
	const returnedArray = new Int8Array(8);

	for (let i = 0; i < cacheBlockSize; i++) {
		if (address === DataCache.cache[blockIndex].address[0] + i) {
			const startingBlockAddress =
				address - DataCache.cache[blockIndex].address[0];
			for (
				let j = startingBlockAddress;
				j <= startingBlockAddress + 7;
				j++
			) {
				returnedArray[j - startingBlockAddress] =
					DataCache.cache[blockIndex].data[j];
			}
			break;
		}
	}

	return getValue(returnedArray, 8);
}

function checkIfAddressIsInRange(address: number, range: [number, number]) {
	if (address <= range[1] && address >= range[0]) {
		return true;
	} else {
		return false;
	}
}

function writeThrough32(value: number, address: number) {
	storeWord(value, address);
}

function writeThrough64(value: number, address: number) {
	storeDouble(value, address);
}

export function checkForCacheMiss(address: number) {
	for (let i = 0; i < cacheSize; i++) {
		if (checkIfAddressIsInRange(address, DataCache.cache[i].address)) {
			cacheMissFlag = false;
			return false;
		}
	}
	cacheMissFlag = true;
	return true;
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

	// console.log(wordString);
	return getTwosComplementBinaryStringValue(wordString);
}

export function getValue(wordBytes: Int8Array, size: number): number {
	let valueString = "";

	for (let i = size - 1; i >= 0; i--) {
		const byteValue = wordBytes[i];
		valueString += getByteString(byteValue);
	}

	return getTwosComplementBinaryStringValue(valueString);
}

export function loadWord(address: number): number {
	//check range
	checkMemoryBounds(address, 4);
	// console.log("miss: " + cacheMissFlag);
	let wordString = "";

	for (let i = 3 + address; i >= address; i--) {
		const byteValue = MainMemory.memory[address + i];
		wordString += getByteString(byteValue);
	}

	return getTwosComplementBinaryStringValue(wordString);
}

export function loadDouble(address: number): number {
	//check range
	checkMemoryBounds(address, 8);

	let doubleString = "";

	for (let i = 7 + address; i >= address; i--) {
		const byteValue = MainMemory.memory[address + i];
		doubleString += getByteString(byteValue);
	}

	// console.log(doubleString);
	return getTwosComplementBinaryStringValue(doubleString);
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
			Math.pow(2, binaryString.length - 1 - i) *
			parseInt(binaryString[i]);
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
	// console.log(bitRep);
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
		// console.log(
		//   `Bit Representation: ${slicedBitRep.slice(i * 8, (i + 1) * 8)}`
		// );
		// console.log(
		//   `Parsed Int: ${parseInt(slicedBitRep.slice(i * 8, (i + 1) * 8), 2)}`
		// );
		// console.log(
		//   `Main Memory at Address ${address + (7 - i)}: ${
		//     MainMemory.memory[address + (7 - i)]
		//   }`
		// );
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
		// console.log(`BitRep > 32: ${bitRep}`);

		throw new Error("Word is not 32 bit representable");
	}

	const slicedBitRep = convertToTwoComplement(value, 32);
	// const slicedBitRep = bitRep.padStart(32, '0');
	for (let i = 0; i < 4; i++) {
		MainMemory.memory[address + (3 - i)] = parseInt(
			slicedBitRep.slice(i * 8, (i + 1) * 8),
			2
		);
		// console.log(
		//   `Bit Representation: ${slicedBitRep.slice(i * 8, (i + 1) * 8)}`
		// );
		// console.log(
		//   `Parsed Int: ${parseInt(slicedBitRep.slice(i * 8, (i + 1) * 8), 2)}`
		// );
		// console.log(
		//   `Main Memory at Address ${address + (3 - i)}: ${
		//     MainMemory.memory[address + (3 - i)]
		//   }`
		// );
	}
}

// //testing toString and parseInt complementarity
// const number = -5;

// const numberBinaryString = number.toString(2);

// console.log(numberBinaryString);

// // const convertedNumber = parseInt(numberBinaryString, 2);
// // const isEqual = number == convertedNumber;

// // console.log(
// //   "Number: " +
// //     number +
// //     "\ttoString then parseInt: " +
// //     convertedNumber +
// //     "\tEquality: " +
// //     isEqual
// // );
