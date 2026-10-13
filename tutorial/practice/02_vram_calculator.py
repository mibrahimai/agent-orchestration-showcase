"""
================================================================================
SCRIPT 02: INTERACTIVE VRAM & GPU SIZING CALCULATOR
================================================================================
Run this tool interactively:
    python tutorial/practice/02_vram_calculator.py

Or pass arguments directly:
    python tutorial/practice/02_vram_calculator.py --params 14 --bits 4 --context 4096
================================================================================
"""

import sys
import argparse

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def calculate_hardware(params_b, bits, context_tokens=4096):
    """
    Calculate full memory requirements for inference and fine-tuning.
    
    Formula:
    - Weight VRAM = Params (B) * (bits / 8)
    - KV Cache VRAM = 2 * n_layers * n_heads * head_dim * context * 2 bytes
      (Rule of thumb: ~0.5 GB per 4k tokens for 7B/14B)
    - Full Training: 16 to 18 Bytes per parameter (Weights + Grads + AdamW + Activations)
    - QLoRA Training: 4-bit Base Model + ~1.5 to 2.5 GB for adapters/gradients/activations
    """
    bytes_per_param = bits / 8.0
    weight_vram_gb = params_b * bytes_per_param
    
    # KV Cache estimate based on model size and context
    kv_cache_gb = (params_b / 7.0) * (context_tokens / 4096.0) * 0.8
    cuda_overhead_gb = 1.2  # PyTorch runtime and CUDA context
    
    total_inference_vram = weight_vram_gb + kv_cache_gb + cuda_overhead_gb
    
    # QLoRA Training: Frozen 4-bit base + 16-bit LoRA adapters + AdamW on adapters only + activations
    qlora_base_gb = params_b * (4.0 / 8.0)
    qlora_adapter_overhead = max(2.5, params_b * 0.25)
    total_qlora_training_vram = qlora_base_gb + qlora_adapter_overhead + cuda_overhead_gb
    
    # Full Fine-Tuning: 16 bytes per param (FP16 weights + FP16 grads + FP32 AdamW) + activations
    total_full_training_vram = (params_b * 16.0) + (params_b * 2.0) + cuda_overhead_gb
    
    return {
        "weight_vram": weight_vram_gb,
        "kv_cache": kv_cache_gb,
        "inference_vram": total_inference_vram,
        "qlora_vram": total_qlora_training_vram,
        "full_training_vram": total_full_training_vram,
    }

def recommend_gpu(vram_gb):
    """Recommend hardware based on required VRAM."""
    if vram_gb <= 14.5:
        return "NVIDIA Tesla T4 (15 GB) [Cloud T4 / ~$0.20/hr]"
    elif vram_gb <= 23.5:
        return "NVIDIA RTX 4090 (24 GB) or NVIDIA L4 (24 GB) [~$0.50 - $0.70/hr]"
    elif vram_gb <= 39.0:
        return "NVIDIA A100 (40 GB) [~$1.50 - $2.00/hr]"
    elif vram_gb <= 78.0:
        return "NVIDIA A100 (80 GB) or H100 (80 GB) [~$2.50 - $3.50/hr]"
    else:
        num_gpus = int(vram_gb // 75) + 1
        return f"Multi-GPU Cluster: {num_gpus}x NVIDIA A100 80GB (NVLink) [~${num_gpus * 3.00:.2f}/hr]"

def display_report(params_b, bits, context_tokens):
    results = calculate_hardware(params_b, bits, context_tokens)
    
    print("\n" + "=" * 70)
    print(f"       AI ARCHITECT MEMORY & SIZING REPORT: {params_b}B MODEL")
    print("=" * 70)
    print(f" Configuration:")
    print(f"   * Model Parameters   : {params_b} Billion")
    print(f"   * Precision          : {bits}-bit ({bits/8.0:.2f} Bytes per parameter)")
    print(f"   * Context Window     : {context_tokens:,} tokens")
    print("-" * 70)
    print(f" 1. INFERENCE BUDGET (Running / Chat):")
    print(f"   * Model Weights VRAM : {results['weight_vram']:>6.2f} GB")
    print(f"   * KV Cache (Context) : {results['kv_cache']:>6.2f} GB")
    print(f"   * CUDA Overhead      :   1.20 GB")
    print(f"   ------------------------------------")
    print(f"   >> TOTAL INFERENCE   : {results['inference_vram']:>6.2f} GB VRAM")
    print(f"   >> RECOMMENDED GPU   : {recommend_gpu(results['inference_vram'])}")
    print("-" * 70)
    print(f" 2. FINE-TUNING BUDGET:")
    print(f"   * QLoRA (4-bit)      : {results['qlora_vram']:>6.2f} GB VRAM")
    print(f"     -> GPU for QLoRA   : {recommend_gpu(results['qlora_vram'])}")
    print(f"   * Full Fine-Tuning   : {results['full_training_vram']:>6.2f} GB VRAM")
    print(f"     -> GPU for Full    : {recommend_gpu(results['full_training_vram'])}")
    print("=" * 70 + "\n")

def main():
    parser = argparse.ArgumentParser(description="LLM VRAM and GPU Sizing Calculator")
    parser.add_argument("--params", type=float, help="Model parameters in billions (e.g. 1.5, 7, 14, 70)")
    parser.add_argument("--bits", type=int, choices=[4, 8, 16, 32], help="Precision in bits (4, 8, 16, 32)")
    parser.add_argument("--context", type=int, default=4096, help="Context length in tokens (default: 4096)")
    args = parser.parse_args()
    
    if args.params is not None and args.bits is not None:
        display_report(args.params, args.bits, args.context)
        return

    print("=" * 70)
    print("        WELCOME TO THE LLM HARDWARE SIZING CALCULATOR")
    print("=" * 70)
    try:
        p_str = input("Enter model parameter count in Billions (e.g., 1.5, 7, 14, 70): ").strip()
        params = float(p_str)
        
        b_str = input("Enter precision in bits (choose 4, 8, or 16): ").strip()
        bits = int(b_str)
        if bits not in [4, 8, 16, 32]:
            print(f"Invalid bits '{bits}'. Defaulting to 4-bit.")
            bits = 4
            
        c_str = input("Enter context length in tokens [Press Enter for 4096]: ").strip()
        context = int(c_str) if c_str else 4096
        
        display_report(params, bits, context)
    except (ValueError, KeyboardInterrupt) as e:
        print("\nExiting calculator.")

if __name__ == "__main__":
    main()
