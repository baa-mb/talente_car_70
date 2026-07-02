input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    gang = (gang + 1) % 6
    music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    basic.showNumber(gang)
})
function berechne_rad_werte() {
    kurve_links = kurve_rad * -1
    kurve_rechts = kurve_rad
    gerade_links = gerade_rad * rad_links_korrektur
    gerade_rechts = gerade_rad
    links_soll = Math.round(gerade_links - kurve_rechts)
    rechts_soll = Math.round(gerade_rechts - kurve_links)
}
// robotbit.Servo(robotbit.Servos.S1, 0)
function init() {
    basic.showIcon(IconNames.Diamond)
    hebe_winkel = 70
    motor_rechts = robotbit.Motors.M1A
    motor_links = robotbit.Motors.M2B
    robotbit.MotorStopAll()
}
radio.onReceivedValue(function (info, wert) {
    // grenze = 205 + gang * 10
    // serial.writeValue("kurve_rad", kurve_rad)
    if (info == "gerade") {
        gerade_get = wert
        gerade_rad = Math.round(Math.map(gerade_get, -45, 45, -1 * grenze, grenze))
    } else if (info == "kurve") {
        kurve_get = wert
        kurve_rad = Math.round(Math.map(kurve_get, -45, 45, -255, 255))
    } else if (info == "get_dist") {
        radio.sendValue("distanz", sonar.ping(
            DigitalPin.P1,
            DigitalPin.P2,
            PingUnit.Centimeters
        ))
    }
})
let kurve_get = 0
let gerade_get = 0
let hebe_winkel = 0
let rechts_soll = 0
let links_soll = 0
let gerade_rechts = 0
let gerade_rad = 0
let gerade_links = 0
let kurve_rechts = 0
let kurve_rad = 0
let kurve_links = 0
let gang = 0
let grenze = 0
let rad_links_korrektur = 0
let rad_links = 0
let rad_rechts = 0
let motor_links = 0
let motor_rechts = 0
let links_ist = 0
let rechts_ist = 0
rad_links_korrektur = 1
grenze = 255
radio.setGroup(99)
rad_links_korrektur = 1
let feinheit = 0.5
let schritte = 12
init()
basic.forever(function () {
    berechne_rad_werte()
    if (links_ist < links_soll) {
        links_ist = Math.min(links_ist + schritte, links_soll)
    } else if (links_ist > links_soll) {
        links_ist = Math.max(links_ist - schritte, links_soll)
    }
    if (rechts_ist < rechts_soll) {
        rechts_ist = Math.min(rechts_ist + schritte, rechts_soll)
    } else if (rechts_ist > rechts_soll) {
        rechts_ist = Math.max(rechts_ist - schritte, rechts_soll)
    }
    if (links_soll == 0 && rechts_soll == 0 && links_ist == 0 && rechts_ist == 0) {
        robotbit.MotorStopAll()
    } else {
        robotbit.MotorRun(motor_links, links_ist)
        robotbit.MotorRun(motor_rechts, rechts_ist)
    }
    basic.pause(5)
})