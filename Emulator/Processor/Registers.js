import {Register} from './Register.js'
import {CPUError} from "./CPU.js";

export class Registers {
    constructor() {
        this.registers = [
            new Register('RAX', 'EAX', 'AX', 'AH', 'AL'),
            new Register('RBX', 'EBX', 'BX', 'BH', 'BL'),
            new Register('RCX', 'ECX', 'CX', 'CH', 'CL'),
            new Register('RDX', 'EDX', 'DX', 'DH', 'DL'),
            new Register('RSI', 'ESI', 'SI', null, 'SIL'),
            new Register('RSP', 'ESP', 'SP', null, 'SPL'),
            new Register('RBP', 'EBP', 'BP', null, 'BPL'),
            new Register('RIP', 'EIP', 'IP', null, null),
            new Register('RDI', 'EDI', 'DI', null, null)
        ];

        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notify(reg, value) {
        this.subscribers.forEach((callback) => {
            callback(reg, value);
        });
    }

    notifyAll() {
        this.subscribers.forEach((callback) => {
            this.registers.forEach((register) => {
                callback(register.name64, register.value);
            });
        });
    }

    reg(name) {
        var retVal = undefined;

        this.registers.forEach((register) => {
            let value = register.valueOf(name);

            if (value !== undefined) {
                retVal = value;
            }
        });

        if (retVal === undefined) {
            throw new CPUError("Tried to access nonexistent register: " + name);
        }

        return retVal;
    }

    setReg(name, value) {
        this.registers.forEach((register) => {
            if (register.setReg(name, value) === true) {
                this.notify(register.name64, value);
                this.notify(register.name32, value);
                this.notify(register.name16 ? register.name16 : "", value);
                this.notify(register.name8hi ? register.name8hi : "", value);
                this.notify(register.name8 ? register.name8 : "", value);
            }
        });
    }

    regByteLen(name) {
        var retVal = undefined;

        this.registers.forEach((register) => {
            let value = register.byteLengthOf(name);

            if (value !== undefined) {
                retVal = value;
            }
        });

        if (retVal === undefined) {
            throw CPUError("Tried to access nonexistent register: " + name);
        }

        return retVal;
    }
}