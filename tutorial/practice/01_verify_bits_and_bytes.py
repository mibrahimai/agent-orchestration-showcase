"""
================================================================================
SCRIPT 01: VERIFY BITS, BYTES, AND MEMORY SIZES
================================================================================
Run this script:
    python tutorial/practice/01_verify_bits_and_bytes.py

This script proves the fundamental math of precision:
- 32-bit (FP32) = 4 Bytes per number
- 16-bit (FP16) = 2 Bytes per number
- 8-bit (INT8)  = 1 Byte per number
- 4-bit (INT4)  = 0.5 Bytes per number (2 numbers per byte)
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

def format_bytes(num_bytes):
    """Convert raw bytes to human-readable KB, MB, GB."""
    if num_bytes >= 1024**3:
        return f"{num_bytes / (1024**3):.2f} GB"
    elif num_bytes >= 1024**2:
        return f"{num_bytes / (1024**2):.2f} MB"
    elif num_bytes >= 1024:
        return f"{num_bytes / 1024:.2f} KB"
    return f"{num_bytes} Bytes"

def main():
    print("=" * 75)
    print("  EXPERIMENT 1: MEASURING MEMORY ALLOCATION FOR 10,000,000 NUMBERS")
    print("=" * 75)
    
    # 10 Million numbers (a miniature model layer)
    N = 10_000_000
    print(f"Creating a simulated neural network layer with {N:,} parameters...\n")
    
    # FP32: 32-bit Single Precision
    arr_fp32 = np.ones(N, dtype=np.float32)
    bytes_fp32 = arr_fp32.nbytes
    
    # FP16: 16-bit Half Precision
    arr_fp16 = np.ones(N, dtype=np.float16)
    bytes_fp16 = arr_fp16.nbytes
    
    # INT8: 8-bit Precision
    arr_int8 = np.ones(N, dtype=np.int8)
    bytes_int8 = arr_int8.nbytes
    
    # INT4 (Simulated: 4-bit packs two numbers into 1 byte)
    bytes_int4 = N // 2
    
    print(f"+---------------+------------+------------------+-----------------+")
    print(f"| Precision     | Bits/Param | Bytes/Param      | Size for 10M    |")
    print(f"+---------------+------------+------------------+-----------------+")
    print(f"| 32-bit (FP32) | 32 bits    | {bytes_fp32 / N:.1f} Bytes        | {format_bytes(bytes_fp32):<15} |")
    print(f"| 16-bit (FP16) | 16 bits    | {bytes_fp16 / N:.1f} Bytes        | {format_bytes(bytes_fp16):<15} |")
    print(f"| 8-bit (INT8)  |  8 bits    | {bytes_int8 / N:.1f} Bytes        | {format_bytes(bytes_int8):<15} |")
    print(f"| 4-bit (INT4)  |  4 bits    | {bytes_int4 / N:.1f} Bytes        | {format_bytes(bytes_int4):<15} |")
    print(f"+---------------+------------+------------------+-----------------+\n")
    
    print("=" * 75)
    print("  EXPERIMENT 2: EXTRAPOLATING TO REAL PRODUCTION MODELS")
    print("=" * 75)
    
    models = [
        ("Qwen 2.5 1.5B", 1_540_000_000),
        ("Llama 3.1 8B",  8_000_000_000),
        ("Qwen 2.5 14B", 14_700_000_000),
        ("Llama 3.3 70B", 70_000_000_000),
    ]
    
    print(f"{'Model Name':<16} | {'Params':<8} | {'FP32 (4B)':<10} | {'16-bit (2B)':<11} | {'8-bit (1B)':<10} | {'4-bit (0.5B)':<12}")
    print("-" * 75)
    
    for name, params in models:
        fp32_gb = (params * 4) / (1024**3)
        fp16_gb = (params * 2) / (1024**3)
        int8_gb = (params * 1) / (1024**3)
        int4_gb = (params * 0.5) / (1024**3)
        print(f"{name:<16} | {params/1e9:>4.1f}B   | {fp32_gb:>7.2f} GB | {fp16_gb:>8.2f} GB | {int8_gb:>7.2f} GB | {int4_gb:>8.2f} GB")
        
    print("-" * 75)
    print("\n>>> KEY OBSERVATION:")
    print("  * Qwen 2.5 14B in 16-bit requires ~27.38 GB of raw weights (Too big for a 15GB T4).")
    print("  * Qwen 2.5 14B in 4-bit requires only ~6.85 GB of raw weights (FITS EASILY on T4!).")
    print("=" * 75)

if __name__ == "__main__":
    main()
