export default class Movements {
    t = 0.2;
    particlesRadius = 0.1;
    g = 0.1; 
    constructor() {}

    resolveCollision(p1, p2) {
        const distance = this.distance(p1, p2);

        if (distance <= this.particlesRadius && distance > 0) {
            const r = [
                p2.x - p1.x,
                p2.y - p1.y,
                p2.z - p1.z,
            ];
            const v = [
                0 - p1.vx,
                0 - p1.vy,
                0 - p1.vz,
            ];

            const rNorm = Math.sqrt(r[0] ** 2 + r[1] ** 2 + r[2] ** 2);
            const rUnit = r.map((val) => (val / rNorm) * 0.995);
            const vDotR = v[0] * rUnit[0] + v[1] * rUnit[1] + v[2] * rUnit[2];

            const massSum = 0.2;
            const massDiff1 = 0.1 / massSum;

            p1.vx += massDiff1 * vDotR * rUnit[0];
            p1.vy += massDiff1 * vDotR * rUnit[1];
            p1.vz += massDiff1 * vDotR * rUnit[2];

        }
    }

    calculate(particles, coordinates) {
        particles.forEach((particle) => {
            this.velocityVector(particle);

            coordinates.forEach((coord) => {
                if (this.detectCollision(particle, coord)) {
                    this.resolveCollision(particle, coord);
                }
            });
        });

        return particles;
    }

    velocityVector(particle) {
        const ax = 0;
        const ay = -this.g;
        const az = 0;

        particle.x += particle.vx * this.t + 0.5 * ax * this.t ** 2;
        particle.y += particle.vy * this.t + 0.5 * ay * this.t ** 2;
        particle.z += particle.vz * this.t + 0.5 * az * this.t ** 2;

        particle.vx += ax * this.t;
        particle.vy += ay * this.t;
        particle.vz += az * this.t;

        return particle;
    }

    detectCollision(p1, p2) {
        return this.distance(p1, p2) <= this.particlesRadius;
    }

    distance(p1, p2) {
        return Math.sqrt(
            (p1.x - p2.x) ** 2 +
            (p1.y - p2.y) ** 2 +
            (p1.z - p2.z) ** 2
        );
    }
}
