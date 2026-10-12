# AI Engineering Mastery: LLM Fundamentals & Memory Sizing

Welcome to the definitive hands-on guide to LLM parameters, precision, quantization, and GPU memory architecture.

This curriculum is engineered from the ground up to build an **unshakeable mental model**. By the time you complete these modules and practice exercises, you will be able to:
1. Instantly calculate GPU VRAM requirements in your head during live client calls.
2. Demystify technical jargon (FP16, BF16, 4-bit, QLoRA, KV Cache) with crystal clarity.
3. Confidently defend architectural choices against client CTOs, lead architects, and engineering teams.
4. Avoid costly mistakes (like running out of GPU memory mid-training or overpaying $10,000/month on cloud infrastructure).

---

## 📚 Curriculum Structure

| Module | File | Focus Area |
| :--- | :--- | :--- |
| **01** | [`01_model_parameters_and_scale.md`](file:///d:/Dev/list/tutorial/01_model_parameters_and_scale.md) | What is a parameter? What does 1.5B vs 14B vs 70B mean? Neural network dials & capacity. |
| **02** | [`02_precision_and_quantization_bits.md`](file:///d:/Dev/list/tutorial/02_precision_and_quantization_bits.md) | What is 16-bit half precision? What is 4-bit? Why is there **no 14-bit**? Bits vs. bytes demystified. |
| **03** | [`03_vram_calculation_and_gpu_sizing.md`](file:///d:/Dev/list/tutorial/03_vram_calculation_and_gpu_sizing.md) | The Golden Formula: Mental math for GPU sizing. Tesla T4 vs RTX 4090 vs A100 sizing matrices. |
| **04** | [`04_inference_vs_training_lora_qlora.md`](file:///d:/Dev/list/tutorial/04_inference_vs_training_lora_qlora.md) | Why does training consume 4x more VRAM? Weights vs Gradients vs AdamW. LoRA & QLoRA mechanics. |
| **05** | [`05_client_consulting_playbook.md`](file:///d:/Dev/list/tutorial/05_client_consulting_playbook.md) | Word-for-word scripts for client calls, architect interviews, cost justifications, and objection handling. |

---

## 💻 Interactive Practice Scripts (`tutorial/practice/`)

Inside the [`practice/`](file:///d:/Dev/list/tutorial/practice) folder, you have 3 runnable Python scripts to prove every mathematical principle on your own machine:

1. [`practice/01_verify_bits_and_bytes.py`](file:///d:/Dev/list/tutorial/practice/01_verify_bits_and_bytes.py)
   - Inspects real tensors in memory.
   - Shows byte-for-byte how FP32 (4 bytes), FP16 (2 bytes), and INT8 (1 byte) behave.
   - Run: `python tutorial/practice/01_verify_bits_and_bytes.py`

2. [`practice/02_vram_calculator.py`](file:///d:/Dev/list/tutorial/practice/02_vram_calculator.py)
   - An interactive command-line tool.
   - Input any model size (e.g. 1.5B, 7B, 14B, 70B) and precision (16-bit, 8-bit, 4-bit).
   - Instantly outputs exact VRAM budgets for Inference, LoRA training, and Full training.
   - Run: `python tutorial/practice/02_vram_calculator.py`

3. [`practice/03_quantization_simulator.py`](file:///d:/Dev/list/tutorial/practice/03_quantization_simulator.py)
   - Demonstrates how continuous decimal weights are compressed into 16 discrete levels (4 bits) and reconstructed.
   - Proves why 4-bit retains ~99% of model accuracy with 75% memory savings.
   - Run: `python tutorial/practice/03_quantization_simulator.py`

---

## 🧠 The "Survival Learning" Mental Strategy (How to memorize this for life)

To wire this deeply into your intuition so you never freeze during high-stakes technical meetings:

1. **Read Module 1 & 2** twice in one sitting. Don't rush. Picture the physical memory chips.
2. **Run the practice scripts** in your terminal. Watching real numbers change solidifies the abstract concepts.
3. **Memorize the Golden Rule**:
   - `16-bit` = **2 GB** per Billion parameters
   - `8-bit` = **1 GB** per Billion parameters
   - `4-bit` = **0.5 GB** per Billion parameters
4. **Practice out loud**: Roleplay Module 5 (Client Consulting Playbook) in front of a mirror or voice recorder. Once you can explain *why 14B at 4-bit fits on a Tesla T4 but 14B at 16-bit crashes* without looking at notes, you own this skill forever.
