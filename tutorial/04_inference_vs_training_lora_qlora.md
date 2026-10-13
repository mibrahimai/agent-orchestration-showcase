# Module 04: Inference vs Training, LoRA, and QLoRA

> **Goal:** Understand why training consumes 4x to 6x more VRAM than inference, why Full Fine-Tuning is wildly expensive, and how LoRA & QLoRA allow fine-tuning on a single affordable GPU.

---

## 1. Why Does Training Need So Much More Memory Than Inference?

A client might ask:
> *"If Qwen 14B runs in 10 GB VRAM for chat, why can't we train it on the same 10 GB GPU?"*

Because **Inference (reading/generating)** is passive, while **Training (learning/updating)** requires tracking math backwards in time.

### The 4 Memory Consumers in Full Training

When you train all parameters of an LLM (**Full Fine-Tuning**), the GPU must hold 4 distinct data structures in VRAM simultaneously:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. MODEL WEIGHTS (16-bit)          : 2 Bytes / parameter   │
├─────────────────────────────────────────────────────────────┤
│ 2. GRADIENTS (16-bit)              : 2 Bytes / parameter   │
├─────────────────────────────────────────────────────────────┤
│ 3. OPTIMIZER STATES (AdamW, FP32)  : 8 Bytes / parameter   │
├─────────────────────────────────────────────────────────────┤
│ 4. ACTIVATIONS & BACKPROP BUFFERS  : 4 - 6 Bytes / param   │
└─────────────────────────────────────────────────────────────┘
  TOTAL FULL TRAINING MEMORY         : 16 - 18 Bytes / parameter!
```

### The AdamW Memory Trap
The industry-standard training algorithm is **AdamW**. For *every single weight* in the model, AdamW maintains two tracking metrics in 32-bit floating point:
1. **Momentum (First Moment):** 4 bytes
2. **Variance (Second Moment):** 4 bytes
That is **8 bytes of optimizer states per parameter alone!**

### Comparing the Math for Qwen 2.5 14B:
- **For Inference (4-bit):**
  $14.7\text{B} \times 0.5\text{ Bytes} + 2.5\text{ GB (overhead)} = \mathbf{\approx 10\text{ GB VRAM}}$
- **For Full Training (16-bit):**
  $14.7\text{B} \times 16\text{ Bytes} = \mathbf{235.2\text{ GB VRAM}}$!
  You would need **3x NVIDIA A100 80GB GPUs** ($15,000+ hardware) just to train it!

---

## 2. What is LoRA (Low-Rank Adaptation)?

In 2021, Microsoft researchers asked a brilliant question:
> *"Do we really need to update all 14 Billion numbers to teach the model a new skill? Or can we leave the original brain untouched and just add small adjustment matrices?"*

### The Encyclopedia & Sticky Notes Analogy
Imagine you have a 1,000-page Medical Encyclopedia:
- **Full Fine-Tuning:** You hire a calligrapher to erase and rewrite every single sentence across all 1,000 pages. It takes forever and costs a fortune.
- **LoRA:** You **freeze** the entire 1,000-page book so not a single letter changes. Whenever you want to add specific hospital guidelines, you attach small yellow **sticky notes** in the margins. When someone reads the book, they read the original page plus the sticky note.

### The Math Behind LoRA:
Instead of updating the full $W$ matrix of size $4096 \times 4096$ (16.7 Million numbers), LoRA decomposes the update into two tiny low-rank matrices:
$$W_{\text{new}} = W_{\text{base}} + \Delta W = W_{\text{base}} + (B \cdot A)$$

If rank $r = 16$:
- Matrix $A$ is $4096 \times 16$ (65,536 numbers)
- Matrix $B$ is $16 \times 4096$ (65,536 numbers)
- Total trainable parameters: **131,072 numbers** instead of 16.7 Million!
- You **freeze 99.8% of the weights**, saving over 90% of training memory!

---

## 3. What is QLoRA (Quantized LoRA)?

**QLoRA (Quantized Low-Rank Adaptation)** takes LoRA one massive step further:

1. **Quantize the Base Model to 4-bit (NormalFloat4):**
   The giant 14B base model is compressed into 4-bit format and locked into GPU memory (occupying only ~7 GB).
2. **Train Tiny 16-bit LoRA Adapters:**
   Only the tiny adapter matrices ($A$ and $B$) receive gradients and AdamW optimizer states.
3. **De-quantize on the Fly:**
   During the forward pass, 4-bit weights are temporarily decompressed to 16-bit inside the GPU registers, multiplied with the input, and immediately discarded.

```
       [ BASE MODEL (14B) ]          [ LoRA ADAPTERS ]
       Compressed to 4-bit          Trained in 16-bit
       FROZEN (No Gradients)        ACTIVE (Gradients & AdamW)
          ~7.3 GB VRAM                    ~0.4 GB VRAM
                 \                             /
                  \                           /
                   ▼                         ▼
         TOTAL TRAINING VRAM: ~9.5 - 11.5 GB!
      (Fits completely inside a 15GB Tesla T4!)
```

This is the exact reason why 4-bit QLoRA makes fine-tuning 14B models possible on accessible 15GB GPUs (like the Tesla T4) without running out of memory!

---

## 4. Understanding LoRA Hyperparameters

When configuring fine-tuning, you will see these three parameters:

1. **Rank ($r$, e.g. 8, 16, 32, 64):**
   - The rank controls the size of the adapter matrices.
   - Low rank ($r=8$ or $16$): Great for style tuning, tone adjustment, classification, or strict JSON formatting. Fast and memory-efficient.
   - High rank ($r=32$ or $64$): Needed when teaching the model complex new facts, heavy coding APIs, or foreign languages.
2. **Alpha ($\alpha$, e.g. 16, 32):**
   - The scaling multiplier (how loud the adapter's voice is compared to the base model).
   - Standard rule: Set $\alpha = 2 \times r$ (e.g., if $r=16$, set $\alpha=32$).
3. **Target Modules:**
   - Which attention and feed-forward layers to attach adapters to (e.g., `q_proj`, `v_proj`, `k_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`).
