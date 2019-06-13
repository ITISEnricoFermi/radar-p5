import P5 from 'p5'

class Radar {
  constructor (divId, data) {
    this.p = new P5(this._sketch, divId)
    this.p.radar = this

    this.data = data

    this.animationAngle = 0
    this.animationSpeed = 0.1
    this.range = 2000
    this.targetRange = 2000
  }

  draw () {
    // this.data.targetAngle += Math.random()
    if (this.data.targetAngle >= 360) this.data.targetAngle = 0

    // this.data.targetDistance += Math.random() * 50 - 25

    if (this.targetRange !== this.range) { this.range += (this.targetRange - this.range) * 0.1 }

    this.setRange(this.data.targetDistance * 2)

    const p = this.p
    const size = p.width
    p.background(0, 0, 0, 5)

    // Scan line
    p.strokeWeight(5)
    p.stroke(0, 100, 0)
    p.fill(0, 100, 0)
    p.triangle(
      Math.cos(this.animationAngle) * size,
      Math.sin(this.animationAngle) * size,
      Math.cos(this.animationAngle + this.animationSpeed + 1) * size,
      Math.sin(this.animationAngle + this.animationSpeed + 1) * size,
      0, 0
    )

    // Circles
    p.stroke(0, 255, 0)
    p.strokeWeight(1)
    p.noFill()
    for (let i = 1; i <= Math.floor(this.range / this.getCircleInterval()); i++) {
      p.ellipse(0, 0, size / (this.range / this.getCircleInterval()) * i)
    }

    // Crosshair
    p.line(-p.width / 2, 0, p.width / 2, 0)
    p.line(0, -p.height / 2, 0, p.height / 2)

    // Target
    p.strokeWeight(0)
    p.stroke(0)
    p.fill(0, 255, 0)
    if (Math.abs(Math.sin(this.data.targetAngle) - Math.sin(-this.animationAngle)) < 0.7 &&
            Math.abs(Math.cos(this.data.targetAngle) - Math.cos(this.animationAngle)) < 0.7) {
      p.ellipse(
        Math.cos(this.data.targetAngle) * (size / 2) * (this.data.targetDistance / this.range),
        -Math.sin(this.data.targetAngle) * (size / 2) * (this.data.targetDistance / this.range),
        20)
    }

    this.animationAngle += this.animationSpeed
    if (this.animationAngle >= 2 * Math.PI) this.animationAngle = 0
  }

  getCircleInterval () {
    let ctr = 0
    for (let i = this.range; i > 10; i = Math.floor(i / 10)) {
      ctr++
    }
    return Math.pow(10, ctr)
  }

  setRange (r) {
    this.targetRange = r
  }

  updateSize () {
    this.p.resizeCanvas(
      this.p.canvas.parentElement.offsetWidth,
      this.p.canvas.parentElement.offsetHeight)
  }

  setTargetData (angle, distance) {
    this.data.targetAngle = angle
    this.data.targetDistance = distance
  }

  _sketch (p) {
    p.setup = () => {
      p.radar.updateSize()
    }
    p.draw = () => {
      p.angleMode(p.DEGREES)
      p.translate(p.width / 2, p.height / 2)
      p.radar.draw()
    }
  }
}

export default Radar
