'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Cpu, 
  Database, 
  Calculator, 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  HelpCircle, 
  Layers, 
  Sliders, 
  Server, 
  ChevronRight,
  Terminal,
  ExternalLink,
  Code
} from 'lucide-react';

export default function TutorialPage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'modules' | 'quantization' | 'scenarios'>('calculator');
  const [selectedModule, setSelectedModule] = useState<number>(1);
  const [revealedScenario, setRevealedScenario] = useState<number | null>(null);

  // Calculator State
  const [paramsB, setParamsB] = useState<number>(14.0);
  const [bits, setBits] = useState<number>(4);
  const [contextTokens, setContextTokens] = useState<number>(4096);

  // Quantization Visualizer State
  const [sampleWeight, setSampleWeight] = useState<number>(0.42);

  // Calculation Math
  const bytesPerParam = bits / 8.0;
  const weightVram = paramsB * bytesPerParam;
  const kvCacheVram = (paramsB / 7.0) * (contextTokens / 4096.0) * 0.8;
  const cudaOverhead = 1.2;
  const totalInferenceVram = weightVram + kvCacheVram + cudaOverhead;
  const qloraVram = (paramsB * 0.5) + Math.max(2.5, paramsB * 0.25) + cudaOverhead;
  const fullTrainingVram = (paramsB * 16.0) + (paramsB * 2.0) + cudaOverhead;

  const getRecommendedGpu = (vram: number) => {
    if (vram <= 14.5) return { name: 'NVIDIA Tesla T4 (15 GB)', badge: 'Cloud T4 / ~$0.20/hr', color: 'emerald' };
    if (vram <= 23.5) return { name: 'NVIDIA RTX 4090 / L4 (24 GB)', badge: '~$0.50 - $0.70/hr', color: 'indigo' };
    if (vram <= 39.0) return { name: 'NVIDIA A100 (40 GB)', badge: '~$1.50 - $2.00/hr', color: 'blue' };
    if (vram <= 78.0) return { name: 'NVIDIA A100 / H100 (80 GB)', badge: '~$2.50 - $3.50/hr', color: 'purple' };
    const count = Math.ceil(vram / 75);
    return { name: `Multi-GPU Cluster (${count}x A100 80GB)`, badge: `~$${(count * 3.0).toFixed(2)}/hr`, color: 'rose' };
  };

  const recGpu = getRecommendedGpu(totalInferenceVram);

  // Quantization Simulation Math
  const scale = 1.5 / 7.0;
  const quantInt = Math.max(-8, Math.min(7, Math.round(sampleWeight / scale)));
  const reconstructed = quantInt * scale;
  const quantError = Math.abs(sampleWeight - reconstructed);
  const nibble = (quantInt + 8) & 0x0f;

  return (
    <div className="min-h-screen bg-[#07090E] text-gray-200 font-sans selection:bg-indigo-500/30">
      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Mission Control</span>
            </Link>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-500/20 p-1.5 rounded-lg border border-indigo-500/30">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                  AI Architecture & GPU Sizing Academy
                  <span className="text-[10px] bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono px-2 py-0.5 rounded-full">
                    Consultant Edition
                  </span>
                </h1>
                <p className="text-[11px] text-gray-500">Mastering LLM Parameters, Bits, Quantization, and Hardware Math</p>
              </div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'calculator'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>VRAM Calculator</span>
            </button>
            <button
              onClick={() => setActiveTab('quantization')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'quantization'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>4-Bit Visualizer</span>
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'modules'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Curriculum (1–5)</span>
            </button>
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'scenarios'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Client Dialogues</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* TAB 1: INTERACTIVE VRAM & HARDWARE CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-transparent p-6 rounded-2xl border border-indigo-500/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                The 30-Second Mental Math Engine
              </h2>
              <p className="text-sm text-gray-400 mt-1 max-w-3xl">
                Use this interactive tool to estimate exact VRAM requirements for any model size, precision level, and context length.
                Formula: <span className="font-mono text-indigo-300">Weight VRAM = Params (B) × (Bits / 8)</span> plus KV Cache & CUDA runtime.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls Column */}
              <div className="lg:col-span-5 bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6 backdrop-blur-md">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-xs font-mono flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Model Configuration
                </h3>

                {/* Parameter Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-gray-300">Model Parameters (Billion)</label>
                    <span className="text-base font-mono font-bold text-indigo-400">{paramsB.toFixed(1)}B</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="70"
                    step="0.5"
                    value={paramsB}
                    onChange={(e) => setParamsB(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 bg-white/10 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                    <button onClick={() => setParamsB(1.5)} className="hover:text-indigo-300">1.5B (Qwen)</button>
                    <button onClick={() => setParamsB(8.0)} className="hover:text-indigo-300">8B (Llama 3)</button>
                    <button onClick={() => setParamsB(14.0)} className="hover:text-indigo-300 font-bold text-indigo-400">14B (Qwen)</button>
                    <button onClick={() => setParamsB(32.0)} className="hover:text-indigo-300">32B</button>
                    <button onClick={() => setParamsB(70.0)} className="hover:text-indigo-300">70B</button>
                  </div>
                </div>

                {/* Precision Selector */}
                <div>
                  <label className="text-xs font-medium text-gray-300 block mb-2">
                    Precision / Quantization Resolution
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { b: 4, label: '4-bit (NF4/AWQ)', bytes: '0.5 B/param' },
                      { b: 8, label: '8-bit (INT8)', bytes: '1.0 B/param' },
                      { b: 16, label: '16-bit (FP16)', bytes: '2.0 B/param' }
                    ].map((item) => (
                      <button
                        key={item.b}
                        onClick={() => setBits(item.b)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          bits === item.b
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="text-sm font-bold">{item.b}-Bit</div>
                        <div className="text-[10px] opacity-75 font-mono">{item.bytes}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Context Length Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-gray-300">Context Window (KV Cache)</label>
                    <span className="text-xs font-mono text-indigo-300">{contextTokens.toLocaleString()} tokens</span>
                  </div>
                  <input
                    type="range"
                    min="1024"
                    max="16384"
                    step="1024"
                    value={contextTokens}
                    onChange={(e) => setContextTokens(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 bg-white/10 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                    <span>2k</span>
                    <span>4k</span>
                    <span>8k</span>
                    <span>16k</span>
                  </div>
                </div>

                {/* Hardware Fit Callout */}
                <div className={`p-4 rounded-xl border ${
                  recGpu.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30' :
                  recGpu.color === 'indigo' ? 'bg-indigo-500/10 border-indigo-500/30' :
                  recGpu.color === 'blue' ? 'bg-blue-500/10 border-blue-500/30' :
                  'bg-purple-500/10 border-purple-500/30'
                }`}>
                  <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Recommended Hardware</div>
                  <div className="text-base font-bold text-white mt-1 flex items-center justify-between">
                    <span>{recGpu.name}</span>
                    <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded-full text-indigo-300">{recGpu.badge}</span>
                  </div>
                </div>
              </div>

              {/* Sizing Results Dashboard */}
              <div className="lg:col-span-7 space-y-6">
                {/* Inference Card */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
                        <Server className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-white">Production Inference Budget</h4>
                        <p className="text-xs text-gray-400">Serving real-time user prompts and streaming chat</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-emerald-400">
                        {totalInferenceVram.toFixed(2)} GB
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">Total VRAM Required</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-gray-500 text-[10px]">WEIGHT VRAM</div>
                      <div className="text-white font-bold text-sm mt-0.5">{weightVram.toFixed(2)} GB</div>
                      <div className="text-[9px] text-gray-500 mt-1">{paramsB}B × {bytesPerParam.toFixed(2)} B</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-gray-500 text-[10px]">KV CACHE</div>
                      <div className="text-white font-bold text-sm mt-0.5">{kvCacheVram.toFixed(2)} GB</div>
                      <div className="text-[9px] text-gray-500 mt-1">{contextTokens.toLocaleString()} tokens</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-gray-500 text-[10px]">CUDA RUNTIME</div>
                      <div className="text-white font-bold text-sm mt-0.5">1.20 GB</div>
                      <div className="text-[9px] text-gray-500 mt-1">PyTorch Context</div>
                    </div>
                  </div>
                </div>

                {/* Fine-Tuning Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* QLoRA Training */}
                  <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-indigo-300 font-mono">QLoRA FINE-TUNING</span>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-mono">Recommended</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-white">
                      {qloraVram.toFixed(2)} GB
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">
                      Freezes 99.8% of base weights in 4-bit. Trains small 16-bit LoRA adapter matrices.
                    </p>
                    <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-gray-300 flex items-center justify-between">
                      <span>Tesla T4 (15GB) Compatible:</span>
                      <span className={`font-mono font-bold ${qloraVram <= 14.5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {qloraVram <= 14.5 ? 'YES (FITS)' : 'EXCEEDS 15GB'}
                      </span>
                    </div>
                  </div>

                  {/* Full Fine-Tuning */}
                  <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-rose-300 font-mono">FULL FINE-TUNING</span>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 font-mono">Enterprise Only</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-rose-400">
                      {fullTrainingVram.toFixed(2)} GB
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">
                      Updates all weights. Requires FP32 AdamW states (8B/param) + gradients (2B/param).
                    </p>
                    <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-gray-300 flex items-center justify-between">
                      <span>Hardware Tier:</span>
                      <span className="font-mono text-rose-300 font-bold">
                        {fullTrainingVram > 80 ? 'Multi-A100 Cluster' : 'A100 (80GB)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE 4-BIT QUANTIZATION VISUALIZER */}
        {activeTab === 'quantization' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-purple-500/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                How Continuous Decimals Become 4-Bit Integers
              </h2>
              <p className="text-sm text-gray-400 mt-1 max-w-3xl">
                4-bit quantization maps floating-point numbers into 16 discrete integer levels (-8 to +7).
                Two numbers are then packed into a single 8-bit memory byte.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Interactive Slider */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-xs font-mono">
                  Interactive Weight Inspector
                </h3>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-gray-300">Continuous Float32 Weight</label>
                    <span className="text-base font-mono font-bold text-purple-400">{sampleWeight > 0 ? `+${sampleWeight.toFixed(4)}` : sampleWeight.toFixed(4)}</span>
                  </div>
                  <input
                    type="range"
                    min="-1.5"
                    max="1.5"
                    step="0.01"
                    value={sampleWeight}
                    onChange={(e) => setSampleWeight(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 bg-white/10 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                    <span>-1.50</span>
                    <span>-0.75</span>
                    <span>0.00</span>
                    <span>+0.75</span>
                    <span>+1.50</span>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-white/5 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-gray-400">Quantized 4-Bit Integer (-8 to +7):</span>
                    <span className="font-bold text-white bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                      {quantInt > 0 ? `+${quantInt}` : quantInt}
                    </span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-gray-400">4-Bit Binary Nibble:</span>
                    <span className="font-bold text-indigo-300 font-mono">
                      {nibble.toString(2).padStart(4, '0')}
                    </span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-gray-400">Dequantized / Reconstructed:</span>
                    <span className="font-bold text-white">
                      {reconstructed > 0 ? `+${reconstructed.toFixed(4)}` : reconstructed.toFixed(4)}
                    </span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-gray-400">Approximation Error:</span>
                    <span className="font-bold text-emerald-400">
                      {quantError.toFixed(4)} ({(quantError * 100).toFixed(1)}% of scale)
                    </span>
                  </div>
                </div>
              </div>

              {/* Bit Packing Visualization */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-xs font-mono">
                  Physical Memory Byte Packing
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed">
                  Notice how the GPU takes <span className="text-white font-semibold">two independent neural network weights</span> and fuses them into one 8-bit byte:
                </p>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Weight A ({quantInt}):</span>
                    <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded">
                      {nibble.toString(2).padStart(4, '0')} (Upper 4 bits)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Weight B (+3 example):</span>
                    <span className="bg-indigo-500/30 text-indigo-300 px-2 py-1 rounded">
                      1011 (Lower 4 bits)
                    </span>
                  </div>
                  <div className="h-[1px] bg-white/10 my-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white font-bold">1 Single RAM Byte:</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded border border-emerald-500/30">
                      {nibble.toString(2).padStart(4, '0')}1011
                    </span>
                  </div>
                </div>

                <div className="bg-indigo-950/20 border border-indigo-500/30 p-4 rounded-xl text-xs text-indigo-200">
                  <div className="font-semibold text-white mb-1">💡 The Big Revelation:</div>
                  This is why Qwen 2.5 14B requires <span className="text-emerald-400 font-bold">only 7 Gigabytes</span> instead of 28 GB! 
                  Every byte stores two parameters simultaneously.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CURRICULUM MODULES (1 TO 5) */}
        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Module List */}
            <div className="lg:col-span-4 space-y-2">
              {[
                { id: 1, title: '01. Model Parameters & Scale', desc: 'What is a parameter? 1.5B vs 14B vs 70B' },
                { id: 2, title: '02. Precision & Quantization Bits', desc: '16-bit, 4-bit, and why no 14-bit' },
                { id: 3, title: '03. VRAM Math & GPU Sizing', desc: 'The Golden Rule for client calls' },
                { id: 4, title: '04. Training vs Inference & LoRA', desc: 'AdamW traps, LoRA, and QLoRA' },
                { id: 5, title: '05. Client Consulting Playbook', desc: 'Real scripts and objection handling' }
              ].map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModule(mod.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedModule === mod.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold text-sm text-white">{mod.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{mod.desc}</div>
                </button>
              ))}

              <div className="pt-4 border-t border-white/10 mt-6">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Practice CLI Tools</div>
                <div className="bg-black/50 border border-white/10 p-3 rounded-xl font-mono text-[11px] text-gray-300 space-y-1.5">
                  <div className="text-indigo-400"># Run in your project terminal:</div>
                  <div>python tutorial/practice/01_verify_bits_and_bytes.py</div>
                  <div>python tutorial/practice/02_vram_calculator.py</div>
                  <div>python tutorial/practice/03_quantization_simulator.py</div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md space-y-6">
              {selectedModule === 1 && (
                <div className="space-y-4 text-sm leading-relaxed text-gray-300">
                  <h3 className="text-2xl font-bold text-white">Module 01: Model Parameters & Scale</h3>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-bold text-white">Core Intuition:</span> A parameter is a single decimal number inside a matrix (e.g. <code className="text-indigo-300">0.0418</code>). A 14B model is literally 14 Billion of these numbers packed together.
                  </div>
                  <p>
                    Think of a sound mixing console with 1.54 Billion physical knobs. Training an AI means nudging those knobs until feeding in a sentence produces an intelligent answer.
                  </p>
                  <h4 className="text-base font-semibold text-white mt-4">Why Not Always Use 70B?</h4>
                  <p>
                    Every word generated requires multiplying the input vector by every single parameter in the model. A 14B model takes ~10x more computation per token than a 1.5B model. We balance intelligence against speed and hardware budget.
                  </p>
                </div>
              )}

              {selectedModule === 2 && (
                <div className="space-y-4 text-sm leading-relaxed text-gray-300">
                  <h3 className="text-2xl font-bold text-white">Module 02: Precision, Bits, & Quantization</h3>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-bold text-white">Remember the Difference:</span> <strong className="text-indigo-300">14B</strong> is HOW MANY numbers you have. <strong className="text-indigo-300">4-bit</strong> is HOW MUCH STORAGE each number takes.
                  </div>
                  <h4 className="text-base font-semibold text-white mt-4">Why Is There No 14-Bit Precision?</h4>
                  <p>
                    Computer processors and GPUs are binary circuits wired in powers of 2 (4, 8, 16, 32, 64 bits). 4 bits = half a byte. Exactly two 4-bit numbers pack into 1 byte. 14 bits doesn't align with bytes and has no GPU hardware support.
                  </p>
                  <h4 className="text-base font-semibold text-white mt-4">How Quantization Works:</h4>
                  <p>
                    Like compressing a 50MB uncompressed RAW photo into a 4MB JPEG. The human eye can barely tell the difference, but the file size drops by 90%. In LLMs, 4-bit NormalFloat retains 99.3% of model intelligence while slashing VRAM by 75%.
                  </p>
                </div>
              )}

              {selectedModule === 3 && (
                <div className="space-y-4 text-sm leading-relaxed text-gray-300">
                  <h3 className="text-2xl font-bold text-white">Module 03: VRAM Calculation & GPU Sizing</h3>
                  <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 font-mono text-xs text-indigo-200">
                    Weight VRAM (GB) = Parameters (B) × (Bits / 8)<br/>
                    Total VRAM = Weight VRAM × 1.20 (adds 20% for KV Cache and runtime)
                  </div>
                  <h4 className="text-base font-semibold text-white mt-4">The 3 Magic Numbers to Memorize:</h4>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li><strong className="text-white">16-bit:</strong> 2.0 GB per 1 Billion parameters</li>
                    <li><strong className="text-white">8-bit:</strong> 1.0 GB per 1 Billion parameters</li>
                    <li><strong className="text-white">4-bit:</strong> 0.5 GB per 1 Billion parameters</li>
                  </ul>
                  <p className="mt-3">
                    Qwen 2.5 14B at 4-bit = 14 × 0.5 = 7 GB (+ 2.8 GB overhead = ~9.8 GB total). Fits easily on a 15GB Tesla T4!
                  </p>
                </div>
              )}

              {selectedModule === 4 && (
                <div className="space-y-4 text-sm leading-relaxed text-gray-300">
                  <h3 className="text-2xl font-bold text-white">Module 04: Training vs Inference, LoRA, and QLoRA</h3>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-bold text-white">The AdamW Trap:</span> Full fine-tuning requires 16 to 18 Bytes per parameter because AdamW keeps two 32-bit floating point numbers (momentum and variance) for EVERY weight in the model!
                  </div>
                  <h4 className="text-base font-semibold text-white mt-4">LoRA: The Sticky Notes Method</h4>
                  <p>
                    Instead of rewriting a 1,000-page encyclopedia, we freeze the entire book and attach small yellow sticky notes (adapter matrices A and B) on key pages. We train only 0.2% of the parameters!
                  </p>
                  <h4 className="text-base font-semibold text-white mt-4">QLoRA:</h4>
                  <p>
                    Compresses the base model into 4-bit (NormalFloat4), freezes it, and trains 16-bit LoRA adapters. This allows fine-tuning 14B models on affordable 15GB GPUs (like the Tesla T4) without memory crashes!
                  </p>
                </div>
              )}

              {selectedModule === 5 && (
                <div className="space-y-4 text-sm leading-relaxed text-gray-300">
                  <h3 className="text-2xl font-bold text-white">Module 05: Client Consulting Playbook</h3>
                  <p>
                    Master the art of answering client questions authoritatively without hesitating. Switch to the <strong>Client Dialogues</strong> tab above to rehearse word-for-word scripts.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CLIENT DIALOGUES / SCENARIO SIMULATOR */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-950/40 via-indigo-950/20 to-transparent p-6 rounded-2xl border border-emerald-500/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                Live Client Roleplay & Objection Handling
              </h2>
              <p className="text-sm text-gray-400 mt-1 max-w-3xl">
                Click each client objection to test yourself, then reveal the exact authoritative answer to memorize.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 1,
                  question: 'Client: "Can we fine-tune Llama 3 70B on our office developer PC with an RTX 4090 (24GB)?"',
                  answer: 'Authoritative Response: "No, because the mathematics of 70B don\'t fit in 24 GB. Even with 4-bit QLoRA, the frozen base weights alone take 35 GB (70 × 0.5 GB). Adding adapter gradients and context brings the minimum requirement to ~45-48 GB. We have two options: fine-tune Qwen 14B or Llama 8B which fit easily in 11 GB VRAM and outperform older 70B models, or rent a dual-A100 cloud instance on RunPod for ~$2.50/hr for 5 hours."'
                },
                {
                  id: 2,
                  question: 'Lead Architect: "Won\'t 4-bit quantization make our enterprise model stupid and inaccurate?"',
                  answer: 'Authoritative Response: "With modern NF4 (NormalFloat4) and AWQ, benchmark evaluations (MMLU, GSM8K) demonstrate that 4-bit retains over 99.3% of the zero-shot reasoning of full 16-bit. Furthermore, a 14B model at 4-bit vastly outperforms an unquantized 7B model at 16-bit while consuming roughly the same 8-10 GB of VRAM."'
                },
                {
                  id: 3,
                  question: 'Product Manager: "We have 200 PDF manuals. Should we fine-tune a model on them?"',
                  answer: 'Authoritative Response: "No, you should use RAG (Retrieval-Augmented Generation). Fine-tuning is for teaching Style, Tone, and strict JSON output syntax. RAG is for dynamic facts and knowledge. If company policies update next week, fine-tuning requires expensive retraining; RAG just updates the vector database."'
                }
              ].map((item) => (
                <div key={item.id} className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold text-white">{item.question}</h4>
                    <button
                      onClick={() => setRevealedScenario(revealedScenario === item.id ? null : item.id)}
                      className="text-xs bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-500/30 font-mono transition-colors"
                    >
                      {revealedScenario === item.id ? 'Hide Answer' : 'Reveal Model Answer'}
                    </button>
                  </div>
                  {revealedScenario === item.id && (
                    <div className="mt-4 pt-4 border-t border-white/10 text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 animate-fadeIn">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
