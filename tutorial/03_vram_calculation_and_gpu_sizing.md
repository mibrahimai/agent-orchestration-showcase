# Module 03: VRAM Calculation & GPU Sizing (The Consultant's Golden Rule)

> **Goal:** Memorize the 30-second mental math formula to calculate GPU memory in your head during live client meetings and choose the right cloud hardware every single time.

---

## 1. The Golden Mental Math Formula

When a client or lead architect asks:
> *"Can we run Qwen 2.5 14B on a single NVIDIA T4 GPU?"*
> *"What hardware do we need to host Llama 3 70B for 50 concurrent internal users?"*

You never guess, and you never have to say "let me check documentation". You calculate it immediately using **The Golden Rule**:

$$\text{Weight VRAM (GB)} = \text{Parameters (in Billions)} \times \frac{\text{Bits}}{8}$$

$$\text{Total VRAM Needed (GB)} \approx \text{Weight VRAM} \times 1.20 \quad (\text{adds 20\% for KV Cache, Context, \& CUDA runtime})$$

### The 3 Rules of Thumb to Memorize
Commit these three numbers to memory:
1. **At 16-bit (Half Precision):** Each 1 Billion parameters takes **2.0 GB** of VRAM.
2. **At 8-bit:** Each 1 Billion parameters takes **1.0 GB** of VRAM.
3. **At 4-bit (Quantized):** Each 1 Billion parameters takes **0.5 GB** of VRAM.

---

## 2. Instant Calculation Walkthroughs

### Example 1: Qwen 2.5 1.5B (Loaded in 16-bit Half Precision)
- **Math:** $1.54 \text{ Billion} \times 2.0 \text{ GB} = \mathbf{3.08\text{ GB}}$ for weights.
- **Add overhead:** $3.08 \times 1.2 \approx \mathbf{3.7\text{ GB}}$ total VRAM.
- **Hardware fit:** Fits on virtually any GPU, including budget 6GB or 8GB cards or entry-level cloud GPUs (15GB).

---

### Example 2: Qwen 2.5 14B (Loaded in 16-bit vs 4-bit)

#### At 16-bit:
- **Math:** $14.7 \text{ Billion} \times 2.0 \text{ GB} = \mathbf{29.4\text{ GB}}$ for weights alone!
- **Add overhead:** $29.4 \times 1.2 \approx \mathbf{35\text{ GB}}$ total VRAM.
- **Hardware fit:** **Crashes with OOM (Out Of Memory) on a 15GB Tesla T4 or 24GB RTX 4090!** Requires an enterprise NVIDIA A100 (40GB or 80GB).

#### At 4-bit:
- **Math:** $14.7 \text{ Billion} \times 0.5 \text{ GB} = \mathbf{7.35\text{ GB}}$ for weights.
- **Add overhead (KV cache for 4k context):** $7.35 + 2.5 \text{ GB} \approx \mathbf{9.85\text{ GB}}$ total VRAM.
- **Hardware fit:** **Fits comfortably inside a 15 GB Tesla T4 with ~4.7 GB of VRAM to spare!**

---

### Example 3: Llama 3 70B (The Enterprise Benchmark)

#### At 16-bit:
- **Math:** $70 \times 2.0 = \mathbf{140\text{ GB}}$ of weights.
- **Total VRAM:** Needs at least **160 GB VRAM** (Requires **2x NVIDIA A100 80GB** or **2x H100 80GB** running tensor parallelism).

#### At 4-bit:
- **Math:** $70 \times 0.5 = \mathbf{35\text{ GB}}$ of weights.
- **Total VRAM:** $\approx \mathbf{42 - 45\text{ GB}}$ total VRAM.
- **Hardware fit:** Fits on a single **A100 80GB** or **2x RTX 3090/4090 24GB** linked via NVLink/PCIe.

---

## 3. The Master Model Sizing Matrix (Inference)

| Model Name | Parameters | 16-bit VRAM (Full) | 8-bit VRAM | 4-bit VRAM (Quantized) | Minimum GPU (4-bit) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Qwen 2.5 0.5B** | 0.5B | ~1.2 GB | ~0.7 GB | ~0.4 GB | Any GPU / CPU |
| **Qwen 2.5 1.5B** | 1.54B | ~3.7 GB | ~2.1 GB | ~1.3 GB | GTX 1650 (4GB) |
| **Llama 3.1 8B** | 8.0B | ~18 GB | ~10 GB | ~5.8 GB | RTX 3060 (12GB) / T4 |
| **Qwen 2.5 14B** | 14.7B | ~35 GB | ~18 GB | **~9.9 GB** | **Tesla T4 (15GB)** |
| **Qwen 2.5 32B** | 32.5B | ~75 GB | ~38 GB | ~21 GB | RTX 4090 (24GB) / A10G |
| **Llama 3.3 70B** | 70.6B | ~160 GB | ~85 GB | ~45 GB | A100 (80GB) |

---

## 4. Hardware Cheat Sheet (What GPUs Exist & What They Cost)

When recommending cloud infrastructure to a client, reference this tier list:

| GPU Model | VRAM | Typical Cloud Cost / Hour | Best Used For |
| :--- | :--- | :--- | :--- |
| **Tesla T4** | 15 GB | ~$0.20/hr (Cloud / AWS g4dn) | Testing, prototyping, 1.5B - 14B (4-bit) |
| **RTX 3090 / 4090** | 24 GB | ~$0.35 - $0.50/hr (RunPod/Vast) | High-speed local dev, up to 32B (4-bit) |
| **NVIDIA L4** | 24 GB | ~$0.65/hr (GCP/AWS) | Modern production inference (Ada Lovelace) |
| **NVIDIA A10G** | 24 GB | ~$1.00/hr (AWS g5 instances) | Standard enterprise inference tier |
| **NVIDIA A100 (40GB)** | 40 GB | ~$1.50 - $2.00/hr | Full 14B FP16 inference, 8-bit fine-tuning |
| **NVIDIA A100 (80GB)** | 80 GB | ~$2.50 - $3.50/hr | 70B 4-bit inference, serious fine-tuning |
| **NVIDIA H100 (80GB)** | 80 GB | ~$3.50 - $4.50/hr | State-of-the-art frontier model training |

---

## 5. What is the "Overhead" (Why Do We Add 20%)?

If the model weights are 7 GB, why can't we run it on an 8 GB card?
Because running an LLM requires three additional memory consumers:

1. **CUDA Context & PyTorch Runtime:** ~500 MB to 1 GB just to initialize the GPU drivers and PyTorch.
2. **KV Cache (Key-Value Cache):** When the model generates text, it caches past words so it doesn't recalculate them. A 4,000-token conversation can take 1.5 GB to 3 GB of VRAM just to store the active chat history!
3. **Activation Memory:** The temporary intermediate numbers computed between neural layers during each forward pass.
