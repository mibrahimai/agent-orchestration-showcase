"""
================================================================================
SCRIPT 03: VISUAL QUANTIZATION & BIT-PACKING SIMULATOR
================================================================================
Run this script:
    python tutorial/practice/03_quantization_simulator.py

This script demonstrates:
1. How high-precision decimal numbers are mapped to 4-bit integers (-8 to +7).
2. How two 4-bit numbers are physically packed into a single 8-bit byte.
3. How little information is lost during dequantization.
================================================================================
"""

import sys
import numpy as np

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def main():
    print("=" * 70)
    print("       DEMONSTRATION: HOW 4-BIT QUANTIZATION WORKS INTERNALLY")
    print("=" * 70)
    
    # Simulate 8 weights from an attention projection layer
    np.random.seed(42)
    original_weights = np.random.normal(loc=0.0, scale=0.5, size=8).astype(np.float32)
    
    print("\n1. EIGHT RAW WEIGHTS (Simulating 32-bit floating point numbers):")
    for i, w in enumerate(original_weights):
        print(f"   w[{i}] = {w:>+9.5f}")
        
    print("\n" + "-" * 70)
    print("2. COMPUTING THE 4-BIT SCALING FACTOR:")
    print("   4 bits allows 16 discrete levels (-8 to +7).")
    max_val = np.max(np.abs(original_weights))
    scale = max_val / 7.0
    print(f"   Max absolute weight : {max_val:.5f}")
    print(f"   Scale Factor (S)    : {scale:.5f} (each 4-bit step represents this amount)")
    
    print("\n" + "-" * 70)
    print("3. QUANTIZING FLOAT32 -> 4-BIT INTEGER -> DEQUANTIZED FLOAT:")
    print(f"   {'Index':<5} | {'Original Float':<15} | {'4-Bit Int':<10} | {'Reconstructed':<15} | {'Error':<10}")
    print("   " + "-" * 62)
    
    quantized_ints = []
    reconstructed_weights = []
    
    for i, w in enumerate(original_weights):
        # Quantize: divide by scale and clip to [-8, 7]
        q = int(np.clip(np.round(w / scale), -8, 7))
        # Dequantize: multiply back by scale
        w_rec = q * scale
        err = abs(w - w_rec)
        
        quantized_ints.append(q)
        reconstructed_weights.append(w_rec)
        
        print(f"   [{i}]   | {w:>+13.5f}   | {q:>+8d}   | {w_rec:>+13.5f}   | {err:>8.5f}")
        
    mae = np.mean(np.abs(original_weights - np.array(reconstructed_weights)))
    print("   " + "-" * 62)
    print(f"   >> Mean Absolute Reconstruction Error: {mae:.5f} (Extremely small!)")
    
    print("\n" + "=" * 70)
    print("4. PHYSICAL HARDWARE PACKING: TWO 4-BIT NUMBERS IN ONE 8-BIT BYTE")
    print("=" * 70)
    print("   Let's take w[0] and w[1] and pack them into a single byte on the GPU:\n")
    
    # Map signed [-8, 7] to unsigned [0, 15] for bitwise packing
    nibble_0 = (quantized_ints[0] + 8) & 0x0F
    nibble_1 = (quantized_ints[1] + 8) & 0x0F
    
    # Pack both into one 8-bit byte: nibble_0 in upper 4 bits, nibble_1 in lower 4 bits
    packed_byte = (nibble_0 << 4) | nibble_1
    
    print(f"   Weight 0 value : {quantized_ints[0]:>2d}  --> 4-bit binary: {nibble_0:04b}")
    print(f"   Weight 1 value : {quantized_ints[1]:>2d}  --> 4-bit binary: {nibble_1:04b}")
    print(f"   Combined 1-Byte: {packed_byte:08b} (Decimal byte value: {packed_byte})")
    print("\n   >> CONCLUSION:")
    print("   Because two 4-bit parameters fit in a single 8-bit memory byte,")
    print("   a 14 Billion parameter model requires only 7 Gigabytes of VRAM!")
    print("=" * 70 + "\n")

if __name__ == "__main__":
    main()
