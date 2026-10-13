'use client';

import { useState } from 'react';
import { 
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
  Code,
  ShieldCheck,
  Zap,
  RefreshCw,
  GitBranch
} from 'lucide-react';

export default function ShowcaseHomePage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'modules' | 'quantization' | 'scenarios' | 'architecture'>('calculator');
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
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white">Agent Orchestration</span>
                <span className="text-[10px] bg-white/10 text-gray-300 font-mono px-2 py-0.5 rounded-full border border-white/10">Showcase</span>
              </div>
              <p className="text-[11px] text-gray-500">Continuous GPU Compute Mesh & AI Architecture Academy</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <a 
              href="https://github.com/mibrahimai/agent-orchestration-showcase" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors font-mono"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950/40 via-purple-950/10 to-transparent p-8 border border-indigo-500/20">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-mono text-indigo-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auditable Multi-Step Agent Orchestrator & Mission Control</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Autonomous Multi-Step AI Systems <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                Built for Auditability, Oversight & Cost Control
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              A task-completion state engine that decomposes complex goals into observable steps, enforces strict cost ceilings, integrates human approval gates on consequential actions, and logs full JSON audit trails.
            </p>
          </div>

          {/* Core Architectural Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 font-mono text-xs">
            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
              <div className="text-gray-500 text-[10px]">EXECUTION SAFETY</div>
              <div className="text-white font-bold text-sm mt-0.5">Step & Cost Ceilings</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Runaway Loop Protection</div>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
              <div className="text-gray-500 text-[10px]">HUMAN-IN-THE-LOOP</div>
              <div className="text-white font-bold text-sm mt-0.5">Approval Gates</div>
              <div className="text-[10px] text-indigo-300 mt-0.5">State-Preserving Resume</div>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
              <div className="text-gray-500 text-[10px]">OBSERVABILITY</div>
              <div className="text-white font-bold text-sm mt-0.5">Full JSON Audit Trail</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Replayable Step History</div>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
              <div className="text-gray-500 text-[10px]">AI SIZING ENGINE</div>
              <div className="text-white font-bold text-sm mt-0.5">0.5B to 70B Models</div>
              <div className="text-[10px] text-indigo-300 mt-0.5">Real-Time VRAM & Cost Math</div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'calculator'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Interactive VRAM Calculator</span>
          </button>
          <button
            onClick={() => setActiveTab('quantization')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'quantization'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4-Bit Quantization Visualizer</span>
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'modules'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Core Curriculum (Modules 1–5)</span>
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'scenarios'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Client Consulting Dialogues</span>
          </button>
        </div>

        {/* TAB 1: VRAM & HARDWARE CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
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

                {/* Hardware Recommendation */}
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
                      <span>Tesla T4 Compatible:</span>
                      <span className={`font-mono font-bold ${qloraVram <= 14.5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {qloraVram <= 14.5 ? 'YES (FITS)' : 'EXCEEDS 15GB'}
                      </span>
                    </div>
                  </div>

                  {/* Full Fine-Tuning */}
                  <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-rose-300 font-mono">FULL FINE-TUNING</span>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 font-mono">Enterprise</span>
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

        {/* TAB 2: QUANTIZATION VISUALIZER */}
        {activeTab === 'quantization' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-xs font-mono">
                Hardware Byte Packing (2 Numbers per Byte)
              </h3>
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
              <p className="text-xs text-gray-400 leading-relaxed">
                By squeezing two 4-bit numbers into one 8-bit memory byte, Qwen 2.5 14B fits inside just 7 GB of weights instead of 28 GB!
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: CURRICULUM MODULES */}
        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
            </div>

            <div className="lg:col-span-8 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md space-y-6 text-sm leading-relaxed text-gray-300">
              {selectedModule === 1 && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">Module 01: Model Parameters & Scale</h3>
                  <p>A parameter is a single decimal number stored in a matrix. A 14B model has 14 Billion of these numbers. For every word generated, the GPU multiplies input vectors by all 14 billion parameters.</p>
                </div>
              )}
              {selectedModule === 2 && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">Module 02: Precision, Bits, & Quantization</h3>
                  <p>14B is parameter count; 4-bit is memory width per parameter. GPUs operate in binary powers of 2 (4, 8, 16, 32). There is no 14-bit precision. 4-bit NormalFloat (NF4) saves 75% VRAM while retaining 99.3% accuracy.</p>
                </div>
              )}
              {selectedModule === 3 && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">Module 03: VRAM Calculation & GPU Sizing</h3>
                  <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 font-mono text-xs text-indigo-200">
                    Weight VRAM = Params (B) × (Bits / 8)<br/>
                    Total VRAM = Weight VRAM × 1.20 (adds 20% for KV Cache and runtime)
                  </div>
                  <p>16-bit = 2.0 GB/B | 8-bit = 1.0 GB/B | 4-bit = 0.5 GB/B. Qwen 14B at 4-bit = 7 GB weights + 2.8 GB overhead = 9.8 GB total VRAM. Fits on Tesla T4 (15GB)!</p>
                </div>
              )}
              {selectedModule === 4 && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">Module 04: Training vs Inference, LoRA, and QLoRA</h3>
                  <p>Full fine-tuning requires 16-18 Bytes/param because AdamW optimizer keeps two 32-bit floats for every parameter. LoRA freezes 99.8% of weights and trains tiny adapters. QLoRA trains adapters over 4-bit frozen weights, enabling 14B training on free T4 hardware.</p>
                </div>
              )}
              {selectedModule === 5 && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">Module 05: Client Consulting Playbook</h3>
                  <p>Use the Client Dialogues tab above to practice answering tough client objections and technical architect questions with 100% confidence.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CLIENT DIALOGUES */}
        {activeTab === 'scenarios' && (
          <div className="space-y-4">
            {[
              {
                id: 1,
                question: 'Client: "Can we fine-tune Llama 3 70B on our office PC with an RTX 4090 (24GB)?"',
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
                  <div className="mt-4 pt-4 border-t border-white/10 text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
