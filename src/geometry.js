class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return Vector2(this.x + v.x, this.y + v.y)
    }
    divide(r) {
        return Vector2(this.x / r, this.y / r)
    }
    multiply(r) {
        return Vector2(this.x * r, this.y * r)
    }

}

class Triangle {
    constructor(v1, v2, v3, color) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.color = color;
    }

    toString() {
        return "Triangle with color: " + this.color + " contains the verticies: (" + this.v1.toString() + "," + this.v2.toString() + "," + this.v3.toString() + ")"
    }
}

class Mesh {
  constructor(name, triangles) {
    this.name = name;
    this.triangles = triangles;
    this.type = "Mesh"
  }

  toString() {
    return "\"" + this.name + "\" Num triangles: " + (this.triangles.length - 1);
  }

  rotateYaw(degrees) {
      let transformMatrix = new Matrix44();
      transformMatrix.setMatrixYawRotation(degrees_to_radians(degrees))
      this.triangles.forEach(tri => {
        tri.v1 = transformMatrix.multDirectionMatrix(tri.v1);
        tri.v2 = transformMatrix.multDirectionMatrix(tri.v2);
        tri.v3 = transformMatrix.multDirectionMatrix(tri.v3);
      });
  }

  rotatePitch(degrees) {
    let transformMatrix = new Matrix44();
    transformMatrix.setMatrixPitchRotation(degrees_to_radians(degrees))
    this.triangles.forEach(tri => {
      tri.v1 = transformMatrix.multDirectionMatrix(tri.v1);
      tri.v2 = transformMatrix.multDirectionMatrix(tri.v2);
      tri.v3 = transformMatrix.multDirectionMatrix(tri.v3);
    });
  }

  rotateRoll(degrees) {
    let transformMatrix = new Matrix44();
    transformMatrix.setMatrixRollRotation(degrees_to_radians(degrees))
    this.triangles.forEach(tri => {
      tri.v1 = transformMatrix.multDirectionMatrix(tri.v1);
      tri.v2 = transformMatrix.multDirectionMatrix(tri.v2);
      tri.v3 = transformMatrix.multDirectionMatrix(tri.v3);
    });
  }
}

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

//Returns array of Vector3s inside the triangle made from the 3 (Vecto3) inputs
function getPointsInsideTriangle(point1, point2, point3) {
  // Find the bounding box of the triangle
  const xMin = Math.min(point1.x, point2.x, point3.x);
  const xMax = Math.max(point1.x, point2.x, point3.x);
  const yMin = Math.min(point1.y, point2.y, point3.y);
  const yMax = Math.max(point1.y, point2.y, point3.y);
  const zMin = Math.min(point1.z, point2.z, point3.z);
  const zMax = Math.max(point1.z, point2.z, point3.z);

  // Find all the points within the bounding box
  const points = [];
  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      for (let z = zMin; z <= zMax; z++) {
        // Check if the point is inside the triangle
        if (isPointInTriangle(new Vector3(x, y, z), point1, point2, point3)) {
          points.push(new Vector3(x, y, z));
        }
      }
    }
  }

  return points;
}

//Helper for getPointsInsideTriangle
function isPointInTriangle(point, point1, point2, point3) {
  // Compute the barycentric coordinates of the point with respect to the triangle
  const barycentricCoords = getBarycentricCoords(point, point1, point2, point3);

  // Check if the point is inside the triangle (i.e. the barycentric coordinates are all non-negative)
  return barycentricCoords[0] >= 0 && barycentricCoords[1] >= 0 && barycentricCoords[2] >= 0;
}

//Helper for isPointInTriangle
function getBarycentricCoords(point, point1, point2, point3) {
  // Compute the vectors from the point to the vertices of the triangle
  const v1 = point1.subtract(point);
  const v2 = point2.subtract(point);
  const v3 = point3.subtract(point);

  // Compute the normal vector of the plane of the triangle
  const normal = crossProduct(point2.subtract(point1), point3.subtract(point1));

  // Compute the barycentric coordinates using the formula:
  // alpha = (v2 x v3 . n) / (v1 x v2 x v3 . n)
  // beta = (v3 x v1 . n) / (v1 x v2 x v3 . n)
  // gamma = (v1 x v2 . n) / (v1 x v2 x v3 . n)
  const alpha = dotProduct(crossProduct(v2, v3), normal) / dotProduct(crossProduct(v1, v2, v3), normal);
  const beta = dotProduct(crossProduct(v3, v1), normal) / dotProduct(crossProduct(v1, v2, v3), normal);
  const gamma = dotProduct(crossProduct(v1, v2), normal) / dotProduct(crossProduct(v1, v2, v3), normal);

  return [alpha, beta, gamma];
}

class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        return new Vector3(
            (this.y * v.z - this.z * v.y), 
            (this.z * v.x - this.x * v.z), 
            (this.x * v.y - this.y * v.x)
        )
    }

    length() {
        return Math.sqrt(this.normal())
    }

    normal() {
        return  this.x * this.x + this.y * this.y + this.z * this.z;
    }

    normalize() {
        let n = this.normal();
        if(n > 0) {
            let factor = 1 / Math.sqrt(n);
            this.x *= factor;
            this.y *= factor;
            this.z *= factor;
        }

        return this;
    }

    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
    }

    subtract(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
    }

    multiply(r) {
        return new Vector3(this.x * r, this.y * r, this.z * r)
    }

    toString() {
        return "(" + this.x + "," + this.y + "," + this.z + ")";
    }
}

//Takes 2 Vector3s and returns array of Vector3s between them
function getPointsBetweenVector3(point1, point2) {
  // Calculate the difference between the two points for each dimension
  const diffX = point2.x - point1.x;
  const diffY = point2.y - point1.y;
  const diffZ = point2.z - point1.z;

  // Calculate the distance between the two points
  const distance = Math.sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);

  // Calculate the number of points to generate
  const numPoints = Math.floor(distance / 0.01); // 0.01 is the desired distance between each point

  // Initialize the array of points with the first point
  const points = [point1];

  // Generate the intermediate points
  for (let i = 1; i < numPoints; i++) {
    const t = i / numPoints;
    const x = Math.round(point1.x + t * diffX);
    const y = Math.round(point1.y + t * diffY);
    const z = Math.round(point1.z + t * diffZ);
    points.push(new Vector3(x, y, z));
  }

  // Add the final point to the array
  points.push(point2);

  return points;
}

//Returns the Vector3 that is the cross product of two Vector3s a and b
function crossProduct(a, b) {
    return new Vector3(
        (a.y * b.z - a.z * b.y), 
        (a.z * b.x - a.x * b.z), 
        (a.x * b.y - a.y * b.x)
    )
}

//Returns the dot product of two Vector3s a and b
function dotProduct(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

//Returns the Vector3 that is the sum of adding two Vector3s a and b
function addVectors(a, b) {
    return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z)
}

//Returns the Vector3 that is the sum of subtracting two Vector3s a and b
function subtractVectors(a, b) {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z)
}

//MATRIX

class Matrix44 {
    constructor() {
      this.m = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ];
    }

    toString() {
      let returnString = "Matrix4x4: \n"
      for(let i = 0; i < 4; i++) {
        returnString += '['
        for(let j = 0; j < 4; j++) {
          returnString += this.m[i][j] + ",";
        }
        returnString += ']\n'
      }
      return returnString;
    }

    setMatrixYawRotation(heading) {
      this.m = [
        [Math.cos(heading), -Math.sin(heading), 0, 0],
        [Math.sin(heading), Math.cos(heading), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ];
    } 

    setMatrixPitchRotation(heading) {
      this.m = [
        [Math.cos(heading), 0, Math.sin(heading), 0],
        [0, 1, 0, 0],
        [-Math.sin(heading), 0, Math.cos(heading), 0],
        [0, 0, 0, 1]
      ];
    } 

    setMatrixRollRotation(heading) {
      this.m = [
        [1, 0, 0, 0],
        [0, Math.cos(heading), -Math.sin(heading), 0],
        [0, Math.sin(heading), Math.cos(heading), 0],
        [0, 0, 0, 1]
      ];
    }

    multiply(b) {
        newM = new Matrix44();
        for(let i = 0; i < 4; ++i) {
            for(let j = 0; j < 4; ++j) {
                newM[i][j] = 
                    this.m[i][0] * b.m[0][j] + 
                    this.m[i][1] * b.m[1][j] + 
                    this.m[i][2] * b.m[2][j] + 
                    this.m[i][3] * b.m[3][j];
            }
        }

        return newM;
    }

    getTransposed() {
        newM = new Matrix44();
        for(let i = 0; i < 4; ++i) {
            for(let j = 0; j < 4; ++j) {
                newM.m[i][j] = this[j][i]
            }
        }
        return newM;
    }

    transposeThis() {
        newM = new Matrix44();
        newM.m[0][0] = this.m[0][0];
        newM.m[0][1] = this.m[1][0];
        newM.m[0][2] = this.m[2][0];
        newM.m[0][3] = this.m[3][0];
        newM.m[1][0] = this.m[0][1];
        newM.m[1][1] = this.m[1][1];
        newM.m[1][2] = this.m[2][1];
        newM.m[1][3] = this.m[3][1];
        newM.m[2][0] = this.m[0][2];
        newM.m[2][1] = this.m[1][2];
        newM.m[2][2] = this.m[2][2];
        newM.m[2][3] = this.m[3][2];
        newM.m[3][0] = this.m[0][3];
        newM.m[3][1] = this.m[1][3];
        newM.m[3][2] = this.m[2][3];
        newM.m[3][3] = this.m[3][3];
        this.m = newM.m;
        return this;
    }

    multVectorMatrix(source) {
        let a, b, c, w;
        a = source.x * this.m[0][0] + source.y * this.m[1][0] + source.z * this.m[2][0] + this.m[3][0]
        b = source.x * this.m[0][1] + source.y * this.m[1][1] + source.z * this.m[2][1] + this.m[3][1]
        c = source.x * this.m[0][2] + source.y * this.m[1][2] + source.z * this.m[2][2] + this.m[3][2]
        w = source.x * this.m[0][3] + source.y * this.m[1][3] + source.z * this.m[2][3] + this.m[3][3]

        return new Vector3(a/w, b/w, c/w);
    }

    multDirectionMatrix(source) {
        let x = source.x * this.m[0][0] + source.y * this.m[1][0] + source.z * this.m[2][0]
        let y = source.x * this.m[0][1] + source.y * this.m[1][1] + source.z * this.m[2][1]
        let z = source.x * this.m[0][2] + source.y * this.m[1][2] + source.z * this.m[2][2]

        return new Vector3(x, y, z);
    }

    inverse() {
        let i, j, k;
        let s = new Matrix44();
        let t = this;
      
        // Forward elimination
        for (i = 0; i < 3; i++) {
          let pivot = i;
          let pivotsize = t.m[i][i];
      
          if (pivotsize < 0) {
            pivotsize = -pivotsize;
          }
      
          for (j = i + 1; j < 4; j++) {
            let tmp = t.m[j][i];
      
            if (tmp < 0) {
              tmp = -tmp;
            }
      
            if (tmp > pivotsize) {
              pivot = j;
              pivotsize = tmp;
            }
          }
      
          if (pivotsize == 0) {
            // Cannot invert singular matrix
            return new Matrix44();
          }
      
          if (pivot != i) {
            for (j = 0; j < 4; j++) {
              let tmp;
              tmp = t.m[i][j];
              t.m[i][j] = t.m[pivot][j];
              t.m[pivot][j] = tmp;
      
              tmp = s.m[i][j];
              s.m[i][j] = s.m[pivot][j];
              s.m[pivot][j] = tmp;
            }
          }
      
          for (j = i + 1; j < 4; j++) {
            let f = t.m[j][i] / t.m[i][i];
            for (k = 0; k < 4; k++) {
              t.m[j][k] -= f * t.m[i][k];
              s.m[j][k] -= f * s.m[i][k];
            }
          }
        }
      
        // Backward substitution
        for (i = 3; i >= 0; i--) {
          let f;
          if ((f = t.m[i][i]) == 0) {
            // Cannot invert singular matrix
            return new Matrix44();
          }
      
          for (j = 0; j < 4; j++) {
            t.m[i][j] /= f;
            s.m[i][j] /= f;
          }
      
          for (j = 0; j < i; j++) {
            f = t.m[j][i];
            for (k = 0; k < 4; k++) {
              t.m[j][k] -= f * t.m[i][k];
              s.m[j][k] -= f * s.m[i][k];
            }
          }
        }
      
        return s;
      }

      invert() {
        let returnMatrix = this.inverse();
        return returnMatrix;
      }

}

export {Mesh, Triangle, Vector2, Vector3, Matrix44, crossProduct, dotProduct, addVectors, subtractVectors, getPointsBetweenVector3, getPointsInsideTriangle, degrees_to_radians}