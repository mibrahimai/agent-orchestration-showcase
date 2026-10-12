# Module 05: Client Consulting Playbook & Technical Dialogues

> **Goal:** Real-world word-for-word dialogue scripts to answer clients, CTOs, and technical architects with supreme technical authority and confidence.

---

## Scenario 1: The Office Desktop Fine-Tuning Request

### 👤 Client / Founder:
> *"We want to fine-tune Llama 3 70B on our internal company documentation. We have a powerful developer PC in the office with an NVIDIA RTX 4090 (24GB VRAM). Can you set up the training script on that machine?"*

### 🎙️ Your Authoritative Response:
> *"I appreciate the instinct to leverage local hardware, but let's walk through the exact memory mathematics so you understand the hardware boundaries:*
>
> *1. An RTX 4090 has **24 GB of VRAM**.*
> *2. Llama 3 70B has **70 Billion parameters**. Even if we compress the base weights to aggressive 4-bit QLoRA, the frozen weights alone require **35 GB** ($70\text{B} \times 0.5\text{ Bytes}$).*
> *3. Once you add the LoRA adapter gradients, optimizer states, and context window buffers, the minimum VRAM required to train 70B is **roughly 45 to 48 GB**.*
>
> *If we run that on a 24 GB card, CUDA will throw an immediate Out-Of-Memory (OOM) crash before completing step one.*
>
> *Here are our two viable architectural paths:*
> - **Path A (Optimal & Cost-Effective):** We fine-tune **Qwen 2.5 14B** or **Llama 3.1 8B**. A 14B model in 4-bit QLoRA requires only **~11 GB VRAM**. It fits smoothly inside your 24GB card with plenty of room for 8k context length, and its benchmark scores beat older 70B models.
> - **Path B (If you strictly require 70B):** We spin up a dual-GPU cloud instance (like 2x A100 80GB or 2x RTX 4090/A6000) on RunPod or AWS for ~$2 to $3/hour, run the LoRA training for 4 to 6 hours for under $20 total, and export the adapter."*

---

## Scenario 2: The "Will 4-Bit Make the AI Stupid?" Objection

### 👤 Lead Technical Architect:
> *"Why are you proposing 4-bit quantization? In our company we deal with financial/legal data. Won't 4-bit rounding degrade the intelligence and accuracy compared to standard 16-bit?"*

### 🎙️ Your Authoritative Response:
> *"That is a very reasonable concern, and 3 years ago with primitive integer quantization, that was indeed a risk. However, modern quantization uses **NF4 (NormalFloat4)** and **AWQ (Activation-aware Weight Quantization)**, which fundamentally changed the equation.*
>
> *1. Neural network weights follow a normal bell-curve distribution. NF4 allocates information-theoretically optimal quantiles rather than naive linear clipping.*
> *2. Rigorous empirical benchmarks (including the original QLoRA university paper and HuggingFace evals) prove that a 4-bit NF4 quantized model retains **over 99.3% of the zero-shot reasoning performance (MMLU and GSM8K)** of the full 16-bit model.*
> *3. More importantly, in real-world economics: A 14B model quantized to 4-bit significantly outperforms an unquantized 7B model at 16-bit, while using roughly the **same memory footprint** (~8-10 GB).*
>
> *If you require zero quantization loss during final production serving, we can benchmark both side-by-side using an automated test suite. But for cost efficiency and latency, 4-bit or 8-bit gives you enterprise-grade fidelity at 1/4 the compute bill."*

---

## Scenario 3: "Should We Use RAG, Prompt Engineering, or Fine-Tuning?"

### 👤 Product Manager:
> *"We have 500 company policy PDFs and product catalogs. Should we fine-tune a model on them?"*

### 🎙️ Your Authoritative Response:
> *"No, you should **not** fine-tune for that use case. You should use **RAG (Retrieval-Augmented Generation)**.*
>
> *Here is the mental rule of thumb I use to distinguish the two:*
> - **Fine-Tuning is for teaching Style, Tone, Syntax, and Form:** Teaching an LLM how to write strict JSON matching your proprietary schema, speaking like a 1920s detective, or following complex medical classification codes.
> - **RAG is for Knowledge Retrieval and Facts:** When policies update, prices change, or new PDF manuals arrive tomorrow, fine-tuning requires retraining the model every week and still suffers from hallucination. RAG retrieves the exact truth from a vector database and inserts it directly into the prompt context.*
> - **When to combine both:** You build a RAG pipeline for the factual knowledge, and you fine-tune a small 1.5B or 14B model to strictly format and reason over that retrieved knowledge."*

---

## Scenario 4: Fast Recall Mental Drills (Self-Test Flashcards)

Cover the right side of the screen and test yourself:

| Question | Instant Answer |
| :--- | :--- |
| What does 16-bit half precision mean? | Each parameter takes **16 bits = 2 bytes** of memory. |
| What does 4-bit precision mean? | Each parameter takes **4 bits = 0.5 bytes** (two parameters per byte). |
| How much VRAM for weights of a 14B model in 16-bit? | $14 \times 2 = \mathbf{28\text{ GB}}$. |
| How much VRAM for weights of a 14B model in 4-bit? | $14 \times 0.5 = \mathbf{7\text{ GB}}$. |
| Why is there no "14-bit" precision? | Hardware architectures operate in powers of 2 (4, 8, 16, 32). "14B" is model parameter count, not bit width. |
| Why does Full Fine-Tuning take 16-18 bytes per param? | Weights (2B) + Gradients (2B) + AdamW Optimizer States (8B) + Activations (4B). |
| Why does QLoRA allow training on cheap GPUs? | It freezes the base model in 4-bit and only trains tiny 16-bit adapter matrices (~0.2% of weights). |
