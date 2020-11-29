/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package volume;

/**
 *
 * @author michel
 */
public class VoxelGradient {

    public float x, y, z;
    public float mag;
    
    public VoxelGradient() {
        x = y = z = mag = 0.0f;
    }
    
    public VoxelGradient(float gx, float gy, float gz) {
        x = gx;
        y = gy;
        z = gz;
        mag = (float) Math.sqrt(x*x + y*y + z*z);
    }
    
    /**
     * Multiply the gradient vector with a scalar.
     * @param s scalar
     * @author Group 13
     */
    public VoxelGradient scale(float s) {
        x *= s;
        y *= s;
        z *= s;
        mag = (float) Math.sqrt(x*x + y*y + z*z);
        return this;
    }

    /**
     * Add two gradient vectors together.
     * @param g another gradient
     * @author Group 13
     */
    public VoxelGradient add(VoxelGradient g) {
        x += g.x;
        y += g.y;
        z += g.z;
        mag = (float) Math.sqrt(x*x + y*y + z*z);
        return this;
    }

    /**
     * @author Group 13
     */
    public String toString() {
        return String.format("(%.3f, %.3f, %.3f)", x, y, z);
    }
}
