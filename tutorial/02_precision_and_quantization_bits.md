# Module 02: Precision, Bits, & Quantization Demystified

> **Goal:** Master what "16-bit half precision", "8-bit", and "4-bit" mean, why there is **no such thing as 14-bit**, and how quantization compresses huge models into small GPUs.

---

## 1. The Critical Distinction: Model Size vs. Precision

A very common point of confusion when starting out is confusing **14B** and **4-bit**:

| Term | What It Refers To | Analogy |
| :--- | :--- | :--- |
| **14B** (Quantity) | **HOW MANY** parameters the model has (14,000,000,000 numbers). | 14 Billion packages in a warehouse. |
| **4-bit** (Precision) | **HOW MUCH MEMORY** each individual number takes up. | The thickness or weight of each package's wrapping paper. |

- You can have a **1.5B model in 16-bit** (1.5 Billion numbers, each stored using 16 bits).
- You can have a **14B model in 4-bit** (14 Billion numbers, each stored using 4 bits).
- You can have a **70B model in 8-bit** (70 Billion numbers, each stored using 8 bits).

---

## 2. Bits vs. Bytes (The Computer Hardware Foundation)

To understand precision, you must know two universal hardware facts:
1. **1 Bit** = A single binary switch (`0` or `1`).
2. **1 Byte** = A group of **8 bits** (`01011010`).

Computers and GPU memory chips measure storage in **Bytes** (Megabytes, Gigabytes).
Therefore, whenever we know the **bit count** of a parameter, we convert it to **bytes** by dividing by 8:

$$\text{Bytes per parameter} = \frac{\text{Bits}}{8}$$

Let's examine the 4 standard precisions used in AI:

### A. 32-Bit (FP32 - "Single Precision")
- **Bits:** 32 bits
- **Bytes per parameter:** $32 \div 8 = \mathbf{4\text{ Bytes}}$
- **How it works:** Uses 1 bit for sign (+/-), 8 bits for exponent, and 23 bits for fraction. It can represent numbers with extreme microscopic detail (e.g., `0.0039281749281`).
- **History:** This was the legacy standard for scientific computing and traditional neural networks.
- **Drawback:** Takes enormous memory.

### B. 16-Bit (FP16 & BF16 - "Half Precision")
- **Bits:** 16 bits
- **Bytes per parameter:** $16 \div 8 = \mathbf{2\text{ Bytes}}$
- **Why it's called "Half Precision":** Because 16 is exactly half of 32!
- **Why it matters:** It takes **half the RAM** of FP32. NVIDIA GPUs (Volta, Turing, Ampere, Hopper) have dedicated silicon called **Tensor Cores** specifically engineered to multiply 16-bit numbers at lightning speed.
- **Modern Reality:** Almost all modern LLMs (Qwen 2.5, Llama 3, Mistral) are originally created, trained, and released by their creators in **16-bit half precision** (usually Bfloat16).

### C. 8-Bit (INT8 / FP8)
- **Bits:** 8 bits
- **Bytes per parameter:** $8 \div 8 = \mathbf{1\text{ Byte}}$
- **Savings:** Takes **half the RAM** of 16-bit, and 1/4 the RAM of 32-bit.
- **How it works:** Instead of storing complex fractions, it maps numbers to integers between -128 and +127 with a scaling multiplier.

### D. 4-Bit (INT4 / NF4 - "Quantized")
- **Bits:** 4 bits
- **Bytes per parameter:** $4 \div 8 = \mathbf{0.5\text{ Bytes}}$ (Half a byte!)
- **How it works:** In computer science, 4 bits is called a **nibble**. You can fit **two entire 4-bit parameters into a single 1-byte memory address**!
- **Savings:** Takes **1/4 the RAM of 16-bit**! A model that required 28 GB can now fit into just 7 GB!

---

## 3. Why Isn't There an "8-bit vs 14-bit" or "14-bit Precision"?

You asked: *"Why not 8 bit, 14 bit, what are these terms?"*

There is **8-bit**, but there is **NO 14-bit precision** in computer hardware. Here is why:

### Binary Architecture Powers of 2
Computers are physical electronic circuits built on binary powers of 2:
$$2^1 = 2, \quad 2^2 = 4, \quad 2^3 = 8, \quad 2^4 = 16, \quad 2^5 = 32, \quad 2^6 = 64$$

- Memory buses, CPU registers, and GPU pipelines are physically wired for **8-bit (1 byte), 16-bit (2 bytes), 32-bit (4 bytes), and 64-bit (8 bytes)**.
- For AI, researchers designed **4-bit** because exactly two 4-bit numbers fit cleanly into 1 byte (8 bits).
- If someone tried to create a "14-bit" precision:
  1. It doesn't align with bytes. Two 14-bit numbers = 28 bits, leaving 4 bits wasted empty space in a 32-bit register.
  2. The GPU would have to spend extra CPU cycles doing bit-shifts and masking just to read the numbers.
  3. No GPU manufacturer (NVIDIA, AMD, Apple) builds silicon instructions for 14-bit math.

**Remember:**
- **14B** = **14 Billion parameters** (The size of Qwen 2.5).
- **4-bit** = **The quantization level** (Half a byte per parameter).

---

## 4. What is "Quantization"? (The High-Res Image Analogy)

Quantization is the process of taking weights originally saved in **16-bit** and rounding them down into **4-bit** or **8-bit** representations.

### The Photo Compression Analogy
Imagine taking a raw, uncompressed 50 Megapixel RAW photograph:
- It looks pristine, but the file size is **100 Megabytes**.
- If you convert it into a high-quality JPEG, the file size drops to **5 Megabytes** (20x smaller!).
- Can the human eye spot the difference? Barely. The edges and colors look 99% identical.

**In Neural Networks:**
- In 16-bit, a weight might be `0.04182914`.
- In 4-bit, we map weights into 16 discrete representative points (using an algorithm called **NF4 - Normal Float 4**).
- Because language models are inherently resilient to tiny noise, the model retains **~99% of its intelligence and reasoning ability**, while slashing GPU VRAM usage by **75%**!

---

## 5. Summary Cheat Sheet

| Precision | Bits | Bytes / Parameter | Memory Needed for 14B Weights | Compatible GPUs |
| :--- | :--- | :--- | :--- | :--- |
| **FP32 (Full)** | 32 bits | 4.0 Bytes | $14 \times 4 = \mathbf{56\text{ GB}}$ | Multi-A100 clusters |
| **FP16 / BF16 (Half)** | 16 bits | 2.0 Bytes | $14 \times 2 = \mathbf{28\text{ GB}}$ | A100 (40GB/80GB) |
| **INT8 (8-bit)** | 8 bits | 1.0 Byte | $14 \times 1 = \mathbf{14\text{ GB}}$ | RTX 3090 / 4090 (24GB) |
| **INT4 / NF4 (4-bit)** | 4 bits | 0.5 Bytes | $14 \times 0.5 = \mathbf{7\text{ GB}}$ | **Tesla T4 (15GB), RTX 3060 (12GB)** |
