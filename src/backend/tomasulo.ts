import { Memory } from "./types";

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

//memory

const MainMemory: Memory = {
    memory: new Int8Array(2048),
}

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
                slicedBitRep = bitRep.slice(slicedBitRep.length - ((i + 1) * 8), slicedBitRep.length);
                remBits = bitRep.slice(0, bitRep.length - ((i + 1) * 8));
                console.log(`SlicedBitRep2 : ${slicedBitRep}`);
            }
            else {
                slicedBitRep = slicedBitRep.padStart(8, '0');
                remBits = "NONE";
                console.log(`SlicedBitRep3 : ${slicedBitRep}`);
            }
        }
        else {
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
    }
    else {
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
    }
    else {
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
        return value < 0 ? (0xFFFFFFFF + value + 1).toString(2) : value.toString(2).padStart(32, '0');
    }
    else  {
        return value < 0 ? (0xFFFFFFFFFFFFFFFFn + BigInt(value) + 1n).toString(2) : value.toString(2).padStart(64, '0');
    }
}
