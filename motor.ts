enum Motor {
    //% block="left"
    LEFT = 0,
    //% block="right"
    RIGHT = 1
}

enum MotorDirection {
    //% block="forward"
    FORWARD = 0,
    //% block="reverse"
    REVERSE = 1
}

enum MotorPower {
    //% block="on"
    ON,
    //% block="off"
    OFF
}

//% weight=13 color=#ffd43a icon=""
namespace motor {
    let motorState: MotorPower = MotorPower.ON

    /**
     *Turns the left motor at a specified speed
        */
    //% block
    //% blockId=motion_turn_left block="turn left motor at |speed: %speed"
    //% speed.min=-100 speed.max=100
    //% weight=60
    export function turnLeft(speed: number): void {
        motorControl(Motor.RIGHT, 0)
        motorControl(Motor.LEFT, speed)
    }

    /**
     *Turns the right motor at a specified speed
        */
    //% block
    //% blockId=motion_turn_right block="turn right motor at |speed: %speed"
    //% speed.min=-100 speed.max=100
    //% weight=50
    export function turnRight(speed: number): void {
        motorControl(Motor.RIGHT, speed)
        motorControl(Motor.LEFT, 0)
    }

    /**
     *Stop the motors
    */
    //% block
    //% blockId=motion_stop block="stop motors"
    //% weight=45
    export function stop(): void {
        motorControl(Motor.LEFT, 0)
        motorControl(Motor.RIGHT, 0)
    }

    /**
    * Control both wheels in one function.
    * Speeds range from -100 to 100.
    * Negative speeds go backwards, positive go forwards.
    */
    //% block
    //% blockId=motion_drive block="drive |left: %leftWheelSpeed|right: %rightWheelSpeed"
    //% leftWheelSpeed.min=-100 leftWheelSpeed.max=100
    //% rightWheelSpeed.min=-100 rightWheelSpeed.max=100
    //% weight=40
    export function drive(leftWheelSpeed: number, rightWheelSpeed: number): void {
        motorControl(Motor.LEFT, leftWheelSpeed)
        motorControl(Motor.RIGHT, rightWheelSpeed)
    }

    /**
    * Turn the motors on/off - default on
    */
    //% block
    //% blockId=motion_power block="turn motors |power: %power"
    //% weight=20
    export function setPowers(power: MotorPower): void {
        if (power == MotorPower.OFF) {
            motor.stop()
        }
        motorState = power
    }

    /**
     * Advanced control of an individual motor. PWM is set to constant value.
     */
    function motorControl(whichMotor: Motor, speed: number): void {
        let motorSpeed: number
        let direction: MotorDirection

        if (motorState == MotorPower.OFF) {
            return
        }

        direction = speed < 0 ? MotorDirection.REVERSE : MotorDirection.FORWARD
        speed = Math.abs(speed)

        motorSpeed = remapSpeed(speed)

        if (whichMotor == Motor.LEFT) {
            pins.digitalWritePin(cak.M1_DIR, direction)
            pins.analogSetPeriod(cak.M1_PWR, 1024)
            pins.analogWritePin(cak.M1_PWR, motorSpeed)
        } else {
            pins.digitalWritePin(cak.M2_DIR, direction)
            pins.analogSetPeriod(cak.M2_PWR, 1024)
            pins.analogWritePin(cak.M2_PWR, motorSpeed)
        }
    }

    // Rescale values from 0 - 100 to 0 - 1023
    function remapSpeed(s: number): number {
        let returnSpeed: number
        if (s <= 0) {
            returnSpeed = 0
        } else if (s >= 100) {
            returnSpeed = 1023
        } else {
            returnSpeed = (23200 + (s * 791)) / 100
        }
        return returnSpeed;
    }
}
